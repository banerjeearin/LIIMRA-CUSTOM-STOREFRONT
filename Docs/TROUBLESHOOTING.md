# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Shop Section Not Visible

**Symptoms**: The "Shop by Goal" section with product cards is not showing on the page.

**Solutions**:

#### 1. Hard Refresh Browser (Most Common Fix)
```
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R
```

#### 2. Clear Browser Cache
Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 3. Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - "useProducts must be used within ProductProvider" → Check App.tsx providers
   - "Cannot read property of undefined" → Products not loading
   - Network errors → Check if dev server is running

#### 4. Verify Dev Server is Running
```bash
# Check if server is running
# You should see: "Local: http://localhost:XXXX/"

# If not, restart:
cd velvet-display
npm run dev
```

#### 5. Check Import Paths
Verify in `src/pages/Index.tsx`:
```tsx
import GoalSelectorSection from "@/components/GoalSelectorSection";
// ...
<GoalSelectorSection />  // Should be in render tree
```

#### 6. Verify Context Providers
Check `src/App.tsx` has correct structure:
```tsx
<QueryClientProvider client={queryClient}>
  <ProductProvider>
    <CartProvider>
      {/* App content */}
    </CartProvider>
  </ProductProvider>
</QueryClientProvider>
```

#### 7. Check Products Data
Verify `src/data/products.ts`:
- Should export `products` array
- Should have 6 products (ragi, jowar, bajra, kangni, kutki, rice)
- Each product should have all required fields

### 🔴 Cart Not Working

**Symptoms**: Cart icon doesn't open, items don't add, or cart is empty after adding items.

**Solutions**:

#### 1. Check Cart Icon Click Handler
Verify in `src/components/Header.tsx`:
```tsx
const { cartCount, openCart } = useCart();
// ...
<button onClick={openCart}>  // Should have onClick
```

#### 2. Verify CartContext Provider
Check `src/App.tsx` includes `<CartProvider>` wrapper.

#### 3. Check localStorage
Open console (F12) and run:
```javascript
localStorage.getItem('liimra-cart')  // Should show cart data
```

If null or corrupted:
```javascript
localStorage.removeItem('liimra-cart');
location.reload();
```

#### 4. Check CartDrawer Import
Verify in `src/pages/Index.tsx`:
```tsx
import CartDrawer from "@/components/CartDrawer";
// ...
<CartDrawer />  // Should be in render tree
```

### 🔴 Size Selection Not Working

**Symptoms**: Clicking size buttons doesn't update price or selected state.

**Solutions**:

#### 1. Check State Management
Verify `GoalSelectorSection.tsx` has:
```tsx
const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
```

#### 2. Verify Product Has Multiple Sizes
Check `src/data/products.ts` - each product should have `sizes` array with multiple entries.

#### 3. Check onClick Handler
Verify size buttons have:
```tsx
onClick={() => setSelectedSizeIndex(index)}
```

### 🔴 Science Section Not Expanding

**Symptoms**: Clicking "Science & Nutrition" button doesn't show details.

**Solutions**:

#### 1. Check State
Verify `GoalSelectorSection.tsx` has:
```tsx
const [scienceExpanded, setScienceExpanded] = useState(false);
```

#### 2. Check Product Data
Verify product has:
- `detailedDescription`
- `scientificHighlight`
- `nutritionalFacts` array
- `uses` array

### 🔴 Products Not Loading (Stuck on Loading Spinner)

**Symptoms**: Shop section shows "Loading products..." indefinitely.

**Solutions**:

#### 1. Check Mock Data Service
Verify `src/services/api/mockData.ts` exists and exports `mockDataService`.

#### 2. Check Product Service
Verify `src/services/api/productService.ts` exports `productAPI`.

#### 3. Check Products Import
Verify `src/services/api/mockData.ts` imports:
```tsx
import { products } from "@/data/products";
```

#### 4. Check React Query Setup
Verify `src/App.tsx` has:
```tsx
const queryClient = new QueryClient();
// ...
<QueryClientProvider client={queryClient}>
```

#### 5. Check Console for Errors
Look for:
- Import errors
- TypeScript errors
- Network errors

### 🔴 TypeScript Errors

**Symptoms**: Red squiggly lines in editor or build fails.

**Solutions**:

#### 1. Check Missing Fields
If you see "Property 'X' does not exist", verify the Product interface in `src/data/products.ts` includes all fields.

#### 2. Rebuild
```bash
npm run build
```

This will show all TypeScript errors.

#### 3. Check Import Paths
Verify all imports use `@/` alias correctly.

### 🔴 Add to Cart Not Working

**Symptoms**: Clicking "Add to Cart" does nothing or shows error.

**Solutions**:

#### 1. Check useCart Hook
Verify component imports:
```tsx
import { useCart } from "@/contexts/CartContext";
const { addItem, openCart } = useCart();
```

#### 2. Check addItem Call
Verify correct structure:
```tsx
addItem({
  productId: product.id,
  variantId: size.variantId || `${product.id}-${size.size}`,
  name: product.name,
  size: size.size,
  quantity: 1,
  price: size.price,
  mrp: size.mrp,
  image: product.image,
});
```

#### 3. Check CartContext Provider
Verify `CartProvider` wraps the app in `App.tsx`.

### 🔴 Build Errors

**Symptoms**: `npm run build` fails with errors.

**Solutions**:

#### 1. Clean Install
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

#### 2. Check Node Version
```bash
node --version  # Should be 18+ or 20+
```

#### 3. Check TypeScript Config
Verify `tsconfig.json` has correct paths configuration.

### 🔴 Deployment Issues

**Symptoms**: App works locally but not in production.

**Solutions**:

#### 1. Check Environment Variables
Verify all `VITE_*` variables are set in your hosting platform (Vercel/Netlify).

#### 2. Check Build Output
```bash
npm run build
npm run preview  # Test production build locally
```

#### 3. Check Routing
For SPAs, configure hosting to redirect all routes to `index.html`.

## 🧪 Testing Checklist

Use this to verify everything works:

- [ ] Dev server starts without errors
- [ ] Homepage loads completely
- [ ] Hero section shows fanned product cards
- [ ] Shop section shows 6 product cards
- [ ] Size selector buttons work
- [ ] Price updates when size changes
- [ ] Science section expands/collapses
- [ ] Add to cart opens cart drawer
- [ ] Cart shows added items
- [ ] Quantity controls work (+/-)
- [ ] Remove button works
- [ ] Cart totals calculate correctly
- [ ] Free shipping indicator updates
- [ ] Cart persists after page refresh
- [ ] Bundles add to cart
- [ ] Product drawer opens
- [ ] WhatsApp button works

## 🔍 Debug Commands

### Check if Products are Loaded
Open browser console (F12):
```javascript
// Check localStorage
localStorage.getItem('liimra-cart')

// Check if React is loaded
window.React

// Force reload without cache
location.reload(true)
```

### Check Dev Server Status
In terminal:
```bash
# Check if process is running
lsof -i :5173  # or whatever port

# Check for errors
npm run dev
```

### Check File Structure
```bash
# Verify all key files exist
ls -la src/contexts/
ls -la src/services/api/
ls -la src/components/CartDrawer.tsx
```

## 🆘 Still Having Issues?

If none of these solutions work:

### 1. Collect Debug Information
- Screenshot of what you see
- Browser console errors (F12 → Console)
- Terminal output
- Network tab (F12 → Network)

### 2. Try Fresh Start
```bash
cd velvet-display
rm -rf node_modules dist
npm install
npm run dev
```

### 3. Try Different Browser
Test in Chrome, Firefox, or Safari to isolate browser-specific issues.

### 4. Check System Requirements
- Node.js 18+ or 20+
- npm 9+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

## 📊 Expected Behavior

### Loading Sequence
1. Page loads → Shows hero section
2. After ~300ms → Products load from mock data
3. Shop section renders → Shows 6 product cards
4. User interaction → Size selection, add to cart, etc.

### Cart Flow
1. User selects size → Price updates
2. User clicks "Add to Cart" → Cart drawer opens
3. Item appears in cart → Totals calculate
4. User can adjust quantity → Totals update
5. User closes cart → Cart persists in localStorage
6. User refreshes page → Cart items still there

---

**Most Common Issue**: Browser cache showing old version. Always try hard refresh first!

**Second Most Common**: Console errors. Always check F12 console for red errors.

**Third Most Common**: Missing providers in App.tsx. Verify provider hierarchy.
