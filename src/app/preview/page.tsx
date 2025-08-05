"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { HeroData } from "@/components/hero/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileX } from "lucide-react";

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

interface SiteData {
  pages: {
    [key: string]: {
      components: Component[];
    };
  };
  theme?: ThemeSettings; // Updated to use ThemeSettings instead of ThemeColors
}

// Define the shape of raw component data from localStorage
interface RawComponentData {
  id: string;
  type: string;
  style?: string;
  content?: string;
  navbarData?: {
    logoText?: string;
    links?: Array<{ id: string; text: string; href?: string }>;
    buttons?: Array<{
      id: string;
      text: string;
      variant: "primary" | "secondary" | "outline";
      href?: string;
    }>;
  };
  heroData?: HeroData;
}

// Available fonts for fallback reference
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

// Function to load Google Fonts
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

  link.onload = () => {
    console.log("Google Fonts loaded successfully in preview");
  };

  link.onerror = () => {
    console.warn(
      "Failed to load Google Fonts in preview, using fallback fonts"
    );
  };

  document.head.appendChild(link);
};

// Function to apply theme settings (colors and fonts)
const applyThemeSettings = (settings: ThemeSettings) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Apply colors
  Object.entries(settings).forEach(([key, value]) => {
    if (key !== "fontFamily") {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    }
  });

  // Apply font
  if (settings.fontFamily) {
    // Ensure Google Fonts are loaded
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

function normalizeComponent(component: RawComponentData): Component {
  const normalized: Component = {
    id: component.id,
    type: component.type,
    style: component.style,
    content: component.content || "",
    navbarData: component.navbarData,
    heroData: component.heroData,
  };

  // Ensure hero components have proper data structure
  if (normalized.type === "hero" && !normalized.heroData) {
    const defaultHeroData: HeroData = {
      title: "Welcome to Our Amazing Platform",
      subtitle: "Build Something Great",
      description:
        "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
      layout: "center",
      backgroundType: "gradient",
      backgroundColor: "primary",
      gradientFrom: "primary",
      gradientTo: "secondary",
      textColor: "primary-foreground",
      buttons: [
        { id: "1", text: "Get Started", variant: "primary", href: "#" },
        { id: "2", text: "Learn More", variant: "outline", href: "#" },
      ],
      showImage: false,
      imageUrl: "",
      imageAlt: "Hero image",
    };
    normalized.heroData = defaultHeroData;
  }

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
          const parsedData = JSON.parse(savedSite) as {
            pages?: { [key: string]: { components?: RawComponentData[] } };
            theme?: ThemeSettings;
          };
          const normalizedData: SiteData = { pages: {} };

          // Process pages
          Object.keys(parsedData.pages || {}).forEach((pageName) => {
            const page = parsedData.pages?.[pageName];
            if (page && Array.isArray(page.components)) {
              normalizedData.pages[pageName] = {
                components: page.components.map(normalizeComponent),
              };
            }
          });

          // Include theme data
          if (parsedData.theme) {
            normalizedData.theme = parsedData.theme;
          }

          setSiteData(normalizedData);

          // Apply theme settings (colors and fonts) if they exist
          if (parsedData.theme) {
            applyThemeSettings(parsedData.theme);
          } else {
            // Load Google Fonts even if no custom theme is set
            loadGoogleFonts();
          }

          if (
            !normalizedData.pages.home &&
            Object.keys(normalizedData.pages).length > 0
          ) {
            setCurrentPage(Object.keys(normalizedData.pages)[0]);
          }
        } catch (error) {
          console.error("Error parsing site data:", error);
          // Load Google Fonts even on error
          loadGoogleFonts();
        }
      } else {
        // Load Google Fonts even if no saved site
        loadGoogleFonts();
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
            <p className="text-muted-foreground">
              The requested site could not be loaded.
            </p>
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
                <p className="text-muted-foreground">
                  This page has no components.
                </p>
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
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="text-xl text-foreground">Loading preview...</div>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
