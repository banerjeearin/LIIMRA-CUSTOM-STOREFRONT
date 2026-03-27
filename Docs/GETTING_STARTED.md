# Getting Started - Liimra Velvet Display

## 🎉 Welcome!

Your Liimra website is ready with a complete shopping cart, size selection, and API-configurable backend. This guide will help you get started quickly.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd velvet-display
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173/** (or the port shown in terminal)

### 3. Test the Features

1. **Browse Products**: Scroll to "Shop by Goal" section
2. **Select Size**: Click size buttons (250g, 500g, 1kg) - price updates instantly
3. **View Science**: Click "🧬 Science & Nutrition" to expand nutritional details
4. **Add to Cart**: Click "Add to Cart" button
5. **View Cart**: Click cart icon in header (top right)
6. **Test Cart**: Use +/- buttons, remove items, see totals update
7. **Test Bundles**: Add a bundle to cart
8. **Refresh Page**: Verify cart persists (localStorage)

## ✨ What's Included

### Smart Product Cards
- Size variant selector with dynamic pricing
- Expandable science & nutrition section
- Add to cart with selected size
- Rating and reviews display

### Complete Shopping Cart
- Slide-in cart drawer
- Add/remove/update quantities
- Real-time totals (subtotal, shipping, total)
- Free shipping progress indicator (₹299 threshold)
- Cart persistence across page refreshes
- "Proceed to Checkout" button

### API-Configurable
- **Current Mode**: Mock data (works offline, perfect for testing)
- **Future Mode**: Shopify API (just add credentials to `.env`)
- **Zero code changes** needed to switch between modes

## 🔌 Connecting to Shopify

### Step 1: Create `.env` File

Create a file named `.env` in the project root:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
VITE_WHATSAPP_NUMBER=919876543210
VITE_CONTACT_EMAIL=hello@liimra.com
VITE_FREE_SHIPPING_THRESHOLD=299
VITE_STANDARD_SHIPPING_COST=40
```

### Step 2: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

The app **automatically detects** Shopify credentials and switches to live data!

### Step 3: Set Up Shopify Store

See `SHOPIFY_INTEGRATION_GUIDE.md` for complete instructions on:
- Creating products in Shopify
- Adding custom metafields
- Configuring variants (sizes)
- Setting up checkout

## 📁 Documentation Files

| File | Purpose |
|------|---------|
| `GETTING_STARTED.md` | **Start here** - Quick setup guide |
| `SHOPIFY_INTEGRATION_GUIDE.md` | Complete Shopify setup instructions |
| `TECHNICAL_SETUP.md` | Deployment and advanced configuration |
| `TROUBLESHOOTING.md` | Common issues and solutions |

## 🎯 Current Features

### ✅ Implemented
- Size selection on product cards
- Dynamic pricing based on size
- Science details merged into product cards
- Complete cart system with drawer UI
- Cart persistence (localStorage)
- Free shipping indicator
- Add to cart from product cards and bundles
- WhatsApp inquiry integration
- Mock data for offline testing
- Shopify API ready (just add credentials)

### 🔮 Future Enhancements
- Product search
- Product filtering
- Wishlist
- Product reviews
- Related products
- Recently viewed

## 🛠️ Build for Production

```bash
npm run build
```

Output will be in `dist/` folder. Deploy to:
- **Vercel** (recommended)
- **Netlify**
- **Any static hosting**

## 🐛 Troubleshooting

### Shop Section Not Visible?
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear cache: Open console (F12) → `localStorage.clear(); location.reload();`
3. Check console for errors (F12 → Console tab)

### Cart Not Working?
1. Verify `CartProvider` is in `App.tsx`
2. Check browser console for errors
3. Clear localStorage and try again

### Products Not Loading?
1. Check `src/data/products.ts` has all 6 products
2. Verify `ProductProvider` is in `App.tsx`
3. Check console for React Query errors

See `TROUBLESHOOTING.md` for more detailed solutions.

## 📞 Support

### Technical Issues
- Check documentation in `Docs/` folder
- Review browser console for errors
- Check terminal for build errors

### Business Questions
- WhatsApp: Configure in `.env`
- Email: Configure in `.env`

## 🎨 What You Should See

When working correctly:

1. **Hero Section**: Fanned product cards with animated badges
2. **Differentiation Section**: Dark green "Not all millet flour is the same"
3. **Shop by Goal Section**: 6 product cards with:
   - Product image on left
   - Size selector buttons
   - Dynamic pricing
   - Expandable science section
   - Add to cart button
4. **Bundles Section**: 2 bundle offers
5. **Other Sections**: Recipes, reviews, FAQ, etc.

## ✅ Next Steps

1. ✅ Test locally with mock data
2. ⏳ Set up Shopify store (see `SHOPIFY_INTEGRATION_GUIDE.md`)
3. ⏳ Add `.env` file with credentials
4. ⏳ Test with Shopify data
5. ⏳ Deploy to production

---

**Status**: ✅ All features implemented  
**Mode**: Mock Data (no Shopify needed for testing)  
**Ready for**: Local testing and Shopify integration

**Need help?** Check `TROUBLESHOOTING.md` or review the other documentation files.
