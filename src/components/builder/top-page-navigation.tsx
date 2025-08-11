import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Component } from "@/components/component-renders";

interface PageNavigationHeaderProps {
  pages: { [key: string]: { components: Component[] } };
  currentPage: string;
  onPageChange: (page: string) => void;
  onPageAdd: () => void;
  onPageDelete: (pageName: string) => void;
}

export const PageNavigationHeader: React.FC<PageNavigationHeaderProps> = ({
  pages,
  currentPage,
  onPageChange,
  onPageAdd,
  onPageDelete,
}) => {
  const pageNames = Object.keys(pages);
  const canDeletePages = pageNames.length > 1;

  return (
    <div className="bg-background border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Pages
          </span>

          <div className="flex items-center gap-2">
            {/* Add New Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onPageAdd}
              className="border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Page
            </Button>

            {/* Existing Pages */}
            {pageNames.map((pageName) => (
              <div
                key={pageName}
                className={`flex items-center gap-1 px-1 rounded-md border transition-colors ${
                  currentPage === pageName
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 hover:bg-muted border-transparent"
                }`}
              >
                <button
                  onClick={() => onPageChange(pageName)}
                  className="px-2 py-1 text-sm capitalize"
                >
                  {pageName}
                </button>

                {/* Inline X icon for non-active pages */}
                {canDeletePages && currentPage !== pageName && (
                  <X
                    onClick={() => onPageDelete(pageName)}
                    className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side info */}
        <div className="text-xs text-muted-foreground">
          {pageNames.length} page{pageNames.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};
