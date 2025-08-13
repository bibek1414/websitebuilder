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
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
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
      console.error('Error creating site:', error);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name *</Label>
            <Input
              id="site-name"
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="Enter site name"
              disabled={createSiteMutation.isPending}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-description">Description</Label>
            <Textarea
              id="site-description"
              value={newSiteDescription}
              onChange={(e) => setNewSiteDescription(e.target.value)}
              placeholder="Enter site description (optional)"
              disabled={createSiteMutation.isPending}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleCreateSite}
              disabled={!newSiteName.trim() || createSiteMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createSiteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
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