import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// POST /api/orders — place a new order (public endpoint, no auth required)
export async function POST(req: Request) {
  try {
    const { customer, items, subtotal, deliveryCharge } = await req.json();

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_city: customer.city ?? '',
        customer_notes: customer.notes ?? '',
        items: items.map((i: { name: string; category: string; price: number; quantity: number }) => ({
          name: i.name,
          category: i.category,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        delivery_charge: deliveryCharge,
        total: subtotal + deliveryCharge,
      }])
      .select('id')
      .single();

    if (error) {
      console.error('[api/orders POST]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('[api/orders POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
