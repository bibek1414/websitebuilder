import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ActionButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  isEditable?: boolean;
  onAddButton?: () => void;
  onUpdateButton?: (
    buttonId: string,
    newText: string,
    newVariant: string,
    newHref?: string
  ) => void;
  onRemoveButton?: (buttonId: string) => void;
}

export function ActionButtons({
  buttons,
  isEditable = false,
  onAddButton,
  onUpdateButton,
  onRemoveButton,
}: ActionButtonsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHref, setEditingHref] = useState(false);

  const getButtonVariant = (
    variant: string
  ): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
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

  const handleSave = (
    buttonId: string,
    text: string,
    variant: string,
    href: string
  ) => {
    onUpdateButton?.(buttonId, text, variant, href);
    setEditingId(null);
    setEditingHref(false);
  };

  if (isEditable) {
    return (
      <div className="flex items-center space-x-3">
        {buttons.map((button) => (
          <div key={button.id} className="relative group">
            {editingId === button.id ? (
              <div className="flex flex-col space-y-1 min-w-32">
                <Input
                  type="text"
                  defaultValue={button.text}
                  onBlur={(e) =>
                    handleSave(
                      button.id,
                      e.target.value,
                      button.variant,
                      button.href || "#"
                    )
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSave(
                        button.id,
                        e.currentTarget.value,
                        button.variant,
                        button.href || "#"
                      );
                    }
                  }}
                  className="text-sm"
                  autoFocus
                  placeholder="Button text"
                />
                <Select
                  defaultValue={button.variant}
                  onValueChange={(value) =>
                    handleSave(
                      button.id,
                      button.text,
                      value,
                      button.href || "#"
                    )
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
                {editingHref && (
                  <Input
                    type="text"
                    defaultValue={button.href || "#"}
                    onBlur={(e) =>
                      handleSave(
                        button.id,
                        button.text,
                        button.variant,
                        e.target.value
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSave(
                          button.id,
                          button.text,
                          button.variant,
                          e.currentTarget.value
                        );
                      }
                    }}
                    className="text-xs"
                    placeholder="Button URL"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingHref(!editingHref)}
                  className="text-xs text-primary-foreground hover:text-muted-foreground"
                >
                  {editingHref ? "Hide URL" : "Edit URL"}
                </Button>
              </div>
            ) : (
              <Button
                variant={getButtonVariant(button.variant)}
                onClick={() => setEditingId(button.id)}
                className="font-medium"
              >
                {button.text}
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveButton?.(button.id)}
              className="absolute -top-2 -right-2 rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0 min-w-0"
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddButton}
          className="text-primary-foreground bg-secondary border-primary-foreground hover:bg-secondary/90 hover:text-primary"
        >
          + Button
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant={getButtonVariant(button.variant)}
          asChild
          className="font-medium"
        >
          <a href={button.href || "#"}>{button.text}</a>
        </Button>
      ))}
    </div>
  );
}
