import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  siteId?: string;
}

export const ProductCard3: React.FC<ProductCardProps> = ({
  product,
  siteId,
}) => {
  const link = siteId ? `/preview?site=${siteId}&product=${product.id}` : "#";

  return (
    <Link href={link}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group flex h-full border-border bg-card">
        <div className="relative w-1/3 flex-shrink-0">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4 sm:p-6 flex flex-col justify-between w-2/3">
          <div>
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
            <h3 className="font-semibold text-lg sm:text-xl leading-tight mt-2 text-foreground">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-primary">
                $
                {(
                  product.price *
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="justify-start p-0 h-auto mt-4 text-primary hover:text-primary/80"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
