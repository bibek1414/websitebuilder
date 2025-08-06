"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { HeroData } from "@/components/hero/hero";
import { FooterData } from "@/types/footer";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, Palette } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BuilderSidebar } from "./builder-sidebar";
import { DroppableEditorZone } from "./droppable-editor-zone";
import { Facebook, Twitter } from "lucide-react";



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
  theme?: ThemeSettings;
}

type ComponentUpdate = Partial<Component>;

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

  link.onload = () => {
    console.log("Google Fonts loaded successfully");
  };

  link.onerror = () => {
    console.warn("Failed to load Google Fonts, using fallback fonts");
  };

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

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("site");
  const siteName = searchParams.get("name");

  const [siteData, setSiteData] = useState<SiteData>({
    pages: { home: { components: [] } },
  });
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const hasNavbar =
    siteData.pages[currentPage]?.components.some(
      (component) => component.type === "navbar"
    ) || false;

  const hasFooter =
    siteData.pages[currentPage]?.components.some(
      (component) => component.type === "footer"
    ) || false;

  useEffect(() => {
    if (siteId && typeof window !== "undefined") {
      const savedSite = localStorage.getItem(`site_${siteId}`);
      if (savedSite) {
        try {
          const parsedData = JSON.parse(savedSite);
          if (!parsedData.pages || Object.keys(parsedData.pages).length === 0) {
            parsedData.pages = { home: { components: [] } };
          }
          setSiteData(parsedData);

          if (parsedData.theme) {
            applyThemeSettings(parsedData.theme);
          } else {
            loadGoogleFonts();
          }
        } catch (error) {
          console.error("Error parsing site data:", error);
          setSiteData({ pages: { home: { components: [] } } });
          loadGoogleFonts();
        }
      } else {
        setSiteData({ pages: { home: { components: [] } } });
        loadGoogleFonts();
      }
      setIsLoading(false);
    }
  }, [siteId]);

  const saveSite = (newSiteData: SiteData) => {
    setSiteData(newSiteData);
    if (siteId && typeof window !== "undefined") {
      localStorage.setItem(`site_${siteId}`, JSON.stringify(newSiteData));
    }
  };

  const handleThemeSettingsChange = (settings: ThemeSettings) => {
    const updatedSiteData = { ...siteData, theme: settings };
    saveSite(updatedSiteData);
    applyThemeSettings(settings);
  };

  const addComponent = (type: string, style?: string) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: type,
      style: style,
      content: `${type} content`,
    };

    if (type === "navbar") {
      newComponent.navbarData = {
        logoText: "Brand",
        links: [
          { id: "1", text: "Home", href: "#" },
          { id: "2", text: "About", href: "#about" },
        ],
        buttons: [
          {
            id: "1",
            text: "Sign Up",
            variant: "primary",
            href: "#signup",
          },
        ],
      };
    } else if (type === "hero") {
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
      newComponent.heroData = defaultHeroData;
      newComponent.content = "";
    } else if (type === "footer") {
      const defaultFooterData: FooterData = {
        companyName: "Your Company",
        description: "Building amazing experiences for our customers with innovative solutions and exceptional service.",
        sections: [
          {
            id: "1",
            title: "Company",
            links: [
              { id: "1", text: "About Us", href: "#about" },
              { id: "2", text: "Our Team", href: "#team" },
              { id: "3", text: "Careers", href: "#careers" },
              { id: "4", text: "Contact", href: "#contact" }
            ]
          },
          {
            id: "2",
            title: "Services",
            links: [
              { id: "1", text: "Web Design", href: "#web-design" },
              { id: "2", text: "Development", href: "#development" },
              { id: "3", text: "Consulting", href: "#consulting" },
              { id: "4", text: "Support", href: "#support" }
            ]
          }
        ],
        socialLinks: [
          { id: "1", platform: "Facebook", href: "#", icon: Facebook },
          { id: "2", platform: "Twitter", href: "#", icon:Twitter },]
        ,
        contactInfo: {
          email: "hello@company.com",
          phone: "+1 (555) 123-4567",
          address: "123 Business St, City, State 12345"
        },
        newsletter: {
          enabled: true,
          title: "Stay Updated",
          description: "Subscribe to our newsletter for the latest updates and news."
        },
        copyright: "© 2024 Your Company. All rights reserved."
      };
      newComponent.footerData = defaultFooterData;
      newComponent.content = "";
    }

    const updatedSiteData = { ...siteData };
    if (!updatedSiteData.pages[currentPage]) {
      updatedSiteData.pages[currentPage] = { components: [] };
    }
    updatedSiteData.pages[currentPage].components.push(newComponent);
    saveSite(updatedSiteData);
  };

  const handleComponentClick = (type: string) => {
    addComponent(type);
  };

  const handleNavbarStyleSelect = (style: string) => {
    addComponent("navbar", style);
  };

  const handleFooterStyleSelect = (style: string) => {
    addComponent("footer", style);
  };

  const removeComponent = (componentId: string) => {
    const updatedSiteData = { ...siteData };
    if (updatedSiteData.pages[currentPage]) {
      updatedSiteData.pages[currentPage].components = updatedSiteData.pages[
        currentPage
      ].components.filter((c) => c.id !== componentId);
      saveSite(updatedSiteData);
    }
  };

  const updateComponent = (
    componentId: string,
    newContent: ComponentUpdate
  ) => {
    const updatedSiteData = { ...siteData };
    if (updatedSiteData.pages[currentPage]) {
      const componentIndex = updatedSiteData.pages[
        currentPage
      ].components.findIndex((c) => c.id === componentId);
      if (componentIndex > -1) {
        const oldComponent =
          updatedSiteData.pages[currentPage].components[componentIndex];
        updatedSiteData.pages[currentPage].components[componentIndex] = {
          ...oldComponent,
          ...newContent,
        };
        saveSite(updatedSiteData);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (
      active.data.current?.type === "navbar" &&
      over.id === "editor-drop-zone"
    ) {
      addComponent("navbar", active.data.current.style);
      return;
    }

    if (
      active.data.current?.type === "footer" &&
      over.id === "editor-drop-zone"
    ) {
      addComponent("footer", active.data.current.style);
      return;
    }

    if (active.data.current?.componentType && over.id === "editor-drop-zone") {
      addComponent(active.data.current.componentType);
      return;
    }

    if (active.id !== over.id) {
      const components = siteData.pages[currentPage]?.components || [];
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newComponents = arrayMove(components, oldIndex, newIndex);
        const updatedSiteData = { ...siteData };
        updatedSiteData.pages[currentPage].components = newComponents;
        saveSite(updatedSiteData);
      }
    }
  };

  const addPage = () => {
    const pageName = prompt("Enter page name:");
    if (
      pageName &&
      pageName.trim() &&
      !siteData.pages[pageName.toLowerCase()]
    ) {
      const updatedSiteData = { ...siteData };
      updatedSiteData.pages[pageName.toLowerCase()] = { components: [] };
      saveSite(updatedSiteData);
    } else if (pageName && siteData.pages[pageName.toLowerCase()]) {
      alert("A page with this name already exists!");
    }
  };

  const deletePage = (pageName: string) => {
    if (Object.keys(siteData.pages).length <= 1) {
      alert("You cannot delete the last page!");
      return;
    }
    if (confirm(`Are you sure you want to delete the "${pageName}" page?`)) {
      const updatedSiteData = { ...siteData };
      delete updatedSiteData.pages[pageName];
      if (currentPage === pageName) {
        setCurrentPage(Object.keys(updatedSiteData.pages)[0]);
      }
      saveSite(updatedSiteData);
    }
  };

  const previewSite = () => {
    if (siteId) {
      window.open(`/preview?site=${siteId}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  if (!siteId) {
    router.push("/");
    return null;
  }

  const currentComponents = siteData.pages[currentPage]?.components || [];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background text-foreground">
        <BuilderSidebar
          siteName={siteName}
          pages={siteData.pages}
          currentPage={currentPage}
          theme={siteData.theme}
          hasNavbar={hasNavbar}
          hasFooter={hasFooter}
          onBackToDashboard={() => router.push("/")}
          onPreviewSite={previewSite}
          onPageChange={setCurrentPage}
          onPageAdd={addPage}
          onPageDelete={deletePage}
          onNavbarStyleSelect={handleNavbarStyleSelect}
          onFooterStyleSelect={handleFooterStyleSelect}
          onComponentClick={handleComponentClick}
          onThemeChange={handleThemeSettingsChange}
        />

        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize">{currentPage} Page</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentComponents.length || 0} components
              </Badge>
              {siteData.theme && (
                <Badge variant="outline" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  Custom Theme
                </Badge>
              )}
              {siteData.theme?.fontFamily && (
                <Badge variant="outline" className="text-xs">
                  Font: {siteData.theme.fontFamily}
                </Badge>
              )}
            </div>
          </div>

          <DroppableEditorZone>
            <div className="p-4 min-h-full">
              {currentComponents.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center h-full">
                  <LayoutTemplate className="h-16 w-16 mx-auto text-muted" />
                  <p className="text-lg mt-4">Drag and Drop Components Here</p>
                  <p className="text-sm">
                    Or click on components from the sidebar to get started!
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={currentComponents.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {currentComponents.map((component) => (
                    <ComponentRenderer
                      key={component.id}
                      component={component}
                      isPreview={false}
                      onUpdate={updateComponent}
                      onRemove={removeComponent}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          </DroppableEditorZone>
        </div>
      </div>
    </DndContext>
  );
}

export default function Builder() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="text-xl text-foreground">Loading builder...</div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}