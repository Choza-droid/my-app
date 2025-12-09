import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verificar que el pago fue completado
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        message: 'Payment not completed',
        payment_status: session.payment_status,
      });
    }

    // Buscar la orden en Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('payment_intent_id', session.id)
      .single();

    if (error || !order) {
      // Si la orden no existe, el webhook aún no ha procesado el pago
      // Esto es normal - puede tomar unos segundos
      return NextResponse.json({
        success: false,
        message: 'Order is being processed. Please refresh in a moment.',
        payment_status: session.payment_status,
        processing: true,
      });
    }

    // Orden encontrada y pago confirmado
    return NextResponse.json({
      success: true,
      order: order,
      session: {
        payment_status: session.payment_status,
        customer_email: session.customer_email,
      },
    });
  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}