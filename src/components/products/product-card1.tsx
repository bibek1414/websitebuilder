import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCard1Props {
  product: Product;
  siteId?: string;
}

export const ProductCard1: React.FC<ProductCard1Props> = ({
  product,
  siteId,
}) => {
  // Mock image since API doesn't provide images
  const mockImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop";
  const price = parseFloat(product.price);
  const discountPercentage = 15; // Mock discount
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.5; // Mock rating

  const CardWrapper = siteId
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={`/preview?site=${siteId}&product=${product.id}`}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <CardWrapper>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-card">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={mockImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {discountPercentage > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2 text-xs"
              >
                -{discountPercentage}%
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 text-xs"
              >
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-xs ml-2">
                ({rating})
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  ${discountedPrice}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
              <Badge
                variant={product.stock > 0 ? "default" : "secondary"}
                className="text-xs"
              >
                Stock: {product.stock}
              </Badge>
            </div>
            <Button size="sm" className="w-full" disabled={product.stock === 0}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
