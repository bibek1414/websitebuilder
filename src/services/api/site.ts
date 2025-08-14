
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateSiteRequest,
  CreateSiteResponse,
  DeleteSiteResponse,
  GetSitesResponse,
} from "@/types/site";

export const useSiteApi = {
  getSites: async (): Promise<GetSitesResponse> => {
    const API_BASE_URL = getApiBaseUrl(); // Get URL dynamically for each call
    const response = await fetch(`${API_BASE_URL}/api/website/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create a new site
  createSite: async (data: CreateSiteRequest): Promise<CreateSiteResponse> => {
    const API_BASE_URL = getApiBaseUrl(); // Get URL dynamically for each call
    const response = await fetch(`${API_BASE_URL}/api/website/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete site
  deleteSite: async (siteId: string): Promise<DeleteSiteResponse> => {
    const API_BASE_URL = getApiBaseUrl(); // Get URL dynamically for each call
    const response = await fetch(`${API_BASE_URL}/api/website/${siteId}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
};
