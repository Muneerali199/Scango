
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/header";
import ProductList from "@/components/product-list";
import ShoppingCart from "@/components/shopping-cart";
import type { CartItem, Product } from "@/lib/types";
import { productRecommendation, type ProductRecommendationOutput } from "@/ai/flows/product-recommendation";
import AIRecommendations from "@/components/ai-recommendations";
import { toast } from "react-hot-toast";
import { CheckoutForm } from "@/components/checkout-form";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const PRODUCTS_PER_PAGE = 8;
type SortOption = "name:asc" | "price:asc" | "price:desc" | "rating:desc";


export default function StorePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("name:asc");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isMobile = useIsMobile();


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data: Product[] = await res.json();
        // The API provides 'title', but our cart uses 'name'. Let's add 'name' for compatibility.
        const productsWithNames = data.map(p => ({ ...p, name: p.title }));
        setAllProducts(productsWithNames);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Could not load products. Please try again later.");
      }
    };
    fetchProducts();
  }, []);
  
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allProducts.map(p => p.category));
    return ["all", ...Array.from(uniqueCategories)];
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setIsLoadingProducts(true);

      const filtered = selectedCategory === "all"
        ? allProducts
        : allProducts.filter(p => p.category === selectedCategory);
      
      const sorted = [...filtered].sort((a, b) => {
        const [field, direction] = sortOption.split(':');
        
        let valA: any;
        let valB: any;

        if (field === 'name') {
          valA = a.title;
          valB = b.title;
        } else if (field === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (field === 'rating') {
          valA = a.rating.rate;
          valB = b.rating.rate;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      setDisplayedProducts(sorted.slice(0, PRODUCTS_PER_PAGE));
      setPage(1);
      setHasMore(sorted.length > PRODUCTS_PER_PAGE);
      setIsLoadingProducts(false);
    }
  }, [allProducts, selectedCategory, sortOption]);


  const handleLoadMore = () => {
    const nextPage = page + 1;
    const newProducts = allProducts
      .filter(p => selectedCategory === "all" || p.category === selectedCategory)
      .sort((a, b) => {
         const [field, direction] = sortOption.split(':');
         if (field === 'name') return direction === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
         if (field === 'price') return direction === 'asc' ? a.price - b.price : b.price - a.price;
         if (field === 'rating') return direction === 'asc' ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate;
         return 0;
      })
      .slice(0, nextPage * PRODUCTS_PER_PAGE);

    setDisplayedProducts(newProducts);
    setPage(nextPage);
    setHasMore(newProducts.length < allProducts.length);
  };


  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cart') {
            const updatedCart = localStorage.getItem("cart");
            if (updatedCart) setCartItems(JSON.parse(updatedCart));
        }
        if (e.key === 'wishlist') {
            const updatedWishlist = localStorage.getItem("wishlist");
            if(updatedWishlist) setWishlist(new Set(JSON.parse(updatedWishlist)))
        }
    };
    window.addEventListener('storage', handleStorageChange);

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try { setWishlist(new Set(JSON.parse(storedWishlist))); } catch (e) { localStorage.removeItem("wishlist"); }
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try { setCartItems(JSON.parse(storedCart)); } catch(e) { localStorage.removeItem("cart"); }
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const triggerStorageUpdate = () => {
    window.dispatchEvent(new Event('storage'));
  };

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

  useEffect(() => {
    if (cartItems.length > 0 && allProducts.length > 0) {
      const getRecs = async () => {
        setIsLoadingRecommendations(true);
        const cartProductIds = cartItems.map(item => item.id);
        const potentialRecs = allProducts.filter(p => !cartProductIds.includes(p.id));
        
        try {
          // Simplified local recommendation logic
           const recs = potentialRecs.slice(0, 5).map(p => ({
            productId: String(p.id),
            name: p.title,
            reason: `Because you showed interest in ${cartItems[0].category}, you might also like this.`
          }));

          setRecommendations(recs);
        } catch (error) {
          console.error("Failed to get recommendations:", error);
          setRecommendations([]);
        } finally {
          setIsLoadingRecommendations(false);
        }
      };
      const timer = setTimeout(getRecs, 500); // Debounce
      return () => clearTimeout(timer);
    } else {
      setRecommendations([]);
    }
  }, [cartItems, allProducts]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartComponent = (
      <ShoppingCart
        items={cartItems}
        onUpdate={handleUpdateCartItem}
        onRemove={(itemId) => {
          const newCartItems = cartItems.filter(item => String(item.id) !== itemId);
          setCartItems(newCartItems);
          localStorage.setItem('cart', JSON.stringify(newCartItems));
          triggerStorageUpdate();
        }}
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Our Products</h1>
                            <p className="text-lg text-muted-foreground">Browse our curated selection of high-quality goods.</p>
                        </div>
                        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name:asc">Name: A-Z</SelectItem>
                                <SelectItem value="price:asc">Price: Low to High</SelectItem>
                                <SelectItem value="price:desc">Price: High to Low</SelectItem>
                                <SelectItem value="rating:desc">Highest Rated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                    products={displayedProducts} 
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    isLoading={isLoadingProducts}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    isLoadingMore={false}
                />
                
                <AIRecommendations 
                  recommendations={recommendations} 
                  isLoading={isLoadingRecommendations}
                  onAddToCart={(rec) => {
                      const product = allProducts.find(p => String(p.id) === rec.productId);
                      if (product) handleAddToCart(product);
                  }}
                  allProducts={allProducts}
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
