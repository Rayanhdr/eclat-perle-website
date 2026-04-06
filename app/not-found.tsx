import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: '#FBF7F4' }}
    >
      <div className="text-8xl mb-6">✨</div>
      <h1
        className="text-6xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#8B4E6B' }}
      >
        404
      </h1>
      <h2
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
      >
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Looks like this page got lost in the craft room! Let&apos;s guide you back to something beautiful.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
          style={{ color: '#8B4E6B', border: '2px solid #C4788A' }}
        >
          <ArrowLeft size={16} />
          Go Home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: '#C4788A' }}
        >
          <ShoppingBag size={16} />
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
