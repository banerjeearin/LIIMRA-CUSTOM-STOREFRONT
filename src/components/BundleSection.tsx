import { useState, memo, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";

const OLIVE_DARK = "#3e4c1d";
const NEON = "#aeb30a";
const NEON_DIM = "rgba(174,179,10,0.15)";

type Bundle = {
  id: string;
  ribbon: string;
  title: string;
  subtitle: string;
  items: { image: string; name: string; weight: string; mrp: number }[];
  totalMrp: number;
  bundlePrice: number;
  savePct: number;
  tag: string;
};

const bundles: Bundle[] = [
  {
    id: "trio",
    ribbon: "✦ Most Popular",
    title: "Sugar Control Trio",
    subtitle: "The 3 best low-GI flours for blood sugar control. Real results: HbA1c from 8.2 → 6.9 in 3 months.",
    items: [
      { image: "/products/ragi-250gm.png",  name: "Ragi Flour",  weight: "250g · Finger Millet", mrp: 199 },
      { image: "/products/jowar-250gm.png", name: "Jowar Flour", weight: "250g · Sorghum",        mrp: 189 },
      { image: "/products/bajra-250 gm.png", name: "Bajra Flour", weight: "250g · Pearl Millet",   mrp: 179 },
    ],
    totalMrp: 567,
    bundlePrice: 439,
    savePct: 22,
    tag: "Best for blood sugar",
  },
  {
    id: "complete",
    ribbon: "✦ Best Value",
    title: "Complete Millet Collection",
    subtitle: "All 6 flours. Complete nutrition. One simple choice for your family's health.",
    items: [
      { image: "/products/ragi-250gm.png",   name: "Ragi Flour",      weight: "250g · Finger Millet", mrp: 199 },
      { image: "/products/jowar-250gm.png",  name: "Jowar Flour",     weight: "250g · Sorghum",       mrp: 189 },
      { image: "/products/bajra-250 gm.png",  name: "Bajra Flour",     weight: "250g · Pearl Millet",  mrp: 179 },
      { image: "/products/kangni-250gm.png", name: "Kangni Flour",    weight: "250g · Foxtail Millet",mrp: 189 },
      { image: "/products/kutki-250gm.png",  name: "Kutki Flour",     weight: "250g · Little Millet", mrp: 199 },
      { image: "/products/rice-500gm.png",   name: "Rice Flour",      weight: "500g · Stone-Ground",  mrp: 129 },
    ],
    totalMrp: 1084,
    bundlePrice: 799,
    savePct: 26,
    tag: "Complete nutrition",
  },
];

const volumeTiers = [
  { qty: "1×",  label: "Single order" },
  { qty: "2×",  label: "5% off" },
  { qty: "3×",  label: "10% off" },
];

const BundleCard = memo(({ bundle, activeVol, setActiveVol }: { bundle: Bundle; activeVol: number; setActiveVol: (i: number) => void }) => {
  const { addItem, openCart } = useCart();
  const { getProduct } = useProducts();
  const discounts = [0, 0.05, 0.10];
  const finalPrice = Math.round(bundle.bundlePrice * (1 - discounts[activeVol]));

  const handleAddBundle = () => {
    bundle.items.forEach((item) => {
      const productId = item.name.toLowerCase().split(" ")[0];
      const product = getProduct(productId);
      if (product) {
        const size = product.sizes.find((s) => s.size === item.weight.split(" ")[0]) || product.sizes[0];
        addItem({
          productId: product.id,
          variantId: size.variantId || `${product.id}-${size.size}`,
          name: product.name,
          size: size.size,
          quantity: activeVol + 1,
          price: size.price,
          mrp: size.mrp,
          image: product.image,
        });
      }
    });
    openCart();
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "0.67px solid rgba(255,255,255,0.11)",
      }}
    >
      {/* Ribbon */}
      <div className="text-center py-2.5 font-body text-xs font-black tracking-[0.1em] uppercase" style={{ background: NEON, color: OLIVE_DARK }}>
        {bundle.ribbon} · {bundle.tag}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-display font-black text-white text-xl leading-tight mb-1">{bundle.title}</h3>
          <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{bundle.subtitle}</p>
        </div>

        {/* Product thumbnails + list */}
        <div className="flex flex-col gap-2.5">
          {bundle.items.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-contain p-1" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-white truncate">{item.name}</div>
                <div className="font-body text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>{item.weight}</div>
              </div>
              <span className="font-body text-xs line-through flex-shrink-0" style={{ color: "rgba(255,255,255,0.28)" }}>₹{item.mrp}</span>
            </div>
          ))}
        </div>

        <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Volume qty selector */}
        <div className="flex gap-2">
          {volumeTiers.map((t, i) => (
            <button
              key={t.qty}
              onClick={() => setActiveVol(i)}
              className="flex-1 font-body text-xs py-2 rounded-full transition-all duration-200 text-center"
              style={
                activeVol === i
                  ? { background: NEON, color: OLIVE_DARK, fontWeight: 700 }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }
              }
            >
              <div className="font-bold">{t.qty}</div>
              <div className="text-[9px] opacity-80">{t.label}</div>
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="font-body text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Bundle Price</div>
            <div className="font-body text-xs line-through mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>MRP ₹{bundle.totalMrp}</div>
          </div>
          <div className="text-right">
            <div className="font-display font-black text-3xl text-white">₹{finalPrice}</div>
            <span className="font-body text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: NEON_DIM, color: NEON }}>
              Save {bundle.savePct + Math.round(discounts[activeVol] * 100)}%
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddBundle}
          className="w-full font-body text-sm font-bold tracking-[0.05em] uppercase py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 mt-auto"
          style={{ background: NEON, color: OLIVE_DARK, boxShadow: `0 3px 12px ${NEON}28`, willChange: "filter" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Add to Cart — ₹{finalPrice}
        </button>

        <p className="font-body text-center text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>
          ✓ COD available · Free shipping · 30-day guarantee
        </p>
      </div>
    </div>
  );
});

BundleCard.displayName = "BundleCard";

const BundleSection = memo(() => {
  const [activeVol0, setActiveVol0] = useState(0);
  const [activeVol1, setActiveVol1] = useState(0);
  const sectionRef = useScrollReveal();

  const handleSetActiveVol0 = useCallback((i: number) => setActiveVol0(i), []);
  const handleSetActiveVol1 = useCallback((i: number) => setActiveVol1(i), []);

  return (
    <section
      ref={sectionRef}
      id="bundles"
      className="relative overflow-hidden scroll-reveal-scale"
      style={{ background: OLIVE_DARK, padding: "96px 0" }}
    >
      {/* Radial neon glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            `radial-gradient(ellipse at 5% 85%, ${NEON}08 0%, transparent 50%),
             radial-gradient(ellipse at 95% 15%, ${NEON}06 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
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

        {/* Two bundle cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <BundleCard bundle={bundles[0]} activeVol={activeVol0} setActiveVol={handleSetActiveVol0} />
          <BundleCard bundle={bundles[1]} activeVol={activeVol1} setActiveVol={handleSetActiveVol1} />
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {[
            { icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, label: "COD Available" },
            { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>, label: "30-Day Guarantee" },
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
