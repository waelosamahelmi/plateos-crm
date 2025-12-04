// Simplified types for PlateOS Demo (no database dependencies)

export interface Category {
  id: number;
  name: string;
  nameEn: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  displayOrder: number;
  isAvailable: boolean;
  offerPrice?: number;
  offerPercentage?: number;
  hasConditionalPricing: boolean;
  includedToppingsCount: number;
}

export interface Topping {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  isActive: boolean;
  displayOrder: number;
  category: string;
  type: string;
}

export interface ToppingGroup {
  id: number;
  name: string;
  nameEn: string;
  isRequired: boolean;
  maxSelections: number;
  minSelections: number;
  displayOrder: number;
  toppings: Topping[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedToppings: Topping[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'stripe';
  paymentStatus: 'pending' | 'paid' | 'failed';
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  menuItemNameEn: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  toppings?: string;
}

export interface Promotion {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  discountType: "percentage" | "fixed" | "buy-x-get-y";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableItems: number[];
  minOrderValue?: number;
  maxDiscount?: number;
}

export type Language = 'fi' | 'en';
export type ViewMode = 'customer' | 'admin';
