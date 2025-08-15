"use client";

import React from "react";
import { useOrders } from "@/hooks/use-orders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, User, MapPin, Calendar, DollarSign } from "lucide-react";
import { Order } from "@/types/orders";

const OrderCard = ({ order }: { order: Order }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order.id}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            ${order.total_amount}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDate(order.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{order.customer_name}</span>
          </div>
          <div className="text-sm text-muted-foreground ml-6">
            {order.customer_email}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Shipping Address:</div>
              <div className="text-muted-foreground">
                {order.shipping_address}
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground ml-6">
            <div className="font-medium">Billing Address:</div>
            <div>{order.customer_address}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              Order Items ({order.items.length})
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm bg-secondary/20 p-2 rounded"
              >
                <div>
                  <span className="font-medium">
                    Product ID: {item.product_id}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    x{item.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function OrdersPage() {
  const { data: ordersResponse, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Manage and view all your orders
          </p>
        </div>
        <OrdersSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Manage and view all your orders
          </p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load orders. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const orders = ordersResponse?.results || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Orders</h1>
        <p className="text-muted-foreground">
          {ordersResponse?.count
            ? `${ordersResponse.count} total orders`
            : "Manage and view all your orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
