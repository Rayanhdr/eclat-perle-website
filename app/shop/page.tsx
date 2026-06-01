'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { getProducts, getProductImages } from '@/lib/defaultProducts';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense, useRef } from 'react';

const CATEGORIES = ['All', 'Resin Art', 'Keychains', 'Jewelry', 'Necklace', 'Bracelet', 'Earrings', 'Rings', 'Anklets', 'Kids', 'Gifts', 'Bookmarks', 'Others'];
const PAGE_SIZE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchProducts = useCallback(async (currentPage: number, cat: string, q: string) => {
    setLoading(true);

    // Phase 1: load metadata without images — instant
    const { products, total } = await getProducts(currentPage, PAGE_SIZE, cat, q);
    setProducts(products);
    setTotal(total);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Phase 2: load images in background — progressive
    if (products.length > 0) {
      const ids = products.map((p) => p.id);
      getProductImages(ids).then((imageMap) => {
        setProducts((prev) => prev.map((p) => ({ ...p, image: imageMap[p.id] ?? '' })));
      });
    }
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
      fetchProducts(1, cat, '');
    } else {
      fetchProducts(1, 'All', '');
    }
  }, [searchParams, fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearch('');
    setPage(1);
    fetchProducts(1, cat, '');
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchProducts(1, activeCategory, value);
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage, activeCategory, search);
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
              onChange={(e) => handleSearchChange(e.target.value)}
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
          ) : products.length === 0 ? (
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
                Showing <span className="font-semibold" style={{ color: '#C4788A' }}>{products.length}</span> of{' '}
                <span className="font-semibold" style={{ color: '#C4788A' }}>{total}</span> products
                {activeCategory !== 'All' && <> in <span className="font-semibold">{activeCategory}</span></>}
                {search && <> matching &quot;<span className="font-semibold">{search}</span>&quot;</>}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  {/* Mobile pagination */}
                  <div className="flex sm:hidden items-center justify-between gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <span className="text-sm font-semibold px-3 py-2 rounded-full text-white" style={{ backgroundColor: '#C4788A' }}>
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      Last
                    </button>
                  </div>

                  {/* Desktop pagination */}
                  <div className="hidden sm:flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
                              onClick={() => handlePageChange(p as number)}
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
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#F9EEF3', color: '#8B4E6B' }}
                    >
                      Last
                    </button>
                  </div>
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
