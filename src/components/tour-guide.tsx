import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ShoppingCart, 
  Smartphone, 
  Settings, 
  Palette,
  Tag,
  BarChart3,
  Check
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: any;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
  action?: () => void;
}

interface TourGuideProps {
  language: string;
  onComplete: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Tervetuloa PlateOS-demoon! 🎉",
    titleEn: "Welcome to PlateOS Demo! 🎉",
    description: "Tämä on interaktiivinen demo, joka näyttää kaikki Babylon-ravintolajärjestelmän ominaisuudet. Katsotaan, mitä voit tehdä!",
    descriptionEn: "This is an interactive demo showcasing all features of the Babylon restaurant system. Let's see what you can do!",
    icon: Sparkles,
  },
  {
    id: "browse-menu",
    title: "Selaa menuamme",
    titleEn: "Browse Our Menu",
    description: "Klikkaa mitä tahansa ruoka-annosta nähdäksesi yksityiskohdat, lisätäksesi toppings ja valitaksesi koon. Kokeile!",
    descriptionEn: "Click any food item to see details, add toppings, and select sizes. Try it!",
    icon: ShoppingCart,
    target: "menu-items",
  },
  {
    id: "add-to-cart",
    title: "Lisää ostoskoriin",
    titleEn: "Add to Cart",
    description: "Kun olet valinnut annoksen, voit lisätä sen ostoskoriin. Ostoskori näkyy yläoikealla.",
    descriptionEn: "Once you've selected an item, add it to your cart. The cart is visible in the top right.",
    icon: ShoppingCart,
    target: "cart-button",
  },
  {
    id: "mobile-admin",
    title: "Mobiilin hallintapaneeli",
    titleEn: "Mobile Admin Panel",
    description: "Klikkaa punaista 'Admin' -painiketta oikeassa alakulmassa nähdäksesi koko hallintapaneelin!",
    descriptionEn: "Click the red 'Admin' button in the bottom right to see the full admin panel!",
    icon: Smartphone,
    target: "mobile-admin",
  },
  {
    id: "manage-orders",
    title: "Hallinnoi tilauksia",
    titleEn: "Manage Orders",
    description: "Hallintapaneelissa voit nähdä kaikki tilaukset, hyväksyä ne ja seurata niiden tilaa. Kokeile muuttaa tilauksen tilaa!",
    descriptionEn: "In the admin panel, you can see all orders, accept them, and track their status. Try changing an order's status!",
    icon: BarChart3,
    target: "orders-tab",
  },
  {
    id: "edit-menu",
    title: "Muokkaa menuasi",
    titleEn: "Edit Your Menu",
    description: "Mene 'Menu' -välilehteen ja klikkaa 'Muokkaa' muokataksesi annoksia tai 'Lisää uusi' luodaksesi uuden annoksen.",
    descriptionEn: "Go to the 'Menu' tab and click 'Edit' to modify items or 'Add New' to create a new item.",
    icon: Settings,
    target: "menu-tab",
  },
  {
    id: "create-promotion",
    title: "Luo kampanjoita",
    titleEn: "Create Promotions",
    description: "Promotions-välilehdessä voit luoda alennuksia ja tarjouksia asiakkaillesi. Kokeile luoda uusi tarjous!",
    descriptionEn: "In the Promotions tab, you can create discounts and offers for your customers. Try creating a new offer!",
    icon: Tag,
    target: "promotions-tab",
  },
  {
    id: "customize-theme",
    title: "Mukauta teemaa",
    titleEn: "Customize Theme",
    description: "Settings-välilehdessä voit vaihtaa värejä, fontteja ja asettelua. Tee ravintolastasi ainutlaatuinen!",
    descriptionEn: "In the Settings tab, you can change colors, fonts, and layout. Make your restaurant unique!",
    icon: Palette,
    target: "settings-tab",
  },
  {
    id: "complete",
    title: "Valmista! 🎉",
    titleEn: "All Done! 🎉",
    description: "Olet nyt nähnyt kaikki PlateOS:n keskeiset ominaisuudet. Kokeile vapaasti kaikkia toimintoja!",
    descriptionEn: "You've now seen all key features of PlateOS. Feel free to explore all functions!",
    icon: Check,
  },
];

export function TourGuide({ language, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const t = (fi: string, en: string) => language === "fi" ? fi : en;

  useEffect(() => {
    // Check if user has completed tour before
    const hasCompletedTour = localStorage.getItem("plateos-tour-completed");
    if (hasCompletedTour) {
      setIsVisible(false);
    }
  }, []);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (step.action) {
        step.action();
      }
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem("plateos-tour-completed", "true");
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("plateos-tour-completed", "true");
    onComplete();
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (!isVisible) return null;

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-black mb-4 gradient-text">
              {t("Tervetuloa PlateOS-demoon!", "Welcome to PlateOS Demo!")}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {t(
                "Haluatko lyhyen kierroksen, joka näyttää kaikki järjestelmän ominaisuudet?",
                "Would you like a quick tour showing all system features?"
              )}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-semibold">{t("Tilausjärjestelmä", "Order System")}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-semibold">{t("Menu-hallinta", "Menu Management")}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Tag className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm font-semibold">{t("Kampanjat", "Promotions")}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Palette className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">{t("Teeman muokkaus", "Theme Customization")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={handleStart}
                className="gradient-primary text-white text-lg px-8 py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t("Aloita kierros", "Start Tour")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkip}
                className="text-lg px-8 py-6"
              >
                {t("Ohita, tutkin itse", "Skip, I'll explore myself")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] pointer-events-none">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-[101] pointer-events-auto">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tour Card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[101] pointer-events-auto animate-slide-up">
        <Card className="bg-white dark:bg-gray-900 border-2 border-red-500 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Badge className="mb-2 bg-red-600 text-white">
                    {t("Vaihe", "Step")} {currentStep + 1} / {tourSteps.length}
                  </Badge>
                  <h3 className="text-xl font-bold">
                    {language === "fi" ? step.title : step.titleEn}
                  </h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {language === "fi" ? step.description : step.descriptionEn}
            </p>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t("Edellinen", "Previous")}
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  {t("Ohita kierros", "Skip Tour")}
                </Button>
                <Button
                  onClick={handleNext}
                  className="gradient-primary text-white px-6"
                >
                  {currentStep === tourSteps.length - 1 
                    ? t("Valmis!", "Finish!") 
                    : t("Seuraava", "Next")}
                  {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                  {currentStep === tourSteps.length - 1 && <Check className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spotlight effect on target element */}
      {step.target && (
        <div 
          className="fixed inset-0 pointer-events-none z-[99]"
          style={{
            background: 'radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), transparent 150px, rgba(0,0,0,0.5) 300px)'
          }}
        />
      )}
    </div>
  );
}
