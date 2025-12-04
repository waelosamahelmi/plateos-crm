import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useCart } from "@/lib/cart-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus, X, Leaf, Heart, Wheat, ShoppingCart } from "lucide-react";
import type { MenuItem, Topping } from "../types/index.js";

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { language, getToppingGroupsForItem } = useData();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const t = (fi: string, en: string, ar?: string) => {
    if (language === "fi") return fi;
    if (language === "en") return en;
    if (language === "ar" && ar) return ar;
    return fi;
  };

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedToppings([]);
      setSpecialInstructions("");
    }
  }, [isOpen, item]);

  if (!item) return null;

  const toppingGroups = getToppingGroupsForItem(item.id);
  const basePrice = item.offerPrice || item.price;

  // Calculate total price
  const calculateItemPrice = () => {
    let total = basePrice;

    // If item has conditional pricing (like "Your Choice Pizza")
    if (item.hasConditionalPricing && item.includedToppingsCount > 0) {
      const toppingItems = selectedToppings.filter(t => t.type === 'topping');
      const extraToppingPrice = toppingItems
        .slice(item.includedToppingsCount)
        .reduce((sum, t) => sum + t.price, 0);
      total += extraToppingPrice;
    }

    // Add all other topping prices
    const otherToppings = selectedToppings.filter(t => t.type !== 'topping' || !item.hasConditionalPricing);
    total += otherToppings.reduce((sum, topping) => sum + topping.price, 0);

    return total * quantity;
  };

  const totalPrice = calculateItemPrice();

  const handleToppingChange = (topping: Topping, checked: boolean) => {
    if (checked) {
      setSelectedToppings(prev => [...prev, topping]);
    } else {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    }
  };

  const handleAddToCart = () => {
    // Convert Topping objects to topping ID strings
    const toppingIds = selectedToppings.map(t => t.id.toString());
    
    // Calculate topping price
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    
    // Convert item to MenuItem format expected by new cart context
    const menuItem = {
      id: item.id,
      name: item.name,
      nameEn: item.nameEn,
      description: item.description || '',
      descriptionEn: item.descriptionEn || '',
      price: (item.offerPrice || item.price).toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      displayOrder: item.displayOrder,
      hasConditionalPricing: item.hasConditionalPricing,
      includedToppingsCount: item.includedToppingsCount,
    } as any;
    
    addItem(menuItem, quantity, undefined, toppingIds, specialInstructions || undefined, toppingsPrice);
    onClose();
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold pr-8">
              {language === "fi" ? item.name : item.nameEn}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={item.imageUrl || "/placeholder-food.jpg"}
              alt={language === "fi" ? item.name : item.nameEn}
              className="w-full h-full object-cover"
            />
            {item.offerPercentage && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-3 py-1">
                -{item.offerPercentage}%
              </Badge>
            )}
          </div>

          {/* Item Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {item.isVegetarian && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Leaf className="w-3 h-3 mr-1" />
                  {t("Kasvisruoka", "Vegetarian", "نباتي")}
                </Badge>
              )}
              {item.isVegan && (
                <Badge variant="outline" className="text-green-700 border-green-700">
                  <Heart className="w-3 h-3 mr-1" />
                  {t("Vegaaninen", "Vegan", "نباتي صارم")}
                </Badge>
              )}
              {item.isGlutenFree && (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  <Wheat className="w-3 h-3 mr-1" />
                  {t("Gluteeniton", "Gluten-free", "خالي من الغلوتين")}
                </Badge>
              )}
            </div>

            {item.description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === "fi" ? item.description : item.descriptionEn}
              </p>
            )}

            <div className="flex items-center space-x-3">
              {item.offerPrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(item.offerPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(item.price)}
                  </span>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {t("Tarjous", "Offer", "عرض")}
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(basePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Topping Groups */}
          {toppingGroups.map((group) => (
            <div key={group.id} className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">
                  {language === "fi" ? group.name : group.nameEn}
                  {group.isRequired && <span className="text-red-500 ml-1">*</span>}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.toppings.map((topping) => {
                    if (!topping) return null;

                    const isSelected = selectedToppings.some(t => t.id === topping.id);

                    return (
                      <div key={topping.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`topping-${topping.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleToppingChange(topping, !!checked)}
                          />
                          <Label htmlFor={`topping-${topping.id}`} className="font-medium cursor-pointer">
                            {language === "fi" ? topping.name : topping.nameEn}
                          </Label>
                        </div>
                        {topping.price > 0 && (
                          <span className="text-sm text-gray-600">
                            +{formatPrice(topping.price)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <Label htmlFor="instructions" className="font-semibold text-lg mb-3 block">
                {t("Erityistoiveet", "Special Instructions", "تعليمات خاصة")}
              </Label>
              <Textarea
                id="instructions"
                placeholder={t("Esim. ilman sipulia, extra mausteita...", "e.g. no onions, extra spices...", "مثلاً بدون بصل، توابل إضافية...")}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{t("Määrä", "Quantity", "الكمية")}:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("Yhteensä", "Total", "المجموع")}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full text-lg py-6"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t("Lisää ostoskoriin", "Add to Cart", "أضف إلى السلة")} - {formatPrice(totalPrice)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
