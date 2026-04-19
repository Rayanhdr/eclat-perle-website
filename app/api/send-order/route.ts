import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { customer, items, subtotal, deliveryCharge, total, orderId } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey || !adminEmail) {
      return NextResponse.json({ success: false, message: 'Email not configured' });
    }

    const resend = new Resend(apiKey);

    const itemRows = items.map((i: { name: string; quantity: number; price: number }) =>
      `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0e6ed;">${i.name}</td><td style="padding:6px 12px;border-bottom:1px solid #f0e6ed;text-align:center;">×${i.quantity}</td><td style="padding:6px 12px;border-bottom:1px solid #f0e6ed;text-align:right;font-weight:600;">$${(i.price * i.quantity).toFixed(2)}</td></tr>`
    ).join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FBF7F4;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(139,78,107,0.1);">
    <div style="background:linear-gradient(135deg,#1A1A2E,#8B4E6B,#C4788A);padding:32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:26px;">Eclat Perlé ✨</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">New Order Received!</p>
    </div>
    <div style="padding:32px;">
      <div style="background:#F9EEF3;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#8B4E6B;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
        <p style="margin:0;font-weight:700;color:#1A1A2E;font-size:14px;">#${orderId?.substring(0, 8).toUpperCase() ?? 'N/A'}</p>
      </div>
      <h2 style="color:#1A1A2E;font-size:16px;margin:0 0 12px;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr><td style="padding:6px 0;color:#8B4E6B;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${customer.firstName} ${customer.lastName}</td></tr>
        <tr><td style="padding:6px 0;color:#8B4E6B;">Phone</td><td style="padding:6px 0;font-weight:600;">${customer.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#8B4E6B;">Address</td><td style="padding:6px 0;font-weight:600;">${customer.address}${customer.city ? `, ${customer.city}` : ''}</td></tr>
        ${customer.notes ? `<tr><td style="padding:6px 0;color:#8B4E6B;">Notes</td><td style="padding:6px 0;">${customer.notes}</td></tr>` : ''}
      </table>
      <h2 style="color:#1A1A2E;font-size:16px;margin:0 0 12px;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <thead><tr style="background:#F9EEF3;"><th style="padding:10px 12px;text-align:left;color:#8B4E6B;font-size:12px;text-transform:uppercase;">Item</th><th style="padding:10px 12px;text-align:center;color:#8B4E6B;font-size:12px;text-transform:uppercase;">Qty</th><th style="padding:10px 12px;text-align:right;color:#8B4E6B;font-size:12px;text-transform:uppercase;">Price</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="background:#F9EEF3;border-radius:12px;padding:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:#666;"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px;color:#666;"><span>Delivery</span><span>$${deliveryCharge.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#8B4E6B;border-top:2px solid rgba(196,120,138,0.3);padding-top:12px;"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </div>
      <div style="margin-top:24px;padding:16px;background:#e8f7f4;border-radius:12px;text-align:center;color:#3D9B8C;font-weight:600;font-size:14px;">💵 Payment Method: Cash on Delivery</div>
    </div>
    <div style="padding:20px;text-align:center;background:#F9EEF3;color:#999;font-size:12px;">Eclat Perlé — Handcrafted with Love in Lebanon 🇱🇧</div>
  </div>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: 'Eclat Perlé Orders <onboarding@resend.dev>',
      to: adminEmail,
      subject: `🛍️ New Order — ${customer.firstName} ${customer.lastName} — $${total.toFixed(2)}`,
      html,
    });

    if (error) return NextResponse.json({ success: false, error });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) });
  }
}
