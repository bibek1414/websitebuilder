import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, RotateCcw, Save, Type } from "lucide-react";

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  muted: string;
  mutedForeground: string;
}

interface ThemeFont {
  name: string;
  value: string;
  fallback: string;
}

interface ThemeSettings extends ThemeColors {
  fontFamily: string;
}

interface ColorPickerProps {
  onColorsChange?: (settings: ThemeSettings) => void;
  initialColors?: Partial<ThemeColors>;
  initialFont?: string;
}

// Available fonts
const availableFonts: ThemeFont[] = [
  {
    name: "Inter",
    value: "Inter",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  {
    name: "Roboto",
    value: "Roboto",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  {
    name: "Playfair Display",
    value: "Playfair Display",
    fallback: "Georgia, serif",
  },
  {
    name: "Poppins",
    value: "Poppins",
    fallback: "system-ui, -apple-system, sans-serif",
  },
];

// Predefined color themes
const colorThemes = {
  default: {
    primary: "#0f172a",
    primaryForeground: "#f8fafc",
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",
    accent: "#f1f5f9",
    accentForeground: "#0f172a",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    border: "#e2e8f0",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  blue: {
    primary: "#2563eb",
    primaryForeground: "#f8fafc",
    secondary: "#dbeafe",
    secondaryForeground: "#1e40af",
    accent: "#dbeafe",
    accentForeground: "#1e40af",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    border: "#cbd5e1",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  purple: {
    primary: "#7c3aed",
    primaryForeground: "#f8fafc",
    secondary: "#ede9fe",
    secondaryForeground: "#5b21b6",
    accent: "#ede9fe",
    accentForeground: "#5b21b6",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    border: "#cbd5e1",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  green: {
    primary: "#059669",
    primaryForeground: "#f0fdf4",
    secondary: "#dcfce7",
    secondaryForeground: "#14532d",
    accent: "#dcfce7",
    accentForeground: "#14532d",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    border: "#cbd5e1",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  orange: {
    primary: "#ea580c",
    primaryForeground: "#fff7ed",
    secondary: "#fed7aa",
    secondaryForeground: "#9a3412",
    accent: "#fed7aa",
    accentForeground: "#9a3412",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    border: "#cbd5e1",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  dark: {
    primary: "#f8fafc",
    primaryForeground: "#0f172a",
    secondary: "#1e293b",
    secondaryForeground: "#f8fafc",
    accent: "#1e293b",
    accentForeground: "#f8fafc",
    background: "#0f172a",
    foreground: "#f8fafc",
    card: "#1e293b",
    cardForeground: "#f8fafc",
    border: "#334155",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
  },
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorsChange,
  initialColors = {},
  initialFont = "Inter",
}) => {
  const initialThemeColors = useMemo(
    () => ({
      ...colorThemes.default,
      ...initialColors,
    }),
    [initialColors]
  );

  const [colors, setColors] = useState<ThemeColors>(initialThemeColors);
  const [selectedFont, setSelectedFont] = useState<string>(initialFont);
  const [activeTab, setActiveTab] = useState<"themes" | "custom" | "fonts">(
    "themes"
  );
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const onColorsChangeRef = useRef(onColorsChange);
  const prevSettingsRef = useRef<ThemeSettings | undefined>(undefined);

  // Update the ref when onColorsChange changes
  useEffect(() => {
    onColorsChangeRef.current = onColorsChange;
  }, [onColorsChange]);

  // Load Google Fonts with better error handling and loading state
  useEffect(() => {
    const loadGoogleFonts = () => {
      // Check if fonts are already loaded
      const existingLink = document.querySelector(
        'link[data-font-loader="google-fonts"]'
      );
      if (existingLink) {
        setFontsLoaded(true);
        return;
      }

      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
      link.rel = "stylesheet";
      link.setAttribute("data-font-loader", "google-fonts");

      // Add loading and error handlers
      link.onload = () => {
        setFontsLoaded(true);
      };

      link.onerror = () => {
        console.warn(
          "Failed to load Google Fonts, falling back to system fonts"
        );
        setFontsLoaded(true); // Still set to true to continue with fallbacks
      };

      document.head.appendChild(link);
    };

    loadGoogleFonts();
  }, []);

  // Apply colors and font to CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Apply colors
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Apply font only after fonts are loaded
    if (fontsLoaded) {
      const selectedFontObj = availableFonts.find(
        (f) => f.value === selectedFont
      );
      if (selectedFontObj) {
        const fontFamily = `"${selectedFontObj.value}", ${selectedFontObj.fallback}`;
        root.style.setProperty("--font-family", fontFamily);
        document.body.style.fontFamily = fontFamily;
      }
    }

    // Call onColorsChange with complete settings
    const currentSettings: ThemeSettings = {
      ...colors,
      fontFamily: selectedFont,
    };

    if (
      prevSettingsRef.current &&
      JSON.stringify(prevSettingsRef.current) !==
        JSON.stringify(currentSettings)
    ) {
      onColorsChangeRef.current?.(currentSettings);
    } else if (!prevSettingsRef.current) {
      // First render
      onColorsChangeRef.current?.(currentSettings);
    }

    prevSettingsRef.current = currentSettings;
  }, [colors, selectedFont, fontsLoaded]);

  const handleColorChange = useCallback(
    (colorKey: keyof ThemeColors, value: string) => {
      setColors((prevColors) => ({ ...prevColors, [colorKey]: value }));
    },
    []
  );

  const handleFontChange = useCallback((fontValue: string) => {
    setSelectedFont(fontValue);
  }, []);

  const applyTheme = useCallback((themeName: keyof typeof colorThemes) => {
    const newColors = { ...colorThemes[themeName] };
    setColors(newColors);
  }, []);

  const resetToDefault = useCallback(() => {
    setColors({ ...colorThemes.default });
    setSelectedFont("Inter");
  }, []);

  const handleApplySettings = useCallback(() => {
    const settings: ThemeSettings = { ...colors, fontFamily: selectedFont };
    onColorsChangeRef.current?.(settings);
  }, [colors, selectedFont]);

  const ColorInput = React.memo(
    ({
      label,
      colorKey,
      description,
    }: {
      label: string;
      colorKey: keyof ThemeColors;
      description?: string;
    }) => (
      <div className="space-y-2">
        <Label htmlFor={colorKey} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
            style={{ backgroundColor: colors[colorKey] }}
            onClick={() => {
              const input = document.getElementById(
                `${colorKey}-input`
              ) as HTMLInputElement;
              input?.click();
            }}
          />
          <Input
            id={`${colorKey}-input`}
            type="color"
            value={colors[colorKey]}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
          />
          <Input
            type="text"
            value={colors[colorKey]}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            className="flex-1 font-mono text-xs"
            placeholder="#000000"
          />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    )
  );

  ColorInput.displayName = "ColorInput";

  const PreviewCard = React.memo(() => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button className="w-full">Primary Button</Button>
          <Button variant="secondary" className="w-full">
            Secondary Button
          </Button>
          <Button variant="outline" className="w-full">
            Outline Button
          </Button>
        </div>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Card Example</h3>
            <p className="text-sm text-muted-foreground">
              This shows how your colors and font look in practice with cards
              and text. The current font is {selectedFont}.
              {!fontsLoaded && (
                <span className="text-yellow-600"> (Loading fonts...)</span>
              )}
            </p>
            <Badge className="mt-2">Sample Badge</Badge>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  ));

  PreviewCard.displayName = "PreviewCard";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customizer
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "themes" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("themes")}
            >
              Preset Themes
            </Button>
            <Button
              variant={activeTab === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("custom")}
            >
              Custom Colors
            </Button>
            <Button
              variant={activeTab === "fonts" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("fonts")}
            >
              <Type className="h-4 w-4 mr-1" />
              Typography
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "themes" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(colorThemes).map(([themeName, themeColors]) => (
                  <Card
                    key={themeName}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() =>
                      applyTheme(themeName as keyof typeof colorThemes)
                    }
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold capitalize mb-3">
                        {themeName}
                      </h3>
                      <div className="grid grid-cols-4 gap-1 mb-3">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: themeColors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: themeColors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: themeColors.accent }}
                          title="Accent"
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: themeColors.background }}
                          title="Background"
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Click to apply
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "fonts" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Font Selection</h3>
                <div className="space-y-2">
                  <Label>Choose a font family</Label>
                  <Select value={selectedFont} onValueChange={handleFontChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span
                            style={{
                              fontFamily: fontsLoaded
                                ? `"${font.value}", ${font.fallback}`
                                : font.fallback,
                            }}
                          >
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!fontsLoaded && (
                    <p className="text-sm text-yellow-600">Loading fonts...</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Font Preview</h3>
                <div className="grid gap-4">
                  {availableFonts.map((font) => (
                    <Card
                      key={font.value}
                      className={`cursor-pointer transition-colors ${
                        selectedFont === font.value
                          ? "ring-2 ring-primary"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleFontChange(font.value)}
                    >
                      <CardContent className="p-4">
                        <div
                          style={{
                            fontFamily: fontsLoaded
                              ? `"${font.value}", ${font.fallback}`
                              : font.fallback,
                          }}
                        >
                          <h4 className="font-semibold text-lg mb-2">
                            {font.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            The quick brown fox jumps over the lazy dog
                          </p>
                          <div className="flex gap-2 text-xs">
                            <span className="font-normal">Normal</span>
                            <span className="font-medium">Medium</span>
                            <span className="font-semibold">Semibold</span>
                            <span className="font-bold">Bold</span>
                          </div>
                        </div>
                        {selectedFont === font.value && (
                          <Badge className="mt-2">Currently Selected</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Primary Colors</h3>
                <ColorInput
                  label="Primary"
                  colorKey="primary"
                  description="Main brand color for buttons, links, and highlights"
                />
                <ColorInput
                  label="Primary Foreground"
                  colorKey="primaryForeground"
                  description="Text color on primary backgrounds"
                />
                <ColorInput
                  label="Secondary"
                  colorKey="secondary"
                  description="Secondary color for less prominent elements"
                />
                <ColorInput
                  label="Secondary Foreground"
                  colorKey="secondaryForeground"
                  description="Text color on secondary backgrounds"
                />

                <h3 className="font-semibold text-lg mt-6">
                  Accent & Background
                </h3>
                <ColorInput
                  label="Accent"
                  colorKey="accent"
                  description="Accent color for highlights and hover states"
                />
                <ColorInput
                  label="Accent Foreground"
                  colorKey="accentForeground"
                  description="Text color on accent backgrounds"
                />
                <ColorInput
                  label="Background"
                  colorKey="background"
                  description="Main background color"
                />
                <ColorInput
                  label="Foreground"
                  colorKey="foreground"
                  description="Main text color"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Card & UI Elements</h3>
                <ColorInput
                  label="Card"
                  colorKey="card"
                  description="Background color for cards and panels"
                />
                <ColorInput
                  label="Card Foreground"
                  colorKey="cardForeground"
                  description="Text color on card backgrounds"
                />
                <ColorInput
                  label="Border"
                  colorKey="border"
                  description="Color for borders and dividers"
                />
                <ColorInput
                  label="Muted"
                  colorKey="muted"
                  description="Muted background color"
                />
                <ColorInput
                  label="Muted Foreground"
                  colorKey="mutedForeground"
                  description="Muted text color"
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToDefault}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplySettings}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Apply Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PreviewCard />
    </div>
  );
};

export default ColorPicker;
