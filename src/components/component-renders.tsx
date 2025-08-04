import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Navbar1 } from "./navbar/navbar-1";
import { Navbar2 } from "./navbar/navbar-2";
import { Navbar3 } from "./navbar/navbar-3";
import { Hero, HeroData } from "./hero/hero";

export interface Component {
  id: string;
  type: string;
  style?: string;
  content: string;
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

interface NavbarUpdateData {
  navbarData: {
    logoText: string;
    links: Array<{ id: string; text: string; href?: string }>;
    buttons: Array<{
      id: string;
      text: string;
      variant: "primary" | "secondary" | "outline";
      href?: string;
    }>;
  };
}

interface HeroUpdateData {
  heroData: HeroData;
}

interface TextUpdateData {
  content: string;
}

type ComponentUpdateData = NavbarUpdateData | HeroUpdateData | TextUpdateData;

interface ComponentRendererProps {
  component: Component;
  isPreview?: boolean;
  onUpdate?: (componentId: string, newContent: ComponentUpdateData) => void;
  onRemove?: (componentId: string) => void;
}

const SortableWrapper = ({
  id,
  onRemove,
  children,
}: {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group p-2">
      {children}
      <Button
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute top-4 right-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <X className="h-3 w-3" />
      </Button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-grab"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export function ComponentRenderer({
  component,
  isPreview = false,
  onUpdate,
  onRemove,
}: ComponentRendererProps) {
  const handleContentChange = (newContent: string) => {
    onUpdate?.(component.id, { content: newContent } as TextUpdateData);
  };

  const handleNavbarUpdate = (
    componentId: string,
    newNavbarData: NavbarUpdateData
  ) => {
    onUpdate?.(componentId, newNavbarData);
  };

  const handleHeroUpdate = (
    componentId: string,
    newHeroData: HeroUpdateData
  ) => {
    onUpdate?.(componentId, newHeroData);
  };

  const handleRemove = () => {
    onRemove?.(component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case "navbar":
        const navbarProps = {
          logoText: component.navbarData?.logoText || "Brand",
          links: component.navbarData?.links || [],
          buttons: component.navbarData?.buttons || [],
          isEditable: !isPreview,
          onUpdate: handleNavbarUpdate,
          componentId: component.id,
        };
        switch (component.style) {
          case "style-2":
            return <Navbar2 {...navbarProps} />;
          case "style-3":
            return <Navbar3 {...navbarProps} />;
          case "style-1":
          default:
            return <Navbar1 {...navbarProps} />;
        }

      case "hero":
        const defaultHeroData: HeroData = {
          title: "Welcome to Our Amazing Platform",
          subtitle: "Build Something Great",
          description:
            "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
          layout: "center",
          backgroundType: "gradient",
          backgroundColor: "hsl(var(--primary))",
          gradientFrom: "hsl(var(--primary))",
          gradientTo: "hsl(var(--secondary))",
          textColor: "hsl(var(--primary-foreground))",
          buttons: [
            { id: "1", text: "Get Started", variant: "primary", href: "#" },
            { id: "2", text: "Learn More", variant: "outline", href: "#" },
          ],
          showImage: false,
          imageUrl: "",
          imageAlt: "Hero image",
        };

        return (
          <Hero
            heroData={component.heroData || defaultHeroData}
            isEditable={!isPreview}
            onUpdate={handleHeroUpdate}
            componentId={component.id}
          />
        );

      case "text":
        if (isPreview) {
          return (
            <div className="py-8">
              <div className="container px-4 max-w-7xl mx-auto">
                <p className="text-foreground leading-relaxed">
                  {component.content}
                </p>
              </div>
            </div>
          );
        }
        return (
          <Card className="bg-accent p-4">
            <Textarea
              value={component.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="bg-transparent border-none w-full resize-none shadow-none focus-visible:ring-0"
              placeholder="Enter your text content"
            />
          </Card>
        );

      default:
        return (
          <Card className="bg-muted p-4">
            <span className="text-muted-foreground">{component.content}</span>
          </Card>
        );
    }
  };

  if (isPreview) {
    return renderComponent();
  }

  return (
    <SortableWrapper id={component.id} onRemove={handleRemove}>
      {renderComponent()}
    </SortableWrapper>
  );
}
