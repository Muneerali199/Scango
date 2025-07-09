"use client";

import type { FC } from "react";
import ProductCard from "./product-card";
import { products } from "@/data/products";
import type { Product } from "@/lib/types";

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: FC<ProductListProps> = ({ onAddToCart }) => {
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold tracking-tight">Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
