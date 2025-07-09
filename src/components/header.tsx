"use client";

import { ScanLine, ShoppingCart } from "lucide-react";
import type { FC } from "react";

interface HeaderProps {
  cartCount: number;
}

const Header: FC<HeaderProps> = ({ cartCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <ScanLine className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">ScanGo</h1>
        </div>
        <div className="relative">
          <ShoppingCart className="h-7 w-7" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
