import React from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Star,
  ShieldCheck,
  Truck,
  PackageCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDetailProps {
  productId: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { data: product, isLoading, error } = useProduct(productId);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Could not load product details. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {product.images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === img
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-primary">
                ${discountedPrice}
              </span>
              <span className="text-xl text-muted-foreground line-through ml-3">
                ${product.price.toFixed(2)}
              </span>
              <Badge variant="destructive" className="ml-3">
                {product.discountPercentage.toFixed(0)}% OFF
              </Badge>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6">
              <Button size="lg" className="w-full">
                Add to Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center text-sm">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
                <Truck className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">
                  Fast Shipping
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">
                  {product.warrantyInformation || "1 Year Warranty"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
                <PackageCheck className="w-6 h-6 text-primary" />
                <span className="font-medium text-green-600">
                  {product.availabilityStatus || "In Stock"}
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full mt-6">
              <AccordionItem value="reviews">
                <AccordionTrigger>Reviews</AccordionTrigger>
                <AccordionContent>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-border last:border-b-0 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            {review.reviewerName}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No reviews available yet.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
