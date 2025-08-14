import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  Product,
} from "@/types/product";

export const useProductApi = {
  getProducts: async (page = 1, limit = 10): Promise<GetProductsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/product/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    const data = await response.json();

    // Transform the response to match our expected format
    return {
      data: Array.isArray(data) ? data : data.results || [],
      total: data.count || data.length || 0,
      page,
      limit,
    };
  },

  getProduct: async (id: number): Promise<Product> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  createProduct: async (
    data: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product created successfully",
    };
  },

  updateProduct: async (
    id: number,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product updated successfully",
    };
  },

  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return {
      message: "Product deleted successfully",
    };
  },
};
