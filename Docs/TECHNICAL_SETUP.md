# Technical Setup Guide - Liimra Frontend

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation

```bash
# Navigate to project directory
cd velvet-display

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Shopify credentials
# (See SHOPIFY_INTEGRATION_GUIDE.md for details)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Project Structure

```
velvet-display/
├── public/                      # Static assets
│   ├── products/               # Product images
│   │   ├── bajra-250gm.png
│   │   ├── jowar-250gm.png
│   │   ├── kangni-250gm.png
│   │   ├── kutki-250gm.png
│   │   ├── ragi-250gm.png
│   │   └── rice-500gm.png
│   ├── liimra-logo.png        # Brand logo
│   └── favicon.svg            # Favicon
│
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── Header.tsx        # Site header with cart
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ProductDrawer.tsx # Product detail drawer
│   │   ├── BundleSection.tsx # Bundle products section
│   │   ├── CartDrawer.tsx    # Shopping cart (to be created)
│   │   └── ...               # Other sections
│   │
│   ├── contexts/             # React contexts
│   │   └── CartContext.tsx   # Cart state management (to be created)
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useProducts.ts    # Product data hook (to be created)
│   │   └── useScrollReveal.ts
│   │
│   ├── services/             # API services
│   │   ├── shopify.ts        # Shopify API client (to be created)
│   │   ├── productMapper.ts  # Data transformation (to be created)
│   │   ├── whatsapp.ts       # WhatsApp integration (to be created)
│   │   └── email.ts          # Email services (to be created)
│   │
│   ├── data/                 # Static data
│   │   └── products.ts       # Product type definitions
│   │
│   ├── pages/                # Page components
│   │   └── Index.tsx         # Main landing page
│   │
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Helper functions
│   │
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
│
├── .env                      # Environment variables (create this)
├── .env.example              # Environment template (to be created)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── vite.config.ts            # Vite config
├── SHOPIFY_INTEGRATION_GUIDE.md  # Main integration guide
└── README.md                 # Project README (to be created)
```

---

## Environment Configuration

### Create `.env.example`

This file should be committed to Git as a template:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here

# Contact Information
VITE_WHATSAPP_NUMBER=919876543210
VITE_CONTACT_EMAIL=hello@liimra.com
VITE_SUPPORT_PHONE=+91-98765-43210

# Feature Flags
VITE_ENABLE_COD=true
VITE_ENABLE_REVIEWS=true
VITE_FREE_SHIPPING_THRESHOLD=299

# Analytics (Optional)
VITE_GA_TRACKING_ID=
VITE_FACEBOOK_PIXEL_ID=

# Debug
VITE_DEBUG_MODE=false
```

### Create `.env` for Development

Copy `.env.example` to `.env` and fill in actual values:

```bash
cp .env.example .env
```

**Important:** Add `.env` to `.gitignore` to prevent committing secrets.

---

## Dependencies Overview

### Core Dependencies

```json
{
  "react": "^18.3.1",              // UI library
  "react-dom": "^18.3.1",          // React DOM renderer
  "react-router-dom": "^6.30.1",   // Routing (if needed)
  "@tanstack/react-query": "^5.83.0", // Data fetching and caching
  "lucide-react": "^0.462.0"       // Icons
}
```

### UI Components

```json
{
  "@radix-ui/react-*": "^1.x",     // Accessible UI primitives
  "tailwindcss": "^3.4.17",        // Utility-first CSS
  "class-variance-authority": "^0.7.1", // Component variants
  "clsx": "^2.1.1",                // Conditional classes
  "tailwind-merge": "^2.6.0"       // Merge Tailwind classes
}
```

### Shopify Integration (To Add)

```json
{
  "@shopify/hydrogen-react": "^2024.1.0",  // Shopify React components
  "shopify-buy": "^2.17.0"                 // Shopify JS Buy SDK
}
```

### Development Dependencies

```json
{
  "vite": "^5.4.19",               // Build tool
  "typescript": "^5.8.3",          // Type safety
  "@vitejs/plugin-react-swc": "^3.11.0", // Fast React refresh
  "tailwindcss": "^3.4.17",        // CSS framework
  "eslint": "^9.32.0"              // Code linting
}
```

---

## Build & Deployment

### Development Build

```bash
npm run dev
```
- Starts dev server at `http://localhost:5173`
- Hot module replacement enabled
- Source maps for debugging

### Production Build

```bash
npm run build
```
- Creates optimized bundle in `dist/`
- Minifies JavaScript and CSS
- Optimizes images
- Generates source maps

### Preview Production Build

```bash
npm run preview
```
- Serves production build locally
- Test before deploying

### Build Optimization

The Vite config is optimized for:
- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading

**Build Output:**
```
dist/
├── assets/
│   ├── index-[hash].js      # Main JavaScript bundle
│   ├── index-[hash].css     # Compiled CSS
│   └── [asset]-[hash].png   # Optimized images
└── index.html               # Entry HTML
```

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based splitting

2. **Image Optimization**
   - Lazy loading with `loading="lazy"`
   - Async decoding with `decoding="async"`
   - Proper sizing and compression

3. **React Optimization**
   - `memo()` for expensive components
   - `useMemo()` for computed values
   - `useCallback()` for event handlers

4. **CSS Optimization**
   - Tailwind CSS purging
   - Critical CSS inlining
   - Minimal runtime CSS

### Performance Targets

- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1

### Monitoring Performance

```bash
# Run Lighthouse audit
npm run build
npx lighthouse http://localhost:4173 --view

# Or use Chrome DevTools
# 1. Open DevTools
# 2. Go to Lighthouse tab
# 3. Run audit
```

---

## TypeScript Configuration

### Type Safety

The project uses strict TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Definitions

Key interfaces are defined in:
- `src/data/products.ts` - Product types
- `src/services/shopify.ts` - Shopify API types
- `src/contexts/CartContext.tsx` - Cart types

### Adding New Types

```typescript
// Example: Adding a new feature type
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Use in component
import { Review } from '@/types/review';
```

---

## Styling Guide

### Color System

The app uses CSS custom properties for theming:

```css
:root {
  --liimra-cream: 45 30% 95%;      /* Background */
  --liimra-forest: 142 55% 20%;    /* Primary dark green */
  --liimra-sage: 142 30% 60%;      /* Medium green */
  --liimra-sage-light: 142 30% 85%; /* Light green */
  --liimra-ink: 142 30% 15%;       /* Text dark */
  --liimra-ink-mid: 142 20% 40%;   /* Text medium */
  --liimra-ink-light: 142 15% 60%; /* Text light */
  --liimra-border: 142 20% 85%;    /* Borders */
}
```

**Direct Colors:**
- Olive: `#3e4c1d`
- Neon: `#aeb30a`

### Typography

**Fonts:**
- Display: Arial Black (headings)
- Body: Inter (text)

**Usage:**
```tsx
<h1 className="font-display font-black text-4xl">Heading</h1>
<p className="font-body text-base">Body text</p>
```

### Responsive Design

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage:**
```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## State Management

### Current Approach

The app uses React hooks and Context API:

1. **Local State:** `useState` for component-specific state
2. **Global State:** Context API for cart, user preferences
3. **Server State:** React Query for API data

### Adding New Global State

```typescript
// 1. Create context
import { createContext, useContext, useState } from 'react';

const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within MyProvider');
  return context;
}

// 2. Wrap app in provider (main.tsx)
<MyProvider>
  <App />
</MyProvider>

// 3. Use in components
const { state, setState } = useMyContext();
```

---

## API Integration Patterns

### Data Fetching with React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutate data
function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Usage in component
const { data, isLoading, error } = useProducts();
const { mutate: addToCart, isPending } = useAddToCart();
```

### Error Handling

```typescript
// In components
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

// In services
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API Error:', error);
  // Log to error tracking service (Sentry, LogRocket)
  throw error;
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductDrawer from './ProductDrawer';

describe('ProductDrawer', () => {
  it('renders product details', () => {
    render(<ProductDrawer productId="ragi" isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Ragi Flour')).toBeInTheDocument();
  });

  it('handles add to cart', async () => {
    const { getByText } = render(<ProductDrawer productId="ragi" isOpen={true} onClose={() => {}} />);
    const button = getByText('Add to Cart');
    fireEvent.click(button);
    // Assert cart updated
  });
});
```

---

## Git Workflow

### Branching Strategy

```bash
main           # Production-ready code
├── develop    # Development branch
├── feature/*  # Feature branches
├── bugfix/*   # Bug fix branches
└── hotfix/*   # Urgent fixes
```

### Commit Messages

Follow conventional commits:

```bash
feat: add WhatsApp integration
fix: resolve cart quantity bug
docs: update integration guide
style: format product cards
refactor: extract cart logic to context
test: add product drawer tests
chore: update dependencies
```

### Pre-commit Checklist

- [ ] Code builds without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] No console errors in browser
- [ ] Responsive design works
- [ ] TypeScript types are correct

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Shopify store is set up
- [ ] Products are added to Shopify
- [ ] Payment gateway is configured
- [ ] Shipping zones are set up
- [ ] Email templates are customized
- [ ] WhatsApp number is verified
- [ ] Domain is purchased and configured
- [ ] SSL certificate is ready

### Build Verification

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Build for production
npm run build

# 3. Test production build locally
npm run preview

# 4. Check build size
du -sh dist/

# 5. Verify all assets are included
ls -R dist/
```

### Post-Deployment

- [ ] Test all pages load correctly
- [ ] Test product browsing
- [ ] Test add to cart functionality
- [ ] Complete a test purchase (use test mode)
- [ ] Verify email notifications work
- [ ] Test WhatsApp integration
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Set up monitoring (Google Analytics, etc.)
- [ ] Configure error tracking (Sentry)

---

## Monitoring & Analytics

### Google Analytics Setup

1. **Create GA4 Property**
   - Go to analytics.google.com
   - Create new property
   - Get Measurement ID

2. **Add to Frontend**

Create `src/lib/analytics.ts`:

```typescript
export function initAnalytics() {
  const GA_ID = import.meta.env.VITE_GA_TRACKING_ID;
  if (!GA_ID) return;

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_ID);
}

// Track events
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// Track page view
export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path });
}

// Track add to cart
export function trackAddToCart(product: { id: string; name: string; price: number }) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
    }],
  });
}

// Track purchase
export function trackPurchase(orderId: string, total: number, items: any[]) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'INR',
    items,
  });
}
```

Call in `main.tsx`:

```typescript
import { initAnalytics } from '@/lib/analytics';

initAnalytics();
```

### Error Tracking with Sentry

```bash
npm install @sentry/react
```

```typescript
// In main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## Security Considerations

### API Keys

**Safe:**
- Shopify Storefront API token (public)
- Google Analytics ID (public)

**Unsafe (Never expose in frontend):**
- Shopify Admin API token
- Payment gateway secrets
- Email service API keys

### Content Security Policy

Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.myshopify.com https://www.google-analytics.com;
  frame-src 'self' https://*.myshopify.com;
">
```

### HTTPS Only

Always use HTTPS in production:

```typescript
// In vite.config.ts for development
export default defineConfig({
  server: {
    https: true, // Use local HTTPS in dev
  },
});
```

---

## Troubleshooting

### Common Development Issues

**1. Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

**2. Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. TypeScript errors**
```bash
# Check types
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint -- --fix
```

**4. Build fails**
```bash
# Check for missing dependencies
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try building again
npm run build
```

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Polyfills:**
Vite automatically includes necessary polyfills for modern browsers.

---

## Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest

# Update major versions (carefully)
npm install package-name@next
```

### Security Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

### Regular Maintenance Tasks

**Weekly:**
- Check for dependency updates
- Review error logs
- Monitor performance metrics

**Monthly:**
- Update dependencies
- Run security audit
- Review and optimize bundle size

**Quarterly:**
- Major dependency updates
- Refactor outdated patterns
- Performance optimization review

---

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- GitLens
- Error Lens

### Browser DevTools

**React DevTools:**
- Install React DevTools extension
- Inspect component tree
- Profile performance

**Redux DevTools:**
- Not needed (using Context API)

---

## Additional Features to Consider

### 1. Product Reviews

**Implementation:**
- Use Shopify Product Reviews app
- Or integrate Judge.me, Loox, or Yotpo
- Display reviews in ProductDrawer

### 2. Wishlist

**Implementation:**
```typescript
// Create WishlistContext similar to CartContext
// Store in localStorage
// Sync with Shopify customer metafields (if logged in)
```

### 3. Product Search

**Implementation:**
```typescript
// Use Shopify Storefront API search
query {
  products(first: 10, query: "ragi") {
    edges {
      node {
        title
        handle
      }
    }
  }
}
```

### 4. User Authentication

**Implementation:**
- Use Shopify Customer Accounts
- Implement login/signup
- Show order history
- Save addresses

### 5. Inventory Notifications

**Implementation:**
- Show "Only X left in stock"
- "Out of stock" badge
- "Notify when available" form

---

## Support

### Getting Help

1. **Check Documentation**
   - Read SHOPIFY_INTEGRATION_GUIDE.md
   - Review this technical guide
   - Check Shopify documentation

2. **Debug Issues**
   - Check browser console
   - Review network requests
   - Check Shopify admin logs

3. **Contact Developer**
   - Email: [developer-email]
   - Include: Error message, steps to reproduce, screenshots

---

## License

This project is proprietary software for Liimra Naturals.

---

## Changelog

### Version 1.0.0 (2026-03-27)
- Initial frontend implementation
- Product display with fanned deck
- Product drawer with details
- Bundle section
- Multiple content sections
- Responsive design
- Performance optimizations

### Upcoming Features
- Shopify integration
- Cart functionality
- Checkout flow
- WhatsApp integration
- Email integration
- User reviews
- Product search
