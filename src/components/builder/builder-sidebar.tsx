import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarNavigation } from "./sidebar-navigation";
import { NavbarStylesDialog } from "./navbar-styles-dialog";
import { FooterStylesDialog } from "@/components/footer/footer-styles-dialog";
import ColorPicker from "@/components/color-picker";
import { Component } from "@/components/component-renders";
import { ComponentPreviews } from "./component-previews";

interface ThemeSettings {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  muted: string;
  mutedForeground: string;
  fontFamily: string;
}

interface BuilderSidebarProps {
  siteName: string | null;
  currentPage: string;
  theme?: ThemeSettings;
  hasNavbar: boolean;
  hasFooter: boolean;
  onBackToDashboard: () => void;
  onPreviewSite: () => void;
  onNavbarStyleSelect: (style: string) => void;
  onFooterStyleSelect: (style: string) => void;
  onComponentClick: (type: string, style?: string) => void;
  onThemeChange: (settings: ThemeSettings) => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  siteName,
  currentPage,
  theme,
  hasNavbar,
  hasFooter,
  onBackToDashboard,
  onPreviewSite,
  onNavbarStyleSelect,
  onFooterStyleSelect,
  onComponentClick,
  onThemeChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showNavbarDialog, setShowNavbarDialog] = useState(false);
  const [showFooterDialog, setShowFooterDialog] = useState(false);
  const [previewDialogState, setPreviewDialogState] = useState<{
    open: boolean;
    type: string | null;
  }>({ open: false, type: null });

  const handleNavbarClick = () => {
    setShowNavbarDialog(true);
  };

  const handleFooterClick = () => {
    setShowFooterDialog(true);
  };

  const handleComponentCategoryClick = (type: string) => {
    if (type === "text") {
      onComponentClick(type);
    } else {
      setPreviewDialogState({ open: true, type: type });
    }
  };

  const handleComponentSelect = (type: string, style: string) => {
    onComponentClick(type, style);
    setPreviewDialogState({ open: false, type: null });
  };

  return (
    <div className="w-82 bg-card shadow-lg flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold truncate">
          Editing: {siteName || "Untitled"}
        </h2>
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToDashboard}
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviewSite}
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                <Palette className="h-3 w-3 mr-1" />
                Theme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customize Theme Colors & Typography</DialogTitle>
                <DialogDescription>
                  Choose colors and fonts that match your brand and create a
                  cohesive look across your website.
                </DialogDescription>
              </DialogHeader>
              <ColorPicker
                onColorsChange={onThemeChange}
                initialColors={theme}
                initialFont={theme?.fontFamily || "Inter"}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SidebarNavigation
        currentPage={currentPage}
        hasNavbar={hasNavbar}
        hasFooter={hasFooter}
        onNavbarClick={handleNavbarClick}
        onFooterClick={handleFooterClick}
        onComponentCategoryClick={handleComponentCategoryClick}
      />

      <ComponentPreviews
        open={previewDialogState.open}
        componentType={previewDialogState.type}
        onOpenChange={(isOpen) =>
          setPreviewDialogState({ ...previewDialogState, open: isOpen })
        }
        onSelect={handleComponentSelect}
      />

      <NavbarStylesDialog
        open={showNavbarDialog}
        onOpenChange={setShowNavbarDialog}
        onStyleSelect={onNavbarStyleSelect}
      />

      <FooterStylesDialog
        open={showFooterDialog}
        onOpenChange={setShowFooterDialog}
        onStyleSelect={onFooterStyleSelect}
      />
    </div>
  );
};