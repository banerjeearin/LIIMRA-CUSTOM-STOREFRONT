import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import FloatingInfoButton from "@/components/FloatingInfoButton";
import ScrollProgress from "@/components/ScrollProgress";
import ProductDrawer from "@/components/ProductDrawer";
import GoalSelectorSection from "@/components/GoalSelectorSection";
import BundleSection from "@/components/BundleSection";
import RecipeSection from "@/components/RecipeSection";
import ExpertVoicesSection from "@/components/ExpertVoicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyLiimraSection from "@/components/WhyLiimraSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const deckCards = [
  { id: "bajra",  name: "Bajra Flour",  image: "/products/bajra-250gm.png" },
  { id: "jowar",  name: "Jowar Flour",  image: "/products/jowar-250gm.png" },
  { id: "kangni", name: "Kangni Flour", image: "/products/kangni-250gm.png" },
  { id: "kutki",  name: "Kutki Flour",  image: "/products/kutki-250gm.png" },
  { id: "ragi",   name: "Ragi Flour",   image: "/products/ragi-250gm.png" },
  { id: "rice",   name: "Rice Flour",   image: "/products/rice-500gm.png" },
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
    // Very small phones — tight 3-card fan, hide outer cards
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
    <div className="relative">
      <ScrollProgress />
      <Header />

      {/* ── Hero section ── */}
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
            
            <p className="font-body text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[hsl(var(--liimra-ink-light))] mb-6 transition-opacity duration-500" style={{ opacity: 0.7 }}>
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

            {/* Stats row — matrix layout */}
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
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="w-2 h-2 bg-[hsl(142_55%_40%)] rounded-full animate-pulse" />
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--liimra-ink-light))]">
                31 people viewing now
              </span>
            </div>
          </div>
        </div>

        {/* ── Fanned product deck ── */}
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
                    filter: isHovered
                      ? "drop-shadow(0 20px 36px rgba(0,0,0,0.35))"
                      : "drop-shadow(0 16px 32px rgba(0,0,0,0.28))",
                    display: "block",
                    transition: "filter 0.45s ease",
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Differentiation section ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#3e4c1d", minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <div style={{ width: "100%", maxWidth: "1155px", margin: "0 auto", padding: "64px 40px" }}>

          {/* Styles for badges */}
          <style>{`
            .diff-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #aeb30a;
              border-radius: 9999px;
              padding: 6px 16px;
              white-space: nowrap;
              position: relative;
              overflow: visible;
            }
            .diff-badge span {
              font-family: 'Inter', sans-serif;
              font-weight: 800;
              font-size: 11px;
              letter-spacing: 1.4px;
              color: #ffffff;
              text-transform: uppercase;
              line-height: 1;
            }
          `}</style>

          {/* Headline block */}
          <div style={{ position: "relative", marginBottom: "96px" }}>

            {/* Main headline — zIndex 1, badges sit on top at zIndex 3 */}
            <p style={{ fontFamily: "'Arial Black', 'Arial', sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 7.5vw, 82px)", lineHeight: 1.12, letterSpacing: "-1.848px", color: "#000000", textTransform: "uppercase", textAlign: "center", margin: 0, position: "relative", zIndex: 1 }}>
              Not all millet flour is the same
            </p>

            {/* Pill: 100% NATURAL — over "NOT ALL", first line, left side */}
            <div
              className={`diff-badge ${hoveredBadge === 0 ? 'badge-sparkle-container' : ''}`}
              style={{
                position: "absolute",
                left: "clamp(16px, 12%, 160px)",
                top: "clamp(8px, 2.5vw, 36px)",
                zIndex: 3,
                transform: "rotate(-6deg)",
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredBadge(0)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {hoveredBadge === 0 && (
                <div className="badge-sparkle-wrapper">
                  <div className="sparkle sparkle-1" />
                  <div className="sparkle sparkle-2" />
                  <div className="sparkle sparkle-3" />
                  <div className="sparkle sparkle-4" />
                  <div className="sparkle sparkle-5" />
                  <div className="sparkle sparkle-6" />
                  <div className="sparkle sparkle-7" />
                  <div className="sparkle sparkle-8" />
                  <div className="sparkle sparkle-9" />
                  <div className="sparkle sparkle-10" />
                  <div className="sparkle sparkle-11" />
                  <div className="sparkle sparkle-12" />
                  <div className="sparkle sparkle-13" />
                  <div className="sparkle sparkle-14" />
                  <div className="sparkle sparkle-15" />
                  <div className="sparkle sparkle-16" />
                  <div className="sparkle sparkle-17" />
                  <div className="sparkle sparkle-18" />
                  <div className="sparkle sparkle-19" />
                  <div className="sparkle sparkle-20" />
                  <div className="sparkle sparkle-21" />
                  <div className="sparkle sparkle-22" />
                  <div className="sparkle sparkle-23" />
                  <div className="sparkle sparkle-24" />
                  <div className="sparkle sparkle-25" />
                  <div className="sparkle sparkle-26" />
                  <div className="sparkle sparkle-27" />
                  <div className="sparkle sparkle-28" />
                  <div className="sparkle sparkle-29" />
                  <div className="sparkle sparkle-30" />
                  <div className="sparkle sparkle-31" />
                  <div className="sparkle sparkle-32" />
                  <div className="sparkle sparkle-33" />
                  <div className="sparkle sparkle-34" />
                  <div className="sparkle sparkle-35" />
                  <div className="sparkle sparkle-36" />
                  <div className="sparkle sparkle-37" />
                  <div className="sparkle sparkle-38" />
                  <div className="sparkle sparkle-39" />
                  <div className="sparkle sparkle-40" />
                </div>
              )}
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "white", fill: "none", strokeWidth: 2.5, flexShrink: 0 }}>
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                <path d="M8 12l3 3 5-5" />
              </svg>
              <span>100% Natural</span>
            </div>

            {/* Pill: 48 HR. MAX SHELF AGE — over "ALL MILLET", first line, centre */}
            <div
              className={`diff-badge ${hoveredBadge === 1 ? 'badge-sparkle-container' : ''}`}
              style={{
                position: "absolute",
                left: "42%",
                top: "69px",
                zIndex: 3,
                transform: "rotate(3deg)",
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredBadge(1)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {hoveredBadge === 1 && (
                <div className="badge-sparkle-wrapper">
                  <div className="sparkle sparkle-1" />
                  <div className="sparkle sparkle-2" />
                  <div className="sparkle sparkle-3" />
                  <div className="sparkle sparkle-4" />
                  <div className="sparkle sparkle-5" />
                  <div className="sparkle sparkle-6" />
                  <div className="sparkle sparkle-7" />
                  <div className="sparkle sparkle-8" />
                  <div className="sparkle sparkle-9" />
                  <div className="sparkle sparkle-10" />
                  <div className="sparkle sparkle-11" />
                  <div className="sparkle sparkle-12" />
                  <div className="sparkle sparkle-13" />
                  <div className="sparkle sparkle-14" />
                  <div className="sparkle sparkle-15" />
                  <div className="sparkle sparkle-16" />
                  <div className="sparkle sparkle-17" />
                  <div className="sparkle sparkle-18" />
                  <div className="sparkle sparkle-19" />
                  <div className="sparkle sparkle-20" />
                  <div className="sparkle sparkle-21" />
                  <div className="sparkle sparkle-22" />
                  <div className="sparkle sparkle-23" />
                  <div className="sparkle sparkle-24" />
                  <div className="sparkle sparkle-25" />
                  <div className="sparkle sparkle-26" />
                  <div className="sparkle sparkle-27" />
                  <div className="sparkle sparkle-28" />
                  <div className="sparkle sparkle-29" />
                  <div className="sparkle sparkle-30" />
                  <div className="sparkle sparkle-31" />
                  <div className="sparkle sparkle-32" />
                  <div className="sparkle sparkle-33" />
                  <div className="sparkle sparkle-34" />
                  <div className="sparkle sparkle-35" />
                  <div className="sparkle sparkle-36" />
                  <div className="sparkle sparkle-37" />
                  <div className="sparkle sparkle-38" />
                  <div className="sparkle sparkle-39" />
                  <div className="sparkle sparkle-40" />
                </div>
              )}
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "white", fill: "none", strokeWidth: 2.5, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>48 Hr. Max Shelf Age</span>
            </div>

            {/* Pill: CHAKKI-FRESH — over "FLOUR", end of first line, steeply tilted */}
            <div
              className={`diff-badge ${hoveredBadge === 2 ? 'badge-sparkle-container' : ''}`}
              style={{
                position: "absolute",
                right: "clamp(16px, 6%, 80px)",
                top: "clamp(28px, 5vw, 68px)",
                zIndex: 3,
                transform: "rotate(-19deg)",
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredBadge(2)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {hoveredBadge === 2 && (
                <div className="badge-sparkle-wrapper">
                  <div className="sparkle sparkle-1" />
                  <div className="sparkle sparkle-2" />
                  <div className="sparkle sparkle-3" />
                  <div className="sparkle sparkle-4" />
                  <div className="sparkle sparkle-5" />
                  <div className="sparkle sparkle-6" />
                  <div className="sparkle sparkle-7" />
                  <div className="sparkle sparkle-8" />
                  <div className="sparkle sparkle-9" />
                  <div className="sparkle sparkle-10" />
                  <div className="sparkle sparkle-11" />
                  <div className="sparkle sparkle-12" />
                  <div className="sparkle sparkle-13" />
                  <div className="sparkle sparkle-14" />
                  <div className="sparkle sparkle-15" />
                  <div className="sparkle sparkle-16" />
                  <div className="sparkle sparkle-17" />
                  <div className="sparkle sparkle-18" />
                  <div className="sparkle sparkle-19" />
                  <div className="sparkle sparkle-20" />
                  <div className="sparkle sparkle-21" />
                  <div className="sparkle sparkle-22" />
                  <div className="sparkle sparkle-23" />
                  <div className="sparkle sparkle-24" />
                  <div className="sparkle sparkle-25" />
                  <div className="sparkle sparkle-26" />
                  <div className="sparkle sparkle-27" />
                  <div className="sparkle sparkle-28" />
                  <div className="sparkle sparkle-29" />
                  <div className="sparkle sparkle-30" />
                  <div className="sparkle sparkle-31" />
                  <div className="sparkle sparkle-32" />
                  <div className="sparkle sparkle-33" />
                  <div className="sparkle sparkle-34" />
                  <div className="sparkle sparkle-35" />
                  <div className="sparkle sparkle-36" />
                  <div className="sparkle sparkle-37" />
                  <div className="sparkle sparkle-38" />
                  <div className="sparkle sparkle-39" />
                  <div className="sparkle sparkle-40" />
                </div>
              )}
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "white", fill: "none", strokeWidth: 2.5, flexShrink: 0 }}>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" /><path d="M20 2v5h-5" /><path d="M20 7C18.5 4 15.5 2 12 2" />
              </svg>
              <span>Chakki-Fresh</span>
            </div>

            {/* Subheading */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "13px", lineHeight: "20px", letterSpacing: "1.2px", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", textAlign: "center", marginTop: "16px", position: "relative", zIndex: 1 }}>
              Most flours on supermarket shelves are machine-processed at high heat<br />
              destroying the very nutrients you're paying for. Here's how Liimra compares.
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.12)", marginBottom: "33px" }} />

          {/* Three feature columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "22px" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "13px", lineHeight: "19px", letterSpacing: "1.5px", color: "#bac20c", textTransform: "uppercase", whiteSpace: "nowrap" }}>Low Glycaemic Index</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "19px", letterSpacing: "0.3px", color: "rgba(255,255,255,0.82)", margin: 0, maxWidth: "323px" }}>
                Recommended by nutritionists for balanced, diabetes-friendly meal plans
              </p>
            </div>
            <div style={{ position: "relative", paddingLeft: "16px" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "1px", height: "100%", background: "rgba(28,14,4,0.15)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "13px", lineHeight: "19px", letterSpacing: "1.5px", color: "#bac20c", textTransform: "uppercase", whiteSpace: "nowrap" }}>3× More Fibre</span>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "19px", letterSpacing: "0.3px", color: "rgba(255,255,255,0.82)", margin: "12px 0 0", maxWidth: "335px" }}>
                Compared to processed wheat flour, our flour contains 3x more fiber. Stone-ground to retain nutrients, not factory processed.
              </p>
            </div>
            <div style={{ position: "relative", paddingLeft: "16px" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "1px", height: "100%", background: "rgba(28,14,4,0.15)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "13px", lineHeight: "19px", letterSpacing: "1.5px", color: "#bac20c", textTransform: "uppercase", whiteSpace: "nowrap" }}>Gluten-Free &amp; Gut Friendly</span>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "19px", letterSpacing: "0.3px", color: "rgba(255,255,255,0.82)", margin: "12px 0 0", maxWidth: "336px" }}>
                Crafted with care, absolutely no artificial additives or preservatives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── New sections from design reference ── */}
      <GoalSelectorSection />
      <BundleSection />
      <RecipeSection />
      <ExpertVoicesSection />
      <ReviewsSection />
      <WhyLiimraSection />
      <FAQSection />
      <Footer />

      <FloatingInfoButton />
      
      <ProductDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productId={selectedProductId}
        onNavigate={handleNavigate}
      />
      
      <CartDrawer />
    </div>
  );
};

export default Index;
