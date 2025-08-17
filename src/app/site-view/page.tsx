"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AlertCircle, Settings, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Preview from "@/components/preview/preview";

function SiteViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subdomain = searchParams.get("subdomain");
  const page = searchParams.get("page");
  const isAuthenticated = searchParams.get("authenticated") === "true";

  const [siteId, setSiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function resolveSiteId() {
      if (!subdomain) {
        setError("No subdomain provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Find the site ID from the subdomain using localStorage
        const foundSiteId = findSiteIdBySubdomain(subdomain);

        if (!foundSiteId) {
          setError("Site not found");
          setIsLoading(false);
          return;
        }

        setSiteId(foundSiteId);

        // Check if the authenticated user is the owner of this site
        if (isAuthenticated) {
          const ownershipStatus = await checkSiteOwnership(
            foundSiteId,
            subdomain
          );
          setIsOwner(ownershipStatus);
        }

        // Update the URL to include the site parameter for the Preview component
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("site", foundSiteId);
        if (page && page !== "home") {
          currentUrl.searchParams.set("page", page);
        }

        // Add a parameter to indicate this is public view
        currentUrl.searchParams.set("public", "true");

        // Replace the current URL without causing a navigation
        window.history.replaceState({}, "", currentUrl.toString());

        setIsLoading(false);
      } catch (err) {
        console.error("Error resolving site:", err);
        setError("Failed to load site");
        setIsLoading(false);
      }
    }

    resolveSiteId();
  }, [subdomain, page, isAuthenticated]);

  // Function to find site ID from subdomain
  function findSiteIdBySubdomain(subdomain: string): string | null {
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage);

      // Try to find site by matching subdomain with site name in metadata
      for (const key of keys) {
        if (key.includes("_metadata")) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            if (data.siteName) {
              const siteSlug = data.siteName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
              if (siteSlug === subdomain) {
                return key.replace("site_", "").replace("_metadata", "");
              }
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fallback: try legacy site data
      for (const key of keys) {
        if (key.startsWith("site_") && !key.includes("_")) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            if (data.name) {
              const siteSlug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
              if (siteSlug === subdomain) {
                return key.replace("site_", "");
              }
            }
          } catch (error) {
            continue;
          }
        }
      }
    }
    return null;
  }

  // Function to check if the authenticated user owns this site
  async function checkSiteOwnership(
    siteId: string,
    subdomain: string
  ): Promise<boolean> {
    // This is a simplified check - you should implement proper ownership verification
    // For now, we'll check if the user has access to this site's data in localStorage
    if (typeof window !== "undefined") {
      try {
        // Check if user can access the site's admin data
        const adminKey = `site_${siteId}_metadata`;
        const adminData = localStorage.getItem(adminKey);
        return adminData !== null;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading site...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !siteId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Site Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The site &apos;{subdomain}&apos; could not be found or is not
            available.
          </p>
          <Button
            onClick={() => {
              const baseDomain =
                process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
              const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";
              window.location.href = `${protocol}://www.${baseDomain}`;
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Main Site
          </Button>
        </div>
      </div>
    );
  }

  // Render the site with admin overlay if user is owner
  return (
    <div className="relative min-h-screen">
      {/* Admin Controls Overlay - Only show if user is authenticated and owns the site */}
      {isAuthenticated && isOwner && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Public View
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              const baseDomain =
                process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
              const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";
              window.location.href = `${protocol}://www.${baseDomain}`;
            }}
            className="flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            Admin Dashboard
          </Button>
        </div>
      )}

      {/* Login prompt for non-owners */}
      {isAuthenticated && !isOwner && (
        <div className="fixed top-4 right-4 z-50">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Viewing as Guest
          </Badge>
        </div>
      )}

      {/* Main site content - render the existing Preview component */}
      <Preview />
    </div>
  );
}

export default function SiteView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading site...</p>
          </div>
        </div>
      }
    >
      <SiteViewContent />
    </Suspense>
  );
}
