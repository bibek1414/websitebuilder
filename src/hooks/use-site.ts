import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { siteApi } from "@/services/api/site";
import type {
  CreateSiteRequest,
  CreateSiteResponse,
  DeleteSiteResponse,
} from "@/types/site";

interface ApiError {
  message?: string;
}

// Query keys
export const siteKeys = {
  all: ["sites"] as const,
  lists: () => [...siteKeys.all, "list"] as const,
};

// Custom hooks
export const useSites = () => {
  return useQuery({
    queryKey: siteKeys.lists(),
    queryFn: siteApi.getSites,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteRequest) => siteApi.createSite(data),
    onSuccess: (data: CreateSiteResponse) => {
      // Invalidate and refetch sites list
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });

      toast.success("Site Created", {
        description:
          data.message ||
          `Site "${data.site.name}" has been created successfully.`,
      });
    },
    onError: (error: ApiError) => {
      console.error("Create site error:", error);
      toast.error("Failed to Create Site", {
        description:
          error.message || "An error occurred while creating the site.",
      });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (siteId: string) => siteApi.deleteSite(siteId),
    onSuccess: (data: DeleteSiteResponse) => {
      // Invalidate sites list
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });

      toast.success("Site Deleted", {
        description: data.message || "The site has been deleted successfully.",
      });
    },
    onError: (error: ApiError) => {
      console.error("Delete site error:", error);
      toast.error("Failed to Delete Site", {
        description:
          error.message || "An error occurred while deleting the site.",
      });
    },
  });
};