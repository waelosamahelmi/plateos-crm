import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AISalesChat } from "@/components/ai-sales-chat";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { LanguageSwitcher, LanguageSwitcherMobile } from "@/components/language-switcher";
import { useLanguage } from "@/lib/language-context";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Play, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Globe,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPageAwwwards() {
  const [showChat, setShowChat] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.fromTo(".hero-line", 
        { 
          y: 120, 
          opacity: 0,
          rotateX: -80,
        },
        { 
          y: 0, 
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      // Hero description fade
      gsap.fromTo(".hero-desc",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" }
      );

      // CTA buttons
      gsap.fromTo(".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1, stagger: 0.15, ease: "power2.out" }
      );

      // Scroll-triggered sections
      const sections = gsap.utils.toArray(".animate-section");
      sections.forEach((section: any) => {
        gsap.fromTo(section,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Feature cards stagger
      gsap.fromTo(".feature-item",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );

      // Pricing cards
      gsap.fromTo(".pricing-item",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".pricing-section",
            start: "top 75%",
          },
        }
      );

      // Stats counter
      gsap.fromTo(".stat-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-row",
            start: "top 85%",
          },
        }
      );

      // Horizontal scroll effect for marquee
      gsap.to(".marquee-content", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: <Zap />, title: t('features.fast'), desc: t('features.fast.desc') },
    { icon: <Globe />, title: t('features.online'), desc: t('features.online.desc') },
    { icon: <Shield />, title: t('features.secure'), desc: t('features.secure.desc') },
    { icon: <BarChart3 />, title: t('features.analytics'), desc: t('features.analytics.desc') },
    { icon: <Smartphone />, title: t('features.mobile'), desc: t('features.mobile.desc') },
    { icon: <Star />, title: t('features.brand'), desc: t('features.brand.desc') },
  ];

  return (
    <div ref={containerRef} className={`bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="PlateOS" className="h-7 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">{t('nav.features')}</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">{t('nav.pricing')}</a>
            <a href="#testimonials" className="text-sm text-white/70 hover:text-white transition-colors">{t('nav.testimonials')}</a>
            <Link href="/contact">
              <span className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer">{t('nav.contact')}</span>
            </Link>
            <LanguageSwitcher variant="minimal" />
            <Link href="/demo">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white hover:text-black transition-all">
                {t('nav.demo')}
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {t('nav.register')}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 space-y-4">
            <a href="#features" className="block text-white/70 hover:text-white">{t('nav.features')}</a>
            <a href="#pricing" className="block text-white/70 hover:text-white">{t('nav.pricing')}</a>
            <a href="#testimonials" className="block text-white/70 hover:text-white">{t('nav.testimonials')}</a>
            <Link href="/contact">
              <span className="block text-white/70 hover:text-white cursor-pointer">{t('nav.contact')}</span>
            </Link>
            <div className="pt-4 border-t border-white/10">
              <LanguageSwitcherMobile />
            </div>
            <Link href="/demo">
              <Button variant="outline" className="w-full border-white/20 text-white">{t('nav.demo')}</Button>
            </Link>
            <Link href="/register">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">{t('nav.register')}</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            {/* Badge */}
            <div className="hero-line mb-8 overflow-hidden">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('hero.badge')}
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight mb-8">
              <div className="overflow-hidden">
                <span className="hero-line block">{t('hero.title.line1')}</span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-line block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {t('hero.title.line2')}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-line block">{t('hero.title.line3')}</span>
              </div>
            </h1>

            {/* Description */}
            <p className="hero-desc text-xl md:text-2xl text-white/60 max-w-2xl mb-12 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/demo">
                <Button 
                  size="lg" 
                  className="hero-cta h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('hero.cta.demo')}
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="hero-cta h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-full"
                onClick={() => setShowChat(true)}
              >
                {t('hero.cta.chat')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats row - Commented out for now as we're just starting */}
            {/* <div className="stats-row flex flex-wrap gap-12">
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-black">50+</div>
                <div className="text-white/50 text-sm mt-1">Ravintolaa</div>
              </div>
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-black">10k+</div>
                <div className="text-white/50 text-sm mt-1">Tilauksia/kk</div>
              </div>
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-black">99.9%</div>
                <div className="text-white/50 text-sm mt-1">Uptime</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Marquee */}
      <section className="py-8 border-y border-white/10 overflow-hidden">
        <div className="marquee-content flex gap-8 whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black text-white/5 uppercase tracking-wider">
              PlateOS • {t('features.online')} • {t('features.analytics')} • {t('features.fast')} • 
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-section text-center mb-20">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
              {t('nav.features')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              {t('features.title')}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="features-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="feature-item group p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section py-32 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-section text-center mb-20">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
              {t('nav.pricing')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              {t('pricing.title')}
            </h2>
            <p className="text-white/50 text-lg">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Combined Pricing Card */}
            <div className="pricing-item p-8 md:p-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-xs font-bold">
                {t('pricing.badge')}
              </div>
              
              {/* Setup Fee */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <div className="text-sm text-orange-400 uppercase tracking-wider mb-2">{t('pricing.setup')}</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl md:text-6xl font-black">€1,500</span>
                  <span className="text-white/50">{t('pricing.oneTime')}</span>
                </div>
                <ul className="space-y-2">
                  {[
                    t('pricing.setup.item1'),
                    t('pricing.setup.item2'),
                    t('pricing.setup.item3'),
                    t('pricing.setup.item4'),
                    t('pricing.setup.item5'),
                    t('pricing.setup.item6')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Monthly Fee */}
              <div className="mb-8">
                <div className="text-sm text-orange-400 uppercase tracking-wider mb-2">{t('pricing.monthly')}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-black">€10</span>
                  <span className="text-white/50">{t('pricing.perMonth')}</span>
                </div>
                <p className="text-white/60 text-sm mb-4">{t('pricing.fromSecondYear')}</p>
                <ul className="space-y-2">
                  {[
                    t('pricing.monthly.item1'),
                    t('pricing.monthly.item2'),
                    t('pricing.monthly.item3')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full" onClick={() => setShowChat(true)}>
                {t('pricing.cta')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Restaurant Clients */}
      <section id="testimonials" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-section text-center mb-20">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
              {t('testimonials.subtitle')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black">
              {t('testimonials.title')}
            </h2>
          </div>

          {/* Restaurant Logos */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Ravintola Babylon */}
            <a 
              href="https://ravintolababylon.fi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="animate-section group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500 flex flex-col items-center justify-center"
            >
              <div className="h-24 flex items-center justify-center mb-6">
                <img 
                  src="https://ravintolababylon.fi/logo.png" 
                  alt="Ravintola Babylon" 
                  className="max-h-full max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-2xl font-bold text-white">Ravintola Babylon</div>
              </div>
              <p className="text-white/50 text-sm group-hover:text-orange-400 transition-colors">
                ravintolababylon.fi →
              </p>
            </a>

            {/* Pizzeria Antonio */}
            <a 
              href="https://pizzeriaantonio.fi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="animate-section group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500 flex flex-col items-center justify-center"
            >
              <div className="h-24 flex items-center justify-center mb-6">
                <img 
                  src="https://foozu3.fi/pizzaadmin/web_admin_common/foodzone//logo/8minqduoo4o4c8kwgw.png" 
                  alt="Pizzeria Antonio" 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-2xl font-bold text-white">Pizzeria Antonio</div>
              </div>
              <p className="text-white/50 text-sm group-hover:text-orange-400 transition-colors">
                pizzeriaantonio.fi →
              </p>
            </a>

            {/* Tirvan Kahvila */}
            <a 
              href="https://tirvankahvila.fi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="animate-section group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500 flex flex-col items-center justify-center"
            >
              <div className="h-24 flex items-center justify-center mb-6">
                <div className="text-3xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  <span className="block text-sm font-medium text-white/50 mb-1">☕</span>
                  Tirvan Kahvila
                </div>
              </div>
              <p className="text-white/50 text-sm group-hover:text-orange-400 transition-colors">
                tirvankahvila.fi →
              </p>
            </a>
          </div>

          {/* Testimonials - Commented out for now */}
          {/* <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ravintola Babylon", text: "Myynti nousi 300% kahdessa kuukaudessa! PlateOS on täydellinen ratkaisu.", stars: 5 },
              { name: "Pizzeria Antonio", text: "Säästämme tuhansia euroja kuukaudessa verrattuna Woltiin ja Foodoraan.", stars: 5 },
              { name: "Tirvan Kahvila", text: "Helppo käyttää ja asiakaspalvelu on erinomaista. Suosittelen!", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="animate-section p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-white/70 mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-section">
            <h2 className="text-4xl md:text-7xl font-black mb-8">
              {t('cta.title')}
            </h2>
            <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90 rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  {t('hero.cta.demo')}
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10 rounded-full"
                onClick={() => setShowChat(true)}
              >
                {t('cta.contact')}
              </Button>
              <Link href="/register">
                <Button 
                  size="lg"
                  className="h-14 px-10 text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full"
                >
                  {t('cta.registerNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-4">
                <img src="/logo.svg" alt="PlateOS" className="h-8 w-auto" />
              </div>
              <p className="text-white/50 text-sm">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#features" className="hover:text-white transition-colors">{t('nav.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">{t('nav.demo')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">{t('nav.register')}</Link></li>
                <li><a href="mailto:info@plateos.fi" className="hover:text-white transition-colors">info@plateos.fi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/demo/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href="/demo/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
            <div className="text-sm text-white/30">
              © 2025 PlateOS. {t('footer.copyright')}
            </div>
            <div className="text-sm text-white/30">
              {t('footer.developedBy')} <a href="https://helmies.fi" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">Helmies Oy</a> (Y-tunnus: 3577819-7)
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chat Modal */}
      {showChat && <AISalesChat onClose={() => setShowChat(false)} />}
      
      {/* Floating AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
