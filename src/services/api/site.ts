import { siteConfig } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateSiteRequest,
  CreateSiteResponse,
  DeleteSiteResponse,
  GetSitesResponse,
} from "@/types/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const siteApi = {
  // Get all sites
  getSites: async (): Promise<GetSitesResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/site/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create a new site
  createSite: async (data: CreateSiteRequest): Promise<CreateSiteResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/site/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete site
  deleteSite: async (siteId: string): Promise<DeleteSiteResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/site/${siteId}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
};