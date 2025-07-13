

export type ProductQuality = 'Budget' | 'Standard' | 'Premium';

export const qualityMultipliers: Record<ProductQuality, number> = {
  Budget: 0.8,
  Standard: 1,
  Premium: 1.5,
};

// Updated Product type to match fakestoreapi.com structure
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  // The 'name' property is added for compatibility with cart logic, which expects a 'name' field.
  // It will be populated from the 'title' field of the API response.
  name: string; 
  data_ai_hint?: string;
}

export interface CartItem extends Product {
  quantity: number;
  quality: ProductQuality;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: CartItem[];
}
