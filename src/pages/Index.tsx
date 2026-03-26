import { useState } from "react";
import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import FloatingInfoButton from "@/components/FloatingInfoButton";
import { products } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (productId: string, size: string) => {
    setCartCount((c) => c + 1);
    const product = products.find((p) => p.id === productId);
    toast({
      title: `${product?.name} (${size}) added!`,
      description: "Your cart has been updated.",
    });
  };

  return (
    <div className="relative">
      <Header cartCount={cartCount} />

      {/* Scroll-snap product showcase */}
      <div className="snap-container">
        {/* Hero intro section */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden bg-[hsl(var(--liimra-cream))]">
          {/* Background decorative grains */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${20 + i * 15}px`,
                  height: `${20 + i * 15}px`,
                  background: `hsl(var(--liimra-sage) / 0.06)`,
                  left: `${10 + i * 11}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  animation: `grain-float ${5 + i * 0.6}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            {/* Tagline */}
            <p className="font-body text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[hsl(var(--liimra-ink-light))] mb-6">
              A Pure Way of Life
            </p>

            {/* Hero headline */}
            <h1 className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tight text-[hsl(var(--liimra-ink))]">
              Control Sugar
              <br />
              <span className="italic font-light">Naturally</span>
            </h1>

            <p className="font-body text-sm sm:text-base text-[hsl(var(--liimra-ink-light))] mt-6 max-w-xl mx-auto leading-relaxed">
              Chakki-fresh stone-ground millet flours, clinically known for diabetes-friendly diets. 
              Trusted by <strong className="text-[hsl(var(--liimra-ink))]">1,400+ Indian families</strong>.
            </p>

            {/* Trust metrics */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
              {[
                { value: "4.9★", label: "Rating" },
                { value: "1400+", label: "Families" },
                { value: "48hr", label: "Dispatch" },
                { value: "₹0", label: "COD Fee" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[hsl(var(--liimra-forest))]">{m.value}</div>
                  <div className="font-body text-[9px] tracking-[0.2em] uppercase text-[hsl(var(--liimra-ink-light))] mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a
                href="#shop"
                className="font-body text-xs tracking-[0.15em] uppercase px-8 py-4 rounded-full bg-[hsl(var(--liimra-forest))] text-[hsl(var(--liimra-cream))] hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                Shop Now — From ₹139
              </a>
              <a
                href="#bundles"
                className="font-body text-xs tracking-[0.15em] uppercase px-8 py-4 rounded-full border border-[hsl(var(--liimra-forest))] text-[hsl(var(--liimra-forest))] hover:bg-[hsl(var(--liimra-forest)/0.05)] transition-all duration-300"
              >
                View Combos →
              </a>
            </div>

            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="w-2 h-2 bg-[hsl(142_55%_40%)] rounded-full animate-pulse" />
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--liimra-ink-light))]">
                31 people viewing now
              </span>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
            <span className="font-body text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--liimra-ink-light))]">
              Discover our millets
            </span>
            <div className="w-px h-8 bg-[hsl(var(--liimra-sage))]" />
          </div>
        </section>

        {/* Product sections */}
        <div id="shop">
          {products.map((product, index) => (
            <ProductSection
              key={product.id}
              product={product}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      <FloatingInfoButton />
    </div>
  );
};

export default Index;
