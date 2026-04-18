import { useState, memo, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/data/products";

const OLIVE_DARK = "#3e4c1d";
const NEON = "#aeb30a";
const NEON_DIM = "rgba(174,179,10,0.15)";

const volumeTiers = [
  { qty: "1×",  label: "Single order" },
  { qty: "2×",  label: "5% off" },
  { qty: "3×",  label: "10% off" },
];

const BundleCard = memo(({ bundleProduct, allProducts, activeVol, setActiveVol }: { bundleProduct: Product; allProducts: Product[]; activeVol: number; setActiveVol: (i: number) => void }) => {
  const { addItem, openCart } = useCart();
  const discounts = [0, 0.05, 0.10];

  let hydratedItems = bundleProduct.bundleItems || [];
  
  // FALLBACK: If Shopify metafields aren't configured, use local mappings
  if (hydratedItems.length === 0) {
    let ids: string[] = [];
    if (bundleProduct.name.toLowerCase().includes("trio")) {
      ids = ["ragi", "jowar", "bajra"];
    } else if (bundleProduct.name.toLowerCase().includes("six") || bundleProduct.name.toLowerCase().includes("6") || bundleProduct.name.toLowerCase().includes("complete")) {
      ids = ["ragi", "jowar", "bajra", "kangni", "kutki", "kodo"];
    }
    
    // Map from global products list to get prices/images
    hydratedItems = ids.map(id => {
      const match = allProducts.find(p => p.id.toLowerCase().includes(id) || p.name.toLowerCase().includes(id));
      if (!match) return null;
      const size = match.sizes[0];
      return {
        id: match.id,
        name: match.name,
        image: match.image,
        mrp: size?.mrp || 150,
        price: size?.price || 120,
        weight: "250g",
        variantId: size?.variantId || ""
      };
    }).filter(Boolean) as any[];
  }
  
  // Base values from the bundle itself, with logical fallbacks
  const dynamicTotalMrp = hydratedItems.length > 0 ? hydratedItems.reduce((acc, item: any) => acc + item.mrp, 0) : (bundleProduct.sizes && bundleProduct.sizes[0] ? bundleProduct.sizes[0].mrp : 864);
  const savePct = bundleProduct.savePct || 15;
  
  const baseBundlePrice = bundleProduct.sizes[0]?.price || Math.round(dynamicTotalMrp * (1 - savePct / 100));
  const finalPrice = Math.round(baseBundlePrice * (1 - discounts[activeVol]));

  const handleAddBundle = () => {
    const size = bundleProduct.sizes[0];
    // Add the actual Bundle Product to the cart so Shopify tracks it as one unit!
    addItem({
      productId: bundleProduct.id,
      variantId: size?.variantId || `${bundleProduct.id}-bundle`,
      name: bundleProduct.name,
      size: size?.size || "Bundle",
      quantity: activeVol + 1,
      price: finalPrice,
      mrp: dynamicTotalMrp,
      image: bundleProduct.image,
    });
    openCart();
  };

  return (
    <div
      className="rounded-[24px] w-full overflow-hidden text-white flex flex-col relative"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.11)",
      }}
    >
      {/* 1. The Hook */}
      <div className="text-center py-2.5 font-body text-xs font-black tracking-[0.15em] uppercase" style={{ background: NEON, color: OLIVE_DARK }}>
        {bundleProduct.ribbon || "✦ Bestseller Combo"} · {bundleProduct.bundleTag || "Best Value"}
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-display font-black text-3xl mb-2 tracking-tight text-white leading-tight">{bundleProduct.name}</h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {(() => {
              try {
                let descStr = bundleProduct.subtitle || bundleProduct.detailedDescription || "";
                
                // If we need to fallback to the raw HTML description, extract ONLY the first paragraph
                // so we don't accidentally render embedded <h2> titles or giant lists
                if (!descStr && bundleProduct.descriptionHtml) {
                  const pMatch = bundleProduct.descriptionHtml.match(/<p>([\s\S]*?)<\/p>/i);
                  descStr = pMatch && pMatch[1] ? pMatch[1] : bundleProduct.descriptionHtml;
                }

                if (descStr.trim().length === 0) {
                   return "The foundation of traditional Indian health in one pack (Default)";
                }
                const cleaned = descStr.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                if (!cleaned) return "The foundation of traditional Indian health in one pack (Cleaned empty)";
                return cleaned.length > 120 ? cleaned.substring(0, 120) + "..." : cleaned;
              } catch(e) {
                return "Error parsing description";
              }
            })()}
          </p>
        </div>

        {/* 2. The Visual (Horizontal layout of packets) */}
        <div className="relative h-32 rounded-xl flex items-center justify-center p-4 mt-2 mb-2" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }}>
          <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.05), transparent)" }} />
          <div className="flex items-center -space-x-4 relative z-10 w-full justify-center overflow-x-auto no-scrollbar py-4 px-2">
            {hydratedItems.map((item: any, idx: number) => {
              const total = hydratedItems.length;
              // Add a slight cascade effect
              const rotation = total === 3 ? (idx === 0 ? '-5deg' : idx === 2 ? '5deg' : '0deg') : '0deg';
              const zIndex = total === 3 ? (idx === 1 ? 10 : 5) : 5 + idx;
              const scale = total === 3 ? (idx === 1 ? 'scale(1.15)' : 'scale(1)') : 'scale(1)';
              
              return (
                <img 
                  key={item.id} 
                  src={item.image} 
                  alt={item.name} 
                  className={`object-cover rounded-lg flex-shrink-0 ${total > 3 ? 'w-16 h-20 -space-x-6' : 'w-20 h-24'}`}
                  style={{
                    transform: `rotate(${rotation}) ${scale}`,
                    zIndex,
                    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))",
                    transition: "transform 0.3s ease"
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* 3. The Science / The Why */}
        <div className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4" style={{ color: NEON }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-body text-xs font-bold uppercase tracking-wider" style={{ color: NEON }}>Scientific Synergy</span>
          </div>
          <ul className="space-y-2.5">
            {hydratedItems.slice(0, 3).map((item: any) => {
               // Extract short name "Ragi" from "Liimra Naturals - Ragi Flour"
               const itemName = item.name.toLowerCase();
               let shortName = "Flour";
               if (itemName.includes("ragi")) shortName = "Ragi";
               else if (itemName.includes("jowar")) shortName = "Jowar";
               else if (itemName.includes("bajra")) shortName = "Bajra";
               else if (itemName.includes("kangni")) shortName = "Kangni";
               else if (itemName.includes("kutki")) shortName = "Kutki";
               else if (itemName.includes("kodo")) shortName = "Kodo";

               // Get a fake descriptive benefit if product object doesn't have it loaded natively from fallback lookup
               const actualProd = allProducts.find(p => p.id === item.id);
               const benefit = actualProd?.primaryBenefit || "Nutrient-dense ancient grain for daily health.";
               
               return (
                 <li key={item.id} className="flex items-start gap-3 font-body text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <span className="mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                    <span><strong className="text-white">{shortName}:</strong> {benefit}</span>
                 </li>
               )
            })}
            {hydratedItems.length > 3 && (
               <li className="flex items-start gap-3 font-body text-sm text-white/50 italic">
                  <span className="mt-0.5">•</span>
                  <span>Plus {hydratedItems.length - 3} more powerful grains...</span>
               </li>
            )}
          </ul>
        </div>

        {/* 4. Pricing & Interaction */}
        <div className="mt-auto pt-2 flex flex-col gap-6">
          {/* Volume Tabs */}
          <div className="flex gap-2">
            {volumeTiers.map((t, i) => (
              <button
                key={t.qty}
                onClick={() => setActiveVol(i)}
                className="flex-1 font-body py-2.5 rounded-lg text-center transition-all duration-200"
                style={
                  activeVol === i
                    ? { background: NEON, color: OLIVE_DARK, fontWeight: 700 }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
                }
              >
                <div className="text-sm font-bold">{t.qty} {i === 0 ? "Pack" : ""}</div>
                {i > 0 && <div className="block text-[10px] uppercase mt-0.5">{t.label}</div>}
              </button>
            ))}
          </div>

          {/* Price Summary */}
          <div className="flex items-end justify-between">
            <div>
              <div className="font-body text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Bundle Total</div>
              <div className="font-body text-xs line-through" style={{ color: "rgba(255,255,255,0.3)" }}>MRP ₹{dynamicTotalMrp}</div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <div className="font-display text-3xl font-black text-white leading-none">₹{finalPrice}</div>
              <span className="font-body text-[10px] font-bold px-2 py-1 rounded inline-block" style={{ background: NEON_DIM, color: NEON }}>
                SAVE {savePct + Math.round(discounts[activeVol] * 100)}%
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddBundle}
            className="w-full font-body font-bold tracking-[0.05em] uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110"
            style={{ background: NEON, color: OLIVE_DARK, boxShadow: `0 4px 14px rgba(174,179,10,0.3)` }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Add Complete Protocol
          </button>
          
          <p className="font-body text-center text-[10px] uppercase tracking-wide font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
            ✓ COD AVAILABLE · FREE SHIPPING
          </p>
        </div>
      </div>
    </div>
  );
});

BundleCard.displayName = "BundleCard";

const BundleSection = memo(() => {
  const [activeVol0, setActiveVol0] = useState(0);
  const [activeVol1, setActiveVol1] = useState(0);
  const sectionRef = useScrollReveal();
  const { products } = useProducts();

  const handleSetActiveVol0 = useCallback((i: number) => setActiveVol0(i), []);
  const handleSetActiveVol1 = useCallback((i: number) => setActiveVol1(i), []);

  const bundlesToDisplay = products.filter(p => p.isBundle === true).slice(0, 2);

  return (
    <section
      ref={sectionRef}
      id="bundles"
      className="relative overflow-hidden scroll-reveal-scale"
      style={{ background: OLIVE_DARK, padding: "96px 0" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            `radial-gradient(ellipse at 5% 85%, ${NEON}08 0%, transparent 50%),
             radial-gradient(ellipse at 95% 15%, ${NEON}06 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-4 justify-center">
            <div className="w-8 h-px" style={{ background: NEON }} />
            <span className="font-body text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: NEON }}>
              Best Value
            </span>
            <div className="w-8 h-px" style={{ background: NEON }} />
          </div>
          <TypewriterTitle
            centered
            className="text-white mb-4"
          >
            Save more. <em className="not-italic" style={{ color: NEON }}>Care better.</em>
          </TypewriterTitle>
          <p className="font-body text-sm text-center max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Curated bundles for every health goal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto min-h-[400px]">
          {bundlesToDisplay.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center text-white/50 text-sm font-body tracking-wider uppercase">Loading Bundles...</div>
          ) : (
            <>
              {bundlesToDisplay[0] && <BundleCard allProducts={products} bundleProduct={bundlesToDisplay[0]} activeVol={activeVol0} setActiveVol={handleSetActiveVol0} />}
              {bundlesToDisplay[1] && <BundleCard allProducts={products} bundleProduct={bundlesToDisplay[1]} activeVol={activeVol1} setActiveVol={handleSetActiveVol1} />}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {[
            { icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, label: "COD Available" },
            { icon: <><path d="M5 12h14M12 5l7 7-7 7" /></>, label: "Ships in 48 hrs" },
            { icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>, label: "WhatsApp Support" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2 font-body text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2 flex-shrink-0">{t.icon}</svg>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

BundleSection.displayName = "BundleSection";

export default BundleSection;
