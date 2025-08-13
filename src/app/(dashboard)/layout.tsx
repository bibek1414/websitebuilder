"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useJWT } from "@/hooks/use-jwt";
import Sidebar from "@/components/home/dashboard/sidebar";
import Header from "@/components/home/dashboard/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { logout: authLogout } = useAuth();
  const {
    user: jwtUser,
    isAuthenticated,
    isLoading: jwtLoading,
    isTokenValid,
  } = useJWT();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!jwtLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [jwtLoading, isAuthenticated, router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main content */}
      <div className="lg:ml-64">
        <Header user={jwtUser} setSidebarOpen={setSidebarOpen} />
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}