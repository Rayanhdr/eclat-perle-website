import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ConditionalNavbar from '@/components/ConditionalNavbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eclat Perlé — Handcrafted Lebanese Accessories',
  description:
    'Discover handcrafted resin art, keychains, pearl & bead jewelry, and gifts by Eclat Perlé — made with love in Lebanon.',
  keywords: ['handmade', 'jewelry', 'resin art', 'keychains', 'Lebanon', 'accessories'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
        <CartProvider>
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
