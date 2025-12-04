import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category, MenuItem, Topping, ToppingGroup, Order, Language, ViewMode } from '../types/index.js';
import { mockCategories, mockMenuItems, mockToppings, mockToppingGroups, mockOrders } from '../data/mockData';

interface DataContextType {
  // Data
  categories: Category[];
  menuItems: MenuItem[];
  toppings: Topping[];
  toppingGroups: ToppingGroup[];
  orders: Order[];

  // Settings
  language: Language;
  viewMode: ViewMode;

  // Actions
  setLanguage: (lang: Language) => void;
  setViewMode: (mode: ViewMode) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
  getMenuItemsByCategory: (categoryId: number) => MenuItem[];
  getToppingGroupsForItem: (menuItemId: number) => ToppingGroup[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORDERS: 'plateos_orders',
  LANGUAGE: 'plateos_language',
  VIEW_MODE: 'plateos_view_mode',
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<Category[]>(mockCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [toppings] = useState<Topping[]>(mockToppings);
  const [toppingGroups] = useState<ToppingGroup[]>(mockToppingGroups);

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : mockOrders;
  });

  // Load language from localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved as Language) || 'en';
  });

  // Load view mode from localStorage
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as ViewMode) || 'customer';
  });

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Persist language to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: number, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => 
      prev.map(existing => existing.id === item.id ? item : existing)
    );
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const getMenuItemsByCategory = (categoryId: number) => {
    return menuItems.filter(item => item.categoryId === categoryId && item.isAvailable);
  };

  const getToppingGroupsForItem = (menuItemId: number) => {
    const item = menuItems.find(i => i.id === menuItemId);
    if (!item) return [];

    // Pizza items get pizza topping groups
    if (item.categoryId === 1) {
      return toppingGroups.filter(g => g.id <= 2);
    }

    // Kebab items get kebab extras
    if (item.categoryId === 2) {
      return toppingGroups.filter(g => g.id === 3 || g.id === 4);
    }

    // Burger items get burger extras
    if (item.categoryId === 3) {
      return toppingGroups.filter(g => g.id === 4);
    }

    // Drinks get size selection
    if (item.categoryId === 4) {
      return toppingGroups.filter(g => g.id === 5);
    }

    return [];
  };

  const value: DataContextType = {
    categories,
    menuItems,
    toppings,
    toppingGroups,
    orders,
    language,
    viewMode,
    setLanguage,
    setViewMode,
    addOrder,
    updateOrderStatus,
    getMenuItemsByCategory,
    getToppingGroupsForItem,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
