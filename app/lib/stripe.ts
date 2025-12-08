import Stripe from 'stripe';

// Cliente de Stripe para el servidor
// Nota: La versión de API se define automáticamente por la versión de stripe instalada
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Función para crear una Checkout Session
export async function createCheckoutSession(params: {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  metadata: Record<string, string>;
  customerEmail: string;
}) {
  try {
    // Validar que NEXT_PUBLIC_BASE_URL esté configurado
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not configured in environment variables');
    }

    console.log('Creating Stripe Checkout Session...');
    console.log('Line items:', JSON.stringify(params.lineItems, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: params.lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: params.customerEmail,
      metadata: params.metadata,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    console.log('✅ Stripe Checkout Session created:', session.id);
    console.log('Checkout URL:', session.url);

    return session;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('❌ Stripe API Error:', {
        message: (error as { message?: string }).message,
        type: (error as { type?: string }).type,
        code: (error as { code?: string }).code,
        param: (error as { param?: string }).param,
        detail: (error as { detail?: string }).detail,
      });
    } else {
      console.error('❌ Stripe API Error:', error);
    }
    throw error;
  }
}

// Función para verificar un webhook de Stripe
export function constructStripeEvent(
  payload: string | Buffer,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}