import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { submitContactForm } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

gsap.registerPlugin(ScrollTrigger);

type FormType = 'contact' | 'complaint' | 'support';

export default function LandingContactPage() {
  const [formType, setFormType] = useState<FormType>('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".animate-in",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitContactForm({
        ...formData,
        type: formType,
      });

      if (result) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(t('contact.form.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTypes = [
    { id: 'contact' as FormType, label: t('contact.form.type.general'), icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'support' as FormType, label: t('contact.form.type.support'), icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'complaint' as FormType, label: t('contact.form.type.complaint'), icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div ref={containerRef} className={`bg-[#0a0a0a] text-white min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="PlateOS" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="minimal" />
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {t('nav.back')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="animate-in text-center mb-16">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
              {t('contact.sidebar.title')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="animate-in space-y-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-orange-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('contact.sidebar.email')}</h3>
                    <a href="mailto:info@plateos.fi" className="text-orange-500 hover:underline">
                      info@plateos.fi
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 animate-in">
              {isSubmitted ? (
                <Card className="p-8 bg-white/5 border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{t('contact.form.success.title')}</h2>
                  <p className="text-white/60 mb-6">
                    {t('contact.form.success.message')}
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {t('contact.form.submit')}
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 bg-white/5 border-white/10">
                  {/* Form Type Selector */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {formTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormType(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formType === type.id
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/80">{t('contact.form.name')} *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('contact.placeholder.name')}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80">{t('contact.form.email')} *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('contact.placeholder.email')}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white/80">{t('contact.form.subject')} *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={
                          formType === 'complaint' ? t('contact.placeholder.subject.complaint') :
                          formType === 'support' ? t('contact.placeholder.subject.support') : t('contact.placeholder.subject.general')
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white/80">{t('contact.form.message')} *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          formType === 'complaint' 
                            ? t('contact.placeholder.message.complaint')
                            : formType === 'support'
                            ? t('contact.placeholder.message.support')
                            : t('contact.placeholder.message.general')
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-white/30">
          © 2025 PlateOS. {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
}
