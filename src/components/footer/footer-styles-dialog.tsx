import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Mail, Phone, Facebook, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface FooterStyle {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}

interface FooterStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: string) => void;
}

const DraggableFooterPreview = ({
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
        type: "footer",
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
        <div className="scale-80 origin-top-left overflow-visible min-h-[120px] p-2">
          {children}
        </div>
      </Card>
    </div>
  );
};

const footerStyles: FooterStyle[] = [
  {
    id: "style-1",
    name: "Clean & Minimal",
    description: "Traditional footer layout with clean typography",
    preview: (
      <div className="p-4 border-t bg-background w-96">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="font-bold text-xs mb-2">Company Name</div>
            <div className="text-xs text-muted-foreground mb-2">
              Brief company description
            </div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Mail className="h-3 w-3 mr-1" />
              email@company.com
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              +1 (555) 123-4567
            </div>
          </div>
          <div>
            <div className="font-semibold text-xs mb-2">Company</div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">About Us</div>
              <div className="text-xs text-muted-foreground">Careers</div>
              <div className="text-xs text-muted-foreground">Contact</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-xs mb-2">Services</div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Web Design</div>
              <div className="text-xs text-muted-foreground">Development</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t text-center">
          <div className="text-xs text-muted-foreground">© 2024 Company. All rights reserved.</div>
        </div>
      </div>
    ),
  },
  {
    id: "style-2",
    name: "Card-Based Modern",
    description: "Modern card-based design with visual separation",
    preview: (
      <div className="p-4 bg-muted/50 w-96">
        <div className="bg-card p-4 rounded border mb-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs mb-2">
                Your Company
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Building amazing experiences
              </div>
              <div className="flex gap-1">
                <div className="p-1 border rounded">
                  <Facebook className="h-3 w-3" />
                </div>
                <div className="p-1 border rounded">
                  <Twitter className="h-3 w-3" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-xs mb-2">Company</div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">About</div>
                  <div className="text-xs text-muted-foreground">Team</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-xs mb-2">Services</div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Design</div>
                  <div className="text-xs text-muted-foreground">Development</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card p-3 rounded border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1 text-primary" />
              <span className="text-muted-foreground">hello@company.com</span>
            </div>
            <div className="text-muted-foreground">© 2024 Company</div>
          </div>
        </div>
      </div>
    ),
  },
];

export const FooterStylesDialog: React.FC<FooterStylesDialogProps> = ({
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
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Footer Style</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 p-4">
          {footerStyles.map((footerStyle) => (
            <div
              key={footerStyle.id}
              onClick={(e) => handleStyleClick(footerStyle.id, e)}
              className="cursor-pointer"
            >
              <DraggableFooterPreview
                id={`footer-${footerStyle.id}`}
                styleName={footerStyle.id}
              >
                {footerStyle.preview}
              </DraggableFooterPreview>
              <div className="mt-2">
                <div className="text-sm font-medium">{footerStyle.name}</div>
                <div className="text-xs text-muted-foreground">
                  {footerStyle.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};