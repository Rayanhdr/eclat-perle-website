'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/defaultProducts';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

const CATEGORY_COLORS: Record<string, string> = {
  Keychains: '#C4788A',
  Jewelry: '#8B4E6B',
  'Resin Art': '#3D9B8C',
  Kids: '#D4A853',
  Gifts: '#C4788A',
  Summer: '#3D9B8C',
};

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  Keychains: 'linear-gradient(135deg, #F9EEF3 0%, #C4788A44 50%, #8B4E6B22 100%)',
  Jewelry: 'linear-gradient(135deg, #F5E6F0 0%, #8B4E6B44 50%, #D4A85322 100%)',
  'Resin Art': 'linear-gradient(135deg, #E6F5F3 0%, #3D9B8C44 50%, #C4788A22 100%)',
  Kids: 'linear-gradient(135deg, #FFF9E6 0%, #D4A85344 50%, #3D9B8C22 100%)',
  Gifts: 'linear-gradient(135deg, #F9EEF3 0%, #C4788A44 50%, #D4A85322 100%)',
  Summer: 'linear-gradient(135deg, #E6F5F3 0%, #3D9B8C44 50%, #D4A85322 100%)',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badgeColor = CATEGORY_COLORS[product.category] || '#C4788A';
  const placeholderGrad =
    PLACEHOLDER_GRADIENTS[product.category] ||
    'linear-gradient(135deg, #F9EEF3 0%, #C4788A44 50%, #3D9B8C22 100%)';

  return (
    <Link href={`/product/${product.id}`} className="block card-hover rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-white border border-pink-50 group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center product-placeholder"
            style={{ background: placeholderGrad }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {product.category === 'Jewelry' ? '💎' :
                 product.category === 'Keychains' ? '🔑' :
                 product.category === 'Resin Art' ? '🎨' :
                 product.category === 'Kids' ? '🌈' :
                 product.category === 'Gifts' ? '🎁' :
                 product.category === 'Summer' ? '☀️' : '✨'}
              </div>
              <p className="text-xs font-medium" style={{ color: badgeColor }}>{product.category}</p>
            </div>
          </div>
        )}
        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded-full"
          style={{ backgroundColor: badgeColor }}
        >
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-rose-primary transition-colors"
          style={{ color: '#1A1A2E', fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: '#8B4E6B' }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full text-white transition-all duration-200"
            style={{ backgroundColor: added ? '#3D9B8C' : '#C4788A' }}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
