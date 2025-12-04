# PlateOS - Premium Restaurant Management Platform

![PlateOS Logo](public/plateos-preview.png)

**PlateOS** is a modern, comprehensive restaurant management system featuring an award-winning landing page, fully functional demo, and AI-powered sales assistant.

## ✨ Features

### 🎨 Premium Landing Page
- **Awwwards-style design** with GSAP scroll animations
- **Modern typography** using Inter & Space Grotesk fonts
- **Custom SVG logo** with plate, fork, and knife motif
- **Animated gradients** and floating orb effects
- **Responsive** mobile-first design
- **Dark mode** support

### 🤖 AI Sales Assistant
- **OpenRouter integration** using free Llama 3.1 model
- **Intelligent chat** about PlateOS features and pricing
- **Real-time responses** with streaming support
- **Context-aware** sales conversations

### 🍽️ Full Demo System
- **Customer web app** with menu browsing and ordering
- **Mobile admin panel** with 6 tabs
  - Orders (real-time notifications)
  - Menu (editable items)
  - Promotions (create campaigns)
  - Analytics (sales reports)
  - Settings (theme customization)
  - Marketing (QR codes, email)
- **Interactive walkthrough** for new users
- **Complete checkout** with Stripe integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Navigate to project directory
cd plateos-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Setup

Edit `.env` and add your OpenRouter API key:

```bash
VITE_OPENROUTER_API_KEY=your_key_here
```

Get a free API key at [https://openrouter.ai/keys](https://openrouter.ai/keys)

### Development

```bash
# Start development server
npm run dev
```

Visit:
- **Landing Page**: http://localhost:5173/
- **Demo**: http://localhost:5173/demo

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
plateos-demo/
├── src/
│   ├── components/
│   │   ├── ai-sales-chat.tsx          # AI chatbot component
│   │   ├── plateos-logo.tsx           # Custom SVG logo
│   │   ├── mobile-app-preview-full.tsx # Admin panel widget
│   │   ├── menu-item-edit-modal.tsx   # Menu editing
│   │   ├── promotion-modal.tsx        # Promotion creation
│   │   ├── theme-customizer.tsx       # Theme settings
│   │   ├── tour-guide.tsx             # Interactive walkthrough
│   │   └── ui/                        # shadcn/ui components (47)
│   ├── pages/
│   │   ├── LandingPagePremium.tsx     # Main landing page
│   │   ├── HomePage.tsx               # Demo homepage
│   │   ├── MenuPage.tsx               # Menu browsing
│   │   └── ...                        # Other demo pages
│   ├── context/
│   │   ├── DataContext.tsx            # Menu & orders state
│   │   ├── CartContext.tsx            # Shopping cart
│   │   └── ThemeContext.tsx           # Theme management
│   ├── lib/
│   │   ├── restaurant-context.tsx     # Restaurant config
│   │   └── language-context.tsx       # i18n support
│   └── types/
│       └── index.ts                   # TypeScript types
├── public/
│   ├── manifest.json                  # PWA manifest
│   └── sw.js                          # Service worker
└── package.json
```

## 💰 Pricing Model

**Setup Fee**: €1,500 (one-time)
- Fully customized solution
- Brand colors, logo, and design
- Menu and product setup
- Payment system configuration
- Staff training
- **Free hosting for 1 year** (€120 value)

**Monthly Hosting**: €10/month (starting year 2)
- 24/7 hosting and maintenance
- Automatic backups
- Security & SSL certificates
- Software updates
- Email technical support
- 99.9% uptime guarantee

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: GSAP + ScrollTrigger
- **Routing**: Wouter
- **AI**: OpenRouter (Llama 3.1)
- **Fonts**: Inter + Space Grotesk (Google Fonts)
- **Icons**: Lucide React

## 🎨 Design Features

### Typography
- **Display Font**: Space Grotesk (700, 600, 500)
- **Body Font**: Inter (300-900)
- **Letter spacing**: -0.02em for headings
- **Smooth rendering**: Antialiased

### Color Palette
- **Primary Gradient**: Orange (#F97316) → Red (#DC2626) → Pink (#EC4899)
- **Background**: Slate 50 (light) / Slate 950 (dark)
- **Accents**: Multiple gradient variants for features

### Animations
- **Hero**: Fade-in with Y-axis translation
- **Features**: Staggered appearance on scroll
- **Pricing Cards**: Scale-up with bounce easing
- **Stats**: Number counter animation
- **Orbs**: Pulsing gradient backgrounds

## 📱 Demo Features

### Customer Experience
- Browse menu with categories
- Add items to cart with modifiers
- Real-time cart updates
- Multiple order types (delivery, pickup, dine-in)
- Stripe checkout integration
- Order tracking

### Admin Panel
- Real-time order notifications with sound
- Menu management (create, edit, delete items)
- Promotion campaigns with live preview
- Sales analytics and charts
- Theme customization (colors, fonts, layout)
- Marketing tools (QR codes, email templates)

### Mobile-First Design
- Responsive at all breakpoints
- Touch-optimized interactions
- Floating admin widget
- Swipe gestures (future)

## 🌐 Deployment

### Recommended Platforms
- **Vercel** (recommended for React/Vite)
- **Netlify**
- **AWS Amplify**
- **Fly.io**

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

### Environment Variables
Set `VITE_OPENROUTER_API_KEY` in your hosting platform's environment settings.

## 📄 License

© 2025 PlateOS. All rights reserved.

## 🤝 Support

- **Email**: support@plateos.fi
- **Phone**: +358 40 123 4567
- **Demo**: https://yoursite.com/demo
- **AI Chat**: Click "Kysy AI-assistentilta" on landing page

## 🚧 Roadmap

- [ ] Multi-language support (currently FI/EN)
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Customer loyalty program
- [ ] Table reservation system
- [ ] QR code ordering integration
- [ ] Kitchen display system (KDS)
- [ ] Cloud printer integration (CloudPRNT)

---

**Built with ❤️ for restaurants by PlateOS**
