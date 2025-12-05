import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <p className="text-sm font-medium truncate">
            <span className="hidden sm:inline">Tämä on PlateOS-demo. </span>
            <span className="font-bold">Haluatko oman ravintolajärjestelmän?</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/">
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-white/90 font-bold text-xs sm:text-sm h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Tilaa PlateOS</span>
              <span className="sm:hidden">Tilaa</span>
            </Button>
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Sulje"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoFloatingCTA() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 z-[90] animate-in slide-in-from-left duration-500">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-2xl p-4 max-w-xs border border-white/20">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 p-1 bg-black/80 rounded-full hover:bg-black transition-colors"
          aria-label="Sulje"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        
        <div className="text-white">
          <p className="font-bold text-lg mb-1">Pidätkö näkemästäsi? 🚀</p>
          <p className="text-sm text-white/80 mb-3">
            Hanki PlateOS omalle ravintolallesi ja kasvata myyntiäsi!
          </p>
          <Link href="/">
            <Button 
              className="w-full bg-white text-orange-600 hover:bg-white/90 font-bold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Tilaa nyt - 1500€
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
