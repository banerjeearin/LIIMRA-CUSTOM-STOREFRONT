# Liimra Naturals - Millet Flour E-commerce

A modern React frontend for Liimra's millet flour e-commerce store with complete shopping cart, size selection, and Shopify integration.

## ✨ Features

- **Smart Product Cards** with size selection and dynamic pricing
- **Complete Shopping Cart** with persistence and checkout
- **Science & Nutrition** details integrated into products
- **API-Configurable** - Works with mock data or Shopify
- **WhatsApp & Email** integration for customer support
- **Responsive Design** optimized for all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit: http://localhost:5173/

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[Getting Started](Docs/GETTING_STARTED.md)** | Quick setup and testing guide |
| **[Shopify Integration](Docs/SHOPIFY_INTEGRATION_GUIDE.md)** | Connect to Shopify backend |
| **[Technical Setup](Docs/TECHNICAL_SETUP.md)** | Deployment and configuration |
| **[Troubleshooting](Docs/TROUBLESHOOTING.md)** | Common issues and solutions |

## 🎯 Current Status

- ✅ All features implemented
- ✅ Running with mock data (no Shopify needed for testing)
- ✅ Cart system fully functional
- ✅ Size selection and dynamic pricing working
- ✅ Science details merged into product cards
- ✅ Ready for Shopify integration

## 🔌 Connecting to Shopify

1. Create `.env` file with Shopify credentials (see `.env.example`)
2. Restart dev server
3. App automatically switches to Shopify API

No code changes needed!

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + Radix UI
- React Query
- Shopify Storefront API

## 📦 What's Included

### Products
- 6 millet flour products (Ragi, Jowar, Bajra, Kangni, Kutki, Rice)
- 2 bundle offers (Sugar Control Trio, Complete Collection)
- Size variants (250g, 500g, 1kg, 2kg)
- Complete nutritional information

### Features
- Product browsing by health goals
- Size selection with dynamic pricing
- Shopping cart with persistence
- Free shipping indicator (₹299 threshold)
- WhatsApp inquiry integration
- Checkout via Shopify

## 🐛 Troubleshooting

**Shop section not visible?**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console (F12) for errors

**Cart not working?**
- Clear localStorage: `localStorage.clear(); location.reload();`
- Check console for errors

See [Troubleshooting Guide](Docs/TROUBLESHOOTING.md) for more solutions.

## 📞 Support

- **Documentation**: See `Docs/` folder
- **WhatsApp**: Configure in `.env`
- **Email**: Configure in `.env`

---

**Ready to use!** Start with [Getting Started](Docs/GETTING_STARTED.md) guide.
