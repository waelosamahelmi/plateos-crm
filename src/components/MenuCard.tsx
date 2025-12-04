import type { MenuItem } from '../types/index.js';
import { useData } from '../context/DataContext';
import { Plus, Leaf, Wheat } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { language } = useData();
  const name = language === 'en' ? item.nameEn : item.name;
  const description = language === 'en' ? item.descriptionEn : item.description;

  const displayPrice = item.offerPrice || item.price;
  const hasOffer = !!item.offerPrice;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={name}
          className="w-full h-full object-cover"
        />
        {hasOffer && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{item.offerPercentage}%
          </div>
        )}

        {/* Dietary badges */}
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {item.isVegan && (
            <div className="bg-green-500 text-white p-1 rounded-full" title="Vegan">
              <Leaf className="w-4 h-4" />
            </div>
          )}
          {item.isVegetarian && !item.isVegan && (
            <div className="bg-green-400 text-white p-1 rounded-full" title="Vegetarian">
              <Leaf className="w-4 h-4" />
            </div>
          )}
          {item.isGlutenFree && (
            <div className="bg-orange-500 text-white p-1 rounded-full" title="Gluten Free">
              <Wheat className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasOffer && (
              <span className="text-sm text-gray-400 line-through">
                €{item.price.toFixed(2)}
              </span>
            )}
            <span className={`text-xl font-bold ${hasOffer ? 'text-red-600' : 'text-gray-800'}`}>
              €{displayPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(item)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'en' ? 'Add' : 'Lisää'}
            </span>
          </button>
        </div>

        {item.hasConditionalPricing && (
          <p className="text-xs text-gray-500 mt-2">
            {language === 'en'
              ? `${item.includedToppingsCount} toppings included`
              : `${item.includedToppingsCount} täytettä hintaan sisältyy`}
          </p>
        )}
      </div>
    </div>
  );
}
