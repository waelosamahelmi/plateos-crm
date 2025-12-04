import { Route, Switch, useLocation } from 'wouter';
import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { CartProvider } from '@/lib/cart-context';
import { RestaurantProvider } from './lib/restaurant-context';
import { LanguageProvider } from './lib/language-context';
import { ThemeProvider } from '@/lib/theme-context';
import { MenuPage } from './pages/MenuPage';
import { AdminPage } from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LandingPageAwwwards from './pages/LandingPageAwwwards';
import LandingContactPage from './pages/LandingContactPage';
import LandingRegisterPage from './pages/LandingRegisterPage';
import PlateOSPortal from './pages/PlateOSPortal';
import AboutPage from './pages/AboutPage';
import BranchesPage from './pages/BranchesPage';
import LocationsPage from './pages/LocationsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from "@/components/ui/toaster";
import { MobileAppPreview } from '@/components/mobile-app-preview-full';
import { TourGuide } from '@/components/tour-guide';
import { useLanguage } from './lib/language-context';

function AppContent() {
  const { language } = useLanguage();
  const [showTour, setShowTour] = useState(true);
  const [location] = useLocation();
  
  // Only show mobile app preview and tour on /demo/* pages
  const isDemoPage = location.startsWith('/demo');

  return (
    <>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={LandingPageAwwwards} />
          <Route path="/contact" component={LandingContactPage} />
          <Route path="/register" component={LandingRegisterPage} />
          <Route path="/portal" component={PlateOSPortal} />
          <Route path="/demo" component={HomePage} />
          <Route path="/demo/menu" component={MenuPage} />
          <Route path="/demo/about" component={AboutPage} />
          <Route path="/demo/branches" component={BranchesPage} />
          <Route path="/demo/locations" component={LocationsPage} />
          <Route path="/demo/contact" component={ContactPage} />
          <Route path="/demo/privacy" component={PrivacyPage} />
          <Route path="/demo/terms" component={TermsPage} />
          <Route path="/demo/login" component={LoginPage} />
          <Route path="/demo/admin" component={AdminPage} />
          <Route>
            <LandingPageAwwwards />
          </Route>
        </Switch>
        <Toaster />
        {isDemoPage && <MobileAppPreview />}
      </div>
      {isDemoPage && showTour && (
        <TourGuide language={language} onComplete={() => setShowTour(false)} />
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="plateos-theme">
      <LanguageProvider>
        <RestaurantProvider>
          <DataProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </DataProvider>
        </RestaurantProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
