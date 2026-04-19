import { useState, memo, useMemo, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { sendProductInquiry } from "@/services/whatsapp";
import ViewingNow from "@/components/ViewingNow";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import type { Product } from "@/data/products";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onNavigate: (direction: "prev" | "next") => void;
}

// ── Image Gallery Sub-component ─────────────────────────────────────────────
const ImageGallery = memo(({ product }: { product: Product }) => {
  const allImages = [product.image, ...(product.images?.slice(1) ?? [])].filter(Boolean);
  const [activeImg, setActiveImg] = useState(0);
  const hasManyImages = allImages.length > 1;

  // Reset to first image when product changes
  useEffect(() => { setActiveImg(0); }, [product.id]);

  return (
    <div className="mb-6">
      {/* Main image viewer */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "white", aspectRatio: "4/3" }}
      >
        <img
          key={activeImg}
          src={allImages[activeImg]}
          alt={`${product.name} ${activeImg + 1}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain transition-opacity duration-300"
          style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))", padding: "20px" }}
        />
        {/* Nav arrows — only when multiple images */}
        {hasManyImages && (
          <>
            <button
              onClick={() => setActiveImg((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(62,76,29,0.85)", color: "white" }}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setActiveImg((p) => (p + 1) % allImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(62,76,29,0.85)", color: "white" }}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {/* Counter badge */}
            <div
              className="absolute bottom-3 right-3 font-body text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ background: "rgba(62,76,29,0.75)", color: "white" }}
            >
              {activeImg + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only when multiple images */}
      {hasManyImages && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: activeImg === i ? "2px solid #3e4c1d" : "2px solid transparent",
                background: "white",
                opacity: activeImg === i ? 1 : 0.55,
                transform: activeImg === i ? "scale(1.05)" : "scale(1)",
              }}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={src}
                alt={`${product.name} thumbnail ${i + 1}`}
                className="w-full h-full object-contain p-1"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ImageGallery.displayName = "ImageGallery";

// ── Product Drawer ────────────────────────────────────────────────────────────
const ProductDrawer = memo(({ isOpen, onClose, productId, onNavigate }: ProductDrawerProps) => {
  const { products, getProduct } = useProducts();
  const { addItem, openCart } = useCart();
  const { trackEcommerce } = useAnalytics();
  const [selectedSize, setSelectedSize] = useState(0);

  const product = useMemo(() => (productId ? getProduct(productId) : null), [productId, getProduct]);

  useEffect(() => {
    setSelectedSize(0);
    if (product && isOpen) {
      trackEcommerce("ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        currency: "INR",
        value: product.sizes[0].price
      });
    }
  }, [productId, product, isOpen, trackEcommerce]);

  const { currentSize, currentIndex, prevProduct, nextProduct } = useMemo(() => {
    if (!product) return { currentSize: null, currentIndex: -1, prevProduct: null, nextProduct: null };

    const currentIndex = products.findIndex((p) => p.id === productId);
    return {
      currentSize: product.sizes[selectedSize],
      currentIndex,
      prevProduct: products[currentIndex - 1],
      nextProduct: products[currentIndex + 1],
    };
  }, [product, productId, selectedSize, products]);

  if (!product || !currentSize) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: currentSize.variantId || `${product.id}-${currentSize.size}`,
      name: product.name,
      size: currentSize.size,
      quantity: 1,
      price: currentSize.price,
      mrp: currentSize.mrp,
      image: product.image,
    });
    openCart();
  };

  const handleWhatsAppInquiry = () => {
    sendProductInquiry(product.name, currentSize.size);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-[hsl(var(--liimra-cream))] p-0 flex flex-col">
        <div className="flex-shrink-0 px-6 py-4 border-b border-[hsl(var(--liimra-border))]">
          <SheetTitle className="font-display font-black text-lg text-center mb-3" style={{ color: OLIVE }}>
            Product Details
          </SheetTitle>

          <div className="flex items-start justify-between gap-3">
            <button
              onClick={() => onNavigate("prev")}
              disabled={!prevProduct}
              className="flex flex-col items-center gap-1 font-body text-xs uppercase tracking-wider transition-opacity disabled:opacity-30 min-w-[60px]"
              style={{ color: OLIVE }}
            >
              <ChevronLeft size={16} />
              {prevProduct && <span className="text-xs leading-tight">{prevProduct.name.split(" ")[0]}</span>}
            </button>

            <div className="font-body text-sm font-bold text-center flex-1 pt-1" style={{ color: OLIVE }}>
              {product.name}
            </div>

            <button
              onClick={() => onNavigate("next")}
              disabled={!nextProduct}
              className="flex flex-col items-center gap-1 font-body text-xs uppercase tracking-wider transition-opacity disabled:opacity-30 min-w-[60px]"
              style={{ color: OLIVE }}
            >
              <ChevronRight size={16} />
              {nextProduct && <span className="text-xs leading-tight">{nextProduct.name.split(" ")[0]}</span>}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ImageGallery product={product} />

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill={NEON} stroke={NEON} />
              ))}
            </div>
            <span className="font-body text-sm font-semibold" style={{ color: OLIVE }}>
              {product.rating}
            </span>
            <span className="font-body text-xs text-[hsl(var(--liimra-ink-light))]">({product.reviews} reviews)</span>
            <div className="ml-auto">
              <ViewingNow dotColor={NEON} />
            </div>
          </div>

          <p className="font-body text-base mb-4" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
            {product.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.primaryTags.map((tag) => (
              <span
                key={tag}
                className="font-body text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(174,179,10,0.12)", color: OLIVE }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{ background: "white" }}>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider mb-3" style={{ color: OLIVE }}>
              {product.primaryBenefit}
            </h4>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
              {product.benefitDescription}
            </p>
            <ul className="space-y-2">
              {product.healthBenefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-body text-sm"
                  style={{ color: "hsl(var(--liimra-ink-mid))" }}
                >
                  <span className="text-base flex-shrink-0" style={{ color: NEON }}>
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{ background: "white" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{product.emoji}</span>
              <h4 className="font-body text-sm font-bold uppercase tracking-wider" style={{ color: OLIVE }}>
                The Science
              </h4>
            </div>
            <p className="font-body text-xs font-semibold mb-2" style={{ color: OLIVE }}>
              {product.commonName} · {product.scientificName}
            </p>
            <div
              className="font-body text-sm leading-relaxed mb-4 product-description"
              style={{ color: "hsl(var(--liimra-ink-mid))" }}
              dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
            />
            <div
              className="inline-flex items-center gap-2 font-body text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              style={{ background: `${NEON}18`, color: OLIVE }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 flex-shrink-0">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {product.scientificHighlight}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-body text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: OLIVE }}>
              Nutritional Facts (per 100g)
            </h4>
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

          <div className="mb-6">
            <h4 className="font-body text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: OLIVE }}>
              Best Used In
            </h4>
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

          <div className="pt-4 pb-2">
            <TrustBadgeBar />
          </div>
        </div>

        <div
          className="flex-shrink-0 px-6 py-3 border-t border-[hsl(var(--liimra-border))] bg-[hsl(var(--liimra-cream))]"
          style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}
        >
          <div className="mb-3">
            <div className="flex gap-2">
              {product.sizes.map((size, i) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(i)}
                  className="flex-1 font-body text-xs px-3 py-2 rounded-lg border-2 transition-all duration-200"
                  style={{
                    borderColor: selectedSize === i ? OLIVE : "hsl(var(--liimra-border))",
                    background: selectedSize === i ? "rgba(62,76,29,0.05)" : "white",
                    color: OLIVE,
                  }}
                >
                  <div className="font-bold">{size.size}</div>
                  <div className="text-xs opacity-70">₹{size.price}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: "white" }}>
            <div className="flex items-baseline gap-2 flex-1">
              <span className="font-display text-2xl font-black" style={{ color: OLIVE }}>
                ₹{currentSize.price}
              </span>
              <span
                className="font-body text-sm line-through opacity-50"
                style={{ color: "hsl(var(--liimra-ink-light))" }}
              >
                ₹{currentSize.mrp}
              </span>
              <span
                className="font-body text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: "rgba(174,179,10,0.15)", color: OLIVE }}
              >
                {currentSize.discount}% OFF
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="font-body text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg flex-shrink-0"
              style={{ background: OLIVE, color: "white" }}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>

          <button
            onClick={handleWhatsAppInquiry}
            className="w-full font-body text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.01]"
            style={{ background: "#25D366", color: "white" }}
          >
            💬 Ask on WhatsApp
          </button>

          <p className="font-body text-xs text-center mt-2" style={{ color: "hsl(var(--liimra-ink-light))" }}>
            ✓ Free shipping · COD available
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
});

ProductDrawer.displayName = "ProductDrawer";

export default ProductDrawer;
