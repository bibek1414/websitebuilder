import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "./navigation-link";
import { ActionButton } from "./action-buttons";

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  buttons: ActionButton[];
  onClose: () => void;
}

export function MobileMenu({ isOpen, links, buttons, onClose }: MobileMenuProps) {
  const getButtonVariant = (variant: string): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
    switch (variant) {
      case "primary":
        return "default";
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      default:
        return "default";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-64 bg-card border-l z-50 shadow-lg">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="float-right text-2xl hover:bg-muted p-1 min-w-0"
          >
            ×
          </Button>
          <div className="clear-both pt-6">
            <nav className="space-y-4">
              {links.map((link) => (
                <Button
                  key={link.id}
                  variant="ghost"
                  asChild
                  className="block w-full justify-start text-left py-2 h-auto"
                  onClick={onClose}
                >
                  <a href={link.href || "#"}>
                    {link.text}
                  </a>
                </Button>
              ))}
            </nav>
            <div className="mt-6 space-y-3">
              {buttons.map((button) => (
                <Button
                  key={button.id}
                  variant={getButtonVariant(button.variant)}
                  asChild
                  className="w-full font-medium"
                  onClick={onClose}
                >
                  <a href={button.href || "#"}>
                    {button.text}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}