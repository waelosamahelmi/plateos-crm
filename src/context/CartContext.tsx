import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, MenuItem, Topping } from '../types/index.js';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, toppings: Topping[], specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'plateos_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateItemPrice = (menuItem: MenuItem, toppings: Topping[]) => {
    let total = menuItem.offerPrice || menuItem.price;

    // If item has conditional pricing (like "Your Choice Pizza")
    if (menuItem.hasConditionalPricing && menuItem.includedToppingsCount > 0) {
      const extraToppings = toppings.filter(t => t.type === 'topping');
      const extraToppingPrice = extraToppings
        .slice(menuItem.includedToppingsCount)
        .reduce((sum, t) => sum + t.price, 0);
      total += extraToppingPrice;
    }

    // Add all other topping prices
    const otherToppings = toppings.filter(t => t.type !== 'topping' || !menuItem.hasConditionalPricing);
    total += otherToppings.reduce((sum, topping) => sum + topping.price, 0);

    return total;
  };

  const addToCart = (menuItem: MenuItem, toppings: Topping[], specialInstructions?: string) => {
    const totalPrice = calculateItemPrice(menuItem, toppings);
    const itemId = `${menuItem.id}-${toppings.map(t => t.id).sort().join('-')}-${specialInstructions || ''}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1, totalPrice: totalPrice * (item.quantity + 1) }
            : item
        );
      }

      return [
        ...prev,
        {
          id: itemId,
          menuItem,
          quantity: 1,
          selectedToppings: toppings,
          specialInstructions,
          totalPrice,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const unitPrice = calculateItemPrice(item.menuItem, item.selectedToppings);
          return { ...item, quantity, totalPrice: unitPrice * quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
