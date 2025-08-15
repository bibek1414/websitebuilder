// types/product.ts
import { z } from "zod";

// Product Schema
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial().omit({ id: true });

// Types
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

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
