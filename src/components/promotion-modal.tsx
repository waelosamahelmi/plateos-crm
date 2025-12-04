import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tag, Percent, Calendar } from "lucide-react";
import type { Promotion } from "@/types";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promotion: Promotion) => void;
  language: string;
}

export function PromotionModal({ isOpen, onClose, onSave, language }: PromotionModalProps) {
  const { toast } = useToast();
  
  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };
  
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    discountType: "percentage",
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: getDefaultEndDate(),
    isActive: true,
    applicableItems: [],
    minOrderValue: 0,
    maxDiscount: 0,
  });

  const t = (fi: string, en: string) => language === "fi" ? fi : en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discountValue) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Täytä pakolliset kentät", "Fill required fields"),
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      id: Date.now(),
    } as Promotion);

    toast({
      title: t("Tarjous luotu!", "Promotion created!"),
      description: t("Kampanja on nyt aktiivinen", "Campaign is now active"),
    });

    onClose();
  };

  const getDiscountPreview = () => {
    const { discountType, discountValue } = formData;
    if (discountType === "percentage") {
      return `${discountValue}% ${t("alennus", "off")}`;
    } else if (discountType === "fixed") {
      return `€${discountValue} ${t("alennus", "off")}`;
    } else {
      return t("Osta 1 Saa 1 Ilmaiseksi", "Buy 1 Get 1 Free");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>{t("Luo uusi tarjous", "Create New Promotion")}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview Card */}
          <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-white text-red-600 mb-2">
                    {t("Tarjous", "OFFER")}
                  </Badge>
                  <h3 className="text-2xl font-bold">
                    {formData.title || t("Tarjouksen nimi", "Promotion Name")}
                  </h3>
                  <p className="text-white/90 mt-1">
                    {formData.description || t("Kuvaus tähän", "Description here")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">
                    {getDiscountPreview()}
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {t("Voimassa", "Valid")} {new Date(formData.startDate || "").toLocaleDateString()} - {new Date(formData.endDate || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Otsikko (Suomi)", "Title (Finnish)")} *</Label>
              <Input
                required
                placeholder={t("esim. Kesätarjous", "e.g. Summer Sale")}
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Otsikko (Englanti)", "Title (English)")}</Label>
              <Input
                placeholder="e.g. Summer Sale"
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Kuvaus (Suomi)", "Description (Finnish)")}</Label>
              <Textarea
                placeholder={t("Kerro tarjouksesta...", "Tell about the offer...")}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Kuvaus (Englanti)", "Description (English)")}</Label>
              <Textarea
                placeholder="Tell about the offer..."
                value={formData.descriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                rows={2}
              />
            </div>
          </div>

          {/* Discount Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Alennustyyppi", "Discount Type")} *</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: any) => setFormData({ ...formData, discountType: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4" />
                      <span>{t("Prosenttialennus", "Percentage Off")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <span>{t("Kiinteä alennus", "Fixed Amount Off")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="buy-x-get-y">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>{t("Osta X Saa Y", "Buy X Get Y")}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {formData.discountType === "percentage" 
                  ? t("Alennus (%)", "Discount (%)") 
                  : t("Alennus (€)", "Discount (€)")} *
              </Label>
              <Input
                type="number"
                step={formData.discountType === "percentage" ? "1" : "0.01"}
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
                required
                value={formData.discountValue || ""}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{t("Alkamispäivä", "Start Date")} *</span>
              </Label>
              <Input
                type="date"
                required
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{t("Päättymispäivä", "End Date")} *</span>
              </Label>
              <Input
                type="date"
                required
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("Min. tilausarvo (€)", "Min Order Value (€)")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.minOrderValue || ""}
                onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                placeholder={t("0 = ei rajaa", "0 = no limit")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Max. alennus (€)", "Max Discount (€)")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscount || ""}
                onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                placeholder={t("0 = ei rajaa", "0 = no limit")}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="font-semibold">{t("Aktiivinen", "Active")}</Label>
              <p className="text-sm text-gray-500">{t("Näytetäänkö asiakkaille nyt?", "Show to customers now?")}</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Peruuta", "Cancel")}
            </Button>
            <Button type="submit" className="gradient-primary text-white">
              <Tag className="w-4 h-4 mr-2" />
              {t("Luo tarjous", "Create Promotion")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
