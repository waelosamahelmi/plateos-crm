import { createContext, useContext } from "react";
import { mockCategories, mockMenuItems } from "@/data/mockData";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  foreground: string;
  background: string;
  getPrimaryGradient: () => string;
  getGradient: (...colors: string[]) => string;
}

interface RestaurantConfig {
  name: string;
  nameEn: string;
  phone: string;
  email: string;
  facebook?: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  hours: {
    general: Record<string, { open: string; close: string; closed?: boolean }>;
  };
  services: {
    hasLunchBuffet: boolean;
    hasDelivery: boolean;
    hasPickup: boolean;
  };
  delivery: {
    minimumOrderDelivery: number;
  };
  about: {
    story: string;
    storyEn: string;
    mission: string;
    missionEn: string;
    specialties: Array<{
      title: string;
      titleEn: string;
      description: string;
      descriptionEn: string;
    }>;
  };
  theme: ThemeColors;
}

interface Branch {
  id: number;
  name: string;
  nameEn: string;
  phone: string;
  email?: string;
  address: string;
  postalCode: string;
  city: string;
  isOpen: boolean;
  openingHours: Record<string, { open: string; close: string; closed?: boolean }>;
}

interface Location {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  logoUrl?: string;
}

interface RestaurantContextType {
  config: RestaurantConfig;
  branches: Branch[];
  locations: Location[];
  menuItems: any[];
  categories: any[];
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const mockTheme: ThemeColors = {
  primary: "#DC2626",
  secondary: "#F97316",
  accent: "#FCD34D",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  foreground: "#1F2937",
  background: "#FFFFFF",
  getPrimaryGradient: () => "linear-gradient(135deg, #DC2626 0%, #F97316 100%)",
  getGradient: (...colors: string[]) => {
    if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 100%)`;
    return `linear-gradient(135deg, ${colors.join(", ")})`;
  },
};

const mockConfig: RestaurantConfig = {
  name: "PlateOS Demo",
  nameEn: "PlateOS Demo",
  phone: "+358 40 123 4567",
  email: "info@plateos-demo.com",
  facebook: "https://facebook.com/plateosdemo",
  address: {
    street: "Demo Street 123",
    postalCode: "00100",
    city: "Helsinki",
  },
  hours: {
    general: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" },
    },
  },
  services: {
    hasLunchBuffet: true,
    hasDelivery: true,
    hasPickup: true,
  },
  delivery: {
    minimumOrderDelivery: 15.00,
  },
  about: {
    story: "PlateOS on moderni ravintolakonsepti, joka yhdistää perinteiset maut nykyaikaiseen palveluun.",
    storyEn: "PlateOS is a modern restaurant concept that combines traditional flavors with modern service.",
    mission: "Tarjoamme laadukasta ruokaa ja erinomaista asiakaspalvelua jokaiselle asiakkaalle.",
    missionEn: "We provide quality food and excellent customer service to every customer.",
    specialties: [
      {
        title: "Tuoreet raaka-aineet",
        titleEn: "Fresh Ingredients",
        description: "Käytämme vain parhaita ja tuoreimpia raaka-aineita",
        descriptionEn: "We use only the best and freshest ingredients",
      },
      {
        title: "Nopea toimitus",
        titleEn: "Fast Delivery",
        description: "Toimitamme tilauksesi nopeasti ja lämpimänä",
        descriptionEn: "We deliver your order quickly and warm",
      },
      {
        title: "Laaja valikoima",
        titleEn: "Wide Selection",
        description: "Monipuolinen menu jokaiseen makuun",
        descriptionEn: "Diverse menu for every taste",
      },
      {
        title: "Erinomainen palvelu",
        titleEn: "Excellent Service",
        description: "Ystävällinen ja ammattitaitoinen henkilökunta",
        descriptionEn: "Friendly and professional staff",
      },
    ],
  },
  theme: mockTheme,
};

const mockBranches: Branch[] = [
  {
    id: 1,
    name: "PlateOS Keskusta",
    nameEn: "PlateOS Downtown",
    phone: "+358 40 123 4567",
    email: "keskusta@plateos-demo.com",
    address: "Demo Street 123",
    postalCode: "00100",
    city: "Helsinki",
    isOpen: true,
    openingHours: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" },
    },
  },
  {
    id: 2,
    name: "PlateOS Itäkeskus",
    nameEn: "PlateOS East Center",
    phone: "+358 40 765 4321",
    email: "itakeskus@plateos-demo.com",
    address: "East Street 456",
    postalCode: "00900",
    city: "Helsinki",
    isOpen: true,
    openingHours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "12:00", close: "20:00" },
    },
  },
];

const mockLocations: Location[] = [
  {
    id: 1,
    name: "K-Market Kamppi",
    address: "Kampinkatu 1",
    postalCode: "00100",
    city: "Helsinki",
    region: "Helsinki",
  },
  {
    id: 2,
    name: "S-Market Kallio",
    address: "Kallion tie 2",
    postalCode: "00530",
    city: "Helsinki",
    region: "Helsinki",
  },
  {
    id: 3,
    name: "Citymarket Espoo",
    address: "Iso Omena",
    postalCode: "02770",
    city: "Espoo",
    region: "Espoo",
  },
  {
    id: 4,
    name: "Prisma Vantaa",
    address: "Tikkurilantie 1",
    postalCode: "01300",
    city: "Vantaa",
    region: "Vantaa",
  },
];

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  return (
    <RestaurantContext.Provider
      value={{
        config: mockConfig,
        branches: mockBranches,
        locations: mockLocations,
        menuItems: mockMenuItems,
        categories: mockCategories,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
