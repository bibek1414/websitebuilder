import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCard2Props {
  product: Product;
  siteId?: string;
}

export const ProductCard2: React.FC<ProductCard2Props> = ({
  product,
  siteId,
}) => {
  const mockImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop";
  const price = parseFloat(product.price);
  const discountPercentage = 15;
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.5;

  const CardWrapper = siteId
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={`/preview?site=${siteId}&product=${product.id}`}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <CardWrapper>
      <Card className="group overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 bg-card">
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-muted/30">
            <div className="aspect-square relative">
              <Image
                src={mockImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs font-medium">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-5">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
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

            <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-1">
              {product.name}
            </h3>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ${discountedPrice}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Stock: {product.stock}
                </div>
              </div>
            </div>

            <Button className="w-full" size="sm" disabled={product.stock === 0}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
