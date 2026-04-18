import { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from "react";
import Header from "@/components/Header";
import FloatingInfoButton from "@/components/FloatingInfoButton";
import ScrollProgress from "@/components/ScrollProgress";
import ProductDrawer from "@/components/ProductDrawer";
import CartDrawer from "@/components/CartDrawer";
import ViewingNow from "@/components/ViewingNow";
import { SEO } from "@/components/SEO/SEO";
import { OrganizationSchema, FAQSchema } from "@/components/SEO/StructuredData";
import { useImpressionTracker } from "@/hooks/useImpressionTracker";

const GoalSelectorSection = lazy(() => import("@/components/GoalSelectorSection"));
const BundleSection = lazy(() => import("@/components/BundleSection"));
const RecipeSection = lazy(() => import("@/components/RecipeSection"));
const ExpertVoicesSection = lazy(() => import("@/components/ExpertVoicesSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const WhyLiimraSection = lazy(() => import("@/components/WhyLiimraSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));

const deckCards = [
  { id: "bajra",  name: "Bajra Flour",  image: "/products/bajra-250gm.webp" },
  { id: "jowar",  name: "Jowar Flour",  image: "/products/jowar-250gm.webp" },
  { id: "kangni", name: "Kangni Flour", image: "/products/kangni-250gm.webp" },
  { id: "kutki",  name: "Kutki Flour",  image: "/products/kutki-250gm.webp" },
  { id: "ragi",   name: "Ragi Flour",   image: "/products/ragi-250gm.webp" },
  { id: "rice-flour",   name: "Rice Flour",   image: "/products/rice-500gm.webp" },
];

// Base config for desktop (1200px+)
const BASE_CARD_CONFIG = [
  { rotate: -30, translateX: -420, translateY: 30 },
  { rotate: -18, translateX: -250, translateY: 12 },
  { rotate:  -7, translateX:  -85, translateY:  2 },
  { rotate:   4, translateX:   85, translateY:  2 },
  { rotate:  15, translateX:  250, translateY: 12 },
  { rotate:  26, translateX:  420, translateY: 30 },
];

function getDeckParams(width: number) {
  if (width < 400) {
    // Very small phones â€” tight 3-card fan, hide outer cards
    return { cardWidth: 140, scale: 0.42, deckTop: 430, deckHeight: 280, paddingBottom: 150 };
  }
  if (width < 640) {
    return { cardWidth: 160, scale: 0.50, deckTop: 470, deckHeight: 320, paddingBottom: 180 };
  }
  if (width < 768) {
    return { cardWidth: 200, scale: 0.60, deckTop: 500, deckHeight: 360, paddingBottom: 210 };
  }
  if (width < 1024) {
    return { cardWidth: 260, scale: 0.75, deckTop: 470, deckHeight: 430, paddingBottom: 250 };
  }
  return { cardWidth: 340, scale: 1.0,  deckTop: 530, deckHeight: 500, paddingBottom: 280 };
}

// Rotating hero messages for different personas
const heroMessages = [
  {
    persona: "For Moms",
    headline: "Kids Will Ask for Seconds",
    subheadline: "Stone-ground millet flours that taste amazing",
  },
  {
    persona: "For Diabetics",
    headline: "Take Control of Your Blood Sugar",
    subheadline: "Low-GI flours recommended by doctors",
  },
  {
    persona: "For Wellness",
    headline: "Clean Eating, Made Simple",
    subheadline: "Zero additives. Just pure, fresh nutrition",
  },
  {
    persona: "For Fitness",
    headline: "Fuel Goals, Not Cravings",
    subheadline: "High-protein, low-GI carbs for performance",
  },
];

const Index = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);
  const resizeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (resizeTimerRef.current !== null) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = window.setTimeout(() => {
        setVw(window.innerWidth);
      }, 150);
    };
    
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimerRef.current !== null) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  // Rotate hero messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setDrawerOpen(true);
  }, []);

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    setSelectedProductId((currentId) => {
      const currentIndex = deckCards.findIndex((c) => c.id === currentId);
      let newIndex;
      if (direction === "prev") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : deckCards.length - 1;
      } else {
        newIndex = currentIndex < deckCards.length - 1 ? currentIndex + 1 : 0;
      }
      return deckCards[newIndex].id;
    });
  }, []);

  const { cardWidth, scale, deckTop, deckHeight, paddingBottom } = useMemo(
    () => getDeckParams(vw),
    [vw]
  );

  const cardConfig = useMemo(
    () => BASE_CARD_CONFIG.map((cfg) => ({
      rotate: cfg.rotate,
      translateX: cfg.translateX * scale,
      translateY: cfg.translateY * scale,
    })),
    [scale]
  );

  return (
    <main className="relative">
      <SEO />
      <OrganizationSchema />
      <FAQSchema />
      <ScrollProgress />
      <Header />

      {/* â”€â”€ Hero section â”€â”€ */}
      <section
        className="relative bg-[hsl(var(--liimra-cream))]"
        style={{ minHeight: "100vh", paddingBottom: `${paddingBottom}px`, overflow: "hidden" }}
      >
        {/* Subtle grain particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: "auto" }}>
          {[...Array(vw < 768 ? 4 : 8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${20 + i * 15}px`,
                height: `${20 + i * 15}px`,
                background: `hsl(var(--liimra-sage) / 0.06)`,
                left: `${10 + i * 11}%`,
                top: `${5 + (i % 4) * 18}%`,
                animation: `grain-float ${5 + i * 0.6}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Hero text block */}
        <div className="flex items-center justify-center pt-24 sm:pt-28 pb-4">
          <div className="w-full max-w-5xl mx-auto px-5 sm:px-6 text-center relative" style={{ zIndex: 10 }}>
            {/* Persona indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {heroMessages.map((msg, i) => (
                <button
                  key={msg.persona}
                  onClick={() => setHeroIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: heroIndex === i ? "32px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: heroIndex === i ? "hsl(var(--liimra-forest))" : "hsl(var(--liimra-border))",
                    willChange: heroIndex === i ? "width" : "auto",
                  }}
                  aria-label={msg.persona}
                />
              ))}
            </div>
            
            <p className="font-body text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[hsl(var(--liimra-ink-light))] mb-6 transition-opacity duration-500">
              {heroMessages[heroIndex].persona}
            </p>
            
            <div className="relative min-h-[120px] sm:min-h-[150px] flex flex-col items-center justify-center">
              <h1
                className="text-[hsl(var(--liimra-ink))] animate-fadeIn"
                style={{
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.5rem, 3.8vw, 3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  animation: "fadeIn 0.6s ease-in-out",
                  maxWidth: "22ch",
                }}
                key={heroIndex}
              >
                {heroMessages[heroIndex].headline}
              </h1>
              
              <p 
                className="font-body text-base sm:text-lg text-[hsl(var(--liimra-forest))] mt-4 font-medium animate-fadeIn" 
                style={{
                  animation: "fadeIn 0.6s ease-in-out 0.2s both",
                }}
                key={`sub-${heroIndex}`}
              >
                {heroMessages[heroIndex].subheadline}
              </p>
            </div>

            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translate3d(0, 10px, 0);
                }
                to {
                  opacity: 1;
                  transform: translate3d(0, 0, 0);
                }
              }
            `}</style>

            {/* Stats row â€” matrix layout */}
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 mt-8">
              {[
                { value: "4.9★", label: "Rating" },
                { value: "1,400+", label: "Families" },
                { value: "48hr", label: "Dispatch" },
                { value: "₹0", label: "COD Fee" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div className="font-display text-xl sm:text-3xl font-black text-[hsl(var(--liimra-forest))]">{m.value}</div>
                  <div className="font-body text-[9px] tracking-[0.2em] uppercase text-[hsl(var(--liimra-ink-light))] mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7">
              <a href="#shop" className="font-body text-sm tracking-[0.12em] uppercase px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[hsl(var(--liimra-forest))] text-[hsl(var(--liimra-cream))] hover:scale-105 transition-transform duration-300 shadow-xl font-semibold" style={{ willChange: "transform" }}>
                Shop Now — From ₹99
              </a>
              <a href="#bundles" className="font-body text-sm tracking-[0.12em] uppercase px-8 sm:px-10 py-4 sm:py-5 rounded-full border-2 border-[hsl(var(--liimra-forest))] text-[hsl(var(--liimra-forest))] hover:bg-[hsl(var(--liimra-forest)/0.05)] transition-all duration-300 font-semibold" style={{ willChange: "background-color" }}>
                View Bundles
              </a>
            </div>
            
            {/* Social proof indicator */}
            <ViewingNow className="justify-center mt-5" dotColor="hsl(142_55%_40%)" />
          </div>
        </div>

        {/* â”€â”€ Fanned product deck â”€â”€ */}
        <div
          className="absolute left-0 right-0 flex justify-center items-end pointer-events-none"
          style={{ top: `${deckTop}px`, height: `${deckHeight}px`, perspective: "1600px", zIndex: 20 }}
        >
          {deckCards.map((card, i) => {
            const cfg = cardConfig[i];
            const isHovered = hoveredCard === i;
            return (
              <div
                key={card.id}
                className="absolute bottom-0 cursor-pointer pointer-events-auto"
                style={{
                  transformOrigin: "50% 100%",
                  transform: isHovered
                    ? `translate3d(${cfg.translateX}px, ${cfg.translateY - 10}px, 0) rotate(${cfg.rotate * 0.5}deg)`
                    : `translate3d(${cfg.translateX}px, ${cfg.translateY}px, 0) rotate(${cfg.rotate}deg)`,
                  zIndex: isHovered ? 100 : 20 + i,
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: isHovered ? "transform" : "auto",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleProductClick(card.id)}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  loading="eager"
                  decoding="async"
                  style={{
                    width: `${cardWidth}px`,
                    height: "auto",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    display: "block",
                    transition: "transform 0.45s ease",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Differentiation section â”€â”€ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#3e4c1d", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 40px 100px", position: "relative" }}
      >
        <style>{`

          .diff-bg-circle {
            position: absolute;
            width: 600px; height: 600px;
            border-radius: 50%;
            border: 1px solid rgba(197,217,58,0.08);
            top: -200px; right: -150px;
            pointer-events: none;
          }
          .diff-bg-circle-2 {
            position: absolute;
            width: 400px; height: 400px;
            border-radius: 50%;
            border: 1px solid rgba(197,217,58,0.06);
            bottom: -100px; left: -100px;
            pointer-events: none;
          }
          .diff-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(197,217,58,0.06) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
          }
          .diff-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(197,217,58,0.12);
            border: 1px solid rgba(197,217,58,0.25);
            border-radius: 100px;
            padding: 8px 20px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #c5d93a;
            margin-bottom: 48px;
            animation: diffFadeUp 0.6s ease 0.0s both;
          }
          .diff-eyebrow-dot {
            width: 6px; height: 6px;
            background: #c5d93a;
            border-radius: 50%;
            animation: diffPulseDot 2s ease-in-out infinite;
          }
          @keyframes diffPulseDot {
            0%,100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.7); }
          }
          .diff-hero {
            text-align: center;
            max-width: 860px;
            margin-bottom: 72px;
            position: relative;
            animation: diffFadeUp 0.6s ease 0.15s both;
          }
          .diff-headline-top {
            font-family: 'Playfair Display', serif;
            font-size: clamp(52px, 8vw, 96px);
            font-weight: 900;
            line-height: 1;
            color: #f5f0e8;
            letter-spacing: -0.02em;
            display: block;
          }
          .diff-headline-accent {
            font-family: 'Playfair Display', serif;
            font-size: clamp(52px, 8vw, 96px);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.02em;
            color: #c5d93a;
            display: block;
            position: relative;
          }
          .diff-headline-accent::after {
            content: '';
            position: absolute;
            bottom: 2px; left: 50%;
            transform: translateX(-50%);
            width: 80%; height: 3px;
            background: #c5d93a;
            opacity: 0.4;
            border-radius: 2px;
          }
          .diff-headline-sub {
            font-family: 'Playfair Display', serif;
            font-size: clamp(34px, 5vw, 60px);
            font-weight: 400;
            font-style: italic;
            color: rgba(245,240,232,0.55);
            display: block;
            margin-top: 4px;
            letter-spacing: -0.01em;
          }
          .diff-badge-row {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 32px;
          }
          .diff-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #c5d93a;
            color: #2d3714;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 7px 16px;
            border-radius: 100px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          }
          .diff-subhead {
            font-size: 15px;
            font-weight: 400;
            line-height: 1.7;
            color: rgba(245,240,232,0.5);
            text-align: center;
            max-width: 540px;
            margin: 0 auto 72px;
            letter-spacing: 0.01em;
            animation: diffFadeUp 0.6s ease 0.25s both;
          }
          .diff-divider {
            width: 60px; height: 1px;
            background: rgba(197,217,58,0.3);
            margin: 0 auto 48px;
            animation: diffFadeUp 0.6s ease 0.3s both;
          }
          .diff-features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            width: 100%;
            max-width: 900px;
            background: rgba(197,217,58,0.08);
            border: 1px solid rgba(197,217,58,0.12);
            border-radius: 20px;
            overflow: hidden;
            animation: diffFadeUp 0.7s ease 0.35s both;
          }
          .diff-feature {
            background: rgba(30,38,12,0.6);
            padding: 36px 32px;
            position: relative;
            cursor: default;
            transition: background 0.3s ease;
          }
          .diff-feature:hover { background: rgba(40,52,16,0.9); }
          .diff-feature::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 2px;
            background: #c5d93a;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .diff-feature:hover::before { opacity: 1; }
          .diff-feature-num {
            font-family: 'Playfair Display', serif;
            font-size: 11px;
            font-weight: 400;
            color: rgba(197,217,58,0.4);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 20px;
            display: block;
          }
          .diff-feature-icon {
            width: 44px; height: 44px;
            border-radius: 50%;
            background: rgba(197,217,58,0.1);
            border: 1px solid rgba(197,217,58,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            font-size: 18px;
          }
          .diff-feature-title {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #c5d93a;
            margin-bottom: 12px;
          }
          .diff-feature-desc {
            font-size: 14px;
            font-weight: 300;
            line-height: 1.75;
            color: rgba(245,240,232,0.6);
          }
          .diff-feature-stat {
            display: inline-flex;
            align-items: baseline;
            gap: 4px;
            margin-top: 20px;
            padding: 8px 14px;
            background: rgba(197,217,58,0.08);
            border: 1px solid rgba(197,217,58,0.15);
            border-radius: 8px;
          }
          .diff-stat-num {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            font-weight: 700;
            color: #c5d93a;
            line-height: 1;
          }
          .diff-stat-label {
            font-size: 11px;
            font-weight: 500;
            color: rgba(197,217,58,0.6);
            letter-spacing: 0.06em;
          }
          .diff-compare-banner {
            width: 100%;
            max-width: 900px;
            background: rgba(197,217,58,0.06);
            border: 1px solid rgba(197,217,58,0.12);
            border-radius: 14px;
            padding: 20px 32px;
            margin-top: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            animation: diffFadeUp 0.6s ease 0.5s both;
          }
          .diff-compare-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(197,217,58,0.5);
            white-space: nowrap;
            flex-shrink: 0;
          }
          .diff-compare-bar { flex: 1; display: flex; gap: 8px; }
          .diff-bar-item { flex: 1; display: flex; flex-direction: column; gap: 4px; }
          .diff-bar-track {
            height: 5px;
            background: rgba(255,255,255,0.08);
            border-radius: 3px;
            overflow: hidden;
          }
          .diff-bar-fill {
            height: 100%;
            border-radius: 3px;
            background: #c5d93a;
          }
          .diff-bar-fill-dim { background: rgba(255,255,255,0.15); }
          .diff-bar-name { font-size: 10px; color: rgba(245,240,232,0.4); font-weight: 500; letter-spacing: 0.06em; }
          .diff-cta-strip {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-top: 60px;
            flex-wrap: wrap;
            justify-content: center;
            animation: diffFadeUp 0.6s ease 0.55s both;
          }
          .diff-cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #c5d93a;
            color: #2d3714;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 16px 32px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(197,217,58,0.25);
          }
          .diff-cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(197,217,58,0.35);
          }
          .diff-cta-secondary {
            font-size: 13px;
            font-weight: 500;
            color: rgba(245,240,232,0.5);
            letter-spacing: 0.05em;
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-color: rgba(245,240,232,0.2);
            transition: color 0.2s;
            background: none;
            border: none;
          }
          .diff-cta-secondary:hover { color: rgba(245,240,232,0.8); }
          @keyframes diffFadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Background decorations */}
        <div className="diff-bg-circle" />
        <div className="diff-bg-circle-2" />

        {/* Eyebrow */}
        <div className="diff-eyebrow">
          <div className="diff-eyebrow-dot" />
          The Liimra Difference
        </div>

        {/* Hero headline */}
        <div className="diff-hero">
          <span className="diff-headline-top">Not all millet flour</span>
          <span className="diff-headline-accent">is the same.</span>
          <span className="diff-headline-sub">Here&#39;s what sets Liimra apart.</span>

          <div className="diff-badge-row">
            <div className="diff-badge-pill" style={{ transform: "rotate(-1.5deg)" }}>&#10003; 100% Natural</div>
            <div className="diff-badge-pill" style={{ transform: "rotate(1deg)" }}>&#128666; Shipping within 48 Hrs</div>
            <div className="diff-badge-pill" style={{ transform: "rotate(-0.8deg)" }}>&#9881; Chakki-Fresh</div>
          </div>
        </div>

        {/* Subhead */}
        <p className="diff-subhead">
          Most flours on supermarket shelves are machine-processed at high heat &mdash; destroying the very nutrients you&#39;re paying for. Here&#39;s how Liimra compares.
        </p>

        {/* Divider */}
        <div className="diff-divider" />

        {/* Feature grid */}
        <div className="diff-features">
          <div className="diff-feature">
            <span className="diff-feature-num">01</span>
            <div className="diff-feature-icon">&#127806;</div>
            <div className="diff-feature-title">Low Glycaemic Index</div>
            <p className="diff-feature-desc">Recommended by nutritionists for balanced, diabetes-friendly meal plans.</p>
            <div className="diff-feature-stat">
              <span className="diff-stat-num">Low</span>
              <span className="diff-stat-label">GI Rating</span>
            </div>
          </div>

          <div className="diff-feature">
            <span className="diff-feature-num">02</span>
            <div className="diff-feature-icon">&#128170;</div>
            <div className="diff-feature-title">3&times; More Fibre</div>
            <p className="diff-feature-desc">Stone-ground to retain nutrients, not factory processed. Contains 3&times; the fibre of processed wheat flour.</p>
            <div className="diff-feature-stat">
              <span className="diff-stat-num">3&times;</span>
              <span className="diff-stat-label">vs. processed wheat</span>
            </div>
          </div>

          <div className="diff-feature">
            <span className="diff-feature-num">03</span>
            <div className="diff-feature-icon">&#127807;</div>
            <div className="diff-feature-title">Gluten-Free &amp; Gut Friendly</div>
            <p className="diff-feature-desc">Crafted with care &mdash; absolutely no artificial additives or preservatives, ever.</p>
            <div className="diff-feature-stat">
              <span className="diff-stat-num">0</span>
              <span className="diff-stat-label">Additives</span>
            </div>
          </div>
        </div>

        {/* Nutrient retention comparison bar */}
        <div className="diff-compare-banner">
          <span className="diff-compare-label">Nutrient retention</span>
          <div className="diff-compare-bar">
            <div className="diff-bar-item">
              <div className="diff-bar-track"><div className="diff-bar-fill" style={{ width: "92%" }} /></div>
              <span className="diff-bar-name">Liimra Chakki</span>
            </div>
            <div className="diff-bar-item">
              <div className="diff-bar-track"><div className="diff-bar-fill diff-bar-fill-dim" style={{ width: "28%" }} /></div>
              <span className="diff-bar-name">Supermarket brand</span>
            </div>
            <div className="diff-bar-item">
              <div className="diff-bar-track"><div className="diff-bar-fill diff-bar-fill-dim" style={{ width: "18%" }} /></div>
              <span className="diff-bar-name">High-heat processed</span>
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="diff-cta-strip">
          <a className="diff-cta-primary" href="#shop">
            Shop Fresh Flour <span style={{ fontSize: "16px" }}>&#8594;</span>
          </a>
          <a href="#why-liimra" className="diff-cta-secondary">Learn our process</a>
        </div>

      </section>
      <Suspense fallback={<div style={{ minHeight: "100vh" }}></div>}>
        <GoalSelectorSection />
        <BundleSection />
        <RecipeSection />
        <ExpertVoicesSection />
        <ReviewsSection />
        <WhyLiimraSection />
        <FAQSection />
        <Footer />
      </Suspense>

      <FloatingInfoButton />
      
      <ProductDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productId={selectedProductId}
        onNavigate={handleNavigate}
      />
      
      <CartDrawer />
    </main>
  );
};

export default Index;
