import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, Zap, Star, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";

interface ProductSectionProps {
  product: Product;
  index: number;
  onAddToCart: (productId: string, size: string) => void;
}

const ProductSection = ({ product, index, onAddToCart }: ProductSectionProps) => {
  const [selectedSize, setSelectedSize] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const currentSize = product.sizes[selectedSize];
  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full snap-start relative flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${product.colorTheme.bg}), hsl(${product.colorTheme.bgDark}))`,
      }}
    >
      {/* Floating grain decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-[0.08]"
            style={{
              width: `${40 + i * 30}px`,
              height: `${40 + i * 30}px`,
              background: `hsl(${product.colorTheme.accent})`,
              left: `${15 + i * 14}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-24 sm:py-16">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? "" : "lg:[direction:rtl]"}`}>
          {/* Product Info */}
          <div
            className={`space-y-6 lg:[direction:ltr] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <Badge
                className="font-body text-[10px] tracking-[0.15em] uppercase border-none px-3 py-1"
                style={{
                  background: `hsl(${product.colorTheme.accent})`,
                  color: `hsl(${product.colorTheme.bg})`,
                }}
              >
                {product.status}
              </Badge>
              {product.rating > 0 && (
                <span className="flex items-center gap-1 font-body text-xs" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
                  <Star size={12} fill="currentColor" /> {product.rating} ({product.reviews})
                </span>
              )}
            </div>

            {/* Giant product name */}
            <div>
              <h2
                className="font-display text-[clamp(3.5rem,10vw,8rem)] font-bold leading-[0.85] tracking-tight"
                style={{ color: `hsl(${product.colorTheme.text})` }}
              >
                {product.displayName}
              </h2>
              <p
                className="font-display text-lg sm:text-xl italic mt-2 tracking-wide"
                style={{ color: `hsl(${product.colorTheme.textLight})` }}
              >
                {product.primaryBenefit}
              </p>
            </div>

            {/* Scientific name */}
            <p className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
              {product.scientificName} · {product.commonName}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.primaryTags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border"
                  style={{
                    borderColor: `hsl(${product.colorTheme.accentLight})`,
                    color: `hsl(${product.colorTheme.text})`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Benefit description */}
            <p className="font-body text-sm sm:text-base leading-relaxed max-w-md" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
              {product.benefitDescription}
            </p>

            {/* Size selector */}
            <div className="flex gap-2">
              {product.sizes.map((size, i) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(i)}
                  className={`font-body text-xs tracking-wider uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                    selectedSize === i ? "scale-105" : "hover:scale-105"
                  }`}
                  style={{
                    background: selectedSize === i ? `hsl(${product.colorTheme.accent})` : "transparent",
                    color: selectedSize === i ? `hsl(${product.colorTheme.bg})` : `hsl(${product.colorTheme.text})`,
                    borderColor: `hsl(${product.colorTheme.accentLight})`,
                  }}
                >
                  {size.size}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-bold" style={{ color: `hsl(${product.colorTheme.text})` }}>
                ₹{currentSize.price}
              </span>
              <span className="font-body text-lg line-through opacity-50" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
                ₹{currentSize.mrp}
              </span>
              <Badge
                className="font-body text-[10px] tracking-wider uppercase border-none"
                style={{
                  background: `hsl(0 70% 50%)`,
                  color: "white",
                }}
              >
                {currentSize.discount}% OFF
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onAddToCart(product.id, currentSize.size)}
                className="font-body text-xs tracking-[0.15em] uppercase px-6 py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: `hsl(${product.colorTheme.accent})`,
                  color: `hsl(${product.colorTheme.bg})`,
                }}
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
              <button
                className="font-body text-xs tracking-[0.15em] uppercase px-6 py-3.5 rounded-full flex items-center gap-2 border transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: `hsl(${product.colorTheme.accent})`,
                  color: `hsl(${product.colorTheme.text})`,
                }}
              >
                <Zap size={14} /> Buy Now
              </button>
              <button
                onClick={() => setIsFav(!isFav)}
                className="p-3.5 rounded-full border transition-all duration-300 hover:scale-110"
                style={{
                  borderColor: `hsl(${product.colorTheme.accentLight})`,
                  color: isFav ? `hsl(0 70% 50%)` : `hsl(${product.colorTheme.textLight})`,
                }}
              >
                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Product Visual — illustrated grain placeholder */}
          <div
            className={`lg:[direction:ltr] flex items-center justify-center transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Circular glow */}
              <div
                className="absolute inset-4 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, hsl(${product.colorTheme.accentLight} / 0.2), transparent 70%)`,
                }}
              />
              {/* Grain icon */}
              <div
                className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl"
                style={{ animation: "float 5s ease-in-out infinite" }}
              >
                {product.emoji}
              </div>
              {/* Nutrient badges floating around */}
              {product.nutrients.map((n, i) => {
                const positions = [
                  { top: "5%", right: "0%" },
                  { bottom: "10%", right: "5%" },
                  { bottom: "5%", left: "5%" },
                ];
                return (
                  <div
                    key={n.label}
                    className="absolute font-body text-center p-3 rounded-2xl backdrop-blur-sm"
                    style={{
                      ...positions[i],
                      background: `hsl(${product.colorTheme.bg} / 0.7)`,
                      border: `1px solid hsl(${product.colorTheme.accentLight} / 0.3)`,
                      animation: `float ${3.5 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.8}s`,
                    }}
                  >
                    <div className="text-lg font-display font-bold" style={{ color: `hsl(${product.colorTheme.accent})` }}>
                      {n.value}
                    </div>
                    <div className="text-[9px] tracking-[0.15em] uppercase" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
                      {n.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom recipe hints */}
        <div
          className={`mt-8 sm:mt-12 flex items-center gap-6 overflow-x-auto pb-2 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-body text-[10px] tracking-[0.2em] uppercase shrink-0" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
            Make it into
          </span>
          {product.recipes.map((recipe) => (
            <span
              key={recipe}
              className="font-body text-xs tracking-wider shrink-0 px-3 py-1.5 rounded-full border cursor-pointer transition-all hover:scale-105"
              style={{
                borderColor: `hsl(${product.colorTheme.accentLight} / 0.5)`,
                color: `hsl(${product.colorTheme.text})`,
              }}
            >
              {recipe}
            </span>
          ))}
          <ChevronRight size={14} style={{ color: `hsl(${product.colorTheme.textLight})` }} />
        </div>
      </div>

      {/* Scroll indicator */}
      {index < 3 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: `hsl(${product.colorTheme.textLight})` }}>
            Scroll
          </span>
          <div className="w-px h-6" style={{ background: `hsl(${product.colorTheme.accentLight})` }} />
        </div>
      )}
    </section>
  );
};

export default ProductSection;
