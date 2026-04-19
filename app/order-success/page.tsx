'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, ShoppingBag, MessageCircle, Home } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12" style={{ backgroundColor: '#FBF7F4' }}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(61,155,140,0.12)' }}>
          <CheckCircle size={48} style={{ color: '#3D9B8C' }} />
        </div>

        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
          Order Placed! 🎉
        </h1>

        <p className="text-gray-500 mb-2">Thank you for your order from Eclat Perlé.</p>

        {orderId && orderId !== 'new' && (
          <p className="text-xs text-gray-400 mb-6">
            Order ID: <span className="font-mono font-semibold">#{orderId.substring(0, 8).toUpperCase()}</span>
          </p>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8 text-left" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#1A1A2E' }}>What happens next?</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: '📱', text: 'A WhatsApp message was sent with your order details' },
              { icon: '✅', text: 'We will confirm your order shortly via WhatsApp' },
              { icon: '🚚', text: 'Your items will be carefully prepared and delivered' },
              { icon: '💵', text: 'Pay cash when your order arrives at your door' },
            ].map((step) => (
              <div key={step.text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-xl flex-shrink-0">{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#C4788A' }}>
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-all hover:scale-105"
            style={{ color: '#8B4E6B', border: '2px solid #C4788A' }}>
            <Home size={18} /> Go Home
          </Link>
        </div>

        <a href="https://instagram.com/eclat_perle" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 mt-4 text-sm transition-colors"
          style={{ color: '#C4788A' }}>
          <MessageCircle size={14} /> Follow @eclat_perle for new arrivals
        </a>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF7F4' }}><div className="text-2xl animate-pulse" style={{ color: '#C4788A' }}>Loading…</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
