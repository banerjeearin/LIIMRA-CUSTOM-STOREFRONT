import { useState, memo, useMemo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useImpressionTracker } from "@/hooks/useImpressionTracker";
import { ProductSchema } from "@/components/SEO/StructuredData";
import type { Product } from "@/data/products";
import ViewingNow from "@/components/ViewingNow";
import { ChevronDown, ChevronUp } from "lucide-react";
import TrustBadgeBar from "@/components/TrustBadgeBar";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";
const CARD_SHADOW = "0 1px 3px rgba(62,76,29,0.05), 0 4px 12px rgba(62,76,29,0.07)";
const CARD_SHADOW_HOVER = "0 2px 6px rgba(62,76,29,0.07), 0 8px 22px rgba(62,76,29,0.10)";

const goals = [
  { id: "all", label: "All Products" },
  { id: "sugar", label: "Managing diabetes naturally" },
  { id: "weight", label: "Feeling lighter & more energetic" },
  { id: "nutrition", label: "Better nutrition for my family" },
  { id: "gut", label: "Fixing digestion issues" },
];

const Stars = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} viewBox="0 0 24 24" className="w-3 h-3" style={{ fill: NEON }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
    <span className="font-body text-xs font-semibold text-[hsl(var(--liimra-ink-mid))] ml-1">{rating}</span>
  </div>
));

Stars.displayName = "Stars";

const ProductCard = memo(({ product, onProductClick }: { product: Product; onProductClick?: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [scienceExpanded, setScienceExpanded] = useState(false);
  const { addItem, openCart } = useCart();
  const cardRef = useImpressionTracker(`ProductCard_${product.id}`, { product_id: product.id, name: product.name });

  const selectedSize = product.sizes[selectedSizeIndex];
  const pct = Math.round(((selectedSize.mrp - selectedSize.price) / selectedSize.mrp) * 100);
  const backdropWord = product.name.split(" ")[0].toUpperCase();

  const handleAddToCart = () => {
    // E-commerce tracking is handled via Cart actions or explicit trackEcommerce
    // We'll leave that to the CartContext or here
    addItem({
      productId: product.id,
      variantId: selectedSize.variantId || `${product.id}-${selectedSize.size}`,
      name: product.name,
      size: selectedSize.size,
      quantity: 1,
      price: selectedSize.price,
      mrp: selectedSize.mrp,
      image: product.image,
    });
    openCart();
  };

  return (
    <div
      ref={cardRef as any}
      className="relative bg-white rounded-3xl overflow-hidden transition-all duration-500 group"
      style={{
        boxShadow: hovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        minHeight: "300px",
        willChange: hovered ? "transform, box-shadow" : "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductSchema product={product} />


      <div className="relative flex flex-col sm:flex-row items-stretch" style={{ zIndex: 1, minHeight: "300px" }}>
        <div
          className="relative flex flex-col items-center justify-start shrink-0 overflow-hidden transition-all duration-500 cursor-pointer"
          style={{
            width: "100%",
            maxWidth: "360px",
            minHeight: "300px",
            background: product.imageBg,
            borderRadius: "1.5rem 0 0 1.5rem",
          }}
          onClick={() => onProductClick?.(product.id)}
          title="Click to view full product details"
        >
          {/* Radial highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 20%, transparent 70%)",
            }}
          />
          {/* Hover overlay — "View Details" */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-14 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: "rgba(0,0,0,0.18)", borderRadius: "1.5rem 0 0 1.5rem", zIndex: 5 }}
          >
            <span
              className="font-body text-[11px] font-bold tracking-[0.12em] uppercase px-4 py-2 rounded-full"
              style={{ background: "rgba(174,179,10,0.90)", color: "#1e2608" }}
            >
              View Details →
            </span>
          </div>
          
          {/* Main Primary Image */}
          <div className="relative flex items-center justify-center w-full" style={{ flex: scienceExpanded ? "0 0 auto" : "1 1 auto", minHeight: "300px", paddingTop: scienceExpanded ? "2rem" : "0" }}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="relative transition-transform duration-700 group-hover:scale-[1.06]"
              style={{
                height: scienceExpanded ? "220px" : "290px",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.45))",
                padding: "10px 16px",
                willChange: "transform",
              }}
            />
            <span
              className="absolute bottom-4 left-4 font-body text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full z-10"
              style={{ background: "rgba(174,179,10,0.20)", color: "#c8cc00", backdropFilter: "blur(6px)" }}
            >
              {product.badge}
            </span>
          </div>

          {/* Expanded Media Pictures (Left Side under Main Picture) */}
          <div 
            className="w-full flex flex-col gap-6 px-6 pb-8 transition-all duration-500 max-h-0 opacity-0 overflow-hidden"
            style={{ 
              maxHeight: scienceExpanded ? "1200px" : "0px",
              opacity: scienceExpanded ? 1 : 0,
              marginTop: scienceExpanded ? "1.5rem" : "0"
            }}
          >
            {product.images && product.images.length > 1 && (
              <>
                <div className="w-full h-px bg-white/20 mb-2"></div>
                <p className="font-body text-[10px] font-bold tracking-[0.14em] uppercase text-center text-white/50">
                  PRODUCT INFORMATION
                </p>
                <div className="flex flex-col items-center gap-6 w-full">
                  {product.images.slice(1).map((imgUrl, idx) => (
                    <img 
                      key={idx}
                      src={imgUrl} 
                      alt={`${product.name} Media ${idx + 2}`} 
                      loading="lazy" 
                      decoding="async"
                      className="object-contain rounded-xl shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
                      style={{ 
                        height: "220px", 
                        width: "auto", 
                        maxWidth: "100%",
                        backgroundColor: "white",
                        padding: imgUrl.includes("transparent") ? "0" : "4px" // Small padding inside the white bg
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center flex-1 px-8 py-8 gap-4 min-w-0 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Stars rating={product.rating} />
              <span className="font-body text-xs text-[hsl(var(--liimra-ink-light))]">({product.reviews})</span>
            </div>
            <ViewingNow dotColor={NEON} />
          </div>

          <div>
            <h3
              className="font-display font-black leading-none tracking-tight"
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: OLIVE,
              }}
            >
              {product.name.replace(" Flour", "")}
              <span style={{ color: "hsl(var(--liimra-ink-light))", fontWeight: 400, fontSize: "55%", marginLeft: "0.3em" }}>
                Flour
              </span>
            </h3>
            <p className="font-body text-sm text-[hsl(var(--liimra-ink-light))] mt-2 leading-relaxed max-w-sm">
              {product.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.primaryTags.map((a) => (
              <span
                key={a}
                className="font-body text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full"
                style={{ background: "hsl(72 22% 91%)", color: OLIVE }}
              >
                {a}
              </span>
            ))}
          </div>

          <div>
            <p className="font-body text-xs font-semibold mb-2" style={{ color: OLIVE }}>
              Select Size:
            </p>
            <div className="flex gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSizeIndex(index)}
                  className="font-body text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  style={
                    selectedSizeIndex === index
                      ? {
                          background: OLIVE,
                          color: "white",
                          boxShadow: "0 2px 8px rgba(62,76,29,0.25)",
                        }
                      : {
                          background: "hsl(72 18% 92%)",
                          color: OLIVE,
                          border: "1px solid hsl(72 18% 88%)",
                        }
                  }
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-auto pt-4" style={{ borderTop: "1px solid hsl(72 18% 92%)" }}>
            <div>
              <div className="font-body text-xs text-[hsl(var(--liimra-ink-light))] line-through">
                MRP ₹{selectedSize.mrp}
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-black"
                  style={{
                    fontFamily: "'Arial Black', 'Arial', sans-serif",
                    fontSize: "2rem",
                    color: "hsl(var(--liimra-ink))",
                  }}
                >
                  ₹{selectedSize.price}
                </span>
                <span className="font-body text-xs font-bold" style={{ color: "#6b6e00" }}>
                  Save {pct}%
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="font-body text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg flex-shrink-0"
              style={{
                background: OLIVE,
                color: "white",
                boxShadow: hovered ? "0 4px 16px rgba(62,76,29,0.30)" : "0 2px 8px rgba(62,76,29,0.15)",
                willChange: "transform, box-shadow",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2 shrink-0">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </button>
          </div>

          <div className="w-full">
            <TrustBadgeBar />
          </div>

          <button
            onClick={() => setScienceExpanded(!scienceExpanded)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 mt-2"
            style={{
              background: scienceExpanded ? "hsl(72 22% 94%)" : "hsl(72 18% 96%)",
              border: "1px solid hsl(72 18% 90%)",
            }}
          >
            <span className="font-body text-xs font-bold tracking-wide" style={{ color: OLIVE }}>
              🧬 Science & Nutrition
            </span>
            {scienceExpanded ? (
              <ChevronUp size={16} style={{ color: OLIVE }} />
            ) : (
              <ChevronDown size={16} style={{ color: OLIVE }} />
            )}
          </button>

          {scienceExpanded && (
            <div className="px-4 py-4 rounded-lg space-y-4" style={{ background: "hsl(72 22% 97%)" }}>
              <div>
                <p className="font-body text-xs font-semibold mb-1" style={{ color: OLIVE }}>
                  {product.commonName} · {product.scientificName}
                </p>
                <div
                  className="font-body text-xs leading-relaxed text-[hsl(var(--liimra-ink-mid))] product-description"
                  dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
                />
              </div>

              <div
                className="inline-flex items-center gap-2 font-body text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: `${NEON}18`, color: OLIVE }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 flex-shrink-0">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {product.scientificHighlight}
              </div>

              <div>
                <p className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: OLIVE }}>
                  Nutritional Facts
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {product.nutritionalFacts.map((n) => (
                    <div
                      key={n.label}
                      className="rounded-lg p-2 text-center"
                      style={{ background: "white", border: "0.67px solid hsl(72 18% 88%)" }}
                    >
                      <div className="font-display font-black text-sm" style={{ color: OLIVE }}>
                        {n.value}
                      </div>
                      <div
                        className="font-body text-[9px] leading-tight tracking-wide"
                        style={{ color: "hsl(var(--liimra-ink-light))" }}
                      >
                        {n.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: OLIVE }}>
                  Best Used In
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.uses.map((u) => (
                    <span
                      key={u}
                      className="font-body text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: "white", color: OLIVE, border: "1px solid hsl(72 18% 88%)" }}
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

const GoalSelectorSection = memo(({ onProductClick }: { onProductClick?: (id: string) => void }) => {
  const [activeGoal, setActiveGoal] = useState("all");
  const { products, isLoading, error, getProductsByGoal } = useProducts();
  const visibleProducts = useMemo(() => getProductsByGoal(activeGoal), [activeGoal, getProductsByGoal]);
  const sectionRef = useScrollReveal();
  const productsRef = useScrollReveal({ threshold: 0.05 });

  if (isLoading) {
    return (
      <section
        id="shop"
        className="relative bg-[hsl(var(--liimra-cream))]"
        style={{ padding: "96px 0", minHeight: "600px" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: OLIVE, borderTopColor: "transparent" }}
            />
            <p className="font-body text-sm" style={{ color: OLIVE }}>
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="shop"
        className="relative bg-[hsl(var(--liimra-cream))]"
        style={{ padding: "96px 0", minHeight: "600px" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-sm mb-2" style={{ color: "red" }}>
              Error loading products
            </p>
            <p className="font-body text-xs" style={{ color: OLIVE }}>
              {error.message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section
        id="shop"
        className="relative bg-[hsl(var(--liimra-cream))]"
        style={{ padding: "96px 0", minHeight: "600px" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-sm" style={{ color: OLIVE }}>
              No products available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shop"
      className="relative bg-[hsl(var(--liimra-cream))]"
      style={{ padding: "96px 0" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Shop by Goal"
            title={
              <>
                What matters most to <em className="not-italic" style={{ color: OLIVE }}>you</em>?
              </>
            }
            centered
            typewriter
          />
        </div>

        <div className="text-center mb-8">
          <p className="font-body text-sm text-[hsl(var(--liimra-ink-mid))]">💚 Buy more, save more — up to 15% off</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGoal(g.id)}
              className="font-body text-xs font-semibold tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={
                activeGoal === g.id
                  ? { background: OLIVE, color: "white", boxShadow: "0 2px 12px rgba(62,76,29,0.28)" }
                  : { background: "hsl(72 18% 92%)", color: "hsl(var(--liimra-ink-mid))" }
              }
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} onProductClick={onProductClick} />
          ))}
        </div>
      </div>
    </section>
  );
});

GoalSelectorSection.displayName = "GoalSelectorSection";

export default GoalSelectorSection;
