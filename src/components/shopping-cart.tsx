"use client";

import type { FC } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartItemCard from "./cart-item";
import type { CartItem } from "@/lib/types";
import { qualityMultipliers } from "@/lib/types";
import { ShoppingBag, CreditCard } from "lucide-react";

interface ShoppingCartProps {
  items: CartItem[];
  onUpdate: (item: CartItem) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

const ShoppingCart: FC<ShoppingCartProps> = ({ items, onUpdate, onRemove, onCheckout }) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * qualityMultipliers[item.quality] * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <Card className="sticky top-24 h-[calc(100vh-7.5rem)] shadow-lg rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingBag className="h-6 w-6" />
          <span>Your Cart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-240px)] p-0">
        <ScrollArea className="h-full">
            <div className="px-6">
                {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pt-16 text-center text-muted-foreground">
                    <ShoppingBag className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Add products to get started.</p>
                </div>
                ) : (
                items.map((item, index) => (
                    <div key={item.id}>
                        <CartItemCard item={item} onUpdate={onUpdate} onRemove={onRemove} />
                        {index < items.length -1 && <Separator className="my-2"/>}
                    </div>
                ))
                )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="absolute bottom-0 w-full flex-col items-start gap-4 bg-secondary/50 p-6 rounded-b-xl border-t">
        {items.length > 0 && (
          <>
            <div className="w-full text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2 bg-border/80" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full h-11 text-base font-bold" onClick={onCheckout}>
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingCart;
