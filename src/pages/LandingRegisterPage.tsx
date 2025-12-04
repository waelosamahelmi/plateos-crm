import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  CheckCircle, 
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Utensils,
  FileText,
  Palette,
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { submitRegistration } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4;

export default function LandingRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // Step 1 - Restaurant Info
    restaurant_name: '',
    restaurant_type: '',
    website: '',
    
    // Step 2 - Contact Info
    contact_name: '',
    email: '',
    phone: '',
    
    // Step 3 - Location & Services
    address: '',
    city: '',
    postal_code: '',
    has_delivery: false,
    has_pickup: false,
    has_dine_in: false,
    opening_hours: '',
    
    // Step 4 - Menu & Preferences
    menu_description: '',
    menu_items_count: '',
    current_system: '',
    preferred_colors: '',
    special_requirements: '',
    timeline: '',
    source: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".animate-in",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep((step + 1) as Step);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitRegistration({
        restaurant_name: formData.restaurant_name,
        contact_name: formData.contact_name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || undefined,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        restaurant_type: formData.restaurant_type,
        current_system: formData.current_system || undefined,
        menu_description: formData.menu_description,
        menu_items_count: formData.menu_items_count ? parseInt(formData.menu_items_count) : undefined,
        has_delivery: formData.has_delivery,
        has_pickup: formData.has_pickup,
        has_dine_in: formData.has_dine_in,
        opening_hours: formData.opening_hours || undefined,
        special_requirements: formData.special_requirements || undefined,
        preferred_colors: formData.preferred_colors || undefined,
        timeline: formData.timeline || undefined,
        source: formData.source || 'registration_form',
      });

      if (result) {
        setIsSubmitted(true);
      } else {
        setError('Rekisteröinti epäonnistui. Yritä uudelleen.');
      }
    } catch (err) {
      setError('Tapahtui virhe. Yritä uudelleen myöhemmin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restaurantTypes = [
    'Pizza & Pasta',
    'Kebab & Grilli',
    'Sushi & Japanilainen',
    'Kiinalainen',
    'Intialainen',
    'Thaimaalainen',
    'Hampurilaiset',
    'Kahvila',
    'Fine Dining',
    'Muu',
  ];

  const timelines = [
    'Heti / Mahdollisimman pian',
    '1-2 viikon sisällä',
    'Kuukauden sisällä',
    '1-3 kuukauden sisällä',
    'Myöhemmin / En osaa sanoa',
  ];

  const sources = [
    'Google-haku',
    'Sosiaalinen media',
    'Toisen ravintolan suositus',
    'Mainos',
    'Muu',
  ];

  const steps = [
    { num: 1, label: 'Ravintola', icon: <Store className="w-5 h-5" /> },
    { num: 2, label: 'Yhteystiedot', icon: <User className="w-5 h-5" /> },
    { num: 3, label: 'Sijainti', icon: <MapPin className="w-5 h-5" /> },
    { num: 4, label: 'Menu & Muut', icon: <Utensils className="w-5 h-5" /> },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-in space-y-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant_name" className="text-white/80 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Ravintolan nimi *
              </Label>
              <Input
                id="restaurant_name"
                required
                value={formData.restaurant_name}
                onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                placeholder="Esim. Pizzeria Mario"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Ravintolatyyppi *
              </Label>
              <Select
                value={formData.restaurant_type}
                onValueChange={(value) => setFormData({ ...formData, restaurant_type: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="Valitse ravintolatyyppi" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-white/80">
                Nykyinen verkkosivusto (jos on)
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.ravintolasi.fi"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-in space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact_name" className="text-white/80 flex items-center gap-2">
                <User className="w-4 h-4" />
                Yhteyshenkilön nimi *
              </Label>
              <Input
                id="contact_name"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="Matti Meikäläinen"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Sähköpostiosoite *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="matti@ravintola.fi"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Puhelinnumero *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+358 40 123 4567"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Osoite *
              </Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Esimerkkikatu 123"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white/80">Kaupunki *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Helsinki"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-white/80">Postinumero *</Label>
                <Input
                  id="postal_code"
                  required
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="00100"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white/80">Palvelut *</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.has_pickup}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_pickup: !!checked })}
                  />
                  <span className="text-white/80">Nouto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.has_delivery}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_delivery: !!checked })}
                  />
                  <span className="text-white/80">Kotiinkuljetus</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.has_dine_in}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_dine_in: !!checked })}
                  />
                  <span className="text-white/80">Paikan päällä</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opening_hours" className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Aukioloajat
              </Label>
              <Input
                id="opening_hours"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                placeholder="Ma-Pe 11-21, La-Su 12-22"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-in space-y-6">
            <div className="space-y-2">
              <Label htmlFor="menu_description" className="text-white/80 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Kerro menustasi *
              </Label>
              <Textarea
                id="menu_description"
                required
                rows={4}
                value={formData.menu_description}
                onChange={(e) => setFormData({ ...formData, menu_description: e.target.value })}
                placeholder="Kuvaile lyhyesti ravintolasi ruokatarjontaa: pääruoat, erikoisuudet, hintahaarukka..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menu_items_count" className="text-white/80">Tuotteiden määrä (arvio)</Label>
                <Input
                  id="menu_items_count"
                  type="number"
                  value={formData.menu_items_count}
                  onChange={(e) => setFormData({ ...formData, menu_items_count: e.target.value })}
                  placeholder="50"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_system" className="text-white/80">Nykyinen järjestelmä</Label>
                <Input
                  id="current_system"
                  value={formData.current_system}
                  onChange={(e) => setFormData({ ...formData, current_system: e.target.value })}
                  placeholder="Esim. Wolt, Foodora, ei mitään"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Toivotut värit / brändi
              </Label>
              <Input
                value={formData.preferred_colors}
                onChange={(e) => setFormData({ ...formData, preferred_colors: e.target.value })}
                placeholder="Esim. punainen ja valkoinen, moderni ilme"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Aikataulu</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData({ ...formData, timeline: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="Milloin haluaisit aloittaa?" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Mistä kuulit meistä?</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="Valitse..." />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_requirements" className="text-white/80">
                Erityistoiveet tai lisätiedot
              </Label>
              <Textarea
                id="special_requirements"
                rows={3}
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                placeholder="Kerro vapaasti muista toiveistasi..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 resize-none"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-lg">
                P
              </div>
              <span className="text-xl font-bold tracking-tight">PlateOS</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Takaisin
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <Card className="p-8 bg-white/5 border-white/10 text-center animate-in">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Kiitos rekisteröinnistä!</h2>
              <p className="text-white/60 mb-8 text-lg">
                Olemme vastaanottaneet tietosi ja otamme sinuun yhteyttä 24 tunnin sisällä.
                Valmistaudumme rakentamaan täydellisen järjestelmän ravintolallesi!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    Takaisin etusivulle
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Kokeile demoa
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              {/* Hero */}
              <div className="animate-in text-center mb-12">
                <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
                  Rekisteröinti
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  Aloita PlateOS:n kanssa
                </h1>
                <p className="text-white/60 text-lg">
                  Kerro meille ravintolastasi niin räätälöimme täydellisen ratkaisun.
                </p>
              </div>

              {/* Steps indicator */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                {steps.map((s) => (
                  <div key={s.num} className="relative flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        s.num <= step 
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-xs mt-2 ${s.num <= step ? 'text-white' : 'text-white/40'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <Card className="p-8 bg-white/5 border-white/10">
                <form onSubmit={handleSubmit}>
                  {renderStep()}

                  {error && (
                    <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep((step - 1) as Step)}
                        className="text-white/70 hover:text-white"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Edellinen
                      </Button>
                    ) : (
                      <div />
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Lähetetään...
                        </>
                      ) : step < 4 ? (
                        <>
                          Seuraava
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Lähetä rekisteröinti
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Info */}
              <p className="text-center text-white/40 text-sm mt-6">
                Rekisteröinti on täysin sitoumukseton. Otamme yhteyttä 24h sisällä.
              </p>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-white/30">
          © 2025 PlateOS. Kaikki oikeudet pidätetään.
        </div>
      </footer>
    </div>
  );
}
