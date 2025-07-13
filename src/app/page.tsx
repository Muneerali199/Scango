
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";


export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isMobile = useIsMobile();


  useEffect(() => {
    // Load products from localStorage or use initial products
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            setProducts(parsedProducts);
        } catch (e) {
            console.error("Failed to parse products from localStorage", e);
            setProducts(initialProducts);
            localStorage.setItem("products", JSON.stringify(initialProducts));
        }
    } else {
        localStorage.setItem("products", JSON.stringify(initialProducts));
    }
    
    // Listen for storage changes to update products list
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'products') {
            const updatedProducts = localStorage.getItem("products");
            if (updatedProducts) {
                setProducts(JSON.parse(updatedProducts));
            }
        }
        if (e.key === 'cart') {
            const updatedCart = localStorage.getItem("cart");
            if (updatedCart) {
                setCartItems(JSON.parse(updatedCart));
            }
        }
        if (e.key === 'wishlist') {
            const updatedWishlist = localStorage.getItem("wishlist");
            if(updatedWishlist) {
                setWishlist(new Set(JSON.parse(updatedWishlist)))
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);

    // Load initial wishlist and cart from localStorage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        setWishlist(new Set(JSON.parse(storedWishlist)));
      } catch (e) {
        localStorage.removeItem("wishlist");
      }
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch(e) {
        localStorage.removeItem("cart");
      }
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const triggerStorageUpdate = () => {
    window.dispatchEvent(new Event('storage'));
  };

  const updateCart = (newCartItems: CartItem[]) => {
      setCartItems(newCartItems);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
      triggerStorageUpdate();
  }

  const handleAddToCart = useCallback((product: Product) => {
    let wasAdded = false;
    setCartItems((prevItems) => {
      let newItems: CartItem[];
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1, quality: "Standard" }];
        wasAdded = true;
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      triggerStorageUpdate();
      return newItems;
    });
    if (wasAdded) {
       toast.success(`${product.name} added to cart!`);
    }
  }, []);

  const handleToggleWishlist = useCallback((productId: string, productName: string) => {
    const newWishlist = new Set(wishlist);
    let isWishlisted;
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      isWishlisted = false;
    } else {
      newWishlist.add(productId);
      isWishlisted = true;
    }
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(Array.from(newWishlist)));
    triggerStorageUpdate();
    toast.success(isWishlisted ? `${productName} added to wishlist!` : `${productName} removed from wishlist.`);
  }, [wishlist]);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(newItems));
        triggerStorageUpdate();
        return newItems;
    });
  }, []);

  const handleUpdateCartItem = useCallback((updatedItem: CartItem) => {
    setCartItems((prevItems) => {
        const newItems = prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
        localStorage.setItem('cart', JSON.stringify(newItems));
        triggerStorageUpdate();
        return newItems;
    });
  }, []);
  
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
    triggerStorageUpdate();
    setIsCheckoutOpen(false);
  }, []);
  
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

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

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartComponent = (
      <ShoppingCart
        items={cartItems}
        onUpdate={handleUpdateCartItem}
        onRemove={handleRemoveFromCart}
        onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }}
        isSheet={isMobile}
      />
  );
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <div className="container mx-auto flex-1">
        <main className="grid flex-1 gap-8 px-4 py-8 md:grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-12">
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
            {isMobile ? (
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <SheetContent className="flex flex-col p-0 w-full sm:max-w-md">
                        {cartComponent}
                    </SheetContent>
                </Sheet>
            ) : (
                <aside className="hidden lg:block">
                    {cartComponent}
                </aside>
            )}
        </main>
      </div>
      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        totalAmount={totalAmount}
        onCheckout={handleClearCart}
      />
    </div>
  );
}
