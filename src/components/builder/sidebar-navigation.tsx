import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Navigation,
  Layout,
  ShoppingBag,
  Type,
  LayoutTemplate,
} from "lucide-react";

interface SidebarNavigationProps {
  currentPage: string;
  hasNavbar: boolean;
  hasFooter: boolean;
  onNavbarClick: () => void;
  onFooterClick: () => void;
  onComponentCategoryClick: (type: string) => void;
}

const componentCategories = [
  {
    type: "hero",
    name: "Hero Sections",
    description: "Large banners for the top of your page.",
    icon: LayoutTemplate,
  },
  {
    type: "products",
    name: "Product Displays",
    description: "Showcase products in various layouts.",
    icon: ShoppingBag,
  },
  {
    type: "text",
    name: "Text Block",
    description: "A simple text block for content.",
    icon: Type,
  },
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentPage,
  hasNavbar,
  hasFooter,
  onNavbarClick,
  onFooterClick,
  onComponentCategoryClick,
}) => {
  return (
    <>
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold mb-3">Site Structure</h3>
        <div className="space-y-2">
          <Card
            className={`cursor-pointer transition-colors ${
              hasNavbar ? "bg-muted border-primary/50" : "hover:bg-accent"
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

          <Card
            className={`cursor-pointer transition-colors ${
              hasFooter ? "bg-muted border-primary/50" : "hover:bg-accent"
            }`}
            onClick={onFooterClick}
          >
            <CardContent className="p-3">
              <div className="flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-medium">Footer</div>
                  <div className="text-xs text-muted-foreground">
                    {hasFooter ? "Edit existing footer" : "Add footer section"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-2">Add Components</h3>
        {componentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.type}
              className="mb-2 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onComponentCategoryClick(category.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};