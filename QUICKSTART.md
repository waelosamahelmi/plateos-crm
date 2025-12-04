# PlateOS Quick Start Guide

## What is PlateOS?

PlateOS is a **unified demo application** that combines both customer and admin functionality of a restaurant ordering system in a single page. No backend, no database required - everything runs in your browser!

## Quick Start (3 Steps)

### 1. Install
```bash
cd plateos-demo
npm install
```

### 2. Run
```bash
npm run dev
```

### 3. Open Browser
Visit: **http://localhost:5173**

## Demo Walkthrough

### Try the Customer Experience

1. **Browse Menu**
   - You'll see pizzas by default
   - Click category tabs to see Kebabs, Burgers, Drinks, Salads

2. **Add Items to Cart**
   - Click "Add" on any menu item
   - Some items (like "Your Choice Pizza") will open a customization modal
   - Select size, toppings, and add special instructions
   - Click "Add to Cart"

3. **Checkout**
   - Click "View Cart" button (bottom right)
   - Review your items, adjust quantities
   - Click "Proceed to Checkout"
   - Fill in customer details
   - Choose Pickup or Delivery
   - Select payment method
   - Click "Place Order"

4. **See Your Order**
   - After placing order, switch to Admin view
   - Your order appears instantly!

### Try the Admin Experience

1. **Switch to Admin View**
   - Click the "Customer/Admin" button in the header
   - Now you're in order management mode

2. **Manage Orders**
   - See all orders in the dashboard
   - Filter by status (Pending, Accepted, Preparing, etc.)
   - Click on any order to see full details

3. **Update Order Status**
   - Click "Mark as Accepted" to accept an order
   - Progress through: Pending → Accepted → Preparing → Ready → Completed
   - Or cancel if needed

4. **View Order Details**
   - Customer information (name, phone, email)
   - Delivery/pickup details
   - All items with toppings and customizations
   - Payment information
   - Total amounts

## Features to Explore

### Language Switching
- Click **EN/FI** button in header
- All content switches between English and Finnish
- Menu items, categories, UI labels all translate

### Special Features
- **Offers**: Some items have discounts (look for red badges)
- **Dietary Info**: Green/orange badges show Vegan/Vegetarian/Gluten-Free
- **Conditional Pricing**: "Your Choice Pizza" includes 3 free toppings
- **Customization**: Different items have different topping groups

### Data Persistence
- Cart items saved in browser
- Orders saved in browser
- Language preference saved
- View mode preference saved

**Note**: Clear browser data to reset everything

## Testing Scenarios

### Scenario 1: Simple Order
1. Add a Margherita pizza
2. Add a Coca Cola
3. Checkout with pickup
4. Switch to Admin view
5. Accept and complete the order

### Scenario 2: Customized Order
1. Click "Your Choice Pizza"
2. Select Large size (+€6.00)
3. Add 5 toppings (3 free, 2 paid)
4. Add special instructions
5. Checkout with delivery
6. See the customization in admin view

### Scenario 3: Multiple Orders
1. Place an order as customer
2. Switch to Admin
3. Accept the order
4. Switch back to Customer
5. Place another order
6. Switch to Admin
7. Manage both orders with different statuses

## Troubleshooting

### Port Already in Use?
If 5173 is taken, Vite will use the next available port. Check the terminal output.

### Build Errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Page is Blank?
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Cart/Orders Not Saving?
- Make sure localStorage is enabled in your browser
- Private/incognito mode may not persist data

## Production Build

To build for production:

```bash
npm run build
```

This creates optimized files in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Next Steps

Want to convert this to a real app? See the **Future Enhancements** section in the main README.md for ideas on adding:
- Real database
- Authentication
- Payment processing
- Email notifications
- And more!

## Support

Questions? Check the main **README.md** for detailed architecture information.

Happy exploring!
