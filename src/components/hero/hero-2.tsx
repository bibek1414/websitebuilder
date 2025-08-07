

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Type,
  MousePointer,
  Paintbrush,
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Upload,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export interface Hero2SliderImage {
  id: string;
  url: string;
  alt: string;
}

export interface Hero2Button {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface Hero2Data {
  title: string;
  subtitle: string;
  description: string;
  textColor: string;
  buttons: Hero2Button[];
  layout: "text-left" | "text-center" | "text-right";
  backgroundType: "color" | "gradient" | "image";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImageUrl: string;
  showOverlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  showSlider: boolean;
  sliderImages: Hero2SliderImage[];
}

interface Hero2Props {
  heroData: Hero2Data;
  isEditable?: boolean;
  onUpdate?: (componentId: string, newData: { hero2Data: Hero2Data }) => void;
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

export const defaultHero2Data: Hero2Data = {
  title: "Welcome to our Website",
  subtitle:
    "Discover your own Website with our drag-and-drop builder. No coding required.",
  description: "",
  textColor: "#FFFFFF",
  buttons: [
    { id: "1", text: "Shop Now", variant: "primary", href: "#" },
    { id: "2", text: "About", variant: "secondary", href: "#" },
  ],
  layout: "text-left",
  backgroundType: "image",
  backgroundColor: "#1e3a8a",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
  showOverlay: true,
  overlayColor: "#000000",
  overlayOpacity: 0.5,
  showSlider: true,
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1559827291-72ee739d0d95?q=80&w=1974&auto=format&fit=crop",
      alt: "Testing image 1",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
      alt: "Testing image 2",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1540499748-020399342750?q=80&w=2070&auto=format&fit=crop",
      alt: "Testing image 3",
    },
  ],
};

export function Hero2({
  heroData = defaultHero2Data,
  isEditable = false,
  onUpdate,
  componentId,
}: Hero2Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backgroundImagePreview, setBackgroundImagePreview] =
    useState<string>("");
  const [sliderImagePreviews, setSliderImagePreviews] = useState<{
    [key: string]: string;
  }>({});

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const handleUpdate = (updates: Partial<Hero2Data>) => {
    const newHeroData = { ...heroData, ...updates };
    onUpdate?.(componentId!, { hero2Data: newHeroData });
  };

  const handleButtonUpdate = (id: string, updates: Partial<Hero2Button>) => {
    handleUpdate({
      buttons: heroData.buttons.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    });
  };

  const addSliderImage = () => {
    const newImage: Hero2SliderImage = {
      id: Date.now().toString(),
      url: "https://via.placeholder.com/600x400",
      alt: "Placeholder image",
    };
    handleUpdate({ sliderImages: [...heroData.sliderImages, newImage] });
  };

  const handleSliderImageUpdate = (
    id: string,
    updates: Partial<Hero2SliderImage>
  ) => {
    handleUpdate({
      sliderImages: heroData.sliderImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    });
  };

  const removeSliderImage = (id: string) => {
    handleUpdate({
      sliderImages: heroData.sliderImages.filter((img) => img.id !== id),
    });
    // Also remove the preview
    const newPreviews = { ...sliderImagePreviews };
    delete newPreviews[id];
    setSliderImagePreviews(newPreviews);
  };

  // Background image upload handler
  const handleBackgroundImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImagePreview(result);
        handleUpdate({ backgroundImageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Slider image upload handler
  const handleSliderImageUpload = (
    imageId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSliderImagePreviews((prev) => ({ ...prev, [imageId]: result }));
        handleSliderImageUpdate(imageId, { url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundImageUrl = () => {
    return (
      backgroundImagePreview || convertUnsplashUrl(heroData.backgroundImageUrl)
    );
  };

  const getSliderImageUrl = (imageId: string, originalUrl: string) => {
    return sliderImagePreviews[imageId] || convertUnsplashUrl(originalUrl);
  };

  const getBackgroundStyles = (): React.CSSProperties => {
    if (heroData.backgroundType === "image") {
      return {
        backgroundImage: `url(${getBackgroundImageUrl()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (heroData.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${heroData.gradientFrom}, ${heroData.gradientTo})`,
      };
    }
    return { backgroundColor: heroData.backgroundColor };
  };

  const getLayoutClasses = () => {
    let classes = "flex-1 ";
    switch (heroData.layout) {
      case "text-left":
        classes += "text-left items-start";
        break;
      case "text-right":
        classes += "text-right items-end";
        break;
      case "text-center":
        classes += "text-center items-center";
        break;
    }
    return classes;
  };

  const renderPreview = () => (
    <section
      className="relative w-full min-h-[80vh] flex items-end p-8 md:p-16"
      style={getBackgroundStyles()}
    >
      {heroData.backgroundType === "image" && heroData.showOverlay && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: heroData.overlayColor,
            opacity: heroData.overlayOpacity,
          }}
        />
      )}
      <div
        className="relative z-10 container mx-auto flex items-end gap-8"
        style={{ color: heroData.textColor }}
      >
        <div className={`flex flex-col gap-4 ${getLayoutClasses()}`}>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md">
            {heroData.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl drop-shadow-sm">
            {heroData.subtitle}
          </p>
          {heroData.description && (
            <p className="text-md max-w-2xl opacity-90">
              {heroData.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            {heroData.buttons.map((btn) => (
              <Button
                key={btn.id}
                variant={btn.variant === "primary" ? "default" : btn.variant}
                size="lg"
              >
                {btn.text}
              </Button>
            ))}
          </div>
        </div>

        {heroData.showSlider && heroData.sliderImages.length > 0 && (
          <div className="hidden lg:block w-1/2 relative">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex">
                {heroData.sliderImages.map((img) => (
                  <div
                    className="flex-grow-0 flex-shrink-0 w-full"
                    key={img.id}
                  >
                    <img
                      src={getSliderImageUrl(img.id, img.url)}
                      alt={img.alt}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 left-2 "
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 right-2 "
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );

  if (!isEditable) {
    return renderPreview();
  }

  return (
    <Card className="relative group/card">
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="absolute top-4 right-4 z-20">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </CollapsibleTrigger>
        </div>

        {renderPreview()}

        <CollapsibleContent>
          <CardContent className="p-6 border-t bg-muted/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Content & Layout */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Type className="h-4 w-4" />
                    Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={heroData.title}
                        onChange={(e) =>
                          handleUpdate({ title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Textarea
                        value={heroData.subtitle}
                        onChange={(e) =>
                          handleUpdate({ subtitle: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={heroData.description}
                        onChange={(e) =>
                          handleUpdate({ description: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={heroData.textColor}
                        onChange={(e) =>
                          handleUpdate({ textColor: e.target.value })
                        }
                        className="w-20 p-1"
                      />
                    </div>
                    <div>
                      <Label>Layout</Label>
                      <Select
                        value={heroData.layout}
                        onValueChange={(
                          v: "text-left" | "text-center" | "text-right"
                        ) => handleUpdate({ layout: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-left">Text Left</SelectItem>
                          <SelectItem value="text-center">
                            Text Center
                          </SelectItem>
                          <SelectItem value="text-right">Text Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <MousePointer className="h-4 w-4" />
                    Buttons
                  </h3>
                  <div className="space-y-3">
                    {heroData.buttons.map((btn) => (
                      <div
                        key={btn.id}
                        className="flex items-center gap-2 p-3 border rounded-lg bg-background"
                      >
                        <Input
                          value={btn.text}
                          onChange={(e) =>
                            handleButtonUpdate(btn.id, { text: e.target.value })
                          }
                          placeholder="Button Text"
                        />
                        <Input
                          value={btn.href}
                          onChange={(e) =>
                            handleButtonUpdate(btn.id, { href: e.target.value })
                          }
                          placeholder="URL"
                        />
                        <Select
                          value={btn.variant}
                          onValueChange={(
                            v: "primary" | "secondary" | "outline"
                          ) => handleButtonUpdate(btn.id, { variant: v })}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdate({
                              buttons: heroData.buttons.filter(
                                (b) => b.id !== btn.id
                              ),
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdate({
                          buttons: [
                            ...heroData.buttons,
                            {
                              id: Date.now().toString(),
                              text: "New Button",
                              variant: "primary",
                              href: "#",
                            },
                          ],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Button
                    </Button>
                  </div>
                </div>
              </div>
              {/* Column 2: Background & Media */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Paintbrush className="h-4 w-4" />
                    Background
                  </h3>
                  <Tabs
                    value={heroData.backgroundType}
                    onValueChange={(v: string) =>
                      handleUpdate({
                        backgroundType: v as "color" | "gradient" | "image",
                      })
                    }
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="color">Color</TabsTrigger>
                      <TabsTrigger value="gradient">Gradient</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="color" className="pt-4">
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={heroData.backgroundColor}
                        onChange={(e) =>
                          handleUpdate({ backgroundColor: e.target.value })
                        }
                        className="w-20 p-1"
                      />
                    </TabsContent>
                    <TabsContent value="gradient" className="pt-4 space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <Label>From</Label>
                          <Input
                            type="color"
                            value={heroData.gradientFrom}
                            onChange={(e) =>
                              handleUpdate({ gradientFrom: e.target.value })
                            }
                            className="w-20 p-1"
                          />
                        </div>
                        <div>
                          <Label>To</Label>
                          <Input
                            type="color"
                            value={heroData.gradientTo}
                            onChange={(e) =>
                              handleUpdate({ gradientTo: e.target.value })
                            }
                            className="w-20 p-1"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="image" className="pt-4 space-y-4">
                      <div>
                        <Label>Upload Background Image</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundImageUpload}
                            className="hidden"
                            id="backgroundImageUpload"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("backgroundImageUpload")
                                ?.click()
                            }
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Background Image
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Background Image URL</Label>
                        <Input
                          value={heroData.backgroundImageUrl}
                          onChange={(e) =>
                            handleUpdate({ backgroundImageUrl: e.target.value })
                          }
                          placeholder="Enter image URL or Unsplash photo URL"
                        />
                      </div>
                      {(backgroundImagePreview ||
                        heroData.backgroundImageUrl) && (
                        <div>
                          <Label>Current Background Preview</Label>
                          <img
                            src={getBackgroundImageUrl()}
                            alt="Background Preview"
                            className="max-w-xs rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="overlay-switch"
                          checked={heroData.showOverlay}
                          onCheckedChange={(c) =>
                            handleUpdate({ showOverlay: c })
                          }
                        />
                        <Label htmlFor="overlay-switch">Show Overlay</Label>
                      </div>
                      {heroData.showOverlay && (
                        <div className="space-y-2">
                          <Label>Overlay Color</Label>
                          <Input
                            type="color"
                            value={heroData.overlayColor}
                            onChange={(e) =>
                              handleUpdate({ overlayColor: e.target.value })
                            }
                            className="w-20 p-1"
                          />
                          <Label>Overlay Opacity</Label>
                          <Input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={heroData.overlayOpacity}
                            onChange={(e) =>
                              handleUpdate({
                                overlayOpacity: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <ImageIcon className="h-4 w-4" />
                    Media Slider
                  </h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="slider-switch"
                      checked={heroData.showSlider}
                      onCheckedChange={(c) => handleUpdate({ showSlider: c })}
                    />
                    <Label htmlFor="slider-switch">Show Image Slider</Label>
                  </div>
                  {heroData.showSlider && (
                    <div className="space-y-3 p-3 border rounded-lg bg-background max-h-72 overflow-y-auto">
                      {heroData.sliderImages.map((img) => (
                        <div
                          key={img.id}
                          className="space-y-2 p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={img.url}
                              onChange={(e) =>
                                handleSliderImageUpdate(img.id, {
                                  url: e.target.value,
                                })
                              }
                              placeholder="Image URL"
                            />
                            <Input
                              value={img.alt}
                              onChange={(e) =>
                                handleSliderImageUpdate(img.id, {
                                  alt: e.target.value,
                                })
                              }
                              placeholder="Alt Text"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSliderImage(img.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleSliderImageUpload(img.id, e)
                              }
                              className="hidden"
                              id={`sliderImageUpload-${img.id}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById(`sliderImageUpload-${img.id}`)
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          </div>
                          {(sliderImagePreviews[img.id] || img.url) && (
                            <img
                              src={getSliderImageUrl(img.id, img.url)}
                              alt="Slider Preview"
                              className="max-w-24 h-16 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSliderImage}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
