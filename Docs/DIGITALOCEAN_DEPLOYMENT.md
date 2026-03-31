# Live Deployment Guide: DigitalOcean + GoDaddy + Shopify

Because your custom React storefront on DigitalOcean now needs to take control of your main `liimra.in` domain (which Shopify currently holds), we must completely split the traffic router using GoDaddy.

## Phase 1: Deploy on DigitalOcean (App Platform)

This step will successfully host your frontend codebase securely.

1. Create a [DigitalOcean](https://digitalocean.com) account.
2. Navigate to **Apps** in the left-hand sidebar and click **Create App**.
3. Choose **GitHub** as the source provider and authenticate your account.
4. Select your repository: `LIIMRA-CUSTOM-STOREFRONT` (Branch: `main`).
5. **Configuration Details**:
    - **Resource Type**: Ensure this is set to **Static Site** (and not 'Web Service', because this is a Vite SPA).
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
6. **Environment Variables**: Click Edit and add the exact keys from your local `.env`.
    - `VITE_SHOPIFY_STORE_DOMAIN`
    - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `VITE_GTM_ID`
    - `VITE_META_PIXEL_ID`
7. Click **Deploy**. DigitalOcean will immediately launch your application onto a temporary `.ondigitalocean.app` domain. Wait until deployment finishes completely successfully with a green checkmark.

## Phase 2: Domain Takeover on GoDaddy

Next, we purposefully strip `liimra.in` away from the standard standard Shopify theme server and point it mathematically to DigitalOcean.

> [!WARNING]
> Be extremely careful when clicking "Delete" inside GoDaddy DNS settings. Ensure you are only deleting the precise A and CNAME records listed here.

1. Log into your **GoDaddy** account.
2. Open the **DNS Management** page specifically for `liimra.in`.
3. **Delete Existing Shopify Records**:
   - Find the `A Record` with the Name `@` pointing to Shopify's IP (typically `23.227.38.65` or similar) and click **Delete**.
   - Find the `CNAME Record` with the Name `www` pointing to `shops.myshopify.com` and click **Delete**.
4. **Acquire New Records from DO**:
   - Inside DigitalOcean App Platform, navigate to your App -> **Settings** -> **Domains**.
   - Click "Add Domain" and type `liimra.in`. Select the option "You manage your domain" (GoDaddy).
   - DigitalOcean will provide you with a new, temporary CNAME string.
5. **Point GoDaddy to DO**:
   - Go back to GoDaddy and **Add** the new CNAME record DigitalOcean just gave you into the DNS list.

## Phase 3: Enabling Headless Checkout (Shopify Domain)

Since the React app now strictly controls your main domain, your customers inevitably still need a secure path to finalize credit card payments securely. We will route Shopify to an exclusive subdomain (`checkout.liimra.in`).

1. Look in the **GoDaddy DNS Management** page one final time.
2. Click **Add New Record**:
   - **Type**: `CNAME`
   - **Name (Host)**: `checkout`
   - **Value**: `shops.myshopify.com`
3. Hit Save.
4. Now, log into your **Shopify Admin Dashboard**.
5. Navigate to **Settings** > **Domains**.
6. Click **Connect existing domain** and enter the raw string `checkout.liimra.in`.
7. Once it connects and verifies successfully, click on `checkout.liimra.in` and officially set it as the **Primary Domain**.
8. *Verification*: At this point, any "Proceed to Checkout" click triggered by your headless DigitalOcean application will natively redirect the customer directly to `checkout.liimra.in` to swipe their credit card!

> [!NOTE]
> DNS propagation across global Wi-Fi towers can take anywhere from 1 hour to 24 hours. Please do not panic if your site is temporarily unreachable right after changing GoDaddy settings!
