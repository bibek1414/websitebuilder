"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle, Globe } from "lucide-react";
import { useCreateSite } from "@/hooks/use-site";

interface CreateSiteModalProps {
  userDomain: string;
}

export default function CreateSiteModal({ userDomain }: CreateSiteModalProps) {
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteDescription, setNewSiteDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const createSiteMutation = useCreateSite();

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) return;

    try {
      await createSiteMutation.mutateAsync({
        name: newSiteName.trim(),
        description: newSiteDescription.trim(),
      });

      // Reset form and close modal on success
      setNewSiteName("");
      setNewSiteDescription("");
      setShowModal(false);
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Error creating site:", error);
    }
  };

  // Generate preview domain
  const generatePreviewDomain = () => {
    if (!newSiteName.trim()) return "";
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const siteSlug = newSiteName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `${siteSlug}.${baseDomain}`;
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Your Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Create Your Website
          </DialogTitle>
          <DialogDescription>
            Create your unique website. Each account can have only one site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Important Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  One Site Per Account
                </p>
                <p className="text-amber-700">
                  You can create only one website per account. Choose your site
                  name carefully as it will become your domain.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name *</Label>
            <Input
              id="site-name"
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="Enter your site name (e.g., mystore, johncafe)"
              disabled={createSiteMutation.isPending}
              autoFocus
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Only letters, numbers, and spaces allowed. Spaces will be replaced
              with hyphens in the URL.
            </p>
          </div>

          {/* Domain Preview */}
          {newSiteName.trim() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Your site will be available at:
                  </p>
                  <p className="text-sm font-mono text-blue-700 break-all">
                    {generatePreviewDomain()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="site-description">Description</Label>
            <Textarea
              id="site-description"
              value={newSiteDescription}
              onChange={(e) => setNewSiteDescription(e.target.value)}
              placeholder="Briefly describe your website (optional)"
              disabled={createSiteMutation.isPending}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCreateSite}
              disabled={!newSiteName.trim() || createSiteMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createSiteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Site...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Create Site
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setNewSiteName("");
                setNewSiteDescription("");
              }}
              className="flex-1"
              disabled={createSiteMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
