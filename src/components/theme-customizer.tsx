import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Layout, RotateCcw } from "lucide-react";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: "small" | "medium" | "large";
  borderRadius: "none" | "small" | "medium" | "large";
  layout: "compact" | "comfortable" | "spacious";
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#DC2626",
  secondaryColor: "#F97316",
  accentColor: "#FCD34D",
  fontFamily: "Inter",
  fontSize: "medium",
  borderRadius: "medium",
  layout: "comfortable",
};

export function ThemeCustomizer({ isOpen, onClose, language }: ThemeCustomizerProps) {
  const { toast } = useToast();
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  const t = (fi: string, en: string) => language === "fi" ? fi : en;

  useEffect(() => {
    // Load saved theme from localStorage
    const saved = localStorage.getItem("plateos-custom-theme");
    if (saved) {
      try {
        setTheme(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
      }
    }
  }, []);

  const applyTheme = (settings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHSL = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply colors
    root.style.setProperty('--primary', hexToHSL(settings.primaryColor));
    root.style.setProperty('--secondary', hexToHSL(settings.secondaryColor));
    root.style.setProperty('--accent', hexToHSL(settings.accentColor));

    // Apply font
    root.style.setProperty('--font-family', settings.fontFamily);

    // Apply font size
    const fontSizes = { small: "14px", medium: "16px", large: "18px" };
    root.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);

    // Apply border radius
    const radii = { none: "0px", small: "4px", medium: "8px", large: "16px" };
    root.style.setProperty('--radius', radii[settings.borderRadius]);

    // Apply layout spacing
    const spacing = { compact: "0.5rem", comfortable: "1rem", spacious: "1.5rem" };
    root.style.setProperty('--spacing', spacing[settings.layout]);
  };

  const handlePreview = () => {
    applyTheme(theme);
    toast({
      title: t("Esikatselu", "Preview"),
      description: t("Katso muutoksia sivulla", "See changes on the page"),
    });
  };

  const handleSave = () => {
    localStorage.setItem("plateos-custom-theme", JSON.stringify(theme));
    applyTheme(theme);
    toast({
      title: t("Teema tallennettu!", "Theme saved!"),
      description: t("Muutokset ovat voimassa", "Changes are applied"),
    });
    onClose();
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.removeItem("plateos-custom-theme");
    toast({
      title: t("Teema palautettu", "Theme reset"),
      description: t("Oletusasetukset palautettu", "Default settings restored"),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>{t("Teeman muokkaus", "Theme Customization")}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-2" />
              {t("Värit", "Colors")}
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-2" />
              {t("Typografia", "Typography")}
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              {t("Asettelu", "Layout")}
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4 mt-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Pääväri", "Primary Color")}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="flex-1 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Toissijainen väri", "Secondary Color")}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                        className="flex-1 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Korostusväri", "Accent Color")}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        className="flex-1 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {t("Pääväri", "Primary")}
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    {t("Toissijainen", "Secondary")}
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {t("Korostus", "Accent")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 mt-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>{t("Fontti", "Font Family")}</Label>
                  <Select
                    value={theme.fontFamily}
                    onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("Fonttikoko", "Font Size")}</Label>
                  <Select
                    value={theme.fontSize}
                    onValueChange={(value: any) => setTheme({ ...theme, fontSize: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t("Pieni", "Small")} (14px)</SelectItem>
                      <SelectItem value="medium">{t("Keskikokoinen", "Medium")} (16px)</SelectItem>
                      <SelectItem value="large">{t("Suuri", "Large")} (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Typography Preview */}
                <div className="mt-4 p-4 border rounded-lg" style={{ fontFamily: theme.fontFamily }}>
                  <h1 className="text-3xl font-bold mb-2">{t("Otsikko 1", "Heading 1")}</h1>
                  <h2 className="text-2xl font-semibold mb-2">{t("Otsikko 2", "Heading 2")}</h2>
                  <p className="text-base mb-2">{t("Tavallinen teksti näyttää tältä.", "Regular text looks like this.")}</p>
                  <p className="text-sm text-gray-500">{t("Pieni teksti esimerkki", "Small text example")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 mt-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>{t("Reunan pyöristys", "Border Radius")}</Label>
                  <Select
                    value={theme.borderRadius}
                    onValueChange={(value: any) => setTheme({ ...theme, borderRadius: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("Ei pyöristystä", "None")}</SelectItem>
                      <SelectItem value="small">{t("Pieni", "Small")} (4px)</SelectItem>
                      <SelectItem value="medium">{t("Keskikokoinen", "Medium")} (8px)</SelectItem>
                      <SelectItem value="large">{t("Suuri", "Large")} (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("Asettelu", "Layout Spacing")}</Label>
                  <Select
                    value={theme.layout}
                    onValueChange={(value: any) => setTheme({ ...theme, layout: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">{t("Tiivis", "Compact")}</SelectItem>
                      <SelectItem value="comfortable">{t("Mukava", "Comfortable")}</SelectItem>
                      <SelectItem value="spacious">{t("Väljä", "Spacious")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Layout Preview */}
                <div className="mt-4 space-y-2">
                  <div 
                    className="p-4 bg-gray-100 dark:bg-gray-700"
                    style={{ 
                      borderRadius: theme.borderRadius === "none" ? "0" : 
                                   theme.borderRadius === "small" ? "4px" : 
                                   theme.borderRadius === "medium" ? "8px" : "16px" 
                    }}
                  >
                    <p>{t("Kortin esikatselu", "Card preview")}</p>
                  </div>
                  <div 
                    className="p-2 bg-gray-100 dark:bg-gray-700 inline-block"
                    style={{ 
                      borderRadius: theme.borderRadius === "none" ? "0" : 
                                   theme.borderRadius === "small" ? "4px" : 
                                   theme.borderRadius === "medium" ? "8px" : "16px" 
                    }}
                  >
                    <p>{t("Painike", "Button")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="text-red-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("Palauta oletukset", "Reset to Default")}
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              {t("Esikatsele", "Preview")}
            </Button>
            <Button onClick={handleSave} className="gradient-primary text-white">
              {t("Tallenna", "Save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
