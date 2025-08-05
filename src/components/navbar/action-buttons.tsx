import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ActionButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  isEditable?: boolean;
  onAddButton?: (text: string, variant: string, href?: string) => void;
  onUpdateButton?: (
    buttonId: string,
    newText: string,
    newVariant: string,
    newHref?: string
  ) => void;
  onRemoveButton?: (buttonId: string) => void;
}

export function ActionButtons({
  buttons,
  isEditable = false,
  onAddButton,
  onUpdateButton,
  onRemoveButton,
}: ActionButtonsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<ActionButton | null>(null);

  // Add dialog form state
  const [newButtonText, setNewButtonText] = useState("");
  const [newButtonVariant, setNewButtonVariant] = useState("primary");
  const [newButtonHref, setNewButtonHref] = useState("");

  // Edit dialog form state
  const [editButtonText, setEditButtonText] = useState("");
  const [editButtonVariant, setEditButtonVariant] = useState("primary");
  const [editButtonHref, setEditButtonHref] = useState("");

  const getButtonVariant = (
    variant: string
  ): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
    switch (variant) {
      case "primary":
        return "default";
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      default:
        return "default";
    }
  };

  const handleAddButton = () => {
    if (newButtonText.trim()) {
      onAddButton?.(
        newButtonText.trim(),
        newButtonVariant,
        newButtonHref.trim() || undefined
      );
      resetAddDialog();
    }
  };

  const handleEditButton = () => {
    if (editingButton && editButtonText.trim()) {
      onUpdateButton?.(
        editingButton.id,
        editButtonText.trim(),
        editButtonVariant,
        editButtonHref.trim() || undefined
      );
      resetEditDialog();
    }
  };

  const resetAddDialog = () => {
    setNewButtonText("");
    setNewButtonVariant("primary");
    setNewButtonHref("");
    setIsAddDialogOpen(false);
  };

  const resetEditDialog = () => {
    setEditButtonText("");
    setEditButtonVariant("primary");
    setEditButtonHref("");
    setEditingButton(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (button: ActionButton) => {
    setEditingButton(button);
    setEditButtonText(button.text);
    setEditButtonVariant(button.variant);
    setEditButtonHref(button.href || "");
    setIsEditDialogOpen(true);
  };

  if (isEditable) {
    return (
      <div className="flex items-center space-x-3">
        {buttons.map((button) => (
          <div key={button.id} className="relative group">
            <Button
              variant={getButtonVariant(button.variant)}
              onClick={() => openEditDialog(button)}
              className="font-medium cursor-pointer"
            >
              {button.text}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveButton?.(button.id);
              }}
              className="absolute -top-2 -right-2 rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0 min-w-0"
            >
              ×
            </Button>
          </div>
        ))}

        {/* Add Button Dialog */}
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
              + Button
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Action Button</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="add-button-text"
                  className="text-sm font-medium"
                >
                  Button Text
                </label>
                <Input
                  id="add-button-text"
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  placeholder="Enter button text"
                  className="w-full"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="add-button-variant"
                  className="text-sm font-medium"
                >
                  Button Style
                </label>
                <Select
                  value={newButtonVariant}
                  onValueChange={setNewButtonVariant}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="add-button-url" className="text-sm font-medium">
                  Button URL (Optional)
                </label>
                <Input
                  id="add-button-url"
                  value={newButtonHref}
                  onChange={(e) => setNewButtonHref(e.target.value)}
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
                <Button
                  onClick={handleAddButton}
                  disabled={!newButtonText.trim()}
                >
                  Add Button
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Button Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetEditDialog();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Action Button</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="edit-button-text"
                  className="text-sm font-medium"
                >
                  Button Text
                </label>
                <Input
                  id="edit-button-text"
                  value={editButtonText}
                  onChange={(e) => setEditButtonText(e.target.value)}
                  placeholder="Enter button text"
                  className="w-full"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-button-variant"
                  className="text-sm font-medium"
                >
                  Button Style
                </label>
                <Select
                  value={editButtonVariant}
                  onValueChange={setEditButtonVariant}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-button-url"
                  className="text-sm font-medium"
                >
                  Button URL (Optional)
                </label>
                <Input
                  id="edit-button-url"
                  value={editButtonHref}
                  onChange={(e) => setEditButtonHref(e.target.value)}
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
                  onClick={handleEditButton}
                  disabled={!editButtonText.trim()}
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
    <div className="flex items-center space-x-3">
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant={getButtonVariant(button.variant)}
          asChild
          className="font-medium"
        >
          <a href={button.href || "#"}>{button.text}</a>
        </Button>
      ))}
    </div>
  );
}
