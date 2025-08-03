"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentRenderer, Component } from "@/components/component-renders";
import { HeroData } from "@/components/hero/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  Palette,
  LayoutTemplate,
} from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  NavbarStylesSection,
  DroppableEditorZone,
} from "@/components/navbar-selection-modal";

interface SiteData {
  pages: {
    [key: string]: {
      components: Component[];
    };
  };
}

const componentTemplates = [
  {
    type: "hero",
    name: "Hero Section",
    description:
      "A customizable hero section with title, description, and buttons",
  },
  { type: "text", name: "Text Block", description: "A simple text block" },
];

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
        } catch (error) {
          console.error("Error parsing site data:", error);
          setSiteData({ pages: { home: { components: [] } } });
        }
      } else {
        setSiteData({ pages: { home: { components: [] } } });
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

  const addComponent = (type: string, style?: string) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: type,
      style: style,
      content: `${type} content`,
    };

    // Add specific data based on component type
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
      newComponent.content = ""; // Hero doesn't use the content field
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

  const removeComponent = (componentId: string) => {
    const updatedSiteData = { ...siteData };
    if (updatedSiteData.pages[currentPage]) {
      updatedSiteData.pages[currentPage].components = updatedSiteData.pages[
        currentPage
      ].components.filter((c) => c.id !== componentId);
      saveSite(updatedSiteData);
    }
  };

  const updateComponent = (componentId: string, newContent: any) => {
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

    // Adding new navbar component from sidebar
    if (
      active.data.current?.type === "navbar" &&
      over.id === "editor-drop-zone"
    ) {
      addComponent("navbar", active.data.current.style);
      return;
    }

    // Handle other component types being dragged from sidebar
    if (active.data.current?.componentType && over.id === "editor-drop-zone") {
      addComponent(active.data.current.componentType);
      return;
    }

    // Reordering existing components
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
        {/* Sidebar - Increased width */}
        <div className="w-80 bg-card shadow-lg flex flex-col border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold truncate">
              Editing: {siteName || "Untitled"}
            </h2>
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={previewSite}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </div>
          </div>

          <div className="p-4 border-b flex-shrink-0">
            <h3 className="font-semibold mb-2">Pages</h3>
            <div className="max-h-32 overflow-y-auto">
              {Object.keys(siteData.pages).map((pageName) => (
                <div key={pageName} className="flex items-center mb-1">
                  <Button
                    variant={currentPage === pageName ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageName)}
                    className="flex-1 justify-start capitalize h-8"
                  >
                    {pageName}
                  </Button>
                  {Object.keys(siteData.pages).length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePage(pageName)}
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
              onClick={addPage}
              className="mt-2 h-8 text-primary hover:text-primary/80"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Page
            </Button>
          </div>

          {/* Navbar Styles Section */}
          <div className="flex-shrink-0 overflow-y-auto max-h-96">
            <NavbarStylesSection onStyleSelect={handleNavbarStyleSelect} />
          </div>

          {/* Other Components */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="font-semibold mb-2">Components</h3>
            {componentTemplates.map((template) => (
              <Card
                key={template.type}
                className="mb-2 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleComponentClick(template.type)}
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
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize">{currentPage} Page</h2>
            <Badge variant="secondary">
              {currentComponents.length || 0} components
            </Badge>
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
