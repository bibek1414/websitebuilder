"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Eye,
  Trash2,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useDeleteSite } from "@/hooks/use-site";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
  userDomain: string;
}

export default function SiteCard({ site, userDomain }: SiteCardProps) {
  const router = useRouter();
  const deleteSiteMutation = useDeleteSite();
  const { user, tokens } = useAuth();
  const [copied, setCopied] = useState(false);

  // Store site metadata for subdomain resolution
  useEffect(() => {
    if (typeof window !== "undefined") {
      const metadataKey = `site_${site.id}_metadata`;
      const currentMetadata = localStorage.getItem(metadataKey);

      if (currentMetadata) {
        try {
          const data = JSON.parse(currentMetadata);
          // Update with site name if missing
          if (!data.siteName) {
            const updatedMetadata = {
              ...data,
              siteName: site.name,
            };
            localStorage.setItem(metadataKey, JSON.stringify(updatedMetadata));
          }
        } catch (error) {
          // Create new metadata if parsing fails
          const newMetadata = {
            pages: ["home"],
            siteName: site.name,
            siteId: site.id.toString(),
            title: site.name,
          };
          localStorage.setItem(metadataKey, JSON.stringify(newMetadata));
        }
      } else {
        // Create metadata if it doesn't exist
        const newMetadata = {
          pages: ["home"],
          siteName: site.name,
          siteId: site.id.toString(),
          title: site.name,
        };
        localStorage.setItem(metadataKey, JSON.stringify(newMetadata));
      }
    }
  }, [site.id, site.name]);

  const openSiteBuilder = () => {
    router.push(
      `/builder?site=${site.id}&name=${encodeURIComponent(site.name)}`
    );
  };

  const previewSite = () => {
    window.open(
      `/preview?site=${site.id}&name=${encodeURIComponent(site.name)}`,
      "_blank"
    );
  };

  const openLiveSite = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

    if (isProduction && baseDomain) {
      const siteSlug = site.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      // Create the cleanest possible URL - just the root domain
      // The middleware will automatically handle everything
      const liveUrl = `${protocol}://${siteSlug}.${baseDomain}`;

      // Open the clean root URL - middleware handles all the routing internally
      window.open(liveUrl, "_blank");
    } else {
      // For development, open preview
      previewSite();
    }
  };

  const copyDomainToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSiteMutation.mutateAsync(site.id.toString());

      // Clean up localStorage data when site is deleted
      if (typeof window !== "undefined") {
        const keysToRemove = Object.keys(localStorage).filter((key) =>
          key.startsWith(`site_${site.id}_`)
        );
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <Card className="hover:shadow-lg transition-shadow border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{site.name}</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Live
            </span>
          </div>
        </CardTitle>
        <div className="space-y-3">
          {site.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {site.description}
            </p>
          )}

          {/* Live Domain Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Live at:</p>
                <p className="text-sm font-mono text-blue-700 break-all">
                  {userDomain}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyDomainToClipboard}
                className="ml-2 p-1 h-8 w-8"
                title="Copy domain"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          {site.createdAt && (
            <p className="text-gray-500 text-xs">
              Created: {new Date(site.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={openSiteBuilder}
            className="flex-1 bg-blue-600 hover:bg-blue-700 min-w-0"
            disabled={deleteSiteMutation.isPending}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={previewSite}
            className="flex-1 min-w-0"
            disabled={deleteSiteMutation.isPending}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={openLiveSite}
            className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 min-w-0"
            disabled={deleteSiteMutation.isPending}
            title={
              isProduction
                ? "Open your live website"
                : "Open preview site (development)"
            }
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visit Site
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 min-w-0"
                disabled={deleteSiteMutation.isPending}
              >
                {deleteSiteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-1" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Your Site?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your site &apos;{site.name}&apos; and the domain {userDomain}{" "}
                  will no longer be accessible.
                  <br />
                  <br />
                  <strong>Note:</strong> After deletion, you can create a new
                  site with a different name.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteSiteMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteSiteMutation.isPending}
                >
                  {deleteSiteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Site"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Additional info */}
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          <p className="font-medium">🌐 Your Website is Live!</p>
          <p>
            {isProduction
              ? "Visit your website directly at the clean URL above. No extra paths needed!"
              : "In development, the 'Visit Site' button opens the preview."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
