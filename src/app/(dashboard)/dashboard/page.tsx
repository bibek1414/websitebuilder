"use client";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle } from "lucide-react";
import { useJWT } from "@/hooks/use-jwt";
import { useSites } from "@/hooks/use-site";
import SiteCard from "@/components/home/dashboard/side-card";
import CreateSiteModal from "@/components/home/dashboard/create-site-modal";

export default function DashboardPage() {
  const { user: jwtUser } = useJWT();

  // Sites data
  const {
    data: sitesData,
    isLoading: sitesLoading,
    error: sitesError,
    refetch: refetchSites,
  } = useSites();

  if (!jwtUser) {
    return null;
  }

  const sites = sitesData?.sites || [];

  return (
    <>
      {/* Welcome message */}
      <div className="mb-6 bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Welcome back, {jwtUser.name}! 👋
        </h2>
        <p className="text-gray-600 text-sm">
          Store: {jwtUser.storeName} • Role: {jwtUser.role} • Domain:{" "}
          {jwtUser.domain}
        </p>
      </div>

      {/* Create new site button */}
      <div className="mb-6">
        <CreateSiteModal userDomain={jwtUser.domain} />
      </div>

      {/* Sites grid */}
      {sitesLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sites...</p>
          </div>
        </div>
      ) : sitesError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load sites
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your sites.
          </p>
          <Button onClick={() => refetchSites()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : sites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              userDomain={jwtUser.domain}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <Package className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No sites yet
          </h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first website for{" "}
            {jwtUser.storeName}.
          </p>
          <div className="mt-6">
            <CreateSiteModal userDomain={jwtUser.domain} />
          </div>
        </div>
      )}
    </>
  );
}