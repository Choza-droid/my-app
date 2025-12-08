import { createClient } from '@supabase/supabase-js';

// Verificar que las variables de entorno existen
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Cliente para uso en el navegador
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente con privilegios de servicio (solo para API routes)
// Esta validación solo se ejecuta en el servidor
export const supabaseAdmin = (() => {
  if (typeof window !== 'undefined') {
    // En el cliente, retornar el cliente normal (no se debe usar supabaseAdmin en el cliente)
    return supabase;
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Admin operations will fail.');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
})();

// Tipos para TypeScript
export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  payment_method: 'stripe';
  payment_status: 'pending' | 'completed' | 'failed';
  payment_intent_id?: string;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  color: string;
  size: string;
  price: number;
  image_url?: string;
  created_at: string;
}

// Función helper para generar número de orden
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GG-${timestamp}-${random}`;
}

// Función para crear una orden
export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: Record<string, string>;
  items: Array<{ id: number; name: string; price: number; color: string; size: string; image: string }>;
  totals: {
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
  };
  payment_method: 'stripe';
  payment_intent_id?: string;
}) {
  const orderNumber = generateOrderNumber();

  // Crear la orden
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      total_amount: orderData.totals.total,
      subtotal: orderData.totals.subtotal,
      shipping_cost: orderData.totals.shipping_cost,
      tax: orderData.totals.tax,
      payment_method: orderData.payment_method,
      payment_status: 'pending',
      payment_intent_id: orderData.payment_intent_id,
      order_status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Crear los items de la orden
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    color: item.color,
    size: item.size,
    price: item.price,
    image_url: item.image
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

// Función para actualizar el estado de pago
export async function updatePaymentStatus(
  orderId: string,
  status: 'completed' | 'failed'
) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: status,
      order_status: status === 'completed' ? 'processing' : 'pending',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) throw error;
}

// Función para obtener órdenes (para admin)
export async function getOrders(filters?: {
  status?: string;
  payment_status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('order_status', filters.status);
  }

  if (filters?.payment_status) {
    query = query.eq('payment_status', filters.payment_status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Función para obtener una orden por ID
export async function getOrderById(orderId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

// Función para obtener una orden por número de orden
export async function getOrderByNumber(orderNumber: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;
  return data;
}