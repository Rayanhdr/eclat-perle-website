'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getProducts, formatPrice } from '@/lib/defaultProducts';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import Footer from '@/components/Footer';

const CATEGORY_COLORS: Record<string, string> = {
  Keychains: '#C4788A',
  Jewelry: '#8B4E6B',
  'Resin Art': '#3D9B8C',
  Kids: '#D4A853',
  Gifts: '#C4788A',
  Summer: '#3D9B8C',
};

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  Keychains: 'linear-gradient(135deg, #F9EEF3 0%, rgba(196,120,138,0.3) 50%, rgba(139,78,107,0.15) 100%)',
  Jewelry: 'linear-gradient(135deg, #F5E6F0 0%, rgba(139,78,107,0.3) 50%, rgba(212,168,83,0.15) 100%)',
  'Resin Art': 'linear-gradient(135deg, #E6F5F3 0%, rgba(61,155,140,0.3) 50%, rgba(196,120,138,0.15) 100%)',
  Kids: 'linear-gradient(135deg, #FFF9E6 0%, rgba(212,168,83,0.3) 50%, rgba(61,155,140,0.15) 100%)',
  Gifts: 'linear-gradient(135deg, #F9EEF3 0%, rgba(196,120,138,0.3) 50%, rgba(212,168,83,0.15) 100%)',
  Summer: 'linear-gradient(135deg, #E6F5F3 0%, rgba(61,155,140,0.3) 50%, rgba(212,168,83,0.15) 100%)',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProducts().then((products) => {
      const found = products.find((p) => p.id === params.id);
      if (!found) { router.push('/shop'); return; }
      setProduct(found);
    });
  }, [params.id, router]);

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FBF7F4' }}
      >
        <div className="text-2xl animate-pulse" style={{ color: '#C4788A' }}>
          Loading...
        </div>
      </div>
    );
  }

  const badgeColor = CATEGORY_COLORS[product.category] || '#C4788A';
  const placeholderGrad =
    PLACEHOLDER_GRADIENTS[product.category] ||
    'linear-gradient(135deg, #F9EEF3 0%, rgba(196,120,138,0.3) 100%)';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="min-h-screen pt-20 pb-0" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Back link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors duration-200"
            style={{ color: '#8B4E6B' }}
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl">
              {product.image ? (
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="h-96 lg:h-[500px] flex items-center justify-center product-placeholder"
                  style={{ background: placeholderGrad }}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-4">
                      {product.category === 'Jewelry' ? '💎' :
                       product.category === 'Keychains' ? '🔑' :
                       product.category === 'Resin Art' ? '🎨' :
                       product.category === 'Kids' ? '🌈' :
                       product.category === 'Gifts' ? '🎁' :
                       product.category === 'Summer' ? '☀️' : '✨'}
                    </div>
                    <p className="text-lg font-semibold" style={{ color: badgeColor }}>
                      {product.category}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-5">
              {/* Category badge */}
              <span
                className="inline-flex self-start text-sm font-semibold text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: badgeColor }}
              >
                {product.category}
              </span>

              <h1
                className="text-3xl sm:text-4xl font-bold leading-snug"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
              >
                {product.name}
              </h1>

              <p className="text-3xl font-bold" style={{ color: '#8B4E6B' }}>
                {formatPrice(product.price)}
              </p>

              <div
                className="w-12 h-0.5 rounded-full"
                style={{ backgroundColor: '#C4788A' }}
              />

              <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div
                  className="flex items-center gap-0 rounded-full overflow-hidden border"
                  style={{ borderColor: 'rgba(196,120,138,0.3)' }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-sm font-bold transition-colors duration-200 hover:bg-pink-50"
                    style={{ color: '#C4788A' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    className="px-4 py-2 text-sm font-bold border-x"
                    style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-sm font-bold transition-colors duration-200 hover:bg-pink-50"
                    style={{ color: '#C4788A' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: added ? '#3D9B8C' : '#C4788A' }}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Info tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {['Handmade', '100% Original', 'Made in Lebanon'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
