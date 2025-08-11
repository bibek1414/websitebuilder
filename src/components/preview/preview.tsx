"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { HeroData } from "@/components/hero/hero";
import { Hero2Data } from "@/components/hero/hero-2";
import { FooterData } from "@/types/footer";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileX } from "lucide-react";
import { Facebook, Twitter } from "lucide-react";
import { ProductDetail } from "@/components/products/product-details";
import { Product } from "@/types/product";




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
  hero2Data?: Hero2Data;
  footerData?: FooterData;
  productsData?: {
    products?: Product[];
    layout?: string;
    showFilters?: boolean;
    categories?: string[];
  };
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
    hero2Data: component.hero2Data,
    footerData: component.footerData,
    productsData: component.productsData,
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

  // Ensure footer components have proper data structure
  if (normalized.type === "footer" && !normalized.footerData) {
    const defaultFooterData: FooterData = {
      companyName: "Your Company",
      description:
        "Building amazing experiences for our customers with innovative solutions and exceptional service.",
      sections: [
        {
          id: "1",
          title: "Company",
          links: [
            { id: "1", text: "About Us", href: "#about" },
            { id: "2", text: "Our Team", href: "#team" },
            { id: "3", text: "Careers", href: "#careers" },
            { id: "4", text: "Contact", href: "#contact" },
          ],
        },
        {
          id: "2",
          title: "Services",
          links: [
            { id: "1", text: "Web Design", href: "#web-design" },
            { id: "2", text: "Development", href: "#development" },
            { id: "3", text: "Consulting", href: "#consulting" },
            { id: "4", text: "Support", href: "#support" },
          ],
        },
      ],
      socialLinks: [
        { id: "1", platform: "Facebook", href: "#", icon: Facebook },
        { id: "2", platform: "Twitter", href: "#", icon: Twitter },
      ],
      contactInfo: {
        email: "hello@company.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, City, State 12345",
      },
      newsletter: {
        enabled: true,
        title: "Stay Updated",
        description:
          "Subscribe to our newsletter for the latest updates and news.",
      },
      copyright: "© 2025 Your Company. All rights reserved.",
    };
    normalized.footerData = defaultFooterData;
  }

  // Ensure products components have proper data structure
  if (normalized.type === "products" && !normalized.productsData) {
    normalized.productsData = {
      products: [],
      layout: "grid",
      showFilters: true,
      categories: [],
    };
  }

  return normalized;
}

// Function to convert page name to URL-friendly slug
const pageNameToSlug = (pageName: string): string => {
  return pageName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// Function to convert URL slug back to page name
const slugToPageName = (
  slug: string,
  pages: { [key: string]: PageData }
): string => {
  // First try exact match
  if (pages[slug]) return slug;

  // Then try to find by converted slug
  const pageEntries = Object.keys(pages);
  const foundPage = pageEntries.find(
    (pageName) => pageNameToSlug(pageName) === slug
  );

  return foundPage || "home";
};

// Enhanced ComponentRenderer that updates navbar links
interface EnhancedComponentRendererProps {
  component: Component;
  siteId: string;
  currentPage: string;
  pages: { [key: string]: PageData };
  siteData?: SiteData;
}

function EnhancedComponentRenderer({
  component,
  siteId,
  currentPage,
  pages,
  siteData,
}: EnhancedComponentRendererProps) {
  // Clone the component and update navbar links if it's a navbar
  const enhancedComponent = { ...component };

  if (component.type === "navbar" && component.navbarData?.links) {
    const updatedLinks = component.navbarData.links.map((link) => {
      // Check if this link corresponds to a page
      const linkText = link.text.toLowerCase();
      const matchingPage = Object.keys(pages).find(
        (pageName) =>
          pageName.toLowerCase() === linkText ||
          pageNameToSlug(pageName) === pageNameToSlug(linkText)
      );

      if (matchingPage) {
        // Update href to use proper navigation
        const slug = pageNameToSlug(matchingPage);
        return {
          ...link,
          href: `/preview?site=${siteId}&page=${slug}`,
        };
      }

      return link;
    });

    enhancedComponent.navbarData = {
      ...component.navbarData,
      links: updatedLinks,
    };
  }

  // For products components, ensure they have access to site products data
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

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const siteId = searchParams.get("site");
  const pageParam = searchParams.get("page");
  const productId = searchParams.get("product");

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
            products?: Product[];
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

          // Include products data
          if (parsedData.products) {
            normalizedData.products = parsedData.products;
          }

          setSiteData(normalizedData);

          // Apply theme settings (colors and fonts) if they exist
          if (parsedData.theme) {
            applyThemeSettings(parsedData.theme);
          } else {
            // Load Google Fonts even if no custom theme is set
            loadGoogleFonts();
          }

          // Set current page based on URL parameter
          if (pageParam) {
            const targetPage = slugToPageName(pageParam, normalizedData.pages);
            setCurrentPage(targetPage);
          } else if (
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
  }, [siteId, pageParam]);

  // Handle navigation when page parameter changes
  useEffect(() => {
    if (pageParam && siteData.pages) {
      const targetPage = slugToPageName(pageParam, siteData.pages);
      setCurrentPage(targetPage);
    }
  }, [pageParam, siteData.pages]);

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

  // Determine which page to render
  const pageToRender = productId ? "home" : currentPage;
  const components = siteData.pages[pageToRender]?.components || [];
  const navbar = components.find((c) => c.type === "navbar");
  const footer = components.find((c) => c.type === "footer");
  const mainComponents = components.filter(
    (c) => c.type !== "navbar" && c.type !== "footer"
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Render navbar if it exists */}
      {navbar && (
        <EnhancedComponentRenderer
          component={navbar}
          siteId={siteId}
          currentPage={pageToRender}
          pages={siteData.pages}
          siteData={siteData}
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
            />
          ))
        )}
      </main>

      {/* Render footer if it exists */}
      {footer && (
        <EnhancedComponentRenderer
          component={footer}
          siteId={siteId}
          currentPage={pageToRender}
          pages={siteData.pages}
          siteData={siteData}
        />
      )}

      {/* Default footer if no footer component */}
      {!footer && (
        <footer className="bg-muted border-t py-4 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-4">
            Built with Website Builder
          </div>
        </footer>
      )}
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