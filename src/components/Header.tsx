import { ShoppingCart, User, Globe, Store } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';


export function Header() {
  const { language, viewMode, setLanguage, setViewMode } = useData();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fi' : 'en');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'customer' ? 'admin' : 'customer');
  };

  return (
    <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Store className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">PlateOS</h1>
              <p className="text-xs text-red-100">
                {language === 'en' ? 'Restaurant Demo' : 'Ravintola Demo'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={toggleViewMode}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
              aria-label="Toggle view mode"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">
                {viewMode === 'customer'
                  ? (language === 'en' ? 'Customer' : 'Asiakas')
                  : (language === 'en' ? 'Admin' : 'Ylläpitäjä')}
              </span>
            </button>

            {/* Cart (only in customer view) */}
            {viewMode === 'customer' && (
              <a
                href="#cart"
                className="relative flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
