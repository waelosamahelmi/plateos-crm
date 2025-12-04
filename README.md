# PlateOS - Restaurant Demo

A unified demo application showcasing the complete restaurant ordering system with both customer and admin functionality in a single page application.

## Features

### Customer View
- 🍕 Browse menu by categories (Pizzas, Kebabs, Burgers, Drinks, Salads)
- 🎨 Customize items with toppings, sizes, and special instructions
- 🛒 Shopping cart with real-time calculations
- 📦 Order placement with delivery/pickup options
- 🌍 Multi-language support (Finnish/English)
- 💳 Multiple payment methods (Cash, Card, Online)

### Admin View
- 📊 Order management dashboard
- ✅ Real-time order status updates
- 🔔 Order filtering by status
- 📋 Detailed order information
- 🚚 Delivery/pickup tracking
- 💰 Payment status monitoring

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: LocalStorage
- **Build Tool**: Vite

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

### Switching Between Views

Use the **Customer/Admin** button in the header to toggle between:
- **Customer View**: Browse menu, add items to cart, place orders
- **Admin View**: Manage incoming orders, update order status

### Language Toggle

Click the **EN/FI** button in the header to switch between English and Finnish.

### Customer Flow

1. Browse menu items by category
2. Click "Add" on any item
3. Customize with toppings/sizes if available
4. Review cart and proceed to checkout
5. Fill in delivery information
6. Place order

### Admin Flow

1. Switch to Admin view
2. See all incoming orders
3. Filter orders by status
4. Update order status through the workflow:
   - Pending → Accepted → Preparing → Ready → Completed
5. Cancel orders if needed

## Data Persistence

All data is stored in the browser's localStorage:
- Shopping cart items
- Order history
- Language preference
- View mode preference

**Note**: This is a demo application. Clearing browser data will reset everything.

## Mock Data

The demo includes pre-populated menu items with:
- 15+ menu items across 5 categories
- 40+ toppings and customization options
- Dietary information (Vegetarian, Vegan, Gluten-Free)
- Special offers and conditional pricing

## Architecture

### Context Providers

- **DataProvider**: Manages menu items, categories, orders, and settings
- **CartProvider**: Handles shopping cart operations

### Key Components

- **Header**: Navigation and settings controls
- **CustomerView**: Main customer interface
- **AdminView**: Order management interface
- **MenuCard**: Menu item display
- **CustomizationModal**: Item customization interface
- **CartView**: Shopping cart and checkout

### Type System

All data models are strongly typed with TypeScript, based on the original Babylon restaurant app schema.

## No Backend Required

This demo runs entirely in the browser with no server dependencies:
- All data is in-memory
- Orders are instantly available in admin view
- Perfect for demonstrations and testing UI/UX

## Future Enhancements

To convert this demo into a production app:
1. Replace in-memory data with a real database
2. Add authentication and authorization
3. Implement payment gateway integration
4. Add email/SMS notifications
5. Integrate with thermal printer for receipts
6. Add real-time WebSocket updates

## License

This is a demonstration project based on the Babylon restaurant ordering system.

## Support

For questions or issues, please refer to the main Babylon project documentation.
