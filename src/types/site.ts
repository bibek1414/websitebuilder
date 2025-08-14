export interface Site {
  id: number; // Changed from string to number based on your API response
  name: string;
  description: string;
  user: number;
  createdAt?: string; // Make optional since it's not in your API response
  updatedAt?: string;
}

export interface CreateSiteRequest {
  name: string;
  description: string;
}

export interface CreateSiteResponse extends Site {
  message?: string;
}

// Update this to match your API response
export type GetSitesResponse = Site[]; // Direct array instead of wrapped object

export interface DeleteSiteResponse {
  message: string;
  success: boolean;
}