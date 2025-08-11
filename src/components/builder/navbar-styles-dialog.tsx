import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface NavbarStyle {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}

interface NavbarStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: string) => void;
}

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

const navbarStyles: NavbarStyle[] = [
  {
    id: "style-1",
    name: "Standard",
    description: "Logo left, links and actions right",
    preview: (
      <div className="p-4 border rounded-md bg-background">
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
    ),
  },
  {
    id: "style-2",
    name: "Centered",
    description: "Logo left, links center, actions right",
    preview: (
      <div className="p-4 border rounded-md bg-primary text-primary-foreground ">
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
    ),
  },
  {
    id: "style-3",
    name: "Stacked",
    description: "Two-row layout with brand and action top",
    preview: (
      <div className="p-4 border rounded-md bg-primary text-white ">
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
    ),
  },
];

export const NavbarStylesDialog: React.FC<NavbarStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const handleStyleClick = (style: string, event: React.MouseEvent) => {
    if (!event.defaultPrevented) {
      onStyleSelect(style);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]  overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Navbar Style</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 ">
          {navbarStyles.map((navbarStyle) => (
            <div
              key={navbarStyle.id}
              onClick={(e) => handleStyleClick(navbarStyle.id, e)}
              className="cursor-pointer "
            >
              <DraggableNavbarPreview
                id={`navbar-${navbarStyle.id}`}
                styleName={navbarStyle.id}
              >
                {navbarStyle.preview}
              </DraggableNavbarPreview>
              <div className="mt-2">
                <div className="text-sm font-medium">{navbarStyle.name}</div>
                <div className="text-xs text-muted-foreground">
                  {navbarStyle.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};