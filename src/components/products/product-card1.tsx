import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  siteId?: string;
}

export const ProductCard1: React.FC<ProductCardProps> = ({
  product,
  siteId,
}) => {
  const link = siteId
    ? `/preview?site=${siteId}&product=${product.id}`
    : "#";

  return (
    <Link href={link}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col border-border bg-card">
        <div className="relative aspect-square w-full">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg leading-tight truncate text-foreground">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold text-primary">
              ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{product.rating}</span>
          </div>
          <Button className="w-full mt-4">View Product</Button>
        </CardContent>
      </Card>
    </Link>
  );
};