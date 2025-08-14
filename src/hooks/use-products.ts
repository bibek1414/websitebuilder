import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Product, ProductListResponse } from "@/types/products";
import { productsApi } from "@/services/api/products";

// Query keys for better cache management
export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (limit: number) => [...productQueryKeys.lists(), limit] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  search: (query: string, limit: number) =>
    [...productQueryKeys.all, "search", query, limit] as const,
  categories: () => [...productQueryKeys.all, "categories"] as const,
  category: (category: string, limit: number) =>
    [...productQueryKeys.all, "category", category, limit] as const,
};

// Hook for fetching multiple products
export function useProducts(
  limit: number = 8
): UseQueryResult<ProductListResponse, Error> {
  return useQuery({
    queryKey: productQueryKeys.list(limit),
    queryFn: () => productsApi.getProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook for fetching a single product by ID
export function useProduct(id: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
