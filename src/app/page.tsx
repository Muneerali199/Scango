
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header";
import ProductList from "@/components/product-list";
import ShoppingCart from "@/components/shopping-cart";
import type { CartItem, Product } from "@/lib/types";
import { productRecommendation, type ProductRecommendationOutput } from "@/ai/flows/product-recommendation";
import AIRecommendations from "@/components/ai-recommendations";
import { useToast } from "@/hooks/use-toast";
import { CheckoutForm } from "@/components/checkout-form";
import { products as allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";

const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      // In a real app, you would fetch from an API endpoint
      // const res = await fetch('/api/products');
      // const data = await res.json();
      setProducts(allProducts);
    }
    fetchProducts();
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(new Set(JSON.parse(storedWishlist)));
    }
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, quality: "Standard" }];
    });
    toast({
        title: "Added to cart!",
        description: `${product.name} is now in your cart.`,
    })
  }, [toast]);

  const handleToggleWishlist = useCallback((productId: string, productName: string) => {
    setWishlist(prevWishlist => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast({
          title: "Removed from Wishlist",
          description: `${productName} has been removed from your wishlist.`,
        });
      } else {
        newWishlist.add(productId);
        toast({
          title: "Added to Wishlist!",
          description: `${productName} has been added to your wishlist.`,
        });
      }
      localStorage.setItem("wishlist", JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  }, [toast]);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const handleUpdateCartItem = useCallback((updatedItem: CartItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);
  
  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);
  
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
