import { z } from "zod";

// Base Product Schema - matches your API structure
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

// Extended Product Schema for external APIs (like the one causing conflicts)
export const ExtendedProductSchema = ProductSchema.extend({
  title: z.string().optional(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial().omit({ id: true });

// Types
export type Product = z.infer<typeof ProductSchema>;
export type ExtendedProduct = z.infer<typeof ExtendedProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

// Generic product-like object interface for normalization
export interface ProductLike {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  price: string | number;
  stock?: number;
  [key: string]: unknown; // For any additional properties
}

// Utility function to normalize products for cart - now type-safe
export const normalizeProductForCart = (product: ProductLike): Product => {
  return {
    id: product.id,
    name: product.name || product.title || "Unknown Product",
    description: product.description || "",
    price:
      typeof product.price === "string"
        ? product.price
        : product.price?.toString() || "0",
    stock: product.stock || 0,
  };
};

// Enhanced pagination interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetProductsResponse {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
  pagination: PaginationInfo;
}

export interface CreateProductResponse {
  data: Product;
  message: string;
}

export interface UpdateProductResponse {
  data: Product;
  message: string;
}

export interface DeleteProductResponse {
  message: string;
}
