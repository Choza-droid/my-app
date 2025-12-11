import { NextRequest, NextResponse } from 'next/server';
import { constructStripeEvent } from '@/app/lib/stripe';
import { supabaseAdmin } from '@/app/lib/supabase';
import { sendOrderConfirmationEmail } from '@/app/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verificar el evento de Stripe
    const event = constructStripeEvent(body, signature);

    console.log(`📥 Webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`💳 Processing checkout.session.completed: ${session.id}`);
        
        // Verificar que el pago fue exitoso
        if (session.payment_status !== 'paid') {
          console.log(`⚠️ Payment not completed for session: ${session.id}`);
          break;
        }

        console.log(`✅ Payment confirmed for session: ${session.id}`);
        const metadata = session.metadata;
        
        if (!metadata) {
          console.error('❌ No metadata found in session');
          break;
        }

        console.log(`📦 Metadata found, processing order...`);
        try {
          // Parsear data del metadata
          const shippingAddress = JSON.parse(metadata.shipping_address);
          const items = JSON.parse(metadata.items);
          const totals = JSON.parse(metadata.totals);

          // CREAR LA ORDEN SOLO DESPUÉS DEL PAGO CONFIRMADO
          const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([{
              order_number: metadata.order_number,
              customer_name: metadata.customer_name,
              customer_email: metadata.customer_email,
              customer_phone: metadata.customer_phone,
              shipping_address: shippingAddress, // Guardar todo el objeto como JSONB
              subtotal: totals.subtotal,
              shipping_cost: totals.shipping_cost,
              tax: totals.tax,
              total_amount: totals.total,
              payment_method: 'stripe',
              payment_status: 'completed',
              order_status: 'processing',
              payment_intent_id: session.id,
            }])
            .select()
            .single();

          if (orderError) {
            console.error('❌ Error creating order:', orderError);
            throw orderError;
          }

          console.log(`✅ Order created: ${order.order_number}`);

          // Crear items de la orden
          const orderItems = items.map((item: { id?: number; name: string; color: string; size: string; price: number }) => ({
            order_id: order.id,
            product_id: item.id || 0, // Usar 0 si no existe el id
            product_name: item.name,
            color: item.color,
            size: item.size,
            price: item.price,
            quantity: 1,
          }));

          const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('❌ Error creating order items:', itemsError);
          } else {
            console.log(`✅ Order items created for order: ${order.order_number}`);
          }

          // Enviar email de confirmación
          const emailResult = await sendOrderConfirmationEmail({
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            items: orderItems,
            subtotal: order.subtotal,
            shippingCost: order.shipping_cost,
            tax: order.tax,
            total: order.total_amount,
            shippingAddress: order.shipping_address, // Ya es un objeto JSONB con todos los campos
          });

          if (emailResult.success) {
            console.log(`📧 Confirmation email sent to ${order.customer_email}`);
          } else {
            console.error(`❌ Failed to send email: ${emailResult.error}`);
          }

          // TODO: Aquí agregar:
          // - Actualizar inventario
          // - Notificar al admin

        } catch (parseError) {
          console.error('❌ Error parsing metadata:', parseError);
        }
        
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        console.log(`⏰ Checkout expired for session: ${expiredSession.id}`);
        // No hacer nada - la orden nunca se creó
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('❌ Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}