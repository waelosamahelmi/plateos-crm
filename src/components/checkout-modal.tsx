import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { useData } from "@/context/DataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Bike, ShoppingBag, CreditCard, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export function CheckoutModal({ isOpen, onClose, onBack }: CheckoutModalProps) {
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    orderType: "delivery" as "delivery" | "pickup",
    paymentMethod: "online",
    specialInstructions: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const deliveryFee = formData.orderType === "delivery" ? 5.0 : 0;
  const totalAmount = totalPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Lisää tuotteita koriin ensin", "Add items to cart first"),
        variant: "destructive",
      });
      return;
    }

    if (formData.orderType === "delivery" && !formData.deliveryAddress) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Toimitusosoite on pakollinen", "Delivery address is required"),
        variant: "destructive",
      });
      return;
    }

    // Generate order ID
    const orderId = Date.now();
    const newOrderNumber = `#${orderId.toString().slice(-4)}`;
    setOrderNumber(newOrderNumber);
    
    // Convert cart items to order items
    const orderItems = items.map((item, index) => {
      const itemPrice = typeof item.menuItem.price === 'number' 
        ? item.menuItem.price 
        : parseFloat(String(item.menuItem.price));
      const toppingsTotal = (item.toppingsPrice || 0) + (item.sizePrice || 0);
      const itemTotal = (itemPrice + toppingsTotal) * item.quantity;
      
      return {
        id: index + 1,
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        menuItemNameEn: item.menuItem.nameEn,
        quantity: item.quantity,
        unitPrice: itemPrice,
        totalPrice: itemTotal,
        specialInstructions: item.specialInstructions,
        toppings: item.toppings?.join(', ') || '',
      };
    });
    
    // Create order object
    const newOrder: Order = {
      id: orderId,
      orderNumber: newOrderNumber,
      items: orderItems,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      deliveryAddress: formData.orderType === "delivery" ? formData.deliveryAddress : undefined,
      orderType: formData.orderType as 'delivery' | 'pickup',
      paymentMethod: formData.paymentMethod as 'cash' | 'card' | 'stripe',
      paymentStatus: 'pending',
      specialInstructions: formData.specialInstructions || undefined,
      status: "pending",
      subtotal: totalPrice,
      deliveryFee: formData.orderType === "delivery" ? 3.90 : 0,
      totalAmount: totalAmount,
      createdAt: new Date(),
    };

    // Add order to data context
    addOrder(newOrder);
    
    // Show success
    setShowSuccess(true);
    
    // Clear cart after a delay
    setTimeout(() => {
      clearCart();
      setShowSuccess(false);
      onClose();
      toast({
        title: t("Tilaus vastaanotettu!", "Order received!"),
        description: t(`Tilauksesi ${newOrderNumber} on vastaanotettu`, `Your order ${newOrderNumber} has been received`),
      });
    }, 3000);
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {t("Tilaus vastaanotettu!", "Order Received!")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("Tilausnumero:", "Order number:")} <span className="font-bold">{orderNumber}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("Saat vahvistuksen sähköpostitse", "You will receive a confirmation by email")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Kassa", "Checkout")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Type Selection */}
          <div className="space-y-3">
            <Label>{t("Tilaustyyppi", "Order Type")}</Label>
            <RadioGroup
              value={formData.orderType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, orderType: value as "delivery" | "pickup" }))}
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Bike className="w-5 h-5" />
                  <span>{t("Kotiinkuljetus", "Delivery")}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t("Nouto", "Pickup")}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t("Nimi", "Name")} *</Label>
              <Input
                id="name"
                required
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("Puhelinnumero", "Phone")} *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">{t("Sähköposti", "Email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
          </div>

          {/* Delivery Address (if delivery selected) */}
          {formData.orderType === "delivery" && (
            <div>
              <Label htmlFor="address">{t("Toimitusosoite", "Delivery Address")} *</Label>
              <Input
                id="address"
                required
                placeholder={t("Katuosoite, postinumero, kaupunki", "Street address, postal code, city")}
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              />
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <Label htmlFor="instructions">{t("Erityisohjeet", "Special Instructions")}</Label>
            <Textarea
              id="instructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder={t("Lisätietoja tilauksesta...", "Additional order information...")}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>{t("Maksutapa", "Payment Method")}</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5" />
                  <span>{t("Verkkomaksu", "Online Payment")}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("Tuotteet yhteensä:", "Items total:")}</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            {formData.orderType === "delivery" && (
              <div className="flex justify-between text-sm">
                <span>{t("Toimitusmaksu:", "Delivery fee:")}</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("Yhteensä:", "Total:")}</span>
              <span className="text-red-600">€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              {t("Takaisin", "Back")}
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              {t("Lähetä tilaus", "Place Order")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
