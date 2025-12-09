import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/app/lib/stripe';

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

    // NO CREAR LA ORDEN AQUÍ

    // Preparar line items
    const lineItems = orderData.items.map((item: any) => {
      let imageUrl = item.image;
      if (imageUrl && imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `Color: ${item.color}, Size: ${item.size}`,
            ...(imageUrl && (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) 
              ? { images: [imageUrl] } 
              : {}
            ),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });

    // Agregar shipping
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

    // Agregar tax
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

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Crear sesión con metadata completo
    const session = await createCheckoutSession({
      lineItems,
      customerEmail: orderData.customer_email,
      metadata: {
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        shipping_address: JSON.stringify(orderData.shipping_address),
        items: JSON.stringify(orderData.items),
        totals: JSON.stringify(orderData.totals),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderNumber: orderNumber,
    });
  } catch (error: unknown) {
    console.error('❌ Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}