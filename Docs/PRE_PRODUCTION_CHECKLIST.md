# Production Pre-Flight Checklist: Liimra Naturals

Before running the final production build (`npm run build`) and deploying this React application to your hosting provider (Vercel, Netlify, Shopify Hydrogen, etc.), you must verify the following items to ensure security and tracking accuracy.

## 1. Environment & Secrets Setup
- [ ] **Production Keys:** Ensure your hosting provider's "Environment Variables" settings are populated with the exact values from your `.env` file. The local `.env` file is intentionally ignored by `.gitignore` and will not be pushed to production.
  - `VITE_SHOPIFY_STORE_DOMAIN`
  - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - `VITE_GTM_ID` (Google Tag Manager/Analytics)
  - `VITE_META_PIXEL_ID`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 2. Supabase Backend Security
- [ ] **Row Level Security (RLS)**: Double-check that RLS is enabled on the `analytics_events` table. If it is turned off, anyone on the internet could theoretically read or delete your analytics data.
- [ ] **Insertion Policy**: Verify that the only active policy on `analytics_events` is the `INSERT` policy we created, which allows the frontend to write data, but never read it.

## 3. Pixel & Analytics Verification
- [ ] **Meta Pixel Helper**: Once deployed, use the "Meta Pixel Helper" Chrome extension to verify that `PageView` and custom events like `ScrollDepth25` are firing directly to your Meta Ads Manager.
- [ ] **Google Analytics 4**: Open `Analytics > Realtime` in your GA4 dashboard. Visit your live site and trigger a `Search` or `AddToCart` to instantly verify the `dataLayer` is piping to Google correctly.

## 4. Compile & Build Testing
- [ ] **TypeScript Build Check**: Run `npm run build` locally on your machine. If Vite throws any strict TypeScript compilation errors, they must be fixed before the deployment pipelines accept the codebase.
- [ ] **Linting Passes**: Optionally run `npm run lint` to catch any unused imports or variables that were left behind during development.

## 5. E-Commerce Checkout Bridge
- [ ] **Shopify Confirmation Pixel**: The React app safely directs users to the Shopify checkout screen to finalize their purchase. Ensure that inside Shopify settings > Customer Events, you have a tracking pixel configured to fire the final `Purchase` event (tied to the same GA4 and Meta IDs) when the order completes.
