
"use client";

import Image from "next/image";
import { PlusCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart, wishlist, onToggleWishlist }) => {
  const isWishlisted = wishlist.has(product.id);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group border-transparent hover:border-primary/20 h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/store/${product.id}`} className="block">
            <div className="relative h-64 w-full">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={product.data_ai_hint}
            />
            </div>
        </Link>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-3 right-3 rounded-full h-9 w-9 transition-all z-10",
            isWishlisted ? "bg-red-500/90 text-white hover:bg-red-500" : "bg-background/70 hover:bg-background"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, product.name);
          }}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          <span className="sr-only">Toggle Wishlist</span>
        </Button>
      </CardHeader>
      <Link href={`/store/${product.id}`} className="flex flex-col flex-grow">
        <CardContent className="flex-grow p-4">
            <CardTitle className="mb-2 text-lg font-semibold leading-snug hover:text-primary transition-colors">{product.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">{product.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
            <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
            </p>
        </CardFooter>
      </Link>
      <div className="p-4 pt-0">
         <Button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} size="sm" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
