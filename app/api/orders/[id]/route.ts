import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, supabaseAdmin } from '@/app/lib/supabase';

// GET - Obtener una orden específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Order not found';
    return NextResponse.json(
      { error: errorMessage },
      { status: 404 }
    );
  }
}

// PATCH - Actualizar el estado de una orden
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { order_status } = body;

    if (!order_status) {
      return NextResponse.json(
        { error: 'Missing order_status' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        order_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}