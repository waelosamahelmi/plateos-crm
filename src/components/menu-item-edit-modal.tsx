import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@/types";

interface MenuItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
  categories: Category[];
  language: string;
}

export function MenuItemEditModal({ isOpen, onClose, item, onSave, categories, language }: MenuItemEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<MenuItem>>(item || {
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    price: 0,
    categoryId: 1,
    imageUrl: "",
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  const t = (fi: string, en: string) => language === "fi" ? fi : en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Täytä pakolliset kentät", "Fill required fields"),
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...item,
      ...formData,
      id: item?.id || Date.now(),
    } as MenuItem);

    toast({
      title: t("Tallennettu!", "Saved!"),
      description: t("Tuote on päivitetty onnistuneesti", "Product updated successfully"),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {item ? t("Muokkaa tuotetta", "Edit Product") : t("Uusi tuote", "New Product")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>{t("Kuva", "Image")}</Label>
            <div className="flex items-center space-x-3">
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <Input
                  placeholder={t("Kuvan URL", "Image URL")}
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t("Tai valitse kuvapankista:", "Or pick from gallery:")}
                </p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
                    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  ].map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Option ${idx + 1}`}
                      className="w-full h-16 rounded object-cover cursor-pointer hover:ring-2 ring-red-500 transition"
                      onClick={() => setFormData({ ...formData, imageUrl: url })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Nimi (Suomi)", "Name (Finnish)")} *</Label>
              <Input
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Nimi (Englanti)", "Name (English)")}</Label>
              <Input
                value={formData.nameEn || ""}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Kuvaus (Suomi)", "Description (Finnish)")}</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Kuvaus (Englanti)", "Description (English)")}</Label>
              <Textarea
                value={formData.descriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                rows={3}
              />
            </div>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Hinta (€)", "Price (€)")} *</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Kategoria", "Category")}</Label>
              <Select
                value={formData.categoryId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {language === "fi" ? cat.name : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dietary Options */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Label className="font-semibold">{t("Ruokavalio", "Dietary Options")}</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <Switch
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                />
                <span className="text-sm">{t("Kasvisruoka", "Vegetarian")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <Switch
                  checked={formData.isVegan}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVegan: checked })}
                />
                <span className="text-sm">{t("Vegaaninen", "Vegan")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <Switch
                  checked={formData.isGlutenFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isGlutenFree: checked })}
                />
                <span className="text-sm">{t("Gluteeniton", "Gluten-free")}</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="font-semibold">{t("Saatavuus", "Availability")}</Label>
              <p className="text-sm text-gray-500">{t("Näytetäänkö asiakkaille?", "Show to customers?")}</p>
            </div>
            <Switch
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Peruuta", "Cancel")}
            </Button>
            <Button type="submit" className="gradient-primary text-white">
              {t("Tallenna", "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
