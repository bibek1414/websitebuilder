"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useJWT } from "@/hooks/use-jwt";
import { useSites } from "@/hooks/use-site";
import Sidebar from "@/components/home/dashboard/sidebar";
import Header from "@/components/home/dashboard/header";
import SiteCard from "@/components/home/dashboard/side-card";
import CreateSiteModal from "@/components/home/dashboard/create-site-modal";
import LandingPage from "@/components/landing-page/landing-page";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { logout: authLogout } = useAuth();
  const {
    user: jwtUser,
    isAuthenticated,
    isLoading: jwtLoading,
    isTokenValid,
  } = useJWT();

  // Sites data
  const {
    data: sitesData,
    isLoading: sitesLoading,
    error: sitesError,
    refetch: refetchSites,
  } = useSites();

  // Show loading state while checking authentication
  if (jwtLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!jwtLoading && !isAuthenticated) {
    return <LandingPage />;
  }

  // Show error state if token is invalid
  if (!isTokenValid && !jwtLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has expired. Please log in again.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Don't render if user data is not available
  if (!jwtUser) {
    return null;
  }

  const sites = sitesData || [];
  const userHasSite = sites.length > 0;

  // Get the user's site domain if they have one
  const userSite = sites[0];
  const isProduction = process.env.NODE_ENV === "production";
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;

  let displayDomain = jwtUser.domain;
  if (userSite && isProduction && baseDomain) {
    const siteSlug = userSite.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    displayDomain = `${siteSlug}.${baseDomain}`;
  }

  // Render authenticated dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:ml-64">
        <Header user={jwtUser} setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="p-6">
          {/* Welcome message */}
          <div className="mb-6 bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Welcome back, {jwtUser.name}! 👋
            </h2>
            <p className="text-gray-600 text-sm">
              Store: {jwtUser.storeName} • Role: {jwtUser.role} • Domain:{" "}
              {displayDomain}
            </p>
            {userHasSite && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700 text-sm font-medium">
                  🌐 Your site is live at:
                  <a
                    href={`https://${displayDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-green-800"
                  >
                    {displayDomain}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Create new site button - Only show if user doesn't have a site */}
          {!userHasSite && (
            <div className="mb-6">
              <CreateSiteModal userDomain={jwtUser.domain} />
            </div>
          )}

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
          ) : userHasSite ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SiteCard
                key={userSite.id}
                site={userSite}
                userDomain={displayDomain}
              />
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
                Get started by creating your website for {jwtUser.storeName}.
                You can create one site per account.
              </p>
              <div className="mt-6">
                <CreateSiteModal userDomain={jwtUser.domain} />
              </div>
            </div>
          )}

          {/* Show message if user already has a site */}
          {userHasSite && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Each account can have only one site. To
                create a new site, you&apos;ll need to delete your current site
                first.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
