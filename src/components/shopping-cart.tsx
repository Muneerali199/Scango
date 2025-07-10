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
    <Card className="sticky top-24 flex flex-col h-[calc(100vh-7.5rem)] shadow-2xl rounded-2xl bg-card/80 backdrop-blur-sm border-2">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <ShoppingBag className="h-7 w-7" />
          <span>Your Cart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full">
            <div className="p-6">
                {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pt-16 text-center text-muted-foreground">
                    <ShoppingBag className="h-20 w-20 mb-4 opacity-50" />
                    <p className="text-xl font-medium">Your cart is empty</p>
                    <p className="text-sm">Add products to get started.</p>
                </div>
                ) : (
                items.map((item, index) => (
                    <div key={item.id}>
                        <CartItemCard item={item} onUpdate={onUpdate} onRemove={onRemove} />
                        {index < items.length -1 && <Separator className="my-4"/>}
                    </div>
                ))
                )}
            </div>
        </ScrollArea>
      </CardContent>
      {items.length > 0 && (
      <CardFooter className="flex-col items-start gap-4 bg-secondary/30 p-6 rounded-b-2xl border-t-2 mt-auto">
          <>
            <div className="w-full space-y-2 text-md">
              <div className="flex justify-between text-muted-foreground">
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
            <Button className="w-full h-12 text-lg font-bold" onClick={onCheckout}>
              <CreditCard className="mr-2 h-6 w-6" />
              Proceed to Checkout
            </Button>
          </>
      </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingCart;
