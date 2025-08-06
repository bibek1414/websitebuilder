import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Settings,
  Type,
  MousePointer,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

export interface HeroButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  layout: "center" | "left" | "right";
  backgroundType: "solid" | "gradient";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  buttons: HeroButton[];
  showImage: boolean;
  imageUrl: string;
  imageAlt: string;
}

interface HeroProps {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (componentId: string, newData: { heroData: HeroData }) => void;
  componentId?: string;
}

const convertUnsplashUrl = (
  url: string,
  width: number = 800,
  quality: number = 80
): string => {
  if (!url) return "";

  const unsplashPhotoMatch = url.match(
    /unsplash\.com\/photos\/.*?-([a-zA-Z0-9_-]{11})/
  );

  if (unsplashPhotoMatch) {
    const photoId = unsplashPhotoMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}`;
  }

  return url;
};

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
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  imageAlt: "Hero image",
};

export function Hero({
  heroData = defaultHeroData,
  isEditable = false,
  onUpdate,
  componentId,
}: HeroProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleUpdate = (updates: Partial<HeroData>) => {
    const newHeroData = { ...heroData, ...updates };
    onUpdate?.(componentId!, { heroData: newHeroData });
  };

  const addButton = () => {
    const newButton: HeroButton = {
      id: Date.now().toString(),
      text: "New Button",
      variant: "primary",
      href: "#",
    };
    handleUpdate({ buttons: [...heroData.buttons, newButton] });
  };

  const updateButton = (buttonId: string, updates: Partial<HeroButton>) => {
    const updatedButtons = heroData.buttons.map((button) =>
      button.id === buttonId ? { ...button, ...updates } : button
    );
    handleUpdate({ buttons: updatedButtons });
  };

  const removeButton = (buttonId: string) => {
    const filteredButtons = heroData.buttons.filter(
      (button) => button.id !== buttonId
    );
    handleUpdate({ buttons: filteredButtons });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleUpdate({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectQuickImage = (url: string) => {
    handleUpdate({ imageUrl: url });
    setImagePreview("");
  };

  const getBackgroundStyles = () => {
    if (heroData.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${heroData.gradientFrom}, ${heroData.gradientTo})`,
      };
    }
    return {
      backgroundColor: heroData.backgroundColor,
    };
  };

  const getLayoutClasses = () => {
    switch (heroData.layout) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getImageUrl = () => {
    return imagePreview || convertUnsplashUrl(heroData.imageUrl);
  };

  const renderPreview = () => (
    <section
      className="py-20 px-4 min-h-[60vh] flex items-center justify-center relative overflow-hidden"
      style={{ ...getBackgroundStyles(), color: heroData.textColor }}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className={`flex flex-col ${getLayoutClasses()} gap-6`}>
          {heroData.showImage && heroData.imageUrl && (
            <div className="mb-6">
              <img
                src={getImageUrl()}
                alt={heroData.imageAlt}
                className="max-w-md mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80";
                }}
              />
            </div>
          )}

          {heroData.subtitle && (
            <Badge variant="secondary" className="w-fit">
              {heroData.subtitle}
            </Badge>
          )}

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {heroData.title}
          </h1>

          {heroData.description && (
            <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
              {heroData.description}
            </p>
          )}

          {heroData.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {heroData.buttons.map((button) => (
                <Button
                  key={button.id}
                  variant={
                    button.variant === "primary" ? "default" : button.variant
                  }
                  size="lg"
                  className="min-w-[120px]"
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (!isEditable) {
    return renderPreview();
  }

  return (
    <Card className="relative">
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {renderPreview()}

      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <CollapsibleContent>
          <CardContent className="p-6 border-t bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Content
                </h3>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title
                  </label>
                  <Input
                    value={heroData.title}
                    onChange={(e) => handleUpdate({ title: e.target.value })}
                    placeholder="Hero title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subtitle
                  </label>
                  <Input
                    value={heroData.subtitle}
                    onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                    placeholder="Hero subtitle"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={heroData.description}
                    onChange={(e) =>
                      handleUpdate({ description: e.target.value })
                    }
                    placeholder="Hero description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Layout
                  </label>
                  <Select
                    value={heroData.layout}
                    onValueChange={(value: "center" | "left" | "right") =>
                      handleUpdate({ layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Buttons
                </h3>
                <Button variant="outline" size="sm" onClick={addButton}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Button
                </Button>
              </div>

              <div className="space-y-3">
                {heroData.buttons.map((button) => (
                  <div
                    key={button.id}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    <Input
                      value={button.text}
                      onChange={(e) =>
                        updateButton(button.id, { text: e.target.value })
                      }
                      placeholder="Button text"
                      className="flex-1"
                    />
                    <Select
                      value={button.variant}
                      onValueChange={(
                        value: "primary" | "secondary" | "outline"
                      ) => updateButton(button.id, { variant: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={button.href || ""}
                      onChange={(e) =>
                        updateButton(button.id, { href: e.target.value })
                      }
                      placeholder="Link URL"
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeButton(button.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <ImageIcon className="h-4 w-4" />
                Image Management
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showImage"
                    checked={heroData.showImage}
                    onChange={(e) =>
                      handleUpdate({ showImage: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="showImage" className="text-sm">
                    Show image
                  </label>
                </div>

                {heroData.showImage && (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Upload Image
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="imageUpload"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("imageUpload")?.click()
                            }
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Image
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Image URL
                        </label>
                        <Input
                          value={heroData.imageUrl}
                          onChange={(e) =>
                            handleUpdate({ imageUrl: e.target.value })
                          }
                          placeholder="Enter image URL or Unsplash photo URL"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Alt Text
                        </label>
                        <Input
                          value={heroData.imageAlt}
                          onChange={(e) =>
                            handleUpdate({ imageAlt: e.target.value })
                          }
                          placeholder="Describe the image for accessibility"
                        />
                      </div>

                      {(imagePreview || heroData.imageUrl) && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Current Image Preview
                          </label>
                          <img
                            src={getImageUrl()}
                            alt="Preview"
                            className="max-w-xs rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
