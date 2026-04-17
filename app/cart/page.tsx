'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice, getWhatsAppNumber } from '@/lib/defaultProducts';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const buildWhatsAppMessage = () => {
    const itemLines = items
      .map(
        (item) =>
          `- ${item.product.name} x${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const message = `🛍️ New Order from Eclat Perlé Website!\n\n📦 Items:\n${itemLines}\n\n💰 Total: $${totalPrice.toFixed(2)}\n\nPlease confirm my order 🙏`;
    return encodeURIComponent(message);
  };

  const handleWhatsApp = async () => {
    const number = await getWhatsAppNumber();
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <>
        <div
          className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4"
          style={{ backgroundColor: '#FBF7F4' }}
        >
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">🛒</div>
            <h1
              className="text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
            >
              Your Cart is Empty
            </h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything yet. Explore our beautiful handcrafted collection!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#C4788A' }}
            >
              <ShoppingBag size={18} />
              Browse Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#8B4E6B' }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          <h1
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
          >
            Your Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-4 flex gap-4 items-start shadow-sm border"
                  style={{ borderColor: 'rgba(196,120,138,0.1)' }}
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    {item.product.image ? (
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-2xl product-placeholder"
                        style={{
                          background:
                            'linear-gradient(135deg, #F9EEF3 0%, rgba(196,120,138,0.2) 100%)',
                        }}
                      >
                        {item.product.category === 'Jewelry' ? '💎' :
                         item.product.category === 'Keychains' ? '🔑' :
                         item.product.category === 'Resin Art' ? '🎨' :
                         item.product.category === 'Kids' ? '🌈' :
                         item.product.category === 'Gifts' ? '🎁' :
                         item.product.category === 'Summer' ? '☀️' : '✨'}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-base truncate"
                      style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{item.product.category}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: '#8B4E6B' }}>
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 rounded-full transition-colors hover:bg-red-50"
                      style={{ color: '#e57373' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div
                      className="flex items-center gap-0 rounded-full overflow-hidden border"
                      style={{ borderColor: 'rgba(196,120,138,0.3)' }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm font-bold hover:bg-pink-50 transition-colors"
                        style={{ color: '#C4788A' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="px-3 py-1.5 text-sm font-bold border-x"
                        style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm font-bold hover:bg-pink-50 transition-colors"
                        style={{ color: '#C4788A' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-gray-500">
                      Subtotal:{' '}
                      <span style={{ color: '#8B4E6B' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="self-start text-sm font-medium text-gray-400 hover:text-red-400 transition-colors mt-2"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24"
                style={{ borderColor: 'rgba(196,120,138,0.15)' }}
              >
                <h2
                  className="text-xl font-bold mb-5"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
                >
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[160px]">
                        {item.product.name}{' '}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium ml-2" style={{ color: '#1A1A2E' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t pt-4 mb-5"
                  style={{ borderColor: 'rgba(196,120,138,0.2)' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base" style={{ color: '#1A1A2E' }}>
                      Total
                    </span>
                    <span className="font-bold text-xl" style={{ color: '#8B4E6B' }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-white text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle size={20} />
                  Send Order via WhatsApp
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  You&apos;ll be redirected to WhatsApp to confirm your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
