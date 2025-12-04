import { useState } from 'react';
import type { MenuItem } from '../types/index.js';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { MenuCard } from './MenuCard';
import { CustomizationModal } from './CustomizationModal';
import { CartView } from './CartView';

export function CustomerView() {
  const { categories, language, getMenuItemsByCategory, getToppingGroupsForItem } = useData();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);

  const menuItems = getMenuItemsByCategory(selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    const toppingGroups = getToppingGroupsForItem(item.id);
    if (toppingGroups.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item, [], '');
    }
  };

  const handleCustomizationConfirm = (toppings: any[], instructions: string) => {
    if (customizingItem) {
      addToCart(customizingItem, toppings, instructions);
      setCustomizingItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Welcome to PlateOS' : 'Tervetuloa PlateOS:iin'}
          </h1>
          <p className="text-lg text-red-100">
            {language === 'en'
              ? 'Order delicious food from our menu'
              : 'Tilaa herkullista ruokaa valikoimastamme'}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {categories.map(category => {
              const name = language === 'en' ? category.nameEn : category.name;
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'en'
                ? 'No items available in this category'
                : 'Tässä kategoriassa ei ole tuotteita'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-red-700 transition flex items-center space-x-2 z-40"
      >
        <span className="font-bold">
          {language === 'en' ? 'View Cart' : 'Näytä ostoskori'}
        </span>
      </button>

      {/* Modals */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          toppingGroups={getToppingGroupsForItem(customizingItem.id)}
          onClose={() => setCustomizingItem(null)}
          onConfirm={handleCustomizationConfirm}
        />
      )}

      {showCart && <CartView onClose={() => setShowCart(false)} />}
    </div>
  );
}
