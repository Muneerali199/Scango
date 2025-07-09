"use client";

import type { FC } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartItemCard from "./cart-item";
import type { CartItem } from "@/lib/types";
import { qualityMultipliers } from "@/lib/types";
import { ShoppingBag } from "lucide-react";

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
    <Card className="sticky top-20 h-[calc(100vh-10rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span>Your Cart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-220px)] p-0">
        <ScrollArea className="h-full">
            <div className="px-6">
                {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                    <ShoppingBag className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Add products to get started.</p>
                </div>
                ) : (
                items.map((item) => (
                    <div key={item.id}>
                        <CartItemCard item={item} onUpdate={onUpdate} onRemove={onRemove} />
                        <Separator className="my-2"/>
                    </div>
                ))
                )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="absolute bottom-0 w-full flex-col items-start gap-2 bg-background p-6">
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
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingCart;
