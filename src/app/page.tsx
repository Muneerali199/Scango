
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header";
import ProductList from "@/components/product-list";
import ShoppingCart from "@/components/shopping-cart";
import type { CartItem, Product } from "@/lib/types";
import { productRecommendation, type ProductRecommendationOutput } from "@/ai/flows/product-recommendation";
import AIRecommendations from "@/components/ai-recommendations";
import { toast } from "react-hot-toast";
import { CheckoutForm } from "@/components/checkout-form";
import { products as initialProducts } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Load products from localStorage or use initial products
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        try {
            setProducts(JSON.parse(storedProducts));
        } catch (e) {
            console.error("Failed to parse products from localStorage", e);
            setProducts(initialProducts);
            localStorage.setItem("products", JSON.stringify(initialProducts));
        }
    } else {
        localStorage.setItem("products", JSON.stringify(initialProducts));
    }
    
    // Listen for storage changes to update products list
    const handleStorageChange = () => {
      const updatedProducts = localStorage.getItem("products");
      if (updatedProducts) {
        setProducts(JSON.parse(updatedProducts));
      }
      const updatedCart = localStorage.getItem("cart");
       if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Load initial wishlist and cart from localStorage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(new Set(JSON.parse(storedWishlist)));
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCart = (newCartItems: CartItem[]) => {
      setCartItems(newCartItems);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
      window.dispatchEvent(new Event('storage'));
  }

  const handleAddToCart = useCallback((product: Product) => {
    let newItems: CartItem[];
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1, quality: "Standard" }];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('storage'));
      return newItems;
    });
    toast.success(`${product.name} added to cart!`);
  }, []);

  const handleToggleWishlist = useCallback((productId: string, productName: string) => {
    setWishlist(prevWishlist => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast.success(`${productName} removed from wishlist.`);
      } else {
        newWishlist.add(productId);
        toast.success(`${productName} added to wishlist!`);
      }
      localStorage.setItem("wishlist", JSON.stringify(Array.from(newWishlist)));
      window.dispatchEvent(new Event('storage'));
      return newWishlist;
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
        return newItems;
    });
  }, []);

  const handleUpdateCartItem = useCallback((updatedItem: CartItem) => {
    setCartItems((prevItems) => {
        const newItems = prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
        return newItems;
    });
  }, []);
  
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('storage'));
  }, []);
  
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    if (cartItems.length > 0) {
      const getRecs = async () => {
        setIsLoadingRecommendations(true);
        try {
          const result = await productRecommendation({
            cartItems: cartItems.map(item => ({
              productId: item.id,
              name: item.name,
              quantity: item.quantity,
              category: item.category,
            })),
          });
          setRecommendations(result.recommendations);
        } catch (error) {
          console.error("Failed to get recommendations:", error);
          setRecommendations([]);
        } finally {
          setIsLoadingRecommendations(false);
        }
      };
      const timer = setTimeout(getRecs, 500); // Debounce API call
      return () => clearTimeout(timer);
    } else {
      setRecommendations([]);
    }
  }, [cartItems]);

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <main className="container mx-auto grid flex-1 gap-8 px-4 py-8 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px] lg:gap-12">
        <div className="flex flex-col gap-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Our Products</h1>
              <p className="text-lg text-muted-foreground">Browse our curated selection of high-quality goods.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <ProductList 
              products={filteredProducts} 
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
            <AIRecommendations 
              recommendations={recommendations} 
              isLoading={isLoadingRecommendations}
              onAddToCart={handleAddToCart}
            />
          </div>
        <aside>
          <ShoppingCart
            items={cartItems}
            onUpdate={handleUpdateCartItem}
            onRemove={handleRemoveFromCart}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </aside>
      </main>
      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        totalAmount={totalAmount}
        onCheckout={handleClearCart}
      />
    </div>
  );
}
