import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Navigation } from "lucide-react";
import { Component } from "@/components/component-renders";

interface SidebarNavigationProps {
  pages: { [key: string]: { components: Component[] } };
  currentPage: string;
  hasNavbar: boolean;
  onPageChange: (page: string) => void;
  onPageAdd: () => void;
  onPageDelete: (pageName: string) => void;
  onNavbarClick: () => void;
  onComponentClick: (type: string) => void;
}

const componentTemplates = [
  {
    type: "hero",
    name: "Hero Section",
    description: "A customizable hero section with title, description, and buttons",
  },
  { 
    type: "text", 
    name: "Text Block", 
    description: "A simple text block" 
  },
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  pages,
  currentPage,
  hasNavbar,
  onPageChange,
  onPageAdd,
  onPageDelete,
  onNavbarClick,
  onComponentClick,
}) => {
  return (
    <>
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold mb-2">Pages</h3>
        <div className="max-h-32 overflow-y-auto">
          {Object.keys(pages).map((pageName) => (
            <div key={pageName} className="flex items-center mb-1">
              <Button
                variant={currentPage === pageName ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(pageName)}
                className="flex-1 justify-start capitalize h-8"
              >
                {pageName}
              </Button>
              {Object.keys(pages).length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageDelete(pageName)}
                  className="ml-2 h-6 w-6 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPageAdd}
          className="mt-2 h-8 text-primary hover:text-primary/80"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Page
        </Button>
      </div>

      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold mb-3">Navigation</h3>
        <Card
          className={`mb-2 cursor-pointer transition-colors ${
            hasNavbar 
              ? "bg-muted border-primary/50" 
              : "hover:bg-accent"
          }`}
          onClick={onNavbarClick}
        >
          <CardContent className="p-3">
            <div className="flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">Navbar</div>
                <div className="text-xs text-muted-foreground">
                  {hasNavbar ? "Edit existing navbar" : "Add navigation bar"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-2">Components</h3>
        {componentTemplates.map((template) => (
          <Card
            key={template.type}
            className="mb-2 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onComponentClick(template.type)}
          >
            <CardContent className="p-3">
              <div className="font-medium capitalize">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {template.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};