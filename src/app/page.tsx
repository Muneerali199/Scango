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

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

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

  return (
    <>
      <Header cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <ProductList onAddToCart={handleAddToCart} />
            <AIRecommendations 
              recommendations={recommendations} 
              isLoading={isLoadingRecommendations}
              onAddToCart={handleAddToCart}
            />
          </div>
          <div className="lg:col-span-1">
            <ShoppingCart
              items={cartItems}
              onUpdate={handleUpdateCartItem}
              onRemove={handleRemoveFromCart}
              onCheckout={() => setIsCheckoutOpen(true)}
            />
          </div>
        </div>
      </main>
      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        totalAmount={totalAmount}
        onCheckout={handleClearCart}
      />
    </>
  );
}
