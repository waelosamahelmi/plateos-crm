import { useData } from "@/context/DataContext";
import { UtensilsCrossed, Phone, Mail, MapPin, Heart, Facebook, Instagram } from "lucide-react";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function Footer() {
  const { language } = useData();

  const t = (fi: string, en: string, ar?: string) => {
    if (language === "fi") return fi;
    if (language === "en") return en;
    if (language === "ar" && ar) return ar;
    return fi;
  };

  // Mock restaurant config
  const config = {
    name: "PlateOS Demo",
    phone: "+358 40 123 4567",
    email: "info@plateos.demo",
    address: {
      street: "Demo Street 123",
      postalCode: "00100",
      city: "Helsinki"
    },
    about: {
      story: "A modern restaurant ordering system built with React and TypeScript.",
      storyEn: "A modern restaurant ordering system built with React and TypeScript."
    },
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com"
  };

  return (
    <footer className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{config.name}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t(config.about.story, config.about.storyEn)}
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-all hover:scale-110 group shadow-lg"
                >
                  <Facebook className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              )}
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-all hover:scale-110 group shadow-lg"
                >
                  <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              )}
              {config.tiktok && (
                <a
                  href={config.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-all hover:scale-110 group shadow-lg"
                  title="TikTok"
                >
                  <TikTokIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {t("Pikanavigaatio", "Quick Links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/demo" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <div className="w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></div>
                  {t("Etusivu", "Home")}
                </a>
              </li>
              <li>
                <a href="/demo/menu" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <div className="w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></div>
                  Menu
                </a>
              </li>
              <li>
                <a href="/demo/admin" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <div className="w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></div>
                  {t("Hallinta", "Admin")}
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {t("Tietoa", "Information")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/demo/terms" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <div className="w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></div>
                  {t("Käyttöehdot", "Terms & Conditions")}
                </a>
              </li>
              <li>
                <a href="/demo/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <div className="w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></div>
                  {t("Tietosuoja", "Privacy Policy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {t("Yhteystiedot", "Contact Info")}
            </h3>
            <div className="space-y-4">
              <a
                href={`tel:${config.phone}`}
                className="flex items-start space-x-3 text-gray-400 hover:text-white transition-all group"
              >
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 transition-all group-hover:scale-110 shadow-lg">
                  <Phone className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="pt-1">{config.phone}</span>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="flex items-start space-x-3 text-gray-400 hover:text-white transition-all group"
              >
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 transition-all group-hover:scale-110 shadow-lg">
                  <Mail className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                </div>
                <span className="pt-1 break-all">{config.email}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.address.street}, ${config.address.postalCode} ${config.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 text-gray-400 hover:text-white transition-all group"
              >
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 transition-all group-hover:scale-110 shadow-lg">
                  <MapPin className="w-5 h-5 flex-shrink-0 group-hover:bounce transition-transform" />
                </div>
                <span className="pt-1">{config.address.street}, {config.address.postalCode} {config.address.city}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {config.name}. {t("Kaikki oikeudet pidätetään.", "All rights reserved.")}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{t("Tehty", "Made with")}</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{t("Suomessa", "in Finland")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
