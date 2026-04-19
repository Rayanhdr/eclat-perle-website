import { Product, OrderCustomer, CartItem } from './types';
import { getSupabase } from './supabase';

// ── Default catalog ───────────────────────────────────────────────────────────
export const DEFAULT_PRODUCTS: Product[] = [
  { id: '', name: 'Pink Resin Heart Keychain',     category: 'Keychains', price: 5,  description: 'Handcrafted pink resin heart keychain with gold flakes. Perfect as a gift.', image: '' },
  { id: '', name: 'Pressed Flower Resin Keychain', category: 'Keychains', price: 6,  description: 'Beautiful circular resin keychain with real pressed flowers preserved inside.', image: '' },
  { id: '', name: 'Pearl Beaded Necklace',          category: 'Necklace',  price: 12, description: 'Elegant handmade pearl beaded necklace, perfect for everyday wear.', image: '' },
  { id: '', name: 'Colorful Beaded Bracelet',       category: 'Bracelet',  price: 7,  description: 'Vibrant colorful beaded bracelet, handmade with love.', image: '' },
  { id: '', name: 'Blue Crystal Bracelet',          category: 'Bracelet',  price: 8,  description: 'Stunning blue and black crystal beaded bracelet.', image: '' },
  { id: '', name: 'Kids Rainbow Bracelet Set',      category: 'Kids',      price: 4,  description: 'Fun rainbow beaded bracelet set for kids. Safe and colorful.', image: '' },
  { id: '', name: 'Resin Art Pendant',              category: 'Resin Art', price: 9,  description: 'Unique handcrafted resin art pendant with swirling colors.', image: '' },
  { id: '', name: 'Gift Box Set',                   category: 'Gifts',     price: 22, description: 'Beautiful gift box set including a keychain, bracelet, and necklace.', image: '' },
];

export function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products').select('*').order('created_at', { ascending: true });
  if (error || !data) return DEFAULT_PRODUCTS;
  return data as Product[];
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from('products')
    .insert([{ name: product.name, category: product.category, price: product.price, description: product.description, image: product.image, max_quantity: product.max_quantity ?? null }])
    .select().single();
  if (error) { console.error('addProduct:', error.message); return null; }
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<boolean> {
  const { error } = await getSupabase().from('products').update(updates).eq('id', id);
  if (error) { console.error('updateProduct:', error.message); return false; }
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('products').delete().eq('id', id);
  if (error) { console.error('deleteProduct:', error.message); return false; }
  return true;
}

// ── Settings ──────────────────────────────────────────────────────────────────

async function getSetting(key: string, fallback: string): Promise<string> {
  const { data } = await getSupabase().from('settings').select('value').eq('key', key).single();
  return data?.value ?? fallback;
}

async function saveSetting(key: string, value: string): Promise<boolean> {
  const { error } = await getSupabase().from('settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) { console.error('saveSetting:', error.message); return false; }
  return true;
}

export async function getWhatsAppNumber(): Promise<string> {
  return getSetting('whatsapp_number', '96170000000');
}
export async function saveWhatsAppNumber(number: string): Promise<boolean> {
  return saveSetting('whatsapp_number', number);
}
export async function getAdminPassword(): Promise<string> {
  return getSetting('admin_password', 'EclatAdmin2024!');
}
export async function saveAdminPassword(password: string): Promise<boolean> {
  return saveSetting('admin_password', password);
}
export async function getDeliveryCharge(): Promise<number> {
  const val = await getSetting('delivery_charge', '0');
  return parseFloat(val) || 0;
}
export async function saveDeliveryCharge(charge: number): Promise<boolean> {
  return saveSetting('delivery_charge', charge.toString());
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function saveOrder(customer: OrderCustomer, items: CartItem[], subtotal: number, deliveryCharge: number): Promise<string | null> {
  const { data, error } = await getSupabase()
    .from('orders')
    .insert([{
      customer_name: `${customer.firstName} ${customer.lastName}`,
      customer_phone: customer.phone,
      customer_address: customer.address,
      customer_city: customer.city,
      customer_notes: customer.notes,
      items: items.map(i => ({ name: i.product.name, category: i.product.category, price: i.product.price, quantity: i.quantity })),
      subtotal,
      delivery_charge: deliveryCharge,
      total: subtotal + deliveryCharge,
    }])
    .select('id').single();
  if (error) { console.error('saveOrder:', error.message); return null; }
  return data?.id ?? null;
}

export async function getOrders() {
  const { data, error } = await getSupabase()
    .from('orders').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const { error } = await getSupabase().from('orders').update({ status }).eq('id', id);
  return !error;
}
