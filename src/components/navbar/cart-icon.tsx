"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/order">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full"
          >
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
};