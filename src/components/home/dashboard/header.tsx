"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  domain: string;
  avatar?: string;
}

interface HeaderProps {
  user: User;
  setSidebarOpen: (open: boolean) => void;
}

const getPageTitle = (pathname: string): string => {
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const titles: { [key: string]: string } = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    blogs: "Blogs",
    testimonials: "Testimonials",
    customers: "Customers",
    settings: "Settings",
  };

  return titles[lastSegment] || "Dashboard";
};

export default function Header({ user, setSidebarOpen }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout: authLogout } = useAuth();

  const pageTitle = getPageTitle(pathname);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      // Clear all auth-related data
      localStorage.removeItem("authTokens");
      localStorage.removeItem("authUser");
      localStorage.removeItem("verificationEmail");

      // Clear session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
      }

      // Call the auth context logout
      authLogout();

      toast.success("Logged Out", {
        description: "You have been successfully logged out.",
      });

      window.location.href = "/";

      // await router.push("/");
      // window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout Error", {
        description: "There was an issue logging out. Please try again.",
      });
    }
  };

  // Generate user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b h-16">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
            {pageTitle}
          </h1>
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-blue-600 font-mono">{user.domain}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
