import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  siteId?: string;
}

export const ProductCard2: React.FC<ProductCardProps> = ({
  product,
  siteId,
}) => {
  const link = siteId ? `/preview?site=${siteId}&product=${product.id}` : "#";

  return (
    <Link href={link}>
      <Card className="overflow-hidden transition-all duration-300 group hover:shadow-xl h-full flex flex-col border-border bg-card">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge variant="destructive" className="absolute top-3 right-3">
            {product.discountPercentage.toFixed(0)}% OFF
          </Badge>
        </div>
        <CardContent className="p-4 bg-card flex-grow flex flex-col justify-between">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">
              {product.category}
            </Badge>
            <h3 className="font-bold text-xl leading-tight truncate text-foreground">
              {product.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-2xl font-extrabold text-primary">
              $
              {(product.price * (1 - product.discountPercentage / 100)).toFixed(
                2
              )}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-foreground">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>{product.rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
