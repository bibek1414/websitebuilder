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

export interface GetProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
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