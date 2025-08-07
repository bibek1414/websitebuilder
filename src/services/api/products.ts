import { Product, ProductListResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export const productsApi = {
  // Fetch all products with optional limit
  getProducts: async (limit: number = 8): Promise<ProductListResponse> => {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json();
  },

  // Fetch single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  
 
};
