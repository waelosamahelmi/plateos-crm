# 🚀 START HERE - PlateOS Demo

Welcome to **PlateOS** - your complete restaurant ordering system demo!

## ⚡ Quick Start (30 seconds)

```bash
cd plateos-demo
npm install
npm run dev
```

Then open: **http://localhost:5173**

**That's it!** You now have a fully functional restaurant app running.

## 🎯 What You'll See

When you open the app, you'll land on the **Customer View** with:
- A menu of pizzas displayed
- Category tabs at the top
- A red header with controls
- "Add" buttons on each menu item

## 🎮 Try These First

### 1. Browse the Menu (10 seconds)
- Click different category tabs: Pizzas → Kebabs → Burgers → Drinks → Salads
- Scroll through the items
- Notice special offer badges and dietary icons

### 2. Add a Simple Item (20 seconds)
- Find "Coca Cola" in the Drinks category
- Click "Add"
- A customization modal appears asking for size
- Select a size and click "Add to Cart"
- Notice the cart count badge appears in header

### 3. Add a Complex Item (30 seconds)
- Go to Pizzas category
- Click "Add" on "Your Choice Pizza"
- Select a size (try Large +€6.00)
- Add some toppings (first 3 are free!)
- Add special instructions if you like
- Watch the price update in real-time
- Click "Add to Cart"

### 4. View Your Cart (15 seconds)
- Click "View Cart" button (bottom right)
- See your items with all customizations
- Try changing quantities with + / - buttons
- Notice total updates automatically

### 5. Checkout (45 seconds)
- Click "Proceed to Checkout"
- Fill in:
  - Name: "John Doe"
  - Phone: "123-456-7890"
  - Choose "Pickup" or "Delivery"
  - Select payment method
- Click "Place Order"
- You'll see a confirmation with order number!

### 6. Switch to Admin View (10 seconds)
- Click the "Customer/Admin" button in header
- **Boom!** You're now in the admin dashboard
- Your order appears instantly!

### 7. Manage the Order (30 seconds)
- Click "Mark as Accepted"
- The order status updates
- Keep clicking to progress: Preparing → Ready → Completed
- Notice the color-coded status badges

### 8. Try Language Switch (5 seconds)
- Click the "EN/FI" button in header
- Everything switches to Finnish
- Click again to go back to English

## 📚 Full Documentation

Ready to dive deeper? Check out:

1. **[QUICKSTART.md](QUICKSTART.md)** - Complete walkthrough with scenarios
2. **[FEATURES.md](FEATURES.md)** - Every feature explained in detail
3. **[README.md](README.md)** - Architecture and technical details
4. **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy online

## 🎨 Cool Things to Notice

### Visual Details
- **Offer Badges**: Red badges show discount percentage
- **Dietary Icons**: Green = Vegan/Vegetarian, Orange = Gluten-Free
- **Status Colors**: Yellow (Pending) → Blue (Accepted) → Purple (Preparing) → Green (Ready/Complete)
- **Smooth Animations**: Hover effects, transitions everywhere

### Smart Features
- **Conditional Pricing**: "Your Choice Pizza" includes 3 free toppings
- **Real-time Totals**: Prices update as you select options
- **Persistent Data**: Refresh the page - your cart stays!
- **Instant Sync**: Orders appear in admin immediately

### Professional Touches
- **Responsive**: Works on phone, tablet, desktop
- **Multi-language**: Full Finnish/English support
- **Type-safe**: Built with TypeScript
- **Fast**: Loads in milliseconds

## 🏗️ Project Structure (Quick Overview)

```
plateos-demo/
├── src/
│   ├── components/        # All UI components
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── CustomerView.tsx     # Customer interface
│   │   ├── AdminView.tsx        # Admin dashboard
│   │   ├── MenuCard.tsx         # Menu item cards
│   │   ├── CustomizationModal.tsx  # Topping selector
│   │   └── CartView.tsx         # Cart & checkout
│   │
│   ├── context/           # State management
│   │   ├── DataContext.tsx      # Menu, orders, settings
│   │   └── CartContext.tsx      # Shopping cart
│   │
│   ├── data/              # Mock data
│   │   └── mockData.ts          # Menu items, toppings
│   │
│   └── types/             # TypeScript types
│       └── index.ts             # All type definitions
│
├── README.md              # Main docs
├── QUICKSTART.md         # Detailed guide
├── FEATURES.md           # Feature list
├── DEPLOYMENT.md         # Deploy instructions
└── package.json          # Dependencies
```

## 💡 Common Questions

**Q: Do I need a database?**
A: No! Everything runs in your browser using localStorage.

**Q: Can I deploy this online?**
A: Yes! See [DEPLOYMENT.md](DEPLOYMENT.md). Works on Vercel, Netlify, GitHub Pages, etc.

**Q: How do I modify the menu?**
A: Edit `src/data/mockData.ts` - add/remove items, change prices, etc.

**Q: Can I add more languages?**
A: Yes! Add your language fields to the data and update the language toggle.

**Q: Is this production-ready?**
A: The UI is! But you'd need to add a real backend for a live restaurant. See README for details.

**Q: Can I customize the colors?**
A: Yes! Edit `tailwind.config.js` for the color scheme.

## 🎓 Perfect For

- **Demos**: Show clients how a restaurant app works
- **Learning**: Study React, TypeScript, state management
- **Portfolio**: Showcase your development skills
- **Prototyping**: Test UX before building backend
- **Teaching**: Example of clean React architecture

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Next Steps

1. ✅ **You are here** - Run the app and explore
2. 📖 Read [QUICKSTART.md](QUICKSTART.md) for guided tour
3. 🎨 Customize the data in `src/data/mockData.ts`
4. 🌐 Deploy to Vercel/Netlify (takes 2 minutes!)
5. 🔧 Add features or convert to production app

## 💬 Tips for Best Experience

### For Demos
- Use two browser windows side-by-side
- One in Customer view, one in Admin view
- Place order in customer → watch it appear in admin
- Very impressive! 🎉

### For Development
- Check the browser console (F12)
- Edit components and see hot reload
- Experiment with the mock data
- Try breaking things - it's all local!

### For Learning
- Read through the component files
- Notice how Context provides data
- See how TypeScript catches errors
- Study the cart calculation logic

## 🎉 Have Fun!

This is a complete, working restaurant ordering system. Play around, break things, learn from it, deploy it, show it off!

**Questions?** Check the other documentation files or dive into the code - it's well-commented!

---

**Built with React, TypeScript, and Tailwind CSS**

Ready? Run this now:
```bash
npm run dev
```

Enjoy! 🍕🍔🥗
