import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('Authorization') === `Bearer ${secret}`;
}

// GET — returns list of product IDs that still have base64 images
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .like('image', 'data:%');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [], total: data?.length ?? 0 });
}

// POST — migrates a single product's image to Storage
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Fetch the product's base64 image
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('id, image')
    .eq('id', id)
    .single();

  if (fetchError || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  if (!product.image || !product.image.startsWith('data:')) {
    return NextResponse.json({ skipped: true, reason: 'Already migrated or no image' });
  }

  // Convert base64 to buffer
  const matches = product.image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return NextResponse.json({ error: 'Invalid base64 format' }, { status: 400 });

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  const filename = `${id}.${ext}`;

  // Upload to Storage (upsert in case it was partially migrated)
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filename, buffer, { contentType: mimeType, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  // Update product record with Storage URL
  const { error: updateError } = await supabase
    .from('products')
    .update({ image: publicUrl })
    .eq('id', id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ success: true, url: publicUrl });
}
