export type ProductQuality = 'Budget' | 'Standard' | 'Premium';

export const qualityMultipliers: Record<ProductQuality, number> = {
  Budget: 0.8,
  Standard: 1,
  Premium: 1.5,
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // base price for 'Standard' quality
  image: string;
  category: string;
  data_ai_hint?: string;
}

export interface CartItem extends Product {
  quantity: number;
  quality: ProductQuality;
}
