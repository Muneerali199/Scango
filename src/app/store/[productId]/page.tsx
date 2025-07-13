
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, PlusCircle, Heart, Star, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, updateDoc, increment, collection, query, where, limit, getDocs } from "firebase/firestore";
import type { Product, CartItem } from "@/lib/types";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product-card";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Increment view count
  useEffect(() => {
    if (productId) {
      const docRef = doc(db, "products", productId);
      updateDoc(docRef, {
        views: increment(1)
      }).catch(err => console.error("Failed to increment view count", err));
    }
  }, [productId]);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      const docRef = doc(db, "products", productId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);

          // Fetch related products from the same category
          const q = query(
            collection(db, "products"), 
            where("category", "==", productData.category),
            where("id", "!=", productId),
            limit(4)
          );
          
          getDocs(q).then((snapshot) => {
            const related = snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Product);
            setRelatedProducts(related);
          });

        } else {
          console.log("No such document!");
          // Handle not found, maybe redirect
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [productId]);

  useEffect(() => {
    // Load initial wishlist and cart from localStorage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(new Set(JSON.parse(storedWishlist)));
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const triggerStorageUpdate = () => {
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      let newItems: CartItem[];
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1, quality: "Standard" }];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      triggerStorageUpdate();
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
        triggerStorageUpdate();
        return newWishlist;
    });
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isWishlisted = product ? wishlist.has(product.id) : false;

  if (isLoading || !product) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header cartCount={cartCount} />
        <main className="container mx-auto flex-1 px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-12 w-12" />
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header cartCount={cartCount} />
      <main className="container mx-auto flex-1 px-4 py-8">
         <Link href="/store" className="mb-8 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-lg">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.data_ai_hint}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2 mb-4">
                    <div className="flex text-yellow-400">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5" />
                    </div>
                    <span className="text-muted-foreground text-sm">(124 reviews)</span>
                </div>
                <p className="text-3xl font-extrabold text-primary mb-6">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1" onClick={() => handleAddToCart(product)}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                    <Button size="lg" variant={isWishlisted ? "destructive" : "outline"} className="w-full sm:w-auto" onClick={() => handleToggleWishlist(product.id, product.name)}>
                        <Heart className="mr-2 h-5 w-5" /> {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    </Button>
                </div>
                 <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500"/>
                    <span>In Stock & Ready to Ship!</span>
                </div>
            </div>
        </div>

        {relatedProducts.length > 0 && (
            <div className="mt-24">
                <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(related => (
                        <ProductCard 
                            key={related.id}
                            product={related}
                            onAddToCart={handleAddToCart}
                            wishlist={wishlist}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  )
}
