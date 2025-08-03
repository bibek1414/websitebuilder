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
}

interface ComponentRendererProps {
  component: Component;
  isPreview?: boolean;
  onUpdate?: (componentId: string, newContent: any) => void;
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
        className="absolute top-4 right-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <X className="h-3 w-3" />
      </Button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-grab"
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
    onUpdate?.(component.id, { content: newContent });
  };

  const handleNavbarUpdate = (componentId: string, newNavbarData: any) => {
    onUpdate?.(componentId, newNavbarData);
  };

  const handleRemove = () => {
    onRemove?.(component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case "navbar":
        const props = {
          logoText: component.navbarData?.logoText || "Brand",
          links: component.navbarData?.links || [],
          buttons: component.navbarData?.buttons || [],
          isEditable: !isPreview,
          onUpdate: handleNavbarUpdate,
          componentId: component.id,
        };
        switch (component.style) {
          case "style-2":
            return <Navbar2 {...props} />;
          case "style-3":
            return <Navbar3 {...props} />; // Add this case
          case "style-1":
          default:
            return <Navbar1 {...props} />;
        }

      case "hero":
        if (isPreview) {
          return (
            <div className="text-secondary-foreground bg-secondary py-20 text-center">
              <h1 className="text-4xl font-bold">{component.content}</h1>
            </div>
          );
        }
        return (
          <Card className="bg-secondary text-center text-secondary-foreground py-8">
            <Textarea
              value={component.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="bg-transparent border-none w-full text-2xl font-bold text-center shadow-none resize-none focus-visible:ring-0"
              placeholder="Hero title"
            />
          </Card>
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