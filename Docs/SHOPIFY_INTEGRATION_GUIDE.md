# Shopify Integration Guide for Liimra Millet Flour Store

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Shopify Store Setup](#shopify-store-setup)
4. [Product Configuration](#product-configuration)
5. [Frontend Integration](#frontend-integration)
6. [Cart & Checkout](#cart--checkout)
7. [WhatsApp Integration](#whatsapp-integration)
8. [Email Integration](#email-integration)
9. [Testing Checklist](#testing-checklist)
10. [Deployment](#deployment)

---

## Overview

This frontend application is built with React, TypeScript, and Vite. It's designed to connect to a Shopify backend store for:
- Product catalog management
- Pricing and inventory
- Shopping cart functionality
- Secure checkout
- Order management

**Technology Stack:**
- Frontend: React 18 + TypeScript + Vite
- UI: Tailwind CSS + Radix UI components
- State Management: React hooks
- Backend: Shopify (to be configured)

---

## Prerequisites

Before starting the integration, ensure you have:

1. **Shopify Account**
   - Active Shopify store (Basic plan or higher recommended)
   - Admin access to the store
   - Shopify API credentials

2. **Development Tools**
   - Node.js 18+ installed
   - npm or yarn package manager
   - Code editor (VS Code recommended)
   - Git for version control

3. **Domain & Hosting** (for production)
   - Custom domain (optional but recommended)
   - Hosting service (Vercel, Netlify, or similar)
   - SSL certificate (usually provided by hosting)

---

## Shopify Store Setup

### Step 1: Create Shopify Store

1. Go to [shopify.com](https://www.shopify.com) and sign up
2. Choose a store name (e.g., "liimra-naturals")
3. Complete the store setup wizard
4. Select a plan (Basic Shopify recommended for starting)

### Step 2: Enable Shopify API Access

1. **Navigate to Settings → Apps and sales channels**
2. **Click "Develop apps"**
3. **Create a new app:**
   - App name: "Liimra Frontend"
   - App developer: Your email

4. **Configure Admin API scopes:**
   Required scopes:
   - `read_products` - Read product data
   - `write_products` - Update product data (for admin)
   - `read_inventory` - Read inventory levels
   - `read_orders` - Read order information
   - `read_customers` - Read customer data
   - `write_customers` - Create customer accounts

5. **Install the app** and save the credentials:
   - Admin API access token
   - API key
   - API secret key
   - Storefront API access token (for public access)

### Step 3: Enable Storefront API

1. Go to **Settings → Apps and sales channels → Develop apps**
2. Select your app
3. Go to **Configuration → Storefront API**
4. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`

5. **Save the Storefront API access token** - you'll need this for the frontend

---

## Product Configuration

### Product Data Structure

Your frontend expects products with the following structure. Map these to Shopify product fields:

#### Frontend Product Interface
```typescript
interface Product {
  id: string;              // Shopify: product.handle or product.id
  name: string;            // Shopify: product.title
  displayName: string;     // Shopify: product.metafields.custom.display_name
  scientificName: string;  // Shopify: product.metafields.custom.scientific_name
  commonName: string;      // Shopify: product.metafields.custom.common_name
  emoji: string;           // Shopify: product.metafields.custom.emoji
  status: string;          // Shopify: product.metafields.custom.status
  rating: number;          // Shopify: product.metafields.custom.rating
  reviews: number;         // Shopify: product.metafields.custom.review_count
  primaryTags: string[];   // Shopify: product.tags (filter by prefix "primary:")
  secondaryTags: string[]; // Shopify: product.tags (filter by prefix "secondary:")
  sizes: ProductSize[];    // Shopify: product.variants
}

interface ProductSize {
  size: string;    // Shopify: variant.option1 (e.g., "500g")
  mrp: number;     // Shopify: variant.compare_at_price
  price: number;   // Shopify: variant.price
  discount: number;// Calculate: ((mrp - price) / mrp) * 100
}
```

### Setting Up Products in Shopify

#### 1. Create Products

For each millet flour product (Ragi, Jowar, Bajra, Kangni, Kutki, Rice):

**Basic Information:**
- **Title:** "Ragi Flour" (matches `name` field)
- **Description:** Full product description with benefits
- **Product type:** "Millet Flour"
- **Vendor:** "Liimra Naturals"
- **Collections:** Add to "All Products", "Millet Flours"

**Pricing & Variants:**
- Create variants for each size (250g, 500g, 1kg, 2kg)
- For each variant:
  - **Option name:** "Size"
  - **Option value:** "500g", "1kg", etc.
  - **Price:** Selling price (e.g., ₹159)
  - **Compare at price:** MRP (e.g., ₹199)
  - **SKU:** Unique code (e.g., "RAGI-500G")
  - **Barcode:** Product barcode if available
  - **Inventory:** Set quantity available
  - **Weight:** Actual weight for shipping

**Images:**
- Upload product images (use existing images from `/public/products/`)
- Image naming convention in Shopify:
  - `bajra-250gm.png`
  - `jowar-250gm.png`
  - `kangni-250gm.png`
  - `kutki-250gm.png`
  - `ragi-250gm.png`
  - `rice-500gm.png`

#### 2. Configure Custom Metafields

Shopify metafields store additional product data. Create these custom metafields:

**Navigate to:** Settings → Custom data → Products → Add definition

| Namespace.Key | Name | Type | Description |
|--------------|------|------|-------------|
| `custom.display_name` | Display Name | Single line text | Uppercase name (e.g., "RAGI") |
| `custom.scientific_name` | Scientific Name | Single line text | Latin name (e.g., "Eleusine coracana") |
| `custom.common_name` | Common Name | Single line text | Common name (e.g., "Finger Millet") |
| `custom.emoji` | Emoji | Single line text | Product emoji (e.g., "🌾") |
| `custom.status` | Status Badge | Single line text | Badge text (e.g., "#1 Bestseller") |
| `custom.rating` | Rating | Decimal | Rating out of 5 (e.g., 4.9) |
| `custom.review_count` | Review Count | Integer | Number of reviews (e.g., 324) |
| `custom.primary_benefit` | Primary Benefit | Single line text | Main benefit headline |
| `custom.benefit_description` | Benefit Description | Multi-line text | Detailed benefit description |
| `custom.health_benefits` | Health Benefits | List of single line text | Array of health benefits |
| `custom.recipes` | Recipes | List of single line text | Array of recipe names |
| `custom.nutrients` | Nutrients | JSON | Array of {label, value} objects |
| `custom.color_theme` | Color Theme | JSON | Color theme object |

**Example Metafield Values for Ragi Flour:**

```json
// custom.nutrients
[
  {"label": "Calcium", "value": "344mg"},
  {"label": "GI Index", "value": "Low"},
  {"label": "Fibre", "value": "3.6g"}
]

// custom.color_theme
{
  "bg": "142 30% 94%",
  "bgDark": "142 30% 85%",
  "accent": "145 40% 25%",
  "accentLight": "145 35% 55%",
  "text": "145 40% 15%",
  "textLight": "145 30% 35%"
}

// custom.health_benefits
[
  "Low GI helps control blood sugar naturally",
  "Extraordinary for bone health and children's growth",
  "Curbs cravings, steady metabolism"
]

// custom.recipes
["Ragi Mudde", "Dosas & Idlis", "Baby Food", "Porridge"]
```

#### 3. Configure Product Tags

Use Shopify tags to categorize products:

**Tag Format:**
- `primary:Low GI`
- `primary:High Calcium`
- `primary:Gluten-Free`
- `secondary:Diabetes Friendly`
- `secondary:B-Vitamins`

**Example for Ragi Flour:**
```
primary:Low GI, primary:High Calcium, primary:Gluten-Free, secondary:Diabetes Friendly, secondary:B-Vitamins
```

#### 4. Bundle Products Setup

For bundle offerings (Sugar Control Trio, Complete Millet Collection):

**Option A: Use Shopify Product Bundles App**
1. Install "Bundle Products" or "Bundler" app from Shopify App Store
2. Create bundles with discounted pricing
3. Link individual products to bundles

**Option B: Create Manual Bundle Products**
1. Create new products with type "Bundle"
2. Use product metafields to store bundle composition:
   - `custom.bundle_items` (JSON): Array of product IDs and quantities
   - `custom.bundle_discount` (Decimal): Bundle discount percentage

**Example Bundle Metafield:**
```json
// custom.bundle_items
[
  {"product_id": "ragi-flour", "variant": "250g", "quantity": 1},
  {"product_id": "jowar-flour", "variant": "250g", "quantity": 1},
  {"product_id": "bajra-flour", "variant": "250g", "quantity": 1}
]
```

---

## Frontend Integration

### Step 1: Install Shopify Dependencies

```bash
cd velvet-display
npm install @shopify/hydrogen-react shopify-buy
```

**Package Descriptions:**
- `@shopify/hydrogen-react`: Official Shopify React components
- `shopify-buy`: Shopify JavaScript Buy SDK for cart and checkout

### Step 2: Create Environment Configuration

Create `.env` file in the project root:

```env
# Shopify Store Configuration
VITE_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here

# Contact Configuration
VITE_WHATSAPP_NUMBER=919876543210
VITE_CONTACT_EMAIL=hello@liimra.com

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

**Security Note:** Never commit `.env` to version control. Add it to `.gitignore`.

### Step 3: Create Shopify Client Service

Create `src/services/shopify.ts`:

```typescript
import Client from 'shopify-buy';

// Initialize Shopify client
const client = Client.buildClient({
  domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: Array<{ src: string; altText: string }>;
  variants: Array<{
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    compareAtPrice: { amount: string; currencyCode: string } | null;
    availableForSale: boolean;
    selectedOptions: Array<{ name: string; value: string }>;
  }>;
  tags: string[];
  metafields: Array<{ key: string; value: string; namespace: string }>;
}

// Fetch all products
export async function fetchProducts(): Promise<ShopifyProduct[]> {
  try {
    const products = await client.product.fetchAll();
    return products as unknown as ShopifyProduct[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Fetch single product by handle
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const product = await client.product.fetchByHandle(handle);
    return product as unknown as ShopifyProduct;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

// Create checkout
export async function createCheckout() {
  try {
    const checkout = await client.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

// Add items to checkout
export async function addToCart(checkoutId: string, lineItems: Array<{ variantId: string; quantity: number }>) {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems);
    return checkout;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItem(checkoutId: string, lineItemId: string, quantity: number) {
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, [
      { id: lineItemId, quantity }
    ]);
    return checkout;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(checkoutId: string, lineItemId: string) {
  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, [lineItemId]);
    return checkout;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

// Fetch checkout
export async function fetchCheckout(checkoutId: string) {
  try {
    const checkout = await client.checkout.fetch(checkoutId);
    return checkout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    throw error;
  }
}

export default client;
```

### Step 4: Create Data Transformation Layer

Create `src/services/productMapper.ts`:

```typescript
import { Product, ProductSize } from '@/data/products';
import { ShopifyProduct } from './shopify';

/**
 * Transform Shopify product data to frontend Product interface
 */
export function mapShopifyProductToProduct(shopifyProduct: ShopifyProduct): Product {
  // Extract metafields
  const metafields = shopifyProduct.metafields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {} as Record<string, string>);

  // Parse tags
  const primaryTags = shopifyProduct.tags
    .filter(tag => tag.startsWith('primary:'))
    .map(tag => tag.replace('primary:', ''));
  
  const secondaryTags = shopifyProduct.tags
    .filter(tag => tag.startsWith('secondary:'))
    .map(tag => tag.replace('secondary:', ''));

  // Map variants to sizes
  const sizes: ProductSize[] = shopifyProduct.variants.map(variant => {
    const price = parseFloat(variant.price.amount);
    const mrp = variant.compareAtPrice 
      ? parseFloat(variant.compareAtPrice.amount) 
      : price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return {
      size: variant.selectedOptions.find(opt => opt.name === 'Size')?.value || variant.title,
      mrp,
      price,
      discount,
    };
  });

  // Parse JSON metafields
  const nutrients = metafields.nutrients ? JSON.parse(metafields.nutrients) : [];
  const healthBenefits = metafields.health_benefits ? JSON.parse(metafields.health_benefits) : [];
  const recipes = metafields.recipes ? JSON.parse(metafields.recipes) : [];
  const colorTheme = metafields.color_theme ? JSON.parse(metafields.color_theme) : {
    bg: "142 30% 94%",
    bgDark: "142 30% 85%",
    accent: "145 40% 25%",
    accentLight: "145 35% 55%",
    text: "145 40% 15%",
    textLight: "145 30% 35%",
  };

  return {
    id: shopifyProduct.handle,
    name: shopifyProduct.title,
    displayName: metafields.display_name || shopifyProduct.title.toUpperCase(),
    scientificName: metafields.scientific_name || '',
    commonName: metafields.common_name || '',
    emoji: metafields.emoji || '🌾',
    status: metafields.status || '',
    rating: parseFloat(metafields.rating || '0'),
    reviews: parseInt(metafields.review_count || '0', 10),
    primaryTags,
    secondaryTags,
    sizes,
    nutrients,
    primaryBenefit: metafields.primary_benefit || '',
    benefitDescription: metafields.benefit_description || '',
    healthBenefits,
    recipes,
    colorTheme,
  };
}

/**
 * Transform array of Shopify products
 */
export function mapShopifyProducts(shopifyProducts: ShopifyProduct[]): Product[] {
  return shopifyProducts.map(mapShopifyProductToProduct);
}
```

### Step 5: Create Product Data Hook

Create `src/hooks/useProducts.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/shopify';
import { mapShopifyProducts } from '@/services/productMapper';
import { Product } from '@/data/products';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const shopifyProducts = await fetchProducts();
      return mapShopifyProducts(shopifyProducts);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProduct(handle: string) {
  return useQuery<Product | null>({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { fetchProductByHandle } = await import('@/services/shopify');
      const { mapShopifyProductToProduct } = await import('@/services/productMapper');
      const shopifyProduct = await fetchProductByHandle(handle);
      return shopifyProduct ? mapShopifyProductToProduct(shopifyProduct) : null;
    },
    enabled: !!handle,
  });
}
```

### Step 6: Update Components to Use Shopify Data

#### Update `src/pages/Index.tsx`

Replace the hardcoded `deckCards` array with data from Shopify:

```typescript
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products, isLoading, error } = useProducts();
  
  // Create deck cards from Shopify products
  const deckCards = useMemo(() => {
    if (!products) return [];
    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: `/products/${product.id}-250gm.png`, // Or use Shopify image URL
    }));
  }, [products]);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products. Please try again.</div>;
  }

  // Rest of component...
}
```

#### Update `src/components/ProductDrawer.tsx`

Replace hardcoded `productsData` with Shopify data:

```typescript
import { useProducts } from '@/hooks/useProducts';

const ProductDrawer = memo(({ isOpen, onClose, productId, onNavigate }: ProductDrawerProps) => {
  const { data: products } = useProducts();
  const product = useMemo(() => products?.find((p) => p.id === productId), [products, productId]);
  
  // Rest of component...
});
```

---

## Cart & Checkout

### Step 1: Create Cart Context

Create `src/contexts/CartContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createCheckout,
  addToCart as shopifyAddToCart,
  updateCartItem as shopifyUpdateCartItem,
  removeFromCart as shopifyRemoveFromCart,
  fetchCheckout,
} from '@/services/shopify';

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  checkoutUrl: string | null;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize checkout on mount
  useEffect(() => {
    const initCheckout = async () => {
      const savedCheckoutId = localStorage.getItem('shopify_checkout_id');
      
      if (savedCheckoutId) {
        try {
          const checkout = await fetchCheckout(savedCheckoutId);
          if (checkout && !checkout.completedAt) {
            setCheckoutId(savedCheckoutId);
            setCheckoutUrl(checkout.webUrl);
            // Sync cart from checkout
            syncCartFromCheckout(checkout);
            return;
          }
        } catch (error) {
          console.error('Error fetching saved checkout:', error);
        }
      }

      // Create new checkout
      const checkout = await createCheckout();
      setCheckoutId(checkout.id);
      setCheckoutUrl(checkout.webUrl);
      localStorage.setItem('shopify_checkout_id', checkout.id);
    };

    initCheckout();
  }, []);

  const syncCartFromCheckout = (checkout: any) => {
    const items: CartItem[] = checkout.lineItems.map((item: any) => ({
      id: item.id,
      variantId: item.variant.id,
      productId: item.variant.product.handle,
      productName: item.title,
      size: item.variant.title,
      price: parseFloat(item.variant.price.amount),
      quantity: item.quantity,
      image: item.variant.image?.src || '',
    }));
    setCart(items);
  };

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    if (!checkoutId) return;
    
    setIsLoading(true);
    try {
      const checkout = await shopifyAddToCart(checkoutId, [
        { variantId: item.variantId, quantity: item.quantity }
      ]);
      syncCartFromCheckout(checkout);
      setCheckoutUrl(checkout.webUrl);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!checkoutId) return;
    
    setIsLoading(true);
    try {
      const checkout = await shopifyUpdateCartItem(checkoutId, itemId, quantity);
      syncCartFromCheckout(checkout);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!checkoutId) return;
    
    setIsLoading(true);
    try {
      const checkout = await shopifyRemoveFromCart(checkoutId, itemId);
      syncCartFromCheckout(checkout);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopify_checkout_id');
    createCheckout().then(checkout => {
      setCheckoutId(checkout.id);
      setCheckoutUrl(checkout.webUrl);
      localStorage.setItem('shopify_checkout_id', checkout.id);
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        checkoutUrl,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

### Step 2: Wrap App with Cart Provider

Update `src/main.tsx`:

```typescript
import { CartProvider } from '@/contexts/CartContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
      </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### Step 3: Update Add to Cart Buttons

Update `src/components/ProductDrawer.tsx`:

```typescript
import { useCart } from '@/contexts/CartContext';

const ProductDrawer = memo(({ isOpen, onClose, productId, onNavigate }: ProductDrawerProps) => {
  const { addItem, isLoading } = useCart();
  const { data: products } = useProducts();
  const product = useMemo(() => products?.find((p) => p.id === productId), [products, productId]);
  const [selectedSize, setSelectedSize] = useState(0);

  const handleAddToCart = async () => {
    if (!product || !currentSize) return;
    
    try {
      await addItem({
        variantId: currentSize.variantId, // You'll need to store this from Shopify
        productId: product.id,
        productName: product.name,
        size: currentSize.size,
        price: currentSize.price,
        quantity: 1,
        image: product.image,
      });
      
      // Show success message
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  // Update button
  <button
    onClick={handleAddToCart}
    disabled={isLoading}
    className="font-body text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg flex-shrink-0"
    style={{ background: OLIVE, color: "white" }}
  >
    <ShoppingCart size={16} />
    {isLoading ? 'Adding...' : 'Add to Cart'}
  </button>
});
```

### Step 4: Create Cart Drawer Component

Create `src/components/CartDrawer.tsx`:

```typescript
import { memo } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = memo(({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, cartCount, checkoutUrl, updateQuantity, removeItem, isLoading } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 299 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[hsl(var(--liimra-cream))] p-0 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[hsl(var(--liimra-border))]">
          <SheetTitle className="font-display font-black text-lg" style={{ color: '#3e4c1d' }}>
            Your Cart ({cartCount})
          </SheetTitle>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-[hsl(var(--liimra-ink-light))] mb-4" />
              <p className="font-body text-sm text-[hsl(var(--liimra-ink-light))]">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-body font-semibold text-sm mb-1">{item.productName}</h4>
                    <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))] mb-2">
                      {item.size}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        disabled={isLoading}
                        className="w-7 h-7 rounded-full border border-[hsl(var(--liimra-border))] flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body text-sm font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-7 h-7 rounded-full border border-[hsl(var(--liimra-border))] flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-[hsl(var(--liimra-ink-light))] hover:text-[hsl(var(--liimra-ink))]"
                    >
                      <X size={16} />
                    </button>
                    <span className="font-display font-bold text-lg" style={{ color: '#3e4c1d' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[hsl(var(--liimra-border))] bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-body text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {subtotal < 299 && (
                <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))]">
                  Add ₹{299 - subtotal} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-[hsl(var(--liimra-border))]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <a
              href={checkoutUrl || '#'}
              className="block w-full font-body text-sm font-bold tracking-wider uppercase py-4 rounded-full text-center transition-all duration-300 hover:scale-[1.02]"
              style={{ background: '#3e4c1d', color: 'white' }}
            >
              Proceed to Checkout
            </a>

            <p className="font-body text-xs text-center mt-3 text-[hsl(var(--liimra-ink-light))]">
              ✓ Secure checkout · COD available
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
});

export default CartDrawer;
```

### Step 2: Update Header with Cart

Update `src/components/Header.tsx`:

```typescript
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';

const Header = memo(() => {
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[hsl(45_30%_95%/0.85)] border-b border-[hsl(var(--liimra-border))]">
        {/* ... existing code ... */}
        
        <button 
          onClick={() => setCartOpen(true)}
          className="relative p-2 rounded-full hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors"
        >
          <ShoppingBag size={20} className="text-[hsl(var(--liimra-ink))]" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center" style={{ background: "#aeb30a", color: "#3e4c1d" }}>
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
});
```

### Step 3: Configure Shopify Checkout Settings

In Shopify Admin:

1. **Go to Settings → Checkout**

2. **Customer contact:**
   - Enable "Customers can only check out using email"
   - Or enable "Phone number or email"

3. **Customer information:**
   - Enable "Require first and last name"
   - Optional: "Company name"

4. **Shipping address:**
   - Enable "Require shipping address"
   - Set up shipping zones for India

5. **Payment methods:**
   - Enable Cash on Delivery (COD)
   - Enable online payments (Razorpay, PayU, or Shopify Payments)
   - Configure payment gateway credentials

6. **Order processing:**
   - Set "After an order is paid" → "Automatically fulfill the order's line items"
   - Or keep manual fulfillment for quality control

7. **Email notifications:**
   - Customize order confirmation email
   - Enable shipping confirmation
   - Enable delivery confirmation

---

## WhatsApp Integration

### Method 1: WhatsApp Business API (Recommended)

**Setup:**
1. Sign up for WhatsApp Business API through a provider (Twilio, MessageBird, or Gupshup)
2. Get your WhatsApp Business number verified
3. Obtain API credentials

**Implementation:**

Create `src/services/whatsapp.ts`:

```typescript
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * Open WhatsApp chat with pre-filled message
 */
export function openWhatsAppChat(message?: string) {
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const url = `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodedMessage}` : ''}`;
  window.open(url, '_blank');
}

/**
 * Send product inquiry via WhatsApp
 */
export function sendProductInquiry(productName: string, size: string) {
  const message = `Hi! I'm interested in ${productName} (${size}). Can you help me with more details?`;
  openWhatsAppChat(message);
}

/**
 * Send order support message
 */
export function sendOrderSupport(orderId?: string) {
  const message = orderId 
    ? `Hi! I need help with my order #${orderId}`
    : `Hi! I need help with my order`;
  openWhatsAppChat(message);
}

/**
 * Send general inquiry
 */
export function sendGeneralInquiry() {
  const message = `Hi! I have a question about Liimra products.`;
  openWhatsAppChat(message);
}
```

**Add WhatsApp Button to Components:**

Update `src/components/ProductDrawer.tsx`:

```typescript
import { sendProductInquiry } from '@/services/whatsapp';

// Add button after "Add to Cart"
<button
  onClick={() => sendProductInquiry(product.name, currentSize.size)}
  className="w-full font-body text-xs font-bold tracking-wider uppercase py-3 rounded-full flex items-center justify-center gap-2 border-2 transition-all duration-300"
  style={{ borderColor: '#3e4c1d', color: '#3e4c1d' }}
>
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  Ask on WhatsApp
</button>
```

### Method 2: Simple WhatsApp Link (No API Required)

If you don't want to set up WhatsApp Business API, use direct links:

```typescript
// In .env
VITE_WHATSAPP_NUMBER=919876543210

// Usage in components
const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi! I'm interested in ${productName}`;
```

---

## Email Integration

### Method 1: Using Shopify Email Notifications (Built-in)

Shopify automatically sends emails for:
- Order confirmation
- Shipping updates
- Delivery confirmation
- Abandoned cart recovery

**Configure in Shopify:**
1. Go to **Settings → Notifications**
2. Customize email templates:
   - Order confirmation
   - Order cancelled
   - Shipping confirmation
   - Out for delivery
   - Delivered
   - Abandoned checkout

**Customization:**
- Add Liimra branding (logo, colors)
- Include WhatsApp support link
- Add personalized messaging
- Include recipe suggestions

### Method 2: Custom Email Integration (Advanced)

For custom email functionality (newsletters, product inquiries):

**Option A: Use Shopify Email App**
1. Install "Shopify Email" app from App Store
2. Create email campaigns
3. Segment customers
4. Track performance

**Option B: Third-party Email Service (Mailchimp, SendGrid)**

Create `src/services/email.ts`:

```typescript
/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(email: string, name?: string) {
  try {
    // Option 1: Use Shopify Customer API
    const response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
                email
              }
              customerUserErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            email,
            firstName: name,
            acceptsMarketing: true,
          },
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}

/**
 * Send product inquiry email
 */
export async function sendProductInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  productName: string;
  message: string;
}) {
  // This would typically go through your backend or a service like Formspree
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

**Add Newsletter Signup Form:**

Create `src/components/NewsletterSignup.tsx`:

```typescript
import { useState } from 'react';
import { subscribeToNewsletter } from '@/services/email';
import { toast } from 'sonner';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await subscribeToNewsletter(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2 rounded-full border border-[hsl(var(--liimra-border))] font-body text-sm"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 rounded-full font-body text-sm font-bold"
        style={{ background: '#3e4c1d', color: 'white' }}
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

Add to Footer:

```typescript
// In src/components/Footer.tsx
import { NewsletterSignup } from './NewsletterSignup';

// Add before the main footer content
<div className="max-w-4xl mx-auto px-6 py-8 border-b border-white/10">
  <h3 className="font-display font-black text-xl text-center mb-4" style={{ color: NEON }}>
    Get Fresh Recipes & Health Tips
  </h3>
  <div className="flex justify-center">
    <NewsletterSignup />
  </div>
</div>
```

---

## Pricing & Deals Configuration

### Dynamic Pricing in Shopify

**1. Regular Pricing:**
- Set in product variants
- `price`: Current selling price
- `compare_at_price`: Original MRP (shows discount automatically)

**2. Bulk Discounts:**

**Option A: Shopify Discount Codes**
1. Go to **Discounts** in Shopify Admin
2. Create discount codes:
   - `BULK5`: 5% off on 2 items
   - `BULK10`: 10% off on 3+ items
   - `FIRSTORDER`: 15% off first order

**Option B: Automatic Discounts**
1. Go to **Discounts → Create discount → Automatic discount**
2. Set up quantity-based discounts:
   - Buy 2, get 5% off
   - Buy 3+, get 10% off

**3. Bundle Pricing:**

In your bundle products, set the price lower than the sum of individual products.

**Example:**
- Ragi 250g: ₹109
- Jowar 250g: ₹99
- Bajra 250g: ₹89
- **Total:** ₹297
- **Bundle Price:** ₹249 (16% savings)

### Frontend Discount Display

The frontend automatically calculates and displays discounts:

```typescript
// In ProductDrawer.tsx
const discount = Math.round(((currentSize.mrp - currentSize.price) / currentSize.mrp) * 100);

<span className="font-body text-xs font-bold px-2 py-1 rounded-full">
  {discount}% OFF
</span>
```

---

## Images Configuration

### Image Management Strategy

**Option 1: Use Shopify CDN (Recommended)**

Store all product images in Shopify:

1. Upload images to Shopify products
2. Use Shopify image URLs in frontend
3. Benefits: CDN, automatic optimization, resizing

**Update image references:**

```typescript
// In productMapper.ts
export function mapShopifyProductToProduct(shopifyProduct: ShopifyProduct): Product {
  // Use Shopify image URL
  const image = shopifyProduct.images[0]?.src || '';
  
  return {
    // ... other fields
    image, // Add this field to Product interface
  };
}

// In components, use product.image instead of hardcoded paths
<img src={product.image} alt={product.name} />
```

**Option 2: Keep Images in Frontend (Current Setup)**

If you prefer to keep images in the frontend `/public/products/` folder:

1. Ensure all product images are in `/public/products/`
2. Use consistent naming: `{product-id}-{size}.png`
3. Reference using: `/products/${productId}-250gm.png`

**Image Optimization:**
- Use WebP format for better compression
- Provide multiple sizes for responsive images
- Use lazy loading (already implemented)

**Image Checklist:**
- [ ] Bajra Flour: `/products/bajra-250gm.png`
- [ ] Jowar Flour: `/products/jowar-250gm.png`
- [ ] Kangni Flour: `/products/kangni-250gm.png`
- [ ] Kutki Flour: `/products/kutki-250gm.png`
- [ ] Ragi Flour: `/products/ragi-250gm.png`
- [ ] Rice Flour: `/products/rice-500gm.png`
- [ ] Logo: `/liimra-logo.png`
- [ ] Favicon: `/favicon.svg`

---

## Testing Checklist

### Pre-Launch Testing

#### 1. Product Display
- [ ] All products load from Shopify
- [ ] Product images display correctly
- [ ] Pricing shows correctly (price, MRP, discount)
- [ ] Product details (nutrients, benefits) display
- [ ] Size variants show all options
- [ ] "Coming Soon" products are marked correctly

#### 2. Cart Functionality
- [ ] Add to cart works for all products
- [ ] Cart count updates in header
- [ ] Cart drawer opens and shows items
- [ ] Quantity increase/decrease works
- [ ] Remove item works
- [ ] Cart persists on page reload
- [ ] Subtotal calculates correctly
- [ ] Shipping calculation is correct (free above ₹299)
- [ ] Total amount is accurate

#### 3. Checkout Flow
- [ ] "Proceed to Checkout" redirects to Shopify checkout
- [ ] Shopify checkout loads correctly
- [ ] Customer can enter shipping details
- [ ] Payment methods display (COD + online)
- [ ] Order confirmation works
- [ ] Email confirmation is sent
- [ ] Order appears in Shopify admin

#### 4. Bundle Products
- [ ] Bundle cards display correctly
- [ ] Bundle pricing is accurate
- [ ] Volume discounts calculate (1×, 2×, 3×)
- [ ] Add to cart works for bundles
- [ ] Bundle items show in cart correctly

#### 5. WhatsApp Integration
- [ ] WhatsApp button opens chat
- [ ] Pre-filled message is correct
- [ ] WhatsApp number is correct
- [ ] Works on mobile and desktop

#### 6. Email Integration
- [ ] Newsletter signup works
- [ ] Confirmation email is sent
- [ ] Order confirmation emails work
- [ ] Email templates are branded correctly

#### 7. Mobile Responsiveness
- [ ] All sections display correctly on mobile
- [ ] Product cards are tappable
- [ ] Cart drawer works on mobile
- [ ] Checkout works on mobile devices
- [ ] WhatsApp opens in app (not browser)

#### 8. Performance
- [ ] Page loads in under 3 seconds
- [ ] Images load progressively
- [ ] No console errors
- [ ] Smooth animations and transitions

---

## Deployment

### Step 1: Build the Frontend

```bash
cd velvet-display
npm install
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 2: Deploy to Hosting

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard:**
   - `VITE_SHOPIFY_STORE_DOMAIN`
   - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_CONTACT_EMAIL`

#### Option B: Netlify

1. **Create `netlify.toml` in project root:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   - Connect GitHub repository to Netlify
   - Or use Netlify CLI: `netlify deploy --prod`

3. **Set environment variables in Netlify dashboard**

#### Option C: Custom Server

1. **Upload `dist` folder to server**
2. **Configure web server (Nginx example):**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

### Step 3: Configure Custom Domain

1. **In hosting provider:**
   - Add custom domain (e.g., shop.liimra.com)
   - Configure DNS records

2. **In Shopify:**
   - Go to **Settings → Domains**
   - Add your domain for checkout
   - This ensures checkout happens on your domain

### Step 4: Set Up SSL

- Most hosting providers (Vercel, Netlify) provide free SSL
- For custom servers, use Let's Encrypt

---

## Implementation Roadmap

### Phase 1: Basic Integration (Week 1)

1. **Set up Shopify store**
   - Create account
   - Configure basic settings
   - Set up payment gateways

2. **Add products to Shopify**
   - Create 6 millet flour products
   - Add variants (sizes)
   - Upload images
   - Set pricing

3. **Connect frontend to Shopify**
   - Install Shopify SDK
   - Create API service layer
   - Test product fetching

### Phase 2: Cart & Checkout (Week 2)

1. **Implement cart functionality**
   - Create CartContext
   - Add to cart buttons
   - Cart drawer component

2. **Test checkout flow**
   - End-to-end purchase test
   - Payment gateway testing
   - Email notifications

### Phase 3: Enhanced Features (Week 3)

1. **Add bundles**
   - Create bundle products
   - Implement bundle pricing
   - Test bundle checkout

2. **Integrate WhatsApp**
   - Set up WhatsApp Business
   - Add WhatsApp buttons
   - Test messaging flow

3. **Email marketing**
   - Newsletter signup
   - Abandoned cart emails
   - Customer segmentation

### Phase 4: Testing & Launch (Week 4)

1. **Comprehensive testing**
   - Use testing checklist
   - Mobile testing
   - Payment testing

2. **Deploy to production**
   - Build and deploy
   - Configure domain
   - Monitor for issues

---

## Shopify Product Setup Examples

### Example 1: Ragi Flour (Complete Setup)

**Basic Information:**
```
Title: Ragi Flour
Handle: ragi-flour
Product Type: Millet Flour
Vendor: Liimra Naturals
Tags: primary:Low GI, primary:High Calcium, primary:Gluten-Free, secondary:Diabetes Friendly, secondary:B-Vitamins
```

**Variants:**
| Size | Price | Compare at Price | SKU | Inventory |
|------|-------|------------------|-----|-----------|
| 250g | ₹109 | ₹139 | RAGI-250G | 100 |
| 500g | ₹159 | ₹199 | RAGI-500G | 100 |
| 1kg | ₹289 | ₹369 | RAGI-1KG | 50 |

**Metafields:**
```
custom.display_name: "RAGI"
custom.scientific_name: "Eleusine coracana"
custom.common_name: "Finger Millet"
custom.emoji: "🌾"
custom.status: "#1 Bestseller"
custom.rating: 4.9
custom.review_count: 324
custom.primary_benefit: "Nature's Calcium Vault"
custom.benefit_description: "More calcium than milk gram-for-gram. Extraordinary for bone health, children's growth, and blood sugar control."
```

**Description (HTML):**
```html
<h2>Ragi Flour - Nature's Calcium Vault</h2>
<p>More calcium than milk gram-for-gram. Extraordinary for bone health, children's growth, and blood sugar control.</p>

<h3>Health Benefits</h3>
<ul>
  <li>Low GI helps control blood sugar naturally</li>
  <li>Extraordinary for bone health and children's growth</li>
  <li>Curbs cravings, steady metabolism</li>
</ul>

<h3>Nutritional Highlights</h3>
<ul>
  <li><strong>Calcium:</strong> 344mg per 100g</li>
  <li><strong>GI Index:</strong> Low</li>
  <li><strong>Fibre:</strong> 3.6g per 100g</li>
</ul>

<h3>Recipe Ideas</h3>
<p>Perfect for Ragi Mudde, Dosas & Idlis, Baby Food, and Porridge</p>
```

### Example 2: Sugar Control Trio Bundle

**Basic Information:**
```
Title: Sugar Control Trio Bundle
Handle: sugar-control-trio
Product Type: Bundle
Vendor: Liimra Naturals
Tags: bundle, diabetes-friendly, low-gi, bestseller
```

**Pricing:**
```
Price: ₹439
Compare at Price: ₹567
Discount: 22% OFF
```

**Metafields:**
```json
// custom.bundle_items
[
  {"product": "ragi-flour", "size": "250g"},
  {"product": "jowar-flour", "size": "250g"},
  {"product": "bajra-flour", "size": "250g"}
]

// custom.bundle_description
"The 3 best low-GI flours for blood sugar control. Real results: HbA1c from 8.2 → 6.9 in 3 months."
```

---

## API Reference

### Shopify Storefront API Queries

#### Fetch All Products

```graphql
query {
  products(first: 50) {
    edges {
      node {
        id
        handle
        title
        description
        tags
        images(first: 5) {
          edges {
            node {
              src
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        metafields(identifiers: [
          {namespace: "custom", key: "display_name"},
          {namespace: "custom", key: "scientific_name"},
          {namespace: "custom", key: "rating"},
          {namespace: "custom", key: "review_count"}
        ]) {
          key
          value
          namespace
        }
      }
    }
  }
}
```

#### Create Checkout

```graphql
mutation {
  checkoutCreate(input: {
    lineItems: [
      {
        variantId: "gid://shopify/ProductVariant/123456789",
        quantity: 1
      }
    ]
  }) {
    checkout {
      id
      webUrl
      lineItems(first: 5) {
        edges {
          node {
            title
            quantity
          }
        }
      }
    }
    checkoutUserErrors {
      field
      message
    }
  }
}
```

---

## Troubleshooting

### Common Issues

**1. Products not loading**
- Check Storefront API token is correct
- Verify products are published to "Online Store" channel
- Check browser console for CORS errors

**2. Add to cart not working**
- Verify variant IDs are correct
- Check checkout is created successfully
- Ensure products are available for sale

**3. Checkout redirect fails**
- Verify checkout URL is valid
- Check if checkout has expired (create new one)
- Ensure products are in stock

**4. Images not displaying**
- Check image paths are correct
- Verify images exist in Shopify or `/public/products/`
- Check image URLs are accessible

**5. WhatsApp not opening**
- Verify WhatsApp number format (no spaces, include country code)
- Test on mobile device
- Check if WhatsApp is installed

### Debug Mode

Add debug logging:

```typescript
// In .env
VITE_DEBUG_MODE=true

// In shopify.ts
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('Shopify API call:', { method, params });
}
```

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Check inventory levels
- Review abandoned carts
- Respond to customer inquiries
- Update product availability

**Monthly:**
- Review sales analytics
- Update product descriptions
- Add new recipes/content
- Check for broken links

**Quarterly:**
- Update pricing if needed
- Add seasonal products
- Review and respond to reviews
- Update FAQ section

### Getting Help

**Shopify Support:**
- Help Center: help.shopify.com
- Community Forums: community.shopify.com
- 24/7 Support: Available on paid plans

**Frontend Issues:**
- Check browser console for errors
- Review this documentation
- Contact developer: [your-email@example.com]

---

## Security Best Practices

1. **Never expose Admin API credentials in frontend**
   - Only use Storefront API token in frontend
   - Keep Admin API token server-side only

2. **Environment Variables**
   - Never commit `.env` to Git
   - Use different tokens for development and production
   - Rotate tokens periodically

3. **HTTPS Only**
   - Always use HTTPS in production
   - Shopify checkout requires HTTPS

4. **Input Validation**
   - Validate email addresses
   - Sanitize user inputs
   - Use Shopify's built-in fraud detection

---

## Quick Start Guide for Client

### Immediate Setup (30 minutes)

1. **Create Shopify Account**
   - Go to shopify.com/free-trial
   - Sign up with email
   - Choose store name

2. **Add First Product**
   - Products → Add product
   - Enter: Title, Price, Image
   - Save

3. **Get API Credentials**
   - Settings → Apps and sales channels → Develop apps
   - Create app → Get Storefront API token
   - Copy token

4. **Configure Frontend**
   - Open `.env` file
   - Paste Shopify store domain
   - Paste API token
   - Save

5. **Test Locally**
   ```bash
   npm install
   npm run dev
   ```
   - Open http://localhost:5173
   - Verify products load
   - Test add to cart

6. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### Next Steps

- Complete all 6 product setups
- Configure payment gateways
- Set up shipping zones
- Customize email templates
- Add bundle products
- Test end-to-end checkout

---

## Additional Resources

### Documentation Links

- **Shopify Storefront API:** shopify.dev/docs/api/storefront
- **Shopify Buy SDK:** shopify.github.io/js-buy-sdk
- **React Hooks:** react.dev/reference/react
- **Tailwind CSS:** tailwindcss.com/docs
- **Vite:** vitejs.dev/guide

### Shopify Apps to Consider

1. **Product Reviews:** Judge.me, Loox, Yotpo
2. **WhatsApp Chat:** SuperLemon, Zotabox
3. **Email Marketing:** Shopify Email, Klaviyo
4. **Bundles:** Bundle Products, Bundler
5. **Analytics:** Google Analytics, Lucky Orange
6. **SEO:** Plug in SEO, Smart SEO

### Payment Gateway Options (India)

1. **Razorpay** (Recommended)
   - Easy integration
   - Low transaction fees
   - COD support
   - UPI, cards, wallets

2. **PayU**
   - Popular in India
   - Multiple payment options
   - Good for COD

3. **Shopify Payments**
   - Seamless integration
   - May not support all Indian payment methods

---

## Contact Information

**For Technical Support:**
- Developer Email: [your-email]
- Documentation: This file
- Shopify Support: help.shopify.com

**For Business Queries:**
- WhatsApp: +91-98765-43210
- Email: hello@liimra.com

---

## Version History

- **v1.0** (2026-03-27): Initial documentation
  - Shopify integration guide
  - Product configuration
  - Cart and checkout setup
  - WhatsApp and email integration

---

## Appendix

### A. Complete Product Checklist

Use this checklist when adding each product to Shopify:

**Product: _____________**

- [ ] Title and handle set
- [ ] Product type: "Millet Flour"
- [ ] Vendor: "Liimra Naturals"
- [ ] Description added (with HTML formatting)
- [ ] All size variants created
- [ ] Pricing set (price + compare_at_price)
- [ ] SKUs assigned
- [ ] Inventory quantities set
- [ ] Images uploaded (primary + variants)
- [ ] Tags added (primary: and secondary:)
- [ ] All metafields filled:
  - [ ] display_name
  - [ ] scientific_name
  - [ ] common_name
  - [ ] emoji
  - [ ] status
  - [ ] rating
  - [ ] review_count
  - [ ] primary_benefit
  - [ ] benefit_description
  - [ ] health_benefits (JSON)
  - [ ] recipes (JSON)
  - [ ] nutrients (JSON)
  - [ ] color_theme (JSON)
- [ ] Product published to "Online Store" channel
- [ ] Product tested in frontend

### B. Environment Variables Reference

```env
# Required
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here

# Contact
VITE_WHATSAPP_NUMBER=919876543210
VITE_CONTACT_EMAIL=hello@liimra.com

# Optional
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_FACEBOOK_PIXEL_ID=123456789
VITE_DEBUG_MODE=false

# Shipping
VITE_FREE_SHIPPING_THRESHOLD=299
VITE_STANDARD_SHIPPING_COST=50

# Features
VITE_ENABLE_COD=true
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=false
```

### C. Shopify Webhook Configuration (Advanced)

For real-time updates, configure webhooks:

**In Shopify Admin:**
Settings → Notifications → Webhooks

**Recommended Webhooks:**
- `products/update`: Update frontend cache when products change
- `inventory_levels/update`: Update stock availability
- `orders/create`: Track new orders
- `checkouts/create`: Track cart abandonment

**Webhook Endpoint:**
You'll need a backend server to receive webhooks. Consider using:
- Shopify Functions
- AWS Lambda
- Vercel Serverless Functions

---

## Final Notes

This documentation provides a complete guide for integrating your React frontend with Shopify. The client should:

1. Follow the setup steps in order
2. Use the checklists to ensure nothing is missed
3. Test thoroughly before going live
4. Refer to troubleshooting section for common issues

**Estimated Setup Time:**
- Shopify store setup: 2-3 hours
- Product configuration: 4-6 hours (for 6 products)
- Frontend integration: 8-12 hours (if following this guide)
- Testing: 4-6 hours
- **Total: 18-27 hours**

The frontend is production-ready and just needs the Shopify backend configuration to be fully functional.
