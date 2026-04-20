import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = 'admin@eclatperle.com';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    const storedPassword = data?.value ?? 'EclatAdmin2024!';

    if (password !== storedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'ADMIN_SECRET env var not configured on server.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: secret });
  } catch (err) {
    console.error('[admin/auth]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
