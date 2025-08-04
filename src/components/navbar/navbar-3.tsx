import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationLinks, NavLink } from "./navigation-link";
import { ActionButtons, ActionButton } from "./action-buttons";
import { MobileMenu } from "./mobile-menu";
import { Menu } from "lucide-react";
import { Input } from "../ui/input";

interface NavbarData {
  links: NavLink[];
  buttons: ActionButton[];
  logoText: string;
}

interface ComponentUpdate {
  navbarData: NavbarData;
}

interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  buttons?: ActionButton[];
  isEditable?: boolean;
  onUpdate?: (componentId: string, newContent: ComponentUpdate) => void;
  onRemove?: (componentId: string) => void;
  componentId?: string;
}
export function Navbar3({
  logoText = "Brand",
  links = [],
  buttons = [],
  isEditable = false,
  onUpdate,
  componentId = "navbar",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLinks, setCurrentLinks] = useState(links);
  const [currentButtons, setCurrentButtons] = useState(buttons);
  const [currentLogoText, setCurrentLogoText] = useState(logoText);

  const updateComponent = (newData: Partial<NavbarData>) => {
    onUpdate?.(componentId, {
      navbarData: {
        links: currentLinks,
        buttons: currentButtons,
        logoText: currentLogoText,
        ...newData,
      },
    });
  };

  const handleLogoUpdate = (newLogoText: string) => {
    setCurrentLogoText(newLogoText);
    onUpdate?.(componentId, {
      navbarData: {
        links: currentLinks,
        buttons: currentButtons,
        logoText: newLogoText,
      },
    });
  };

  const handleAddLink = () => {
    const newLink = { id: Date.now().toString(), text: "New Link", href: "#" };
    const updatedLinks = [...currentLinks, newLink];
    setCurrentLinks(updatedLinks);
    updateComponent({ links: updatedLinks, buttons: currentButtons });
  };

  const handleUpdateLink = (
    linkId: string,
    newText: string,
    newHref?: string
  ) => {
    const updatedLinks = currentLinks.map((link) =>
      link.id === linkId ? { ...link, text: newText, href: newHref } : link
    );
    setCurrentLinks(updatedLinks);
    updateComponent({ links: updatedLinks, buttons: currentButtons });
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = currentLinks.filter((link) => link.id !== linkId);
    setCurrentLinks(updatedLinks);
    updateComponent({ links: updatedLinks, buttons: currentButtons });
  };

  const handleAddButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: "Button",
      variant: "primary" as const,
      href: "#",
    };
    const updatedButtons = [...currentButtons, newButton];
    setCurrentButtons(updatedButtons);
    updateComponent({ links: currentLinks, buttons: updatedButtons });
  };

  const handleUpdateButton = (
    buttonId: string,
    newText: string,
    newVariant: string,
    newHref?: string
  ) => {
    const updatedButtons = currentButtons.map((button) =>
      button.id === buttonId
        ? {
            ...button,
            text: newText,
            variant: newVariant as ActionButton["variant"],
            href: newHref,
          }
        : button
    );
    setCurrentButtons(updatedButtons);
    updateComponent({ links: currentLinks, buttons: updatedButtons });
  };

  const handleRemoveButton = (buttonId: string) => {
    const updatedButtons = currentButtons.filter(
      (button) => button.id !== buttonId
    );
    setCurrentButtons(updatedButtons);
    updateComponent({ links: currentLinks, buttons: updatedButtons });
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First row: Brand and Action Button */}
        <div className="flex justify-between items-center h-12 border-b border-slate-700">
          <div className="flex-shrink-0">
            {isEditable ? (
              <Input
                value={currentLogoText}
                onChange={(e) => handleLogoUpdate(e.target.value)}
                className="text-lg font-bold border-0 bg-transparent focus-visible:ring-1 text-white placeholder:text-white/70"
                placeholder="Brand"
              />
            ) : (
              <a href="#" className="text-lg font-bold">
                {currentLogoText}
              </a>
            )}
          </div>

          <div className="hidden md:block">
            <ActionButtons
              buttons={currentButtons}
              isEditable={isEditable}
              onAddButton={handleAddButton}
              onUpdateButton={handleUpdateButton}
              onRemoveButton={handleRemoveButton}
            />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Second row: Navigation Links */}
        <div className="py-3">
          <div className="hidden md:block">
            <NavigationLinks
              links={currentLinks}
              isEditable={isEditable}
              onAddLink={handleAddLink}
              onUpdateLink={handleUpdateLink}
              onRemoveLink={handleRemoveLink}
            />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        links={currentLinks}
        buttons={currentButtons}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
