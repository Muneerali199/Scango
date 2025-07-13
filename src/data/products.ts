
import type { Product } from '@/lib/types';

export const products: Omit<Product, 'id' | 'views'>[] = [
  {
    name: 'AURA Wireless Headphones',
    description: 'Immerse yourself in high-fidelity sound with these sleek, noise-canceling over-ear headphones.',
    price: 399.99,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'sleek headphones',
    category: 'Electronics',
    timestamp: new Date()
  },
  {
    name: 'ChronoLink Smartwatch',
    description: 'Stay connected and track your fitness goals with this stylish and powerful smartwatch.',
    price: 429.00,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'modern smartwatch',
    category: 'Electronics',
    timestamp: new Date()
  },
  {
    name: 'ErgoFlow Mouse',
    description: 'Experience ultimate comfort and precision with this ergonomic vertical mouse, designed for all-day use.',
    price: 99.99,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'ergonomic mouse',
    category: 'Electronics',
    timestamp: new Date()
  },
  {
    name: 'VoltPack Power Bank',
    description: 'A slim, high-capacity portable charger that keeps your devices powered up on the go.',
    price: 34.99,
    image: 'https://images.pexels.com/photos/133500/pexels-photo-133500.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'power bank',
    category: 'Accessories',
    timestamp: new Date()
  },
  {
    name: 'Arctic Insulated Tumbler',
    description: 'This durable stainless steel tumbler maintains your drink’s temperature for hours, hot or cold.',
    price: 35.00,
    image: 'https://images.pexels.com/photos/905380/pexels-photo-905380.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'insulated tumbler',
    category: 'Home',
    timestamp: new Date()
  },
  {
    name: 'BaristaGo Coffee Machine',
    description: 'Brew cafe-quality coffee at home with this compact and intuitive single-serve coffee maker.',
    price: 159.00,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'coffee machine',
    category: 'Home',
    timestamp: new Date()
  },
   {
    name: 'Nordic Voyager Backpack',
    description: 'A stylish and durable backpack perfect for daily commutes or weekend adventures.',
    price: 80.00,
    image: 'https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'minimalist backpack',
    category: 'Accessories',
    timestamp: new Date()
  },
  {
    name: 'Alpine Fleece Jacket',
    description: 'Stay warm and comfortable in this soft, high-performance fleece jacket, made from recycled materials.',
    price: 139.00,
    image: 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'fleece jacket',
    category: 'Apparel',
    timestamp: new Date()
  },
  {
    name: 'BrewMaster Coffee Press',
    description: 'A modern take on the classic press, delivering a rich and smooth coffee experience every time.',
    price: 39.95,
    image: 'https://images.pexels.com/photos/3718442/pexels-photo-3718442.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'coffee press',
    category: 'Home',
    timestamp: new Date()
  },
  {
    name: 'The Catalyst: A Novel',
    description: 'An inspiring story about innovation, teamwork, and breaking through barriers to achieve the impossible.',
    price: 27.00,
    image: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'book cover design',
    category: 'Books',
    timestamp: new Date()
  },
  {
    name: 'NOVA-1 White Sneakers',
    description: 'Classic court style meets modern comfort in these versatile and iconic white leather sneakers.',
    price: 110.00,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'white sneakers',
    category: 'Apparel',
    timestamp: new Date()
  },
  {
    name: 'Echoes of the Void',
    description: 'A gripping psychological thriller that will keep you on the edge of your seat until the very last page.',
    price: 16.75,
    image: 'https://images.pexels.com/photos/267597/pexels-photo-267597.jpeg?auto=compress&cs=tinysrgb&w=800',
    data_ai_hint: 'thriller novel cover',
    category: 'Books',
    timestamp: new Date()
  },
];
