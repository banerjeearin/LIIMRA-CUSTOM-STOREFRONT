

# Liimra Naturals -- Immersive Product Showcase Website

## Overview

A single-page, scroll-driven product showcase for Liimra Naturals' 4 millet flours (Ragi, Jowar, Bajra, Kangni). Inspired by Hungry Tiger's bold typography and full-bleed product-centric design. Each product gets a full-viewport "card" in a horizontal-stack metaphor -- scrolling vertically transitions between products with smooth animations.

## Design Direction

- **Typography**: Cormorant Garamond (display/serif) + Jost (body/sans-serif), all-caps bold headlines like Hungry Tiger
- **Color**: Each product has its own color theme (from PRD), background transitions as you scroll between products
- **Layout**: Full-viewport product sections, product name in massive display type, product details overlaid
- **No product images uploaded yet** -- will use illustrated SVG grain graphics as described in PRD, with gradient backgrounds per product

## Architecture

### Files to create/modify:

1. **`src/index.css`** -- Add Google Fonts (Cormorant Garamond, Jost), custom CSS variables from PRD color palette, scroll-snap styles, keyframe animations (float, fade-in, slide)

2. **`src/pages/Index.tsx`** -- Main single-page app with these sections:
   - Header bar (logo text "LIIMRA NATURALS", nav: Shop, Bundles, Our Millets, Recipes, About)
   - Product showcase (scroll-snapping full-viewport sections for each of 4 products)
   - Floating info button (certifications, support, shipping bundled together)

3. **`src/components/ProductSection.tsx`** -- Full-viewport product showcase card:
   - Massive product name in display font (like "BOLD FLAVOR" on Hungry Tiger)
   - Subtitle with scientific name
   - Health tags/badges
   - Price with MRP strikethrough
   - Size selector pills
   - Add to Cart / Buy Now / Favourite (heart icon) buttons
   - Nutritional highlights
   - Background gradient per product color scheme

4. **`src/components/Header.tsx`** -- Sticky header with logo, nav links (pill-style like Hungry Tiger), cart icon

5. **`src/components/FloatingInfoButton.tsx`** -- Floating button (bottom-right) that opens a sheet/drawer with: FSSAI cert, shipping info, COD details, WhatsApp support, 30-day guarantee, payment methods

6. **`src/data/products.ts`** -- Product data for all 4 flours (Ragi, Jowar, Bajra, Kangni placeholder) with pricing, tags, nutritional info, color themes

### Scroll Behavior
- CSS `scroll-snap-type: y mandatory` on the container
- Each product section is `100vh` with `scroll-snap-align: start`
- On scroll, background color transitions smoothly using CSS transitions
- Product content animates in (fade + slide from bottom) using Intersection Observer

### Animations (CSS-based, no Three.js for first draft)
- Scroll-snap transitions between products
- Fade-in + translateY for product details on enter
- Floating grain particle decorations (CSS keyframe)
- Subtle product name parallax effect
- Pulsing "live" indicator dots

### Floating Info Button Content (organized in a Sheet)
- FSSAI Certified badge
- Shipping: 48hr dispatch, free above ₹299
- Payment: COD, UPI, Cards
- 30-Day Guarantee
- WhatsApp Support link
- Returns Policy summary

## Technical Details

- **No Three.js/WebGL** in first draft -- pure CSS animations + Intersection Observer for performance. Can add later.
- **No Shopify** yet -- mock cart with state (React useState), buttons are functional UI only
- **Kangni flour** -- will add as 4th product with placeholder data (user can provide details later)
- **Responsive** -- mobile-first, scroll-snap works on mobile, sticky mobile CTA bar at bottom
- **Fonts**: Google Fonts via `@import` in CSS

