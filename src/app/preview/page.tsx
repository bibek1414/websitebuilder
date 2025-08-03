"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileX } from "lucide-react";

interface SiteData {
  pages: {
    [key: string]: {
      components: Component[];
    };
  };
}

function normalizeComponent(component: any): Component {
  const normalized: Component = {
    id: component.id,
    type: component.type,
    style: component.style,
    content: component.content || '',
    navbarData: component.navbarData,
  };
  return normalized;
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("site");

  const [siteData, setSiteData] = useState<SiteData>({ pages: {} });
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (siteId && typeof window !== "undefined") {
      const savedSite = localStorage.getItem(`site_${siteId}`);
      if (savedSite) {
        try {
          const parsedData = JSON.parse(savedSite);
          const normalizedData: SiteData = { pages: {} };

          Object.keys(parsedData.pages || {}).forEach((pageName) => {
            const page = parsedData.pages[pageName];
            if (page && Array.isArray(page.components)) {
              normalizedData.pages[pageName] = {
                components: page.components.map(normalizeComponent),
              };
            }
          });
          setSiteData(normalizedData);
          if (!normalizedData.pages.home && Object.keys(normalizedData.pages).length > 0) {
            setCurrentPage(Object.keys(normalizedData.pages)[0]);
          }
        } catch (error) {
          console.error("Error parsing site data:", error);
        }
      }
      setIsLoading(false);
    }
  }, [siteId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-xl text-foreground">Loading preview...</div>
      </div>
    );
  }

  if (!siteId || Object.keys(siteData.pages).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Site Not Found</h1>
            <p className="text-muted-foreground">The requested site could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageKeys = Object.keys(siteData.pages);
  const hasMultiplePages = pageKeys.length > 1;

  return (
    <div className="min-h-screen bg-background">
      {hasMultiplePages && (
        <nav className="bg-primary text-primary-foreground sticky top-0 z-20 shadow">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 py-2">
              {pageKeys.map((pageName) => (
                <Button
                  key={pageName}
                  variant={currentPage === pageName ? "secondary" : "ghost"}
                  onClick={() => setCurrentPage(pageName)}
                  className="capitalize"
                >
                  {pageName}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main>
        {siteData.pages[currentPage]?.components.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <FileX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Empty Page</h2>
                <p className="text-muted-foreground">This page has no components.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          siteData.pages[currentPage]?.components.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isPreview={true}
            />
          ))
        )}
      </main>

      <footer className="bg-muted border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">Built with Website Builder</div>
      </footer>
    </div>
  );
}

export default function Preview() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center h-screen bg-background"><div className="text-xl text-foreground">Loading preview...</div></div>}>
      <PreviewContent />
    </Suspense>
  );
}