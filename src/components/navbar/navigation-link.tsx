import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface NavLink {
  id: string;
  text: string;
  href?: string;
}

interface NavigationLinksProps {
  links: NavLink[];
  isEditable?: boolean;
  onAddLink?: (text: string, href?: string) => void;
  onUpdateLink?: (linkId: string, newText: string, newHref?: string) => void;
  onRemoveLink?: (linkId: string) => void;
}

export function NavigationLinks({
  links,
  isEditable = false,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}: NavigationLinksProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);

  // Add dialog form state
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkHref, setNewLinkHref] = useState("");

  // Edit dialog form state
  const [editLinkText, setEditLinkText] = useState("");
  const [editLinkHref, setEditLinkHref] = useState("");

  const handleAddLink = () => {
    if (newLinkText.trim()) {
      onAddLink?.(newLinkText.trim(), newLinkHref.trim() || undefined);
      resetAddDialog();
    }
  };

  const handleEditLink = () => {
    if (editingLink && editLinkText.trim()) {
      onUpdateLink?.(
        editingLink.id,
        editLinkText.trim(),
        editLinkHref.trim() || undefined
      );
      resetEditDialog();
    }
  };

  const resetAddDialog = () => {
    setNewLinkText("");
    setNewLinkHref("");
    setIsAddDialogOpen(false);
  };

  const resetEditDialog = () => {
    setEditLinkText("");
    setEditLinkHref("");
    setEditingLink(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (link: NavLink) => {
    setEditingLink(link);
    setEditLinkText(link.text);
    setEditLinkHref(link.href || "");
    setIsEditDialogOpen(true);
  };

  if (isEditable) {
    return (
      <div className="flex items-center space-x-6">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            <span
              onClick={() => openEditDialog(link)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {link.text}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveLink?.(link.id);
              }}
              className="absolute -top-2 -right-2 rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0 min-w-0"
            >
              ×
            </Button>
          </div>
        ))}

        {/* Add Link Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetAddDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-primary-foreground bg-secondary border-primary-foreground hover:bg-secondary/90 hover:text-primary"
            >
              + Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Navigation Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="add-link-text" className="text-sm font-medium">
                  Link Text
                </label>
                <Input
                  id="add-link-text"
                  value={newLinkText}
                  onChange={(e) => setNewLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full"
                  
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="add-link-url" className="text-sm font-medium">
                  Link URL (Optional)
                </label>
                <Input
                  id="add-link-url"
                  value={newLinkHref}
                  onChange={(e) => setNewLinkHref(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddLink} disabled={!newLinkText.trim()}>
                  Add Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Link Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetEditDialog();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Navigation Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-link-text" className="text-sm font-medium">
                  Link Text
                </label>
                <Input
                  id="edit-link-text"
                  value={editLinkText}
                  onChange={(e) => setEditLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-link-url" className="text-sm font-medium">
                  Link URL (Optional)
                </label>
                <Input
                  id="edit-link-url"
                  value={editLinkHref}
                  onChange={(e) => setEditLinkHref(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditLink}
                  disabled={!editLinkText.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-6">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href || "#"}
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            // Handle navigation in preview mode
            if (link.href?.includes("/preview?")) {
              e.preventDefault();
              window.location.href = link.href;
            }
          }}
        >
          {link.text}
        </a>
      ))}
    </nav>
  );
}
