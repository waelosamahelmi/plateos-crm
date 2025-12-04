import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem, Topping, ToppingGroup } from '../types/index.js';
import { useData } from '../context/DataContext';

interface CustomizationModalProps {
  item: MenuItem;
  toppingGroups: ToppingGroup[];
  onClose: () => void;
  onConfirm: (toppings: Topping[], instructions: string) => void;
}

export function CustomizationModal({
  item,
  toppingGroups,
  onClose,
  onConfirm,
}: CustomizationModalProps) {
  const { language } = useData();
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const name = language === 'en' ? item.nameEn : item.name;

  const toggleTopping = (topping: Topping, group: ToppingGroup) => {
    const isSelected = selectedToppings.some(t => t.id === topping.id);

    if (isSelected) {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    } else {
      // Check max selections
      const currentGroupSelections = selectedToppings.filter(t =>
        group.toppings.some(gt => gt.id === t.id)
      );

      if (currentGroupSelections.length >= group.maxSelections) {
        // Remove the first selection in this group
        const toRemove = currentGroupSelections[0];
        setSelectedToppings(prev =>
          prev.filter(t => t.id !== toRemove.id).concat(topping)
        );
      } else {
        setSelectedToppings(prev => [...prev, topping]);
      }
    }
  };

  const calculateTotal = () => {
    let total = item.offerPrice || item.price;

    if (item.hasConditionalPricing && item.includedToppingsCount > 0) {
      const extraToppings = selectedToppings.filter(t => t.type === 'topping');
      const extraPrice = extraToppings
        .slice(item.includedToppingsCount)
        .reduce((sum, t) => sum + t.price, 0);
      total += extraPrice;
    }

    const otherToppings = selectedToppings.filter(
      t => t.type !== 'topping' || !item.hasConditionalPricing
    );
    total += otherToppings.reduce((sum, t) => sum + t.price, 0);

    return total;
  };

  const handleConfirm = () => {
    // Validate required groups
    for (const group of toppingGroups) {
      if (group.isRequired) {
        const selections = selectedToppings.filter(t =>
          group.toppings.some(gt => gt.id === t.id)
        );
        if (selections.length < group.minSelections) {
          alert(
            language === 'en'
              ? `Please select at least ${group.minSelections} option(s) from ${group.nameEn}`
              : `Valitse vähintään ${group.minSelections} vaihtoehtoa kohteesta ${group.name}`
          );
          return;
        }
      }
    }

    onConfirm(selectedToppings, specialInstructions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Customize' : 'Mukauta'}: {name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {toppingGroups.map(group => {
            const groupName = language === 'en' ? group.nameEn : group.name;

            return (
              <div key={group.id} className="border rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                    <span>{groupName}</span>
                    {group.isRequired && (
                      <span className="text-red-600 text-sm">*</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'en'
                      ? `Select ${group.minSelections === group.maxSelections
                          ? group.maxSelections
                          : `${group.minSelections}-${group.maxSelections}`
                        }`
                      : `Valitse ${group.minSelections === group.maxSelections
                          ? group.maxSelections
                          : `${group.minSelections}-${group.maxSelections}`
                        }`}
                  </p>
                </div>

                <div className="space-y-2">
                  {group.toppings.map(topping => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    const toppingName = language === 'en' ? topping.nameEn : topping.name;

                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping, group)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                          isSelected
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-gray-800">{toppingName}</span>
                        <div className="flex items-center space-x-2">
                          {topping.price > 0 && (
                            <span className="text-sm text-gray-600">
                              +€{topping.price.toFixed(2)}
                            </span>
                          )}
                          {isSelected ? (
                            <Minus className="w-5 h-5 text-red-600" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Special Instructions' : 'Erityisohjeet'}
            </label>
            <textarea
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder={
                language === 'en'
                  ? 'Any special requests?'
                  : 'Onko erityistoiveita?'
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Total:' : 'Yhteensä:'} €{calculateTotal().toFixed(2)}
          </div>
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
          >
            {language === 'en' ? 'Add to Cart' : 'Lisää ostoskoriin'}
          </button>
        </div>
      </div>
    </div>
  );
}
