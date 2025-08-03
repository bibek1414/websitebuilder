"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Eye, Trash2 } from "lucide-react";

interface Site {
  id: string;
  name: string;
  createdAt: string;
}

export default function HomePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [newSiteName, setNewSiteName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSites = localStorage.getItem("sites");
      if (savedSites) {
        setSites(JSON.parse(savedSites));
      }
    }
  }, []);

  const createSite = () => {
    if (!newSiteName.trim()) return;

    const newSite: Site = {
      id: Date.now().toString(),
      name: newSiteName,
      createdAt: new Date().toISOString(),
    };

    const updatedSites = [...sites, newSite];
    setSites(updatedSites);

    if (typeof window !== "undefined") {
      localStorage.setItem("sites", JSON.stringify(updatedSites));
    }

    setNewSiteName("");
    setShowModal(false);
  };

  const deleteSite = (siteId: string) => {
    const updatedSites = sites.filter((site) => site.id !== siteId);
    setSites(updatedSites);

    if (typeof window !== "undefined") {
      localStorage.setItem("sites", JSON.stringify(updatedSites));
      localStorage.removeItem(`site_${siteId}`);
    }
  };

  const openSite = (siteName: string, siteId: string) => {
    router.push(`/builder?site=${siteId}&name=${encodeURIComponent(siteName)}`);
  };

  const previewSite = (siteId: string) => {
    window.open(`/preview?site=${siteId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Website Builder
        </h1>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button className="mb-8">
              <Plus className="w-4 h-4 mr-2" />
              New Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createSite()}
                placeholder="Enter site name"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={createSite}
                  disabled={!newSiteName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setNewSiteName("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{site.name}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Created: {new Date(site.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => openSite(site.name, site.id)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => previewSite(site.id)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your site "{site.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteSite(site.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No sites yet. Create your first website!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
