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
import { Edit, Eye, Trash2, Loader2 } from "lucide-react";
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

  const handleDelete = async () => {
    try {
      await deleteSiteMutation.mutateAsync(site.id);
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Error deleting site:", error);
    }
  };

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
          <p className="text-gray-500 text-xs">
            Created: {new Date(site.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={openSiteBuilder}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={deleteSiteMutation.isPending}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={previewSite}
            className="flex-1"
            disabled={deleteSiteMutation.isPending}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
