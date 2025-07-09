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
        <Image src={item.image} alt={item.name} fill className="object-cover" data-ai-hint={item.data_ai_hint} />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
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
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onRemove(item.id)}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItemCard;
