import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, Sparkles, Tag, Percent, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export function HeroVideoWithPromotions() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock promotions for demo
  const promotions = [
    {
      title: "Kesätarjous",
      titleEn: "Summer Special",
      description: "Kaikki pizzat -20% alennuksella!",
      descriptionEn: "All pizzas 20% off!",
      discountType: "percentage",
      discountValue: 20
    },
    {
      title: "Lounas Menu",
      titleEn: "Lunch Menu",
      description: "Lounasmenu vain 10,90€",
      descriptionEn: "Lunch menu only €10.90",
      discountType: "fixed",
      discountValue: 10.90
    }
  ];

  // Rotate between restaurant info and promotions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (promotions.length + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isPromotion = currentSlide > 0;
  const currentPromotion = isPromotion ? promotions[currentSlide - 1] : null;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          poster="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop"
        >
          <source
            src="https://cdn.pixabay.com/video/2022/01/18/104505-667011166_large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Animated Container with fade transitions */}
        <div className="animate-fade-in" key={currentSlide}>
          {!isPromotion ? (
            /* Restaurant Info */
            <>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-md rounded-full mb-8 shadow-2xl animate-slide-down border border-white/20">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">
                  {t("Tervetuloa", "Welcome")}
                </span>
              </div>

              {/* Main Heading with Shadow */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent animate-gradient">
                  PlateOS Demo
                </span>
              </h1>

              {/* Tagline */}
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-red-500 to-orange-500 opacity-30"></div>
                <p className="relative text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-200 to-red-200 bg-clip-text text-transparent">
                  {t("Modernin ravintolajärjestelmän demo", "Modern Restaurant System Demo")}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
                {t(
                  "Koe Babylonin voima - täydellinen ratkaisu ravintolallesi. Tilausten hallinta, menu-muokkaus, teemamuokkaus ja paljon muuta.",
                  "Experience the power of Babylon - the complete solution for your restaurant. Order management, menu editing, theme customization and much more."
                )}
              </p>
            </>
          ) : (
            /* Promotion Display */
            currentPromotion && (
              <>
                {/* Promotion Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-md rounded-full mb-8 shadow-2xl animate-slide-down border border-white/20">
                  <Tag className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">
                    {t("Erikoistarjous", "Special Offer")}
                  </span>
                </div>

                {/* Promotion Name */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
                  <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                    {t(currentPromotion.title, currentPromotion.titleEn)}
                  </span>
                </h1>

                {/* Discount Badge */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-40"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-3xl shadow-2xl border-4 border-white/30">
                    <div className="flex items-center gap-3">
                      <Percent className="w-10 h-10 font-black" />
                      <span className="text-5xl md:text-6xl font-black">
                        {currentPromotion.discountType === 'percentage'
                          ? `${currentPromotion.discountValue}%`
                          : `${currentPromotion.discountValue}€`
                        }
                      </span>
                      <span className="text-2xl font-bold uppercase">
                        {t("ALE", "OFF")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promotion Description */}
                <p className="text-xl md:text-2xl mb-10 text-yellow-100 max-w-3xl mx-auto leading-relaxed font-medium">
                  {t(currentPromotion.description, currentPromotion.descriptionEn)}
                </p>
              </>
            )
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo/menu">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-md group"
              >
                <ShoppingCart className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                {t("Tilaa nyt", "Order Now")}
              </Button>
            </Link>
            <a href={`tel:${config?.phone || '+358123456789'}`}>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Phone className="mr-2 h-6 w-6" />
                {t("Soita meille", "Call Us")}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-10 h-10 text-white/80" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'w-8 bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
