export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  max_quantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export type Category =
  | 'All'
  | 'Resin Art'
  | 'Keychains'
  | 'Jewelry'
  | 'Necklace'
  | 'Bracelet'
  | 'Earrings'
  | 'Rings'
  | 'Kids'
  | 'Gifts';
