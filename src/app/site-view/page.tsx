"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileX } from "lucide-react";
import { ProductDetail } from "@/components/products/product-details";
import { Product } from "@/types/products";

interface ThemeColors {
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
}

interface ThemeSettings extends ThemeColors {
  fontFamily: string;
}

interface PageData {
  components: Component[];
}

interface SiteData {
  pages: {
    [key: string]: PageData;
  };
  theme?: ThemeSettings;
  products?: Product[];
}

class PreviewStorageManager {
  private siteId: string;

  constructor(siteId: string) {
    this.siteId = siteId;
  }

  loadComponent(componentId: string): Component | null {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_component_${componentId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }

  loadPageStructure(pageName: string): string[] {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_page_${pageName}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          return data.componentIds || [];
        } catch (error) {
          return [];
        }
      }
    }
    return [];
  }

  loadPageComponents(pageName: string): Component[] {
    const componentIds = this.loadPageStructure(pageName);
    const components: Component[] = [];

    for (const id of componentIds) {
      const component = this.loadComponent(id);
      if (component) {
        components.push(component);
      }
    }

    return components;
  }

  loadTheme(): ThemeSettings | null {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_theme`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }

  loadSiteMetadata(): { pages: string[]; title?: string; siteId?: string } {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_metadata`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          return {
            pages: data.pages || ["home"],
            title: data.title,
            siteId: data.siteId || this.siteId,
          };
        } catch (error) {
          return { pages: ["home"] };
        }
      }
    }
    return { pages: ["home"] };
  }

  loadLegacySiteData(): SiteData | null {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }

  // Method to find site ID from subdomain
  findSiteIdBySubdomain(subdomain: string): string | null {
    if (typeof window !== "undefined") {
      // Try to find site by matching subdomain with site name
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes("_metadata")) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            if (data.siteName) {
              const siteSlug = data.siteName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
              if (siteSlug === subdomain) {
                const siteId = key
                  .replace("site_", "")
                  .replace("_metadata", "");
                return siteId;
              }
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fallback: try legacy site data
      for (const key of keys) {
        if (key.startsWith("site_") && !key.includes("_")) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            if (data.name) {
              const siteSlug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
              if (siteSlug === subdomain) {
                return key.replace("site_", "");
              }
            }
          } catch (error) {
            continue;
          }
        }
      }
    }
    return null;
  }
}

const availableFonts = [
  {
    name: "Inter",
    value: "Inter",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  {
    name: "Roboto",
    value: "Roboto",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  {
    name: "Playfair Display",
    value: "Playfair Display",
    fallback: "Georgia, serif",
  },
  {
    name: "Poppins",
    value: "Poppins",
    fallback: "system-ui, -apple-system, sans-serif",
  },
];

const loadGoogleFonts = () => {
  if (typeof window === "undefined") return;

  const existingLink = document.querySelector(
    'link[data-font-loader="google-fonts"]'
  );
  if (existingLink) return;

  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  link.setAttribute("data-font-loader", "google-fonts");
  document.head.appendChild(link);
};

const applyThemeSettings = (settings: ThemeSettings) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  Object.entries(settings).forEach(([key, value]) => {
    if (key !== "fontFamily") {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    }
  });

  if (settings.fontFamily) {
    loadGoogleFonts();

    const selectedFontObj = availableFonts.find(
      (f) => f.value === settings.fontFamily
    );
    if (selectedFontObj) {
      const fontFamily = `"${selectedFontObj.value}", ${selectedFontObj.fallback}`;
      root.style.setProperty("--font-family", fontFamily);
      document.body.style.fontFamily = fontFamily;
    }
  }
};

const pageNameToSlug = (pageName: string): string => {
  return pageName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const slugToPageName = (
  slug: string,
  pages: { [key: string]: PageData }
): string => {
  if (pages[slug]) return slug;

  const pageEntries = Object.keys(pages);
  const foundPage = pageEntries.find(
    (pageName) => pageNameToSlug(pageName) === slug
  );

  return foundPage || "home";
};

interface EnhancedComponentRendererProps {
  component: Component;
  siteId: string;
  currentPage: string;
  pages: { [key: string]: PageData };
  siteData?: SiteData;
  isSubdomain?: boolean;
}

function EnhancedComponentRenderer({
  component,
  siteId,
  currentPage,
  pages,
  siteData,
  isSubdomain = false,
}: EnhancedComponentRendererProps) {
  const enhancedComponent = { ...component };

  if (component.type === "navbar" && component.navbarData?.links) {
    const updatedLinks = component.navbarData.links.map((link) => {
      const linkText = link.text.toLowerCase();
      const matchingPage = Object.keys(pages).find(
        (pageName) =>
          pageName.toLowerCase() === linkText ||
          pageNameToSlug(pageName) === pageNameToSlug(linkText)
      );

      if (matchingPage) {
        const slug = pageNameToSlug(matchingPage);
        if (isSubdomain) {
          // For subdomain, use clean URLs and handle navigation via window.location
          return {
            ...link,
            href: slug === "home" ? "/" : `/${slug}`,
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              const newPath = slug === "home" ? "/" : `/${slug}`;
              window.location.href = newPath;
            },
          };
        } else {
          // For preview mode, use query parameters
          return {
            ...link,
            href: `/preview?site=${siteId}&page=${slug}`,
          };
        }
      }

      return link;
    });

    enhancedComponent.navbarData = {
      ...component.navbarData,
      links: updatedLinks,
    };
  }

  if (component.type === "products" && siteData?.products) {
    enhancedComponent.productsData = {
      ...component.productsData,
      products: siteData.products,
    };
  }

  return (
    <ComponentRenderer
      component={enhancedComponent}
      isPreview={true}
      siteId={siteId}
    />
  );
}

function SiteViewContent() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get("subdomain");
  const productId = searchParams.get("product");
  const pageParam = searchParams.get("page");

  const [siteData, setSiteData] = useState<SiteData>({ pages: {} });
  const [currentPage, setCurrentPage] = useState("home");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageManager, setStorageManager] =
    useState<PreviewStorageManager | null>(null);

  useEffect(() => {
    if (subdomain && typeof window !== "undefined") {
      // First, try to find the site ID from the subdomain
      const tempManager = new PreviewStorageManager("temp");
      const foundSiteId = tempManager.findSiteIdBySubdomain(subdomain);

      if (!foundSiteId) {
        setIsLoading(false);
        return;
      }

      setSiteId(foundSiteId);
      const manager = new PreviewStorageManager(foundSiteId);
      setStorageManager(manager);

      let normalizedData: SiteData = { pages: {} };

      const metadata = manager.loadSiteMetadata();
      const theme = manager.loadTheme();

      if (metadata.pages.length > 0) {
        const pagesData: { [key: string]: PageData } = {};
        for (const pageName of metadata.pages) {
          const components = manager.loadPageComponents(pageName);
          pagesData[pageName] = { components };
        }

        normalizedData = {
          pages: pagesData,
          theme: theme || undefined,
        };
      } else {
        const legacyData = manager.loadLegacySiteData();
        if (legacyData) {
          normalizedData = legacyData;
        } else {
          normalizedData = { pages: { home: { components: [] } } };
        }
      }

      setSiteData(normalizedData);

      if (normalizedData.theme) {
        applyThemeSettings(normalizedData.theme);
      } else {
        loadGoogleFonts();
      }

      // Determine current page from search params (set by middleware) or URL path
      const pageParam = searchParams.get("page");
      if (pageParam) {
        const targetPage = slugToPageName(pageParam, normalizedData.pages);
        setCurrentPage(targetPage);
      } else {
        setCurrentPage("home");
      }

      setIsLoading(false);
    }
  }, [subdomain, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-xl text-foreground">Loading site...</div>
      </div>
    );
  }

  if (!subdomain || !siteId || Object.keys(siteData.pages).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Site Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The requested site could not be found or is not available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageToRender = productId ? "home" : currentPage;
  const components = siteData.pages[pageToRender]?.components || [];
  const navbar = components.find((c) => c.type === "navbar");
  const footer = components.find((c) => c.type === "footer");
  const mainComponents = components.filter(
    (c) => c.type !== "navbar" && c.type !== "footer"
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {navbar && (
        <EnhancedComponentRenderer
          component={navbar}
          siteId={siteId}
          currentPage={pageToRender}
          pages={siteData.pages}
          siteData={siteData}
          isSubdomain={true}
        />
      )}

      <main className="flex-grow">
        {productId ? (
          <ProductDetail productId={productId} siteId={siteId} />
        ) : mainComponents.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <FileX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Empty Page</h2>
                <p className="text-muted-foreground">
                  This page has no components.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          mainComponents.map((component) => (
            <EnhancedComponentRenderer
              key={component.id}
              component={component}
              siteId={siteId}
              currentPage={currentPage}
              pages={siteData.pages}
              siteData={siteData}
              isSubdomain={true}
            />
          ))
        )}
      </main>

      {footer && (
        <EnhancedComponentRenderer
          component={footer}
          siteId={siteId}
          currentPage={pageToRender}
          pages={siteData.pages}
          siteData={siteData}
          isSubdomain={true}
        />
      )}

      {!footer && (
        <footer className="bg-muted border-t py-4 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-4">Built with NepDora.</div>
        </footer>
      )}
    </div>
  );
}

export default function SiteView() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="text-xl text-foreground">Loading site...</div>
        </div>
      }
    >
      <SiteViewContent />
    </Suspense>
  );
}
