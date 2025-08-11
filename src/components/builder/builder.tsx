"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { HeroData } from "@/components/hero/hero";
import { Hero2Data, defaultHero2Data } from "@/components/hero/hero-2";
import { FooterData } from "@/types/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { getMainSiteUrl } from "@/lib/env-config";
import { PageNavigationHeader } from "./top-page-navigation";
import { toast } from "sonner";

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

class ComponentStorageManager {
  private siteId: string;

  constructor(siteId: string) {
    this.siteId = siteId;
  }

  saveComponent(component: Component): void {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_component_${component.id}`;
      localStorage.setItem(key, JSON.stringify(component));
    }
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

  removeComponent(componentId: string): void {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_component_${componentId}`;
      localStorage.removeItem(key);
    }
  }

  savePageStructure(pageName: string, componentIds: string[]): void {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_page_${pageName}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          componentIds,
          lastModified: Date.now(),
        })
      );
    }
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

  saveTheme(theme: ThemeSettings): void {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_theme`;
      localStorage.setItem(key, JSON.stringify(theme));
    }
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

  saveSiteMetadata(metadata: { pages: string[]; title?: string }): void {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_metadata`;
      localStorage.setItem(
        key,
        JSON.stringify({
          ...metadata,
          lastModified: Date.now(),
        })
      );
    }
  }

  loadSiteMetadata(): { pages: string[]; title?: string } {
    if (typeof window !== "undefined") {
      const key = `site_${this.siteId}_metadata`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          return { pages: data.pages || ["home"], title: data.title };
        } catch (error) {
          return { pages: ["home"] };
        }
      }
    }
    return { pages: ["home"] };
  }

  clearSiteData(): void {
    if (typeof window === "undefined") return;

    const keysToRemove: string[] = [];
    const prefix = `site_${this.siteId}_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  }
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
  const [storageManager, setStorageManager] =
    useState<ComponentStorageManager | null>(null);

  // Dialog states
  const [addPageDialog, setAddPageDialog] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [deletePageDialog, setDeletePageDialog] = useState(false);
  const [pageToDelete, setPageToDelete] = useState("");

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
      const manager = new ComponentStorageManager(siteId);
      setStorageManager(manager);

      const metadata = manager.loadSiteMetadata();

      const pagesData: { [key: string]: { components: Component[] } } = {};
      for (const pageName of metadata.pages) {
        const components = manager.loadPageComponents(pageName);
        pagesData[pageName] = { components };
      }

      const theme = manager.loadTheme();

      const loadedSiteData: SiteData = {
        pages: pagesData,
        theme: theme || undefined,
      };

      setSiteData(loadedSiteData);

      if (theme) {
        applyThemeSettings(theme);
      } else {
        loadGoogleFonts();
      }

      setIsLoading(false);
    }
  }, [siteId]);

  const saveSiteData = (newSiteData: SiteData) => {
    if (!storageManager) return;

    setSiteData(newSiteData);

    Object.entries(newSiteData.pages).forEach(([pageName, pageData]) => {
      pageData.components.forEach((component) => {
        storageManager.saveComponent(component);
      });

      const componentIds = pageData.components.map((c) => c.id);
      storageManager.savePageStructure(pageName, componentIds);
    });

    if (newSiteData.theme) {
      storageManager.saveTheme(newSiteData.theme);
    }

    const pages = Object.keys(newSiteData.pages);
    storageManager.saveSiteMetadata({ pages, title: siteName || undefined });
  };

  const handleThemeSettingsChange = (settings: ThemeSettings) => {
    const updatedSiteData = { ...siteData, theme: settings };
    saveSiteData(updatedSiteData);
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
      if (style === "style-2") {
        newComponent.hero2Data = {
          ...defaultHero2Data,
          title: "Your Amazing Journey Starts Here",
          subtitle:
            "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
        };
        newComponent.heroData = undefined;
      } else {
        newComponent.heroData = {
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
        newComponent.hero2Data = undefined;
      }
    } else if (type === "footer") {
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
      newComponent.footerData = defaultFooterData;
      newComponent.content = "";
    } else if (type === "products") {
      newComponent.productsData = {
        title: "Featured Products",
        limit: 8,
      };
      newComponent.content = "";
    }

    const updatedSiteData = { ...siteData };
    if (!updatedSiteData.pages[currentPage]) {
      updatedSiteData.pages[currentPage] = { components: [] };
    }
    updatedSiteData.pages[currentPage].components.push(newComponent);
    saveSiteData(updatedSiteData);

    toast.success(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } component added successfully!`
    );
  };

  const handleComponentClick = (type: string, style?: string) => {
    addComponent(type, style);
  };

  const handleNavbarStyleSelect = (style: string) => {
    addComponent("navbar", style);
  };

  const handleFooterStyleSelect = (style: string) => {
    addComponent("footer", style);
  };

  const removeComponent = (componentId: string) => {
    if (!storageManager) return;

    const updatedSiteData = { ...siteData };
    if (updatedSiteData.pages[currentPage]) {
      updatedSiteData.pages[currentPage].components = updatedSiteData.pages[
        currentPage
      ].components.filter((c) => c.id !== componentId);

      storageManager.removeComponent(componentId);
      saveSiteData(updatedSiteData);

      toast.success("Component removed successfully!");
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
        saveSiteData(updatedSiteData);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const components = siteData.pages[currentPage]?.components || [];
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newComponents = arrayMove(components, oldIndex, newIndex);
        const updatedSiteData = { ...siteData };
        updatedSiteData.pages[currentPage].components = newComponents;
        saveSiteData(updatedSiteData);

        toast.success("Component moved successfully!");
      }
    }
  };

  const handleAddPageSubmit = () => {
    const pageName = newPageName.trim().toLowerCase();

    if (!pageName) {
      toast.error("Please enter a page name");
      return;
    }

    if (siteData.pages[pageName]) {
      toast.error("A page with this name already exists!");
      return;
    }

    const updatedSiteData = { ...siteData };
    updatedSiteData.pages[pageName] = { components: [] };
    saveSiteData(updatedSiteData);

    setAddPageDialog(false);
    setNewPageName("");
    toast.success(`Page "${pageName}" created successfully!`);
  };

  const handleDeletePageConfirm = () => {
    if (Object.keys(siteData.pages).length <= 1) {
      toast.error("You cannot delete the last page!");
      setDeletePageDialog(false);
      setPageToDelete("");
      return;
    }

    const updatedSiteData = { ...siteData };

    if (storageManager && updatedSiteData.pages[pageToDelete]) {
      updatedSiteData.pages[pageToDelete].components.forEach((component) => {
        storageManager.removeComponent(component.id);
      });
    }

    delete updatedSiteData.pages[pageToDelete];
    if (currentPage === pageToDelete) {
      setCurrentPage(Object.keys(updatedSiteData.pages)[0]);
    }
    saveSiteData(updatedSiteData);

    setDeletePageDialog(false);
    toast.success(`Page "${pageToDelete}" deleted successfully!`);
    setPageToDelete("");
  };

  const addPage = () => {
    setAddPageDialog(true);
  };

  const deletePage = (pageName: string) => {
    setPageToDelete(pageName);
    setDeletePageDialog(true);
  };

  const previewSite = () => {
    if (siteId) {
      window.open(`/preview?site=${siteId}`, "_blank");
      toast.success("Preview opened in new tab!");
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
  const handleBackToDashboard = () => {
    const mainUrl = getMainSiteUrl();
    window.location.href = mainUrl;
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        <BuilderSidebar
          siteName={siteName}
          currentPage={currentPage}
          theme={siteData.theme}
          hasNavbar={hasNavbar}
          hasFooter={hasFooter}
          onBackToDashboard={handleBackToDashboard}
          onPreviewSite={previewSite}
          onNavbarStyleSelect={handleNavbarStyleSelect}
          onFooterStyleSelect={handleFooterStyleSelect}
          onComponentClick={handleComponentClick}
          onThemeChange={handleThemeSettingsChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Page Navigation */}
          <PageNavigationHeader
            pages={siteData.pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageAdd={addPage}
            onPageDelete={deletePage}
          />

          {/* Page Header */}
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

          {/* Editor Zone */}
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

        {/* Add Page Dialog */}
        <Dialog open={addPageDialog} onOpenChange={setAddPageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
              <DialogDescription>
                Enter a name for your new page. It will be converted to
                lowercase and used as the page URL.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page-name" className="text-right">
                  Page Name
                </Label>
                <Input
                  id="page-name"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., About, Contact, Services"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddPageSubmit();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setAddPageDialog(false);
                  setNewPageName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPageSubmit}>Add Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Page Confirmation Dialog */}
        <AlertDialog open={deletePageDialog} onOpenChange={setDeletePageDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                &apos;
                {pageToDelete}&apos; page and all its components.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeletePageDialog(false);
                  setPageToDelete("");
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePageConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
