import { createContext, useContext, useState, useEffect } from "react";
import { type Language, getTranslation, isRTL, languageNames, languageFlags, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrFinnish: string, englishText?: string) => string;
  isRTL: boolean;
  languageName: string;
  languageFlag: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get browser language and map to supported languages
function getBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: Language[] = ['fi', 'en', 'ar', 'tr', 'sv'];
  
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  // Default to Finnish for Finland, Swedish for Sweden, etc.
  const fullLang = navigator.language.toLowerCase();
  if (fullLang.includes('fi')) return 'fi';
  if (fullLang.includes('se') || fullLang.includes('sv')) return 'sv';
  if (fullLang.includes('tr')) return 'tr';
  if (fullLang.includes('ar')) return 'ar';
  
  return 'fi'; // Default to Finnish
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fi');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check URL for language parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    
    // Then check localStorage
    const savedLanguage = localStorage.getItem("plateos-language") as Language;
    
    // Then check browser language
    const browserLang = getBrowserLanguage();
    
    const validLanguages: Language[] = ['fi', 'en', 'ar', 'tr', 'sv'];
    
    if (urlLang && validLanguages.includes(urlLang)) {
      setLanguageState(urlLang);
      localStorage.setItem("plateos-language", urlLang);
    } else if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      setLanguageState(browserLang);
    }
    
    setIsInitialized(true);
  }, []);

  // Update document attributes when language changes
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
      
      // Update URL without reload for SEO
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }, [language, isInitialized]);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("plateos-language", lang);
  };

  const t = (keyOrFinnish: string, englishText?: string): string => {
    // If englishText is provided, use the old two-argument format (for demo components)
    if (englishText !== undefined) {
      // Legacy mode: t(finnishText, englishText)
      return language === 'en' ? englishText : keyOrFinnish;
    }
    
    // New translation key mode: t('key')
    // First check if it's a translation key
    if (translations[keyOrFinnish]) {
      return getTranslation(keyOrFinnish, language);
    }
    
    // Fallback: return the text as-is (for dynamic content)
    return keyOrFinnish;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        t,
        isRTL: isRTL(language),
        languageName: languageNames[language],
        languageFlag: languageFlags[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Re-export types for convenience
export type { Language };
export { languageNames, languageFlags, isRTL };
