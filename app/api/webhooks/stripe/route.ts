import { NextRequest, NextResponse } from 'next/server';
import { constructStripeEvent } from '@/app/lib/stripe';
import { supabaseAdmin } from '@/app/lib/supabase';

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

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Verificar que el pago fue exitoso
        if (session.payment_status !== 'paid') {
          console.log(`⚠️ Payment not completed for session: ${session.id}`);
          break;
        }

        const metadata = session.metadata;
        
        if (!metadata) {
          console.error('❌ No metadata found in session');
          break;
        }

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
              shipping_address: shippingAddress.address,
              shipping_city: shippingAddress.city,
              shipping_state: shippingAddress.state,
              shipping_zip: shippingAddress.zipCode,
              subtotal: totals.subtotal,
              shipping_cost: totals.shipping_cost,
              tax: totals.tax,
              total_amount: totals.total,
              payment_method: 'stripe',
              payment_status: 'completed',
              order_status: 'processing',
              payment_intent_id: session.id,
              stripe_payment_intent: session.payment_intent,
            }])
            .select()
            .single();

          if (orderError) {
            console.error('❌ Error creating order:', orderError);
            throw orderError;
          }

          console.log(`✅ Order created: ${order.order_number}`);

          // Crear items de la orden
          const orderItems = items.map((item: any) => ({
            order_id: order.id,
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
          }

          // TODO: Aquí agregar:
          // - Enviar email de confirmación
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