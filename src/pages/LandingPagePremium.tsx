import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, ShieldCheck, TrendingUp, Users, Star, ChevronRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AISalesChat } from "@/components/ai-sales-chat";
import { Link } from "wouter";
import { PlateOSLogo } from "@/components/plateos-logo";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPagePremium() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState(false);

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out",
        });
        
        gsap.to(cursorDotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.05,
        });
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1.5,
          duration: 0.3,
        });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    const interactiveElements = document.querySelectorAll("button, a, .feature-card, .pricing-card");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    // Hero animations
    const ctx = gsap.context(() => {
      // Floating logo animation
      gsap.to(".hero-logo", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.from(".hero-logo", {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
      });

      gsap.from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out",
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.9,
        ease: "power2.out",
      });

      // Parallax orbs
      gsap.to(".orb-1", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 200,
        x: -100,
      });

      gsap.to(".orb-2", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 250,
        x: 100,
      });

      // Feature cards with 3D tilt effect
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 100,
        rotationX: -15,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
      });

      // Pricing cards with flip animation
      gsap.from(".pricing-card", {
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 75%",
        },
        opacity: 0,
        rotationY: 90,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.4)",
      });

      // Stats counter animation with magnetic effect
      const stats = document.querySelectorAll(".stat-number");
      stats.forEach((stat) => {
        const target = stat.textContent || "0";
        
        gsap.from(stat, {
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
          },
          textContent: 0,
          duration: 2.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            const current = Math.ceil(this.targets()[0].textContent);
            if (target.includes("+")) {
              stat.textContent = current + "+";
            } else if (target.includes("%")) {
              stat.textContent = current + "%";
            } else if (target.includes("k")) {
              stat.textContent = (current / 1000).toFixed(1) + "k+";
            } else {
              stat.textContent = current.toString();
            }
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Nopea käyttöönotto",
      description: "Ravintolasi verkossa 24 tunnissa. Ei teknistä osaamista tarvita.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Asiakastilaukset 24/7",
      description: "Vastaanota tilauksia kellon ympäri. Kasvata myyntiä automaattisesti.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Turvallinen maksaminen",
      description: "Stripe-integraatio. PCI DSS -yhteensopiva. Kaikki maksutavat.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytiikka & raportit",
      description: "Seuraa myyntiä reaaliajassa. Optimoi menusi datan perusteella.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Tekoäly-assistentti",
      description: "AI-chatbot palvelee asiakkaita ja vastaa kysymyksiin automaattisesti.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Mukautuva design",
      description: "Brändin mukaiset värit, fontit ja layout. Täysin oma ilme.",
      color: "from-red-500 to-rose-500",
    },
  ];

  const testimonials = [
    {
      name: "Mikko Virtanen",
      restaurant: "Ravintola Babylon",
      text: "PlateOS nosti verkkokauppamme myynnin 300% kahdessa kuukaudessa. Asiakkaat rakastavat helppoa tilaamista!",
      rating: 5,
    },
    {
      name: "Laura Mäkinen",
      restaurant: "Café Aroma",
      text: "Aikaisemmin käytimme kolmannen osapuolen alustoja jotka veivät 20% jokaisesta tilauksesta. Nyt säästämme tuhansia euroja kuukaudessa.",
      rating: 5,
    },
    {
      name: "Jari Korhonen",
      restaurant: "Sushi Palace",
      text: "Asiakaspalvelu on huippuluokkaa. Saimme räätälöidyn ratkaisun täsmälleen tarpeidemme mukaan.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 cursor-none">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-full h-full border-2 border-white rounded-full" />
      </div>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 dark:from-orange-500/5 dark:via-red-500/5 dark:to-pink-500/5" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Floating orbs with parallax */}
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="orb-2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: "1s" }} 
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge className="hero-subtitle bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-6 py-2 text-sm font-medium animate-pulse">
              🍕 Suomen modernein ravintola-alusta
            </Badge>
            
            {/* Interactive Logo */}
            <div className="hero-logo flex justify-center perspective-1000">
              <div className="transform-gpu hover:scale-110 transition-transform duration-500 hover:rotate-12">
                <PlateOSLogo className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl" />
              </div>
            </div>
            
            <h1 className="hero-title text-6xl md:text-8xl font-black tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 animate-gradient">
                PlateOS
              </span>
            </h1>
            
            <p className="hero-subtitle text-2xl md:text-4xl font-bold text-slate-700 dark:text-slate-300">
              Ravintolasi digitaalinen sydän
            </p>
            
            <p className="hero-subtitle text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Täydellinen tilaus- ja hallintajärjestelmä ravintoloille. 
              Ota käyttöön alle vuorokaudessa. Kasvata myyntiäsi 24/7.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/demo">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105">
                  <span className="relative z-10 flex items-center">
                    <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Kokeile demoa ilmaiseksi
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowChat(true)}
                className="group text-lg px-8 py-6 rounded-full border-2 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Kysy AI-assistentilta
                </span>
              </Button>
            </div>

            {/* Stats with magnetic hover effect */}
            <div className="stats-section grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
              <div className="group transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300">
                <div className="stat-number text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                  50
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 group-hover:text-orange-500 transition-colors">Ravintolaa</div>
              </div>
              <div className="group transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300">
                <div className="stat-number text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                  10000
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 group-hover:text-orange-500 transition-colors">Tilauksia/kk</div>
              </div>
              <div className="group transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300">
                <div className="stat-number text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                  99.9
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 group-hover:text-orange-500 transition-colors">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator with pulse */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="relative">
            <ChevronRight className="w-6 h-6 text-slate-400 rotate-90" />
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-ping" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-0 mb-4">
              Ominaisuudet
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Kaikki mitä tarvitset
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              PlateOS sisältää kaiken tarvittavan modernin ravintolan pyörittämiseen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="feature-card group relative overflow-hidden border-2 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 transform-gpu"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div ref={pricingRef} className="py-32 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-0 mb-4">
              Hinnoittelu
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Yksinkertainen hinnoittelu
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Ei kuukausimaksuja ensimmäisenä vuonna. Ei piilokustannuksia.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Setup Fee */}
            <Card className="pricing-card relative border-2 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-0">
                  Käyttöönotto
                </Badge>
                <CardTitle className="text-4xl font-black">
                  €1,500
                  <span className="text-lg font-normal text-slate-600 dark:text-slate-400 block mt-2">
                    Kertaluontoinen maksu
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Täysin räätälöity ratkaisu ravintolallesi</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Brändisi mukaiset värit, logo ja design</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Menun ja tuotteiden lisääminen</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maksujärjestelmän konfigurointi</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Henkilökunnan koulutus</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    Ilmainen hosting 1 vuosi (arvo €120)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Fee */}
            <Card className="pricing-card relative border-2 border-orange-500 dark:border-orange-400 shadow-xl shadow-orange-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-6 py-2">
                  ⭐ Paras arvo
                </Badge>
              </div>
              <CardHeader className="pt-8">
                <Badge className="w-fit mb-2 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-0">
                  Jatkuva palvelu
                </Badge>
                <CardTitle className="text-4xl font-black">
                  €10
                  <span className="text-lg font-normal text-slate-600 dark:text-slate-400 block mt-2">
                    /kuukausi (toisen vuoden alusta)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>24/7 hosting ja ylläpito</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Automaattiset varmuuskopiot</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tietoturva & SSL-sertifikaatti</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ohjelmistopäivitykset</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tekninen tuki sähköpostilla</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>99.9% uptime-takuu</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-12 py-6 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              Aloita tänään
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-0 mb-4">
              Asiakaskokemuksia
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Ravintoloitsijat rakastavat meitä
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-2 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic leading-relaxed">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.restaurant}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h2 className="text-5xl md:text-6xl font-black">
              Valmis kasvattamaan myyntiäsi?
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Liity yli 50 ravintolan joukkoon jotka luottavat PlateOS:iin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/demo">
                <Button 
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-slate-100 text-lg px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Kokeile demoa nyt
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setShowChat(true)}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-12 py-6 rounded-full transition-all duration-300"
              >
                Kysy lisää
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      {showChat && <AISalesChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
