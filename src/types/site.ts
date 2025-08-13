export interface Site {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSiteRequest {
  name: string;
  description: string;
}

export interface CreateSiteResponse {
  site: Site;
  message?: string;
}

export interface GetSitesResponse {
  sites: Site[];
  total?: number;
}

export interface DeleteSiteResponse {
  message: string;
  success: boolean;
}