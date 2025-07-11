
"use client";

import Image from "next/image";
import { PlusCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import type { FC } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart, wishlist, onToggleWishlist }) => {
  const isWishlisted = wishlist.has(product.id);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg group">
      <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.data_ai_hint}
          />
        </div>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 rounded-full h-9 w-9 transition-all",
            isWishlisted ? "bg-red-500/90 text-white hover:bg-red-500" : "bg-background/70 hover:bg-background"
          )}
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product.id, product.name);
          }}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          <span className="sr-only">Toggle Wishlist</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg font-semibold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Button onClick={() => onAddToCart(product)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
