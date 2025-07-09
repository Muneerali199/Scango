"use client";

import type { FC } from "react";
import { Sparkles, PlusCircle, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { ProductRecommendationOutput } from "@/ai/flows/product-recommendation";
import { products } from "@/data/products";
import type { Product } from "@/lib/types";

interface AIRecommendationsProps {
  recommendations: ProductRecommendationOutput["recommendations"];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

const AIRecommendations: FC<AIRecommendationsProps> = ({ recommendations, isLoading, onAddToCart }) => {
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">AI Recommendations</h2>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">AI Recommendations</h2>
        </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {recommendations.map((rec) => {
            const productDetails = products.find(p => p.id === rec.productId);
            if (!productDetails) return null;

            return (
              <CarouselItem key={rec.productId} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="flex h-full flex-col">
                    <CardHeader>
                      <CardTitle>{rec.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">Why you might like it:</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" size="sm" onClick={() => onAddToCart(productDetails)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default AIRecommendations;
