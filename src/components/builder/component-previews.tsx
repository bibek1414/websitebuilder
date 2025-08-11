import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hero as Hero1,
  defaultHeroData as defaultHero1Data,
} from "@/components/hero/hero";
import { Hero2, defaultHero2Data } from "@/components/hero/hero-2";
import { ProductCard1 } from "@/components/products/product-card1";
import { ProductCard2 } from "@/components/products/product-card2";
import { ProductCard3 } from "@/components/products/product-card3";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ComponentPreviewsProps {
  open: boolean;
  componentType: string | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: string, style: string) => void;
}

const PreviewCard = ({
  title,
  onClick,
  children,
  isLoading,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}) => (
  <Card className="w-full mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 border-t">
      <div className="overflow-hidden w-full flex justify-center">
        {children}
      </div>
    </CardContent>
    <div className="p-4 border-t">
      <Button onClick={onClick} className="w-full" disabled={isLoading}>
        Add Component
      </Button>
    </div>
  </Card>
);

export const ComponentPreviews: React.FC<ComponentPreviewsProps> = ({
  open,
  componentType,
  onOpenChange,
  onSelect,
}) => {
  const {
    data: productResponse,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useProducts(3);

  const getDialogTitle = () => {
    if (!componentType) return "";
    return `Select a ${
      componentType.charAt(0).toUpperCase() + componentType.slice(1)
    } Style`;
  };

  const renderProductPreviews = () => {
    if (isLoadingProducts) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full mb-4">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-0 border-t">
                <div className="bg-muted p-4 flex items-center justify-center">
                  <div className="w-full max-w-md space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (isErrorProducts) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Products</AlertTitle>
          <AlertDescription>
            Could not load product previews. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    const products = productResponse?.products || [];

    if (products.length < 3) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not Enough Data</AlertTitle>
          <AlertDescription>
            Could not fetch enough product data to display all previews.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        <PreviewCard
          title="Product Grid - Classic"
          onClick={() => onSelect("products", "style-1")}
        >
          <div className="p-4 w-full max-w-md">
            <ProductCard1 product={products[0]} />
          </div>
        </PreviewCard>

        <PreviewCard
          title="Product Grid - Modern"
          onClick={() => onSelect("products", "style-2")}
        >
          <div className="p-4 w-full max-w-md">
            <ProductCard2 product={products[1]} />
          </div>
        </PreviewCard>

        <PreviewCard
          title="Product List - Horizontal"
          onClick={() => onSelect("products", "style-3")}
        >
          <div className="p-4 w-full max-w-md">
            <ProductCard3 product={products[2]} />
          </div>
        </PreviewCard>
      </div>
    );
  };

  const renderHeroPreviews = () => {
    return (
      <div className="space-y-4">
        <PreviewCard
          title="Hero - Basic"
          onClick={() => onSelect("hero", "style-1")}
        >
          <div className="w-full max-w-4xl mx-auto scale-75 md:scale-90 lg:scale-100 transform pointer-events-none">
            <Hero1 heroData={defaultHero1Data} />
          </div>
        </PreviewCard>

        <PreviewCard
          title="Hero - Advanced with Slider"
          onClick={() => onSelect("hero", "style-2")}
        >
          <div className="w-full max-w-4xl mx-auto scale-75 md:scale-90 lg:scale-100 transform pointer-events-none">
            <Hero2 heroData={defaultHero2Data} />
          </div>
        </PreviewCard>
      </div>
    );
  };

  const renderPreviews = () => {
    switch (componentType) {
      case "hero":
        return renderHeroPreviews();
      case "products":
        return renderProductPreviews();
      default:
        return (
          <p className="text-muted-foreground">
            No previews available for this component type.
          </p>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Select a style and click &apos;Add Component&apos; to add it to your page.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] p-1">
          <div className="p-4">{renderPreviews()}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
