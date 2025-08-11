import React from "react";
import { Component, ComponentUpdateData } from "@/components/component-renders";
import { useProducts } from "@/hooks/use-products";
import { ProductCard1 } from "./product-card1";
import { ProductCard2 } from "./product-card2";
import { ProductCard3 } from "./product-card3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye } from "lucide-react";
import { Product } from "@/types/product";

interface ProductsListProps {
  component: Component;
  isPreview?: boolean;
  siteId?: string;
  onUpdate?: (componentId: string, newContent: ComponentUpdateData) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  component,
  isPreview = false,
  siteId,
}) => {
  const { limit = 8, title = "Featured Products" } =
    component.productsData || {};
  const { data, isLoading, error } = useProducts(limit);

  // Extract products from the response data
  const products = data?.products || [];

  const renderProductCard = (product: Product, isBuilderMode: boolean = false) => {
    const cardProps = {
      product,
      siteId: isBuilderMode ? undefined : siteId, // Disable links in builder mode
    };

    switch (component.style) {
      case "style-2":
        return <ProductCard2 {...cardProps} />;
      case "style-3":
        return <ProductCard3 {...cardProps} />;
      case "style-1":
      default:
        return <ProductCard1 {...cardProps} />;
    }
  };

  const gridStyle =
    component.style === "style-3"
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // Builder mode preview (when isPreview is false)
  if (!isPreview) {
    return (
      <div className="relative">
        {/* Style Info Header */}
        <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            Product Section Configuration
          </h3>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Style: {component.style || "style-1"}</span>
            <span>Limit: {limit}</span>
            <span>Title: {title}</span>
          </div>
        </div>

        {/* Actual Product Preview */}
        <div className="py-4">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-6 text-foreground/75">
              {title}
            </h2>

            {isLoading && (
              <div className={`grid ${gridStyle} gap-4`}>
                {Array.from({ length: Math.min(limit, 4) }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.message ||
                    "Failed to load products. Please try again later."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && products.length > 0 && (
              <div className={`grid ${gridStyle} gap-4`}>
                {products.slice(0, Math.min(limit, 4)).map((product) => (
                  <div
                    key={product.id}
                    className="relative cursor-default transform hover:scale-105 transition-transform duration-200"
                  >
                    {/* Overlay to prevent clicks in builder mode */}
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderProductCard(product, true)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            )}

            {!isLoading && !error && products.length > 4 && (
              <div className="text-center mt-4 p-2 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">
                  Showing 4 of {products.length} products in builder preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="py-8 md:py-12 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
          {title}
        </h2>

        {isLoading && (
          <div className={`grid ${gridStyle} gap-6`}>
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message ||
                "Failed to load products. Please try again later."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className={`grid ${gridStyle} gap-6`}>
            {products.map((product) => (
              <div key={product.id}>{renderProductCard(product, false)}</div>
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
