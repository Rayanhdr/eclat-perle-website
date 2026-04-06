export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category =
  | 'All'
  | 'Resin Art'
  | 'Keychains'
  | 'Jewelry'
  | 'Kids'
  | 'Gifts'
  | 'Summer';
