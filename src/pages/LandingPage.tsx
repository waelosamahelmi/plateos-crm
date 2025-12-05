import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Check,
  ArrowRight,
  Smartphone,
  Globe,
  BarChart3,
  Settings,
  Shield,
  Star,
  Quote,
  MessageCircle,
  ChevronRight,
  Play,
  ShoppingCart,
  CreditCard,
  Package,
  Bell
} from "lucide-react";
import { AISalesChat } from "../components/ai-sales-chat";

export default function LandingPage() {
  const [showChat, setShowChat] = useState(false);

  const features = [
    {
      icon: Globe,
      title: "Modernin Nettisivusto",
      titleEn: "Modern Website",
      description: "Responsiivinen verkkosivu joka toimii kaikilla laitteilla",
      descriptionEn: "Responsive website that works on all devices"
    },
    {
      icon: Smartphone,
      title: "Mobiilisovellus",
      titleEn: "Mobile App",
      description: "Android-sovellus suoraan asiakkaillesi",
      descriptionEn: "Android app directly for your customers"
    },
    {
      icon: ShoppingCart,
      title: "Verkkokauppa",
      titleEn: "Online Ordering",
      description: "Asiakkaat voivat tilata suoraan verkossa",
      descriptionEn: "Customers can order directly online"
    },
    {
      icon: CreditCard,
      title: "Maksun käsittely",
      titleEn: "Payment Processing",
      description: "Stripe-integraatio turvallisiin maksuihin",
      descriptionEn: "Stripe integration for secure payments"
    },
    {
      icon: BarChart3,
      title: "Admin Hallintapaneeli",
      titleEn: "Admin Dashboard",
      description: "Täydellinen hallinta tilauksista ja menuista",
      descriptionEn: "Complete control over orders and menus"
    },
    {
      icon: Settings,
      title: "Helppo muokkaus",
      titleEn: "Easy Editing",
      description: "Muokkaa menuasi ja hintojasi vaivattomasti",
      descriptionEn: "Edit your menu and prices effortlessly"
    },
    {
      icon: Bell,
      title: "Reaaliaikaiset ilmoitukset",
      titleEn: "Real-time Notifications",
      description: "Saat välittömästi tiedon uusista tilauksista",
      descriptionEn: "Get instant notifications of new orders"
    },
    {
      icon: Package,
      title: "Varaston hallinta",
      titleEn: "Inventory Management",
      description: "Hallitse tuotteita ja saatavuutta",
      descriptionEn: "Manage products and availability"
    },
    {
      icon: Shield,
      title: "Turvallinen & Luotettava",
      titleEn: "Secure & Reliable",
      description: "Suojattu data ja varmuuskopiot",
      descriptionEn: "Protected data and backups"
    }
  ];

  const testimonials = [
    {
      name: "Maria Korhonen",
      business: "Pizza Place Lahti",
      quote: "PlateOS muutti liiketoimintamme. Tilaukset lisääntyivät 40% ensimmäisen kuukauden aikana!",
      quoteEn: "PlateOS transformed our business. Orders increased 40% in the first month!",
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      business: "Kebab King Tampere",
      quote: "Helppokäyttöinen järjestelmä. Asiakkaat rakastavat mobiilisovellusta.",
      quoteEn: "Easy to use system. Customers love the mobile app.",
      rating: 5
    },
    {
      name: "Jukka Virtanen",
      business: "Burger House Turku",
      quote: "Paras investointi ravintolallemme. Suosittelen lämpimästi!",
      quoteEn: "Best investment for our restaurant. Highly recommend!",
      rating: 5
    }
  ];

  const pricingFeatures = [
    "Modernin verkkosivusto / Modern website",
    "Android mobiilisovellus / Android mobile app",
    "Admin hallintapaneeli / Admin dashboard",
    "Verkkokauppa-toiminnot / E-commerce features",
    "Stripe maksuintegraatio / Stripe payment integration",
    "Ilmainen hosting 1 vuosi / Free hosting for 1 year",
    "Tuki ja päivitykset / Support & updates",
    "Menu- ja hintojen hallinta / Menu & price management",
    "Tilausten hallinta / Order management",
    "Reaaliaikaiset ilmoitukset / Real-time notifications"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                PlateOS
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
                Ominaisuudet
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
                Hinta
              </a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
                Arvostelut
              </a>
              <Link href="/demo">
                <Button variant="outline" className="font-semibold">
                  <Play className="w-4 h-4 mr-2" />
                  Kokeile Demoa
                </Button>
              </Link>
              <Button className="gradient-primary text-white font-semibold" onClick={() => setShowChat(true)}>
                Aloita nyt
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-5 pattern-dots"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 text-sm font-bold">
              🚀 Modernin ravintolajärjestelmä
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
              Vie ravintolasi
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                digiaikaan
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Täydellinen ratkaisu ravintolallesi: Verkkosivu, mobiilisovellus ja hallintapaneeli.
              Vain <span className="font-bold text-red-600">1500€</span> kertamaksu!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-10 py-7 text-lg font-bold gradient-primary text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Keskustele myyjän kanssa
              </Button>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-bold">
                  <Play className="w-5 h-5 mr-2" />
                  Katso demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/Video Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
              <Link href="/demo">
                <div className="relative group cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=675&fit=crop" 
                    alt="PlateOS Dashboard"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-6">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-4 py-2">
              Ominaisuudet
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
              Kaikki mitä tarvitset
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Täydellinen järjestelmä modernille ravintolalle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:shadow-xl group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2">
              Hinta
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
              Yksinkertainen hinnoittelu
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ei kuukausimaksuja ensimmäisenä vuonna!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-4 border-red-500 dark:border-red-600 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-red-600 to-orange-600 text-white px-6 py-2 text-sm font-bold transform rotate-12 translate-x-8 translate-y-4">
                SUOSITUIN
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-3xl font-black mb-4 text-gray-900 dark:text-white">
                  PlateOS Complete
                </CardTitle>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    1500€
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-400">kertamaksu</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  + <span className="font-bold">Ilmainen hosting 1 vuosi</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Sen jälkeen vain 10€/kk
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-12">
                <div className="space-y-4 mb-8">
                  {pricingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full py-7 text-lg font-bold gradient-primary text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Aloita tilaus nyt
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-4">
                  ✓ 30 päivän rahat takaisin -takuu
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-4 py-2">
              Asiakkaiden kokemuksia
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
              Mitä asiakkaamme sanovat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-red-200 dark:text-red-900 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.business}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Valmis aloittamaan?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Ota yhteyttä myyjäämme ja saat järjestelmän käyttöön 7 päivässä!
          </p>
          <Button 
            size="lg" 
            className="px-12 py-7 text-lg font-bold bg-white text-red-600 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => setShowChat(true)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Keskustele myyjän kanssa
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black">PlateOS</span>
          </div>
          <p className="text-gray-400 mb-6">
            Modernin ravintolajärjestelmä jokaiselle ravintolalle
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Ominaisuudet</a>
            <a href="#pricing" className="hover:text-white transition-colors">Hinta</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Arvostelut</a>
            <Link href="/demo">
              <span className="hover:text-white transition-colors cursor-pointer">Demo</span>
            </Link>
          </div>
          <p className="text-gray-500 mt-8 text-sm">
            © 2025 PlateOS. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Sales Chat */}
      {showChat && <AISalesChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
