
"use client";

import type { FC } from "react";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
}

const ProductList: FC<ProductListProps> = ({ products, onAddToCart, wishlist, onToggleWishlist }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
