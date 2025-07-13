
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
  const isWishlisted = wishlist.has(String(product.id));

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group border-transparent hover:border-primary/20 h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/store/${product.id}`} className="block relative h-64 w-full">
            <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={product.data_ai_hint}
            />
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
            onToggleWishlist(String(product.id), product.title);
          }}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          <span className="sr-only">Toggle Wishlist</span>
        </Button>
      </CardHeader>
      <Link href={`/store/${product.id}`} className="flex flex-col flex-grow">
        <CardContent className="flex-grow p-4">
            <CardTitle className="mb-2 text-lg font-semibold leading-snug hover:text-primary transition-colors">{product.title}</CardTitle>
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
  </change>
  </change>
  <change>
    <file>src/components/cart-item.tsx</file>
    <content><![CDATA[
"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { FC } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CartItem, ProductQuality } from "@/lib/types";
import { qualityMultipliers } from "@/lib/types";

interface CartItemProps {
  item: CartItem;
  onUpdate: (item: CartItem) => void;
  onRemove: (itemId: string) => void;
}

const CartItemCard: FC<CartItemProps> = ({ item, onUpdate, onRemove }) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdate({ ...item, quantity: newQuantity });
    }
  };

  const handleQualityChange = (quality: ProductQuality) => {
    onUpdate({ ...item, quality });
  };
  
  const totalPrice = item.price * qualityMultipliers[item.quality] * item.quantity;

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={item.image} alt={item.title} fill className="object-contain" data-ai-hint={item.data_ai_hint} />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-md border">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Select value={item.quality} onValueChange={handleQualityChange}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Budget">Budget</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onRemove(String(item.id))}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItemCard;
