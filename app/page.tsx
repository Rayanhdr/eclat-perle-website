import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Sparkles, ArrowRight, AtSign } from 'lucide-react';

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const COLLECTIONS = [
  {
    title: 'Resin Art',
    emoji: '🎨',
    description: 'Unique handcrafted resin pendants and art pieces with swirling colors.',
    gradient: 'linear-gradient(135deg, #E6F5F3 0%, rgba(61,155,140,0.2) 100%)',
    accent: '#3D9B8C',
    href: '/shop?category=Resin+Art',
  },
  {
    title: 'Keychains',
    emoji: '🔑',
    description: 'Adorable resin keychains with gold flakes and pressed flowers.',
    gradient: 'linear-gradient(135deg, #F9EEF3 0%, rgba(196,120,138,0.2) 100%)',
    accent: '#C4788A',
    href: '/shop?category=Keychains',
  },
  {
    title: 'Jewelry',
    emoji: '💎',
    description: 'Elegant pearl, bead, and crystal necklaces and bracelets.',
    gradient: 'linear-gradient(135deg, #F5E6F0 0%, rgba(139,78,107,0.2) 100%)',
    accent: '#8B4E6B',
    href: '/shop?category=Jewelry',
  },
  {
    title: 'Gifts',
    emoji: '🎁',
    description: 'Curated gift boxes perfect for loved ones on any occasion.',
    gradient: 'linear-gradient(135deg, #FFF9E6 0%, rgba(212,168,83,0.2) 100%)',
    accent: '#D4A853',
    href: '/shop?category=Gifts',
  },
];

const WHY_CHOOSE = [
  {
    icon: '⭐',
    title: 'Premium Quality',
    description: 'Each piece is carefully handcrafted using the finest materials to ensure lasting beauty.',
    color: '#C4788A',
  },
  {
    icon: '✨',
    title: 'Best Prices',
    description: 'Luxury handmade accessories at fair, honest prices. No compromise on quality or affordability.',
    color: '#8B4E6B',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description: 'Quick and careful packaging to ensure your order arrives safe and on time.',
    color: '#3D9B8C',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #8B4E6B 40%, #C4788A 70%, #3D9B8C 100%)' }}
      >
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
            style={{ backgroundColor: 'rgba(212,168,83,0.2)', color: '#D4A853', border: '1px solid rgba(212,168,83,0.4)' }}
          >
            <Sparkles size={14} />
            Handcrafted in Lebanon
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Handcrafted with Love,
            <br />
            <span style={{ color: '#D4A853' }}>Worn with Elegance</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover unique resin art, keychains, pearl jewelry, and gift sets — each piece lovingly crafted by hand at Eclat Perlé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: '#C4788A' }}>
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/#our-story"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              Our Story
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: '100%', label: 'Handmade' },
              { value: '50+', label: 'Products' },
              { value: '❤️', label: 'Made in Lebanon' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#3D9B8C' }}>Explore</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
              Our Collections
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From resin art to handcrafted jewelry — find something beautiful for yourself or someone special.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((col) => (
              <Link key={col.title} href={col.href}
                className="card-hover rounded-2xl p-6 text-center group block"
                style={{ background: col.gradient, border: '1px solid rgba(196,120,138,0.15)' }}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{col.emoji}</div>
                <h3 className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: col.accent }}>
                  {col.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{col.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: col.accent }}>
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4" style={{ backgroundColor: '#F9EEF3' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#C4788A' }}>Why Us</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
              Why Choose Eclat Perlé?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="card-hover bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
                  style={{ backgroundColor: item.color + '22' }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="our-story" className="py-20 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Portrait Image */}
            <div className="relative">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4', maxHeight: '560px' }}>
                <Image
                  src="/story-portrait.jpg"
                  alt="Eclat Perlé founder — Nurse & Artist"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-5 py-3 shadow-lg"
                style={{ border: '2px solid rgba(212,168,83,0.3)' }}
              >
                <p className="text-xs text-gray-500">Founded with</p>
                <p className="font-bold text-sm" style={{ color: '#D4A853' }}>❤️ Passion &amp; Love</p>
              </div>
            </div>

            {/* Story Text */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#3D9B8C' }}>Our Story</span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-2 mb-6 leading-snug"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
                Born from a Nurse&apos;s Creative Heart
              </h2>

              <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                <p>
                  At Éclat Perlé, I am a registered nurse with a lifelong passion for creating accessories and handmade crafts. Since childhood, art has been my way of reconnecting with nature and expressing beauty through meaningful pieces.
                </p>
                <p>
                  Through my work, I aim to remind people of the soul of Lebanon by highlighting its natural beauty and meaningful symbols such as the cedar and other Lebanese icons. Éclat Perlé is more than a brand — it represents my journey toward stability, independence, and purpose.
                </p>
                <p>
                  We create resin jewelry, handcrafted accessories and unique artisanal pieces inspired by nature, authenticity, and the Lebanese spirit. What makes Eclat Perlé special is that each piece is carefully handmade with love – no two pieces are exactly alike.
                </p>
                <p>
                  As a nurse, I deeply believe that every person is unique, and just as quality, precision, and responsibility are essential in healthcare, they are also a priority in my creative work. I translate this belief into my creations by offering personalized pieces crafted with care, high standards, and attention to detail — so that each client receives something truly special and meaningful.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap mt-6">
                <a href="https://instagram.com/eclat_perle" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#C4788A' }}>
                  <AtSign size={16} /> Instagram
                </a>
                <a href="https://www.facebook.com/share/1NQRCPu3K8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#1877F2' }}>
                  <FacebookIcon size={16} /> Facebook
                </a>
                <Link href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                  style={{ color: '#8B4E6B', border: '2px solid #C4788A' }}>
                  Shop Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social CTA */}
      <section className="py-16 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #8B4E6B 0%, #C4788A 60%, #3D9B8C 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
            Follow Our Journey
          </h2>
          <p className="text-white/80 mb-6">
            See behind-the-scenes, new arrivals, and customer favourites on social media.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://instagram.com/eclat_perle" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold bg-white transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ color: '#8B4E6B' }}>
              <AtSign size={18} /> @eclat_perle
            </a>
            <a href="https://www.facebook.com/share/1NQRCPu3K8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#1877F2', color: 'white' }}>
              <FacebookIcon size={18} /> Facebook
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
