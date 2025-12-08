import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/app/lib/stripe';
import { createOrder } from '@/app/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderData } = body;

    if (!orderData) {
      return NextResponse.json(
        { error: 'Missing order data' },
        { status: 400 }
      );
    }

    // Crear la orden en Supabase primero
    const order = await createOrder({
      ...orderData,
      payment_method: 'stripe',
    });

    // Preparar los line items para Stripe
    const lineItems = orderData.items.map((item: { name: string; color: string; size: string; price: number; image: string }) => {
      // Construir URL absoluta para la imagen si es relativa
      let imageUrl = item.image;
      if (imageUrl && imageUrl.startsWith('/')) {
        // Es una ruta local, necesitamos hacer la URL absoluta
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `Color: ${item.color}, Size: ${item.size}`,
            // Solo incluir imágenes si son URLs válidas de HTTPS
            ...(imageUrl && (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) 
              ? { images: [imageUrl] } 
              : {}
            ),
          },
          unit_amount: Math.round(item.price * 100), // Convertir a centavos
        },
        quantity: 1,
      };
    });

    // Agregar shipping como un line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
          description: 'Standard shipping',
        },
        unit_amount: Math.round(orderData.totals.shipping_cost * 100),
      },
      quantity: 1,
    });

    // Agregar tax como un line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
          description: 'Sales tax',
        },
        unit_amount: Math.round(orderData.totals.tax * 100),
      },
      quantity: 1,
    });

    // Crear Checkout Session en Stripe
    const session = await createCheckoutSession({
      lineItems,
      customerEmail: orderData.customer_email,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
    });

    // Actualizar la orden con el session_id
    const { supabaseAdmin } = await import('@/app/lib/supabase');
    await supabaseAdmin
      .from('orders')
      .update({ payment_intent_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (error: unknown) {
    console.error('❌ Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error details:', {
        message: (error as { message?: string }).message,
        type: (error as { type?: string }).type,
        code: (error as { code?: string }).code,
        param: (error as { param?: string }).param,
      });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}