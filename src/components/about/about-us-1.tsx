"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, Type, Image as ImageIcon, Plus, Trash2, LayoutGrid, BarChart } from "lucide-react";

export interface AboutUsStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutUs1Data {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  layout: "image-left" | "image-right";
  stats: AboutUsStat[];
}

interface AboutUs1Props {
  data: AboutUs1Data;
  isEditable?: boolean;
  onUpdate?: (componentId: string, newData: { aboutUs1Data: AboutUs1Data }) => void;
  componentId?: string;
}

export const defaultAboutUs1Data: AboutUs1Data = {
  title: "About Our Company",
  subtitle: "Driving Innovation and Excellence Since 2010",
  description:
    "We are a passionate team dedicated to creating cutting-edge solutions that empower businesses and individuals. Our journey began with a simple idea: to make technology accessible and impactful. Today, we continue to push boundaries, driven by our commitment to quality, creativity, and customer success. We believe in building strong relationships and delivering results that matter.",
  imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
  imageAlt: "A team of professionals collaborating in a modern office.",
  layout: "image-right",
  stats: [
    { id: "1", value: "10+", label: "Years Experience" },
    { id: "2", value: "500+", label: "Projects Completed" },
    { id: "3", value: "99%", label: "Client Satisfaction" },
  ],
};

export function AboutUs1({ data = defaultAboutUs1Data, isEditable = false, onUpdate, componentId }: AboutUs1Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleUpdate = (updates: Partial<AboutUs1Data>) => {
    const newData = { ...data, ...updates };
    onUpdate?.(componentId!, { aboutUs1Data: newData });
  };

  const handleStatUpdate = (id: string, updates: Partial<AboutUsStat>) => {
    handleUpdate({
      stats: data.stats.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const addStat = () => {
    const newStat: AboutUsStat = { id: Date.now().toString(), value: "0", label: "New Stat" };
    handleUpdate({ stats: [...data.stats, newStat] });
  };

  const removeStat = (id: string) => {
    handleUpdate({ stats: data.stats.filter((s) => s.id !== id) });
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

  const getImageUrl = () => imagePreview || data.imageUrl;

  const renderPreview = () => (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
            data.layout === "image-left" ? "md:grid-flow-col-dense" : ""
          }`}
        >
          <div className={`${data.layout === "image-left" ? "md:col-start-2" : ""}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{data.title}</h2>
            <p className="text-lg text-primary font-semibold mb-4">{data.subtitle}</p>
            <p className="text-muted-foreground leading-relaxed">{data.description}</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {data.stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${data.layout === "image-left" ? "md:col-start-1" : ""}`}>
            <img
              src={getImageUrl()}
              alt={data.imageAlt}
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x450"; }}
            />
          </div>
        </div>
      </div>
    </section>
  );

  if (!isEditable) {
    return renderPreview();
  }

  return (
    <Card className="relative">
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="absolute top-4 right-4 z-20">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </CollapsibleTrigger>
        </div>
        {renderPreview()}
        <CollapsibleContent>
          <CardContent className="p-6 border-t bg-muted/30 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Content */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><Type className="h-4 w-4" />Content</h3>
                <div className="space-y-4">
                  <div><Label>Title</Label><Input value={data.title} onChange={(e) => handleUpdate({ title: e.target.value })} /></div>
                  <div><Label>Subtitle</Label><Input value={data.subtitle} onChange={(e) => handleUpdate({ subtitle: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea value={data.description} onChange={(e) => handleUpdate({ description: e.target.value })} rows={5} /></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><BarChart className="h-4 w-4" />Statistics</h3>
                <div className="space-y-3">
                  {data.stats.map(stat => (
                    <div key={stat.id} className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                      <Input value={stat.value} onChange={(e) => handleStatUpdate(stat.id, { value: e.target.value })} placeholder="Value (e.g., 10+)" />
                      <Input value={stat.label} onChange={(e) => handleStatUpdate(stat.id, { label: e.target.value })} placeholder="Label (e.g., Years)" />
                      <Button variant="ghost" size="icon" onClick={() => removeStat(stat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addStat}><Plus className="h-4 w-4 mr-2" />Add Stat</Button>
                </div>
              </div>
            </div>
            {/* Column 2: Layout & Image */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><LayoutGrid className="h-4 w-4" />Layout</h3>
                <Select value={data.layout} onValueChange={(v: "image-left" | "image-right") => handleUpdate({ layout: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image-left">Image Left</SelectItem>
                    <SelectItem value="image-right">Image Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><ImageIcon className="h-4 w-4" />Image</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Image URL</Label>
                    <Input value={data.imageUrl} onChange={(e) => handleUpdate({ imageUrl: e.target.value })} />
                  </div>
                  <div>
                    <Label>Upload Image</Label>
                    <Input type="file" accept="image/*" id={`about1-img-upload-${componentId}`} onChange={handleImageUpload} className="text-sm" />
                  </div>
                  <div>
                    <Label>Image Alt Text</Label>
                    <Input value={data.imageAlt} onChange={(e) => handleUpdate({ imageAlt: e.target.value })} />
                  </div>
                  {getImageUrl() && (
                    <div><Label>Preview</Label><img src={getImageUrl()} alt="Preview" className="max-w-xs rounded-lg border" /></div>
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