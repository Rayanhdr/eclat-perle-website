'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { getDeliveryCharge, formatPrice } from '@/lib/defaultProducts';
import { OrderCustomer } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, MapPin, ShoppingBag, Loader2, Truck, CreditCard } from 'lucide-react';

const EMPTY_CUSTOMER: OrderCustomer = { firstName: '', lastName: '', phone: '', address: '', city: '', notes: '' };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [customer, setCustomer] = useState<OrderCustomer>(EMPTY_CUSTOMER);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Partial<OrderCustomer>>({});

  useEffect(() => {
    getDeliveryCharge().then(setDeliveryCharge);
  }, []);

  useEffect(() => {
    if (items.length === 0) router.push('/shop');
  }, [items, router]);

  const total = totalPrice + deliveryCharge;

  const validate = () => {
    const e: Partial<OrderCustomer> = {};
    if (!customer.firstName.trim()) e.firstName = 'Required';
    if (!customer.lastName.trim()) e.lastName = 'Required';
    if (!customer.phone.trim()) e.phone = 'Required';
    if (!customer.address.trim()) e.address = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      // 1. Save order via secure server API route (uses service role — bypasses RLS)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map(i => ({ name: i.product.name, category: i.product.category, price: i.product.price, quantity: i.quantity })),
          subtotal: totalPrice,
          deliveryCharge,
        }),
      });

      if (!orderRes.ok) {
        console.error('Failed to save order');
        return;
      }

      const { id: orderId } = await orderRes.json();

      // 2. Send email (non-blocking — won't fail the order if email fails)
      try {
        await fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer, items: items.map(i => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })), subtotal: totalPrice, deliveryCharge, total, orderId }),
        });
      } catch { /* email is optional */ }

      // 3. Clear cart & redirect to success
      clearCart();
      router.push(`/order-success?id=${orderId ?? 'new'}`);
    } finally {
      setPlacing(false);
    }
  };

  const field = (
    label: string,
    key: keyof OrderCustomer,
    placeholder: string,
    icon: React.ReactNode,
    type = 'text',
    required = true
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
        {label} {required && <span style={{ color: '#C4788A' }}>*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          value={customer[key]}
          onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor: errors[key] ? '#e57373' : 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}
        />
      </div>
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ backgroundColor: '#FBF7F4' }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors" style={{ color: '#8B4E6B' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Customer Form ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
                <User size={18} style={{ color: '#C4788A' }} /> Your Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {field('First Name', 'firstName', 'Jana', <User size={15} />)}
                {field('Last Name', 'lastName', 'Khalil', <User size={15} />)}
              </div>
              <div className="mt-4">
                {field('Phone Number', 'phone', '+961 70 000 000', <Phone size={15} />, 'tel')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
                <MapPin size={18} style={{ color: '#C4788A' }} /> Delivery Address
              </h2>
              <div className="flex flex-col gap-4">
                {field('Address', 'address', 'Street, Building, Floor...', <MapPin size={15} />)}
                {field('City / Region', 'city', 'Beirut, Tripoli, Sidon...', <MapPin size={15} />, 'text', false)}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>Order Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="Any special requests, gift wrapping, etc."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none"
                    style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(61,155,140,0.12)' }}>
                <CreditCard size={22} style={{ color: '#3D9B8C' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>Cash on Delivery</p>
                <p className="text-xs text-gray-400">Pay when you receive your order</p>
              </div>
              <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#3D9B8C' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3D9B8C' }} />
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <div className="relative w-12 h-12"><Image src={item.product.image} alt={item.product.name} fill className="object-cover" /></div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#F9EEF3,rgba(196,120,138,0.2))' }}>
                          {item.product.category === 'Gifts' ? '🎁' : item.product.category === 'Kids' ? '🌈' : item.product.category === 'Resin Art' ? '🎨' : item.product.category === 'Keychains' ? '🔑' : '💎'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#1A1A2E' }}>{item.product.name}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#8B4E6B' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2" style={{ borderColor: 'rgba(196,120,138,0.2)' }}>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 items-center gap-1">
                  <span className="flex items-center gap-1"><Truck size={13} /> Delivery</span>
                  <span>{deliveryCharge === 0 ? <span style={{ color: '#3D9B8C' }} className="font-semibold">Free</span> : `$${deliveryCharge.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-3 border-t" style={{ borderColor: 'rgba(196,120,138,0.2)' }}>
                  <span className="font-bold text-base" style={{ color: '#1A1A2E' }}>Total</span>
                  <span className="font-bold text-xl" style={{ color: '#8B4E6B' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-5 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-white text-base transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#C4788A' }}
              >
                {placing ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShoppingBag size={12} style={{ color: '#C4788A' }} />
                Order saved &amp; confirmation sent by email
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
