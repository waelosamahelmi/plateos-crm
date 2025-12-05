import { useLanguage, languageNames, languageFlags, type Language } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

const languages: Language[] = ['fi', 'en', 'ar', 'tr', 'sv'];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'icon-only';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, languageFlag, languageName } = useLanguage();

  if (variant === 'icon-only') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-9 w-9 ${className}`}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex items-center gap-3 cursor-pointer ${language === lang ? 'bg-accent' : ''}`}
            >
              <span className="text-lg">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={`h-8 px-2 gap-1 ${className}`}
          >
            <span className="text-base">{languageFlag}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex items-center gap-2 cursor-pointer ${language === lang ? 'bg-accent' : ''}`}
            >
              <span>{languageFlags[lang]}</span>
              <span className="text-sm">{languageNames[lang]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`h-9 px-3 gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 ${className}`}
        >
          <span className="text-base">{languageFlag}</span>
          <span className="hidden sm:inline text-sm">{languageName}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] bg-zinc-900 border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`flex items-center gap-3 cursor-pointer text-white hover:bg-white/10 ${language === lang ? 'bg-white/5' : ''}`}
          >
            <span className="text-lg">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile-friendly language selector (for mobile nav)
export function LanguageSwitcherMobile({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            language === lang 
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <span>{languageFlags[lang]}</span>
          <span className="text-sm">{languageNames[lang]}</span>
        </button>
      ))}
    </div>
  );
}
