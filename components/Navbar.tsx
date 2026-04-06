'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const admin = sessionStorage.getItem('isAdmin');
    setIsAdmin(admin === 'true');
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/#our-story', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="text-2xl font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-playfair), Playfair Display, serif',
                color: '#8B4E6B',
              }}
            >
              Eclat Perlé
            </span>
            <span className="text-xl">✨</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide transition-colors duration-200 hover:text-rose-primary"
                style={{ color: '#1A1A2E' }}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium tracking-wide px-3 py-1 rounded-full text-white transition-all duration-200"
                style={{ backgroundColor: '#3D9B8C' }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-pink-50 transition-colors duration-200">
              <ShoppingCart size={22} style={{ color: '#8B4E6B' }} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#C4788A' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-pink-50 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} style={{ color: '#8B4E6B' }} /> : <Menu size={22} style={{ color: '#8B4E6B' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium py-2 border-b border-pink-50 transition-colors duration-200"
                style={{ color: '#1A1A2E' }}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium py-2 text-center rounded-full text-white"
                style={{ backgroundColor: '#3D9B8C' }}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
