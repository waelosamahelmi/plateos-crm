import { useState } from "react";
import { useData } from "@/context/DataContext";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/Footer";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { CartModal } from "@/components/cart-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Leaf, Heart, Wheat, UtensilsCrossed, ChefHat } from "lucide-react";
import type { MenuItem } from "../types/index.js";

export function MenuPage() {
  const { language, categories, menuItems, getMenuItemsByCategory } = useData();
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const t = (fi: string, en: string, ar?: string) => {
    if (language === "fi") return fi;
    if (language === "en") return en;
    if (language === "ar" && ar) return ar;
    return fi;
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
    const matchesSearch = searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  const handleCheckoutOpen = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const handleCheckoutClose = () => setIsCheckoutOpen(false);
  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
      <UniversalHeader onCartClick={handleCartOpen} />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
                {t("Tuoretta ja maukasta", "Fresh & Delicious", "طازج ولذيذ")}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
                {t("Ruokalista", "Our Menu", "قائمتنا")}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {t("Löydä suosikkisi", "Find your favorite", "ابحث عن المفضلة لديك")} {filteredItems.length}+ {t("tuotteen valikoimasta", "products", "منتجات")}
              </p>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-full"></div>
              <div className="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-2">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("Etsi ruokia...", "Search menu items...", "ابحث عن الأطباق...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-16 pr-6 py-7 text-lg border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Categories */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-4 space-y-6">
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-6 animate-slide-up">
                <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
                  {t("Kategoriat", "Categories", "الفئات")}
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-between group ${
                      selectedCategory === "all"
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 dark:bg-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-600'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <UtensilsCrossed className="w-5 h-5" />
                      {t("Kaikki tuotteet", "All Items", "جميع المنتجات")}
                    </span>
                    <span className={`text-sm font-black px-3 py-1 rounded-full ${
                      selectedCategory === "all"
                        ? 'bg-white/20'
                        : 'bg-gray-200 dark:bg-stone-600'
                    }`}>
                      {menuItems.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const categoryItems = getMenuItemsByCategory(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-between group ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-50 dark:bg-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-600'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <UtensilsCrossed className="w-5 h-5" />
                          {language === "fi" ? cat.name : cat.nameEn}
                        </span>
                        <span className={`text-sm font-black px-3 py-1 rounded-full ${
                          selectedCategory === cat.id
                            ? 'bg-white/20'
                            : 'bg-gray-200 dark:bg-stone-600'
                        }`}>
                          {categoryItems.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white animate-scale-in">
                <div className="text-5xl font-black mb-2">{filteredItems.length}</div>
                <div className="text-white/90 font-bold">{t("tuotetta löytyi", "items found", "عناصر موجودة")}</div>
              </div>
            </div>
          </aside>

          {/* Menu Items Grid */}
          <div className="flex-1">
            {/* Mobile Categories */}
            <div className="lg:hidden mb-6">
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-4">
                <h2 className="text-lg font-black mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
                  {t("Kategoriat", "Categories", "الفئات")}
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === "all"
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-stone-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    {t("Kaikki", "All", "الكل")}
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                          : 'bg-gray-50 dark:bg-stone-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {language === "fi" ? cat.name : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-20 animate-fade-in bg-white dark:bg-stone-800 rounded-2xl shadow-xl">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-stone-700 dark:to-stone-600 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  {t("Ei tuloksia", "No results found", "لم يتم العثور على نتائج")}
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  {t("Kokeile toista hakusanaa", "Try a different search term", "حاول مصطلح بحث مختلف")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-0 bg-white dark:bg-stone-800 hover:shadow-2xl transition-all duration-500 animate-scale-in cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      {item.isVegetarian && (
                        <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                          <Leaf className="w-4 h-4" />
                        </div>
                      )}
                      {item.isVegan && (
                        <div className="bg-green-600 text-white rounded-full p-2 shadow-lg">
                          <Heart className="w-4 h-4" />
                        </div>
                      )}
                      {item.isGlutenFree && (
                        <div className="bg-amber-500 text-white rounded-full p-2 shadow-lg">
                          <Wheat className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {item.offerPercentage && (
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-xl animate-pulse">
                        -{item.offerPercentage}% OFF
                      </div>
                    )}

                    <div className="aspect-[16/11] relative overflow-hidden bg-gray-100 dark:bg-stone-700">
                      <img
                        src={item.imageUrl || "/placeholder-food.jpg"}
                        alt={language === "fi" ? item.name : item.nameEn}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                          {language === "fi" ? item.name : item.nameEn}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {language === "fi" ? item.description : item.descriptionEn}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-stone-700">
                        <div>
                          {item.offerPrice ? (
                            <div>
                              <div className="text-3xl font-black text-red-600 mb-1">
                                {formatPrice(item.offerPrice)}
                              </div>
                              <div className="text-sm text-gray-400 line-through">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                              {formatPrice(item.price)}
                            </div>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all">
                          <ChefHat className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckoutOpen}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        onBack={handleBackToCart}
      />
    </div>
  );
}
