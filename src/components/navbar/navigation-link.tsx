import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface NavLink {
  id: string;
  text: string;
  href?: string;
}

interface NavigationLinksProps {
  links: NavLink[];
  isEditable?: boolean;
  onAddLink?: () => void;
  onUpdateLink?: (linkId: string, newText: string, newHref?: string) => void;
  onRemoveLink?: (linkId: string) => void;
}

export function NavigationLinks({
  links,
  isEditable = false,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}: NavigationLinksProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHrefId, setEditingHrefId] = useState<string | null>(null);

  const handleSave = (linkId: string, text: string, href: string) => {
    onUpdateLink?.(linkId, text, href);
    setEditingId(null);
    setEditingHrefId(null);
  };

  if (isEditable) {
    return (
      <div className="flex items-center space-x-6">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            {editingId === link.id ? (
              <div className="flex flex-col space-y-1">
                <Input
                  type="text"
                  defaultValue={link.text}
                  onBlur={(e) =>
                    handleSave(link.id, e.target.value, link.href || "#")
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSave(
                        link.id,
                        e.currentTarget.value,
                        link.href || "#"
                      );
                    }
                  }}
                  className="bg-transparent border-b border-primary-foreground text-primary-background outline-none text-sm"
                  autoFocus
                  placeholder="Link text"
                />
                {editingHrefId === link.id && (
                  <Input
                    type="text"
                    defaultValue={link.href || "#"}
                    onBlur={(e) =>
                      handleSave(link.id, link.text, e.target.value)
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSave(link.id, link.text, e.currentTarget.value);
                      }
                    }}
                    className="bg-background text-foreground px-2 py-1 rounded text-xs"
                    placeholder="Link URL"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingHrefId(editingHrefId === link.id ? null : link.id);
                  }}
                  className="text-xs text-primary-foreground hover:text-muted-foreground"
                >
                  {editingHrefId === link.id ? "Hide URL" : "Edit URL"}
                </Button>
              </div>
            ) : (
              <span
                onClick={() => setEditingId(link.id)}
                className="text-muted-foreground hover:text-muted-foreground cursor-pointer transition-colors"
              >
                {link.text}
              </span>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveLink?.(link.id);
              }}
              className="absolute -top-2 -right-2 rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0 min-w-0"
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddLink}
          className="text-primary-foreground bg-secondary border-primary-foreground hover:bg-secondary/90 hover:text-primary"
        >
          + Link
        </Button>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-6">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href || "#"}
          className=""
        >
          {link.text}
        </a>
      ))}
    </nav>
  );
}