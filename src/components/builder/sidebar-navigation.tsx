import React from "react";
import { Badge } from "@/components/ui/badge";
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
  // Add these props to get actual component counts
  componentCounts?: {
    hero?: number;
    products?: number;
    text?: number;
  };
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
  componentCounts = {},
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Site Structure Section */}

      <div className="py-3 border-b flex-shrink-0">
        <div className="mb-3">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground rounded-r-full px-4 py-3 text-lg font-medium"
          >
            Site Structure ( Basics )
          </Badge>
        </div>

        <div className="space-y-1">
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-muted/30`}
            onClick={onNavbarClick}
          >
            <div className="flex items-center">
              <Navigation className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium ">Navbar</span>
            </div>
          </div>

          <div
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-secondary/30`}
            onClick={onFooterClick}
          >
            <div className="flex items-center">
              <Layout className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Footer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Site Components Section */}
      <div className=" py-3 flex-1 overflow-y-auto">
        <div className="mb-3">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground rounded-r-full px-4 py-3 text-lg font-medium"
          >
            Site Components (Advanced)
          </Badge>
        </div>

        <div className="space-y-1">
          {componentCategories.map((category) => {
            const Icon = category.icon;
            const count =
              componentCounts[category.type as keyof typeof componentCounts] ||
              0;

            return (
              <div
                key={category.type}
                className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => onComponentCategoryClick(category.type)}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary/80 text-secondary-foreground text-xs px-2 py-0 h-5 min-w-[20px] flex items-center justify-center rounded-full"
                  >
                    {count}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
