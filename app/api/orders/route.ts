import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/app/lib/supabase';

// GET - Obtener todas las órdenes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const filters = {
      status: searchParams.get('status') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const orders = await getOrders(filters);

    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}