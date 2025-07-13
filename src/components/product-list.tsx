
"use client";

import type { FC } from "react";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, onAddToCart, wishlist, onToggleWishlist, isLoading, onLoadMore, hasMore, isLoadingMore }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {products.length > 0 ? (
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
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-xl font-semibold">No products found.</p>
          <p>Try adjusting your filters.</p>
        </div>
      )}

      {hasMore && (
        <div className="mt-12 flex justify-center">
            <Button onClick={onLoadMore} disabled={isLoadingMore} size="lg">
                {isLoadingMore ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                    </>
                ) : (
                    "Load More Products"
                )}
            </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
