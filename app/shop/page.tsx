'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/defaultProducts';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';

const CATEGORIES = ['All', 'Resin Art', 'Keychains', 'Jewelry', 'Necklace', 'Bracelet', 'Earrings', 'Rings', 'Kids', 'Gifts'];
const PAGE_SIZE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchProducts = useCallback(async (currentPage: number) => {
    setLoading(true);
    const { products, total } = await getProducts(currentPage, PAGE_SIZE);
    setProducts(products);
    setTotal(total);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [activeCategory, fetchProducts]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      {/* Header */}
      <section
        className="pt-24 pb-12 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #F9EEF3 0%, #FBF7F4 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#3D9B8C' }}>
            Browse
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mt-2 mb-4"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
          >
            Our Shop
          </h1>
          <p className="text-gray-500 mb-8">
            Every piece handcrafted with love — discover your perfect accessory.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border bg-white text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? { backgroundColor: '#C4788A', color: '#fff' }
                    : { backgroundColor: '#F9EEF3', color: '#8B4E6B' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="max-w-7xl mx-auto">

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-2xl animate-pulse" style={{ color: '#C4788A' }}>Loading...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}
              >
                No products found
              </h3>
              <p className="text-gray-500">Try a different category or search term.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Showing <span className="font-semibold" style={{ color: '#C4788A' }}>{filtered.length}</span> of{' '}
                <span className="font-semibold" style={{ color: '#C4788A' }}>{total}</span> products
                {activeCategory !== 'All' && <> in <span className="font-semibold">{activeCategory}</span></>}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .reduce<(number | string)[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === '...' ? (
                          <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className="w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200"
                            style={
                              page === p
                                ? { backgroundColor: '#C4788A', color: '#fff' }
                                : { backgroundColor: '#F9EEF3', color: '#8B4E6B' }
                            }
                          >
                            {p}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF7F4' }}><div className="text-2xl animate-pulse" style={{ color: '#C4788A' }}>Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
