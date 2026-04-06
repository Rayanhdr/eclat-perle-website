import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pink Resin Heart Keychain',
    category: 'Keychains',
    price: 5,
    description: 'Handcrafted pink resin heart keychain with gold flakes. Perfect as a gift.',
    image: '',
  },
  {
    id: '2',
    name: 'Pressed Flower Resin Keychain',
    category: 'Keychains',
    price: 6,
    description: 'Beautiful circular resin keychain with real pressed flowers preserved inside.',
    image: '',
  },
  {
    id: '3',
    name: 'Pearl Beaded Necklace',
    category: 'Jewelry',
    price: 12,
    description: 'Elegant handmade pearl beaded necklace, perfect for everyday wear.',
    image: '',
  },
  {
    id: '4',
    name: 'Colorful Beaded Bracelet',
    category: 'Jewelry',
    price: 7,
    description: 'Vibrant colorful beaded bracelet, handmade with love.',
    image: '',
  },
  {
    id: '5',
    name: 'Blue Crystal Bracelet',
    category: 'Jewelry',
    price: 8,
    description: 'Stunning blue and black crystal beaded bracelet.',
    image: '',
  },
  {
    id: '6',
    name: 'Kids Rainbow Bracelet Set',
    category: 'Kids',
    price: 4,
    description: 'Fun rainbow beaded bracelet set for kids. Safe and colorful.',
    image: '',
  },
  {
    id: '7',
    name: 'Resin Art Pendant',
    category: 'Resin Art',
    price: 9,
    description: 'Unique handcrafted resin art pendant with swirling colors.',
    image: '',
  },
  {
    id: '8',
    name: 'Gift Box Set',
    category: 'Gifts',
    price: 22,
    description: 'Beautiful gift box set including a keychain, bracelet, and necklace.',
    image: '',
  },
];

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const stored = localStorage.getItem('eclat_products');
    if (stored) {
      return JSON.parse(stored) as Product[];
    }
    localStorage.setItem('eclat_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('eclat_products', JSON.stringify(products));
}

export function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}

export function getWhatsAppNumber(): string {
  if (typeof window === 'undefined') return '96170000000';
  return localStorage.getItem('eclat_whatsapp') || '96170000000';
}

export function saveWhatsAppNumber(number: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('eclat_whatsapp', number);
}

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return 'EclatAdmin2024!';
  return localStorage.getItem('eclat_admin_password') || 'EclatAdmin2024!';
}

export function saveAdminPassword(password: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('eclat_admin_password', password);
}
