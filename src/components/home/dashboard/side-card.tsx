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
import { Edit, Eye, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useDeleteSite } from "@/hooks/use-site";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
  userDomain: string;
}

export default function SiteCard({ site, userDomain }: SiteCardProps) {
  const router = useRouter();
  const deleteSiteMutation = useDeleteSite();

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
    // Generate the live site URL based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'https';
    
    if (isProduction && baseDomain) {
      // Create subdomain URL: sitename.yourdomain.com
      const siteSlug = site.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const liveUrl = `${protocol}://${siteSlug}.${baseDomain}`;
      window.open(liveUrl, "_blank");
    } else {
      // Fallback to preview in development
      previewSite();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSiteMutation.mutateAsync(site.id.toString());
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const isProduction = process.env.NODE_ENV === 'production';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;

  return (
    <Card className="hover:shadow-lg transition-shadow border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{site.name}</CardTitle>
        <div className="space-y-2">
          {site.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {site.description}
            </p>
          )}

          {isProduction && baseDomain && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.{baseDomain}
            </div>
          )}

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

          {isProduction && baseDomain && (
            <Button
              size="sm"
              variant="outline"
              onClick={openLiveSite}
              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 min-w-0"
              disabled={deleteSiteMutation.isPending}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Live
            </Button>
          )}
          
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your site &apos;{site.name}&apos;.
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
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}