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

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Actualizar el estado de la orden en Supabase
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'completed',
            order_status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', session.id);

        if (updateError) {
          console.error('Error updating order:', updateError);
          throw updateError;
        }

        console.log(`✅ Checkout completed for session: ${session.id}`);
        
        // Aquí puedes agregar lógica adicional como:
        // - Enviar email de confirmación
        // - Actualizar inventario
        // - Notificar al admin
        
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', expiredSession.id);

        console.log(`❌ Checkout expired for session: ${expiredSession.id}`);
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