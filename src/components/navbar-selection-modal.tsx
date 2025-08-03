import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DraggableNavbarPreview = ({
  id,
  styleName,
  children,
}: {
  id: string;
  styleName: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        type: "navbar",
        style: styleName,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      <Card className="overflow-hidden cursor-grab active:cursor-grabbing hover:bg-accent transition-colors">
        <div
          className="p-2 bg-muted/40 flex items-center justify-center"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="scale-80 origin-top-left overflow-visible min-h-[80px] p-2">
          {children}
        </div>
      </Card>
    </div>
  );
};

export const DroppableEditorZone = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "editor-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-auto bg-muted ${
        isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
      }`}
    >
      {children}
    </div>
  );
};

// New component for sidebar navbar styles
export const NavbarStylesSection = ({
  onStyleSelect,
}: {
  onStyleSelect?: (style: string) => void;
}) => {
  const handleStyleClick = (style: string, event: React.MouseEvent) => {
    // Only trigger click if not dragging
    if (!event.defaultPrevented && onStyleSelect) {
      onStyleSelect(style);
    }
  };

  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-3">Navbar Styles</h3>
      <div className="space-y-3">
        {/* Style 1 */}
        <div
          onClick={(e) => handleStyleClick("style-1", e)}
          className="cursor-pointer"
        >
          <DraggableNavbarPreview id="navbar-style-1" styleName="style-1">
            <div className="p-4 border rounded-md bg-background w-80">
              <div className="flex justify-between items-center">
                <div className="font-bold text-xs">Brand</div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Link 1</span>
                  <span>Link 2</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="px-2 py-1 border rounded text-xs">Login</div>
                  <div className="px-2 py-1 border rounded text-xs bg-primary text-primary-foreground">
                    Sign Up
                  </div>
                </div>
              </div>
            </div>
          </DraggableNavbarPreview>
          <div className="mt-1">
            <div className="text-sm font-medium">Standard</div>
            <div className="text-xs text-muted-foreground">
              Logo left, links and actions right
            </div>
          </div>
        </div>

        {/* Style 2 */}
        <div
          onClick={(e) => handleStyleClick("style-2", e)}
          className="cursor-pointer"
        >
          <DraggableNavbarPreview id="navbar-style-2" styleName="style-2">
            <div className="p-4 border rounded-md bg-primary text-primary-foreground w-80">
              <div className="flex justify-between items-center">
                <div className="font-bold text-xs">Brand</div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Link 1</span>
                  <span>Link 2</span>
                  <span>Link 3</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="px-2 py-1 border rounded text-xs">Action</div>
                </div>
              </div>
            </div>
          </DraggableNavbarPreview>
          <div className="mt-1">
            <div className="text-sm font-medium">Centered</div>
            <div className="text-xs text-muted-foreground">
              Logo left, links center, actions right
            </div>
          </div>
        </div>

        {/* Style 3 - New style */}
        <div
          onClick={(e) => handleStyleClick("style-3", e)}
          className="cursor-pointer"
        >
          <DraggableNavbarPreview id="navbar-style-3" styleName="style-3">
            <div className="p-4 border rounded-md bg-slate-900 text-white w-80">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs">Brand</div>
                  <div className="px-2 py-1 bg-white text-black rounded text-xs">
                    Get Started
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Home</span>
                  <span>About</span>
                  <span>Services</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
          </DraggableNavbarPreview>
          <div className="mt-1">
            <div className="text-sm font-medium">Stacked</div>
            <div className="text-xs text-muted-foreground">
              Two-row layout with brand and action top
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
