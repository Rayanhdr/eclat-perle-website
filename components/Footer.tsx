'use client';

import Link from 'next/link';
import { AtSign, MessageCircle, Heart, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getWhatsAppNumber } from '@/lib/defaultProducts';

export default function Footer() {
  const [waNumber, setWaNumber] = useState('96170000000');

  useEffect(() => {
    getWhatsAppNumber().then(setWaNumber);
  }, []);

  return (
    <footer id="contact" style={{ backgroundColor: '#1A1A2E' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#C4788A' }}
            >
              Eclat Perlé ✨
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Handcrafted with love in Lebanon. Every piece tells a story of creativity and passion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white tracking-wide uppercase text-sm">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/#our-story', label: 'Our Story' },
                { href: '/cart', label: 'Cart' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-rose-300 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white tracking-wide uppercase text-sm">Connect With Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/eclat_perle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-pink-300 transition-colors duration-200"
              >
                <AtSign size={16} />
                @eclat_perle
              </a>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-300 transition-colors duration-200"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Eclat Perlé. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Made with <Heart size={12} className="text-rose-400" fill="currentColor" /> in Lebanon
            </p>
            <Link
              href="/admin/login"
              title="Admin"
              className="opacity-10 hover:opacity-50 transition-opacity duration-300"
              style={{ color: '#888' }}
            >
              <Lock size={11} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
