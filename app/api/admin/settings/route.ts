import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('Authorization');
  return auth === `Bearer ${secret}`;
}

// GET /api/admin/settings — returns all settings as { key: value } map
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('settings').select('key, value');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const map: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    map[row.key] = row.value;
  });
  return NextResponse.json(map);
}

// POST /api/admin/settings — upsert settings { key: value, ... }
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const updates: Record<string, string> = await req.json();
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
  if (rows.length === 0) {
    return NextResponse.json({ ok: true });
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
