import { memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Ground Fresh",
    description:
      "Within 48 hours of your order. Not months in a warehouse.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Zero Additives",
    description:
      "100% pure and natural ingredients without any artificial preservatives or chemicals.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Family Business",
    description:
      "Started for our diabetic mother. Now caring for yours.",
  },
];

const WhyLiimraSection = memo(() => {
  const sectionRef = useScrollReveal();
  const pillarsRef = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      id="why-liimra"
      ref={sectionRef}
      className="scroll-reveal-right"
      style={{ background: "hsl(var(--liimra-cream))", padding: "96px 0" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <SectionHeader
            eyebrow="Why Choose Us"
            title={
              <>
                Why <em className="not-italic" style={{ color: OLIVE }}>Liimra</em>?
              </>
            }
            centered
            typewriter
          />
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 shadow-[0_4px_24px_rgba(62,76,29,0.06)] border border-[hsl(var(--liimra-border))] scroll-reveal-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle, ${OLIVE} 0%, transparent 70%)` }}></div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 relative z-10">
            <div>
              <h3 className="font-display font-black text-2xl mb-4" style={{ color: OLIVE }}>
                Our Millet Journey
                <span className="block text-sm font-body font-semibold tracking-widest uppercase mt-2 opacity-60">
                  A Path to Wholesome Living
                </span>
              </h3>
              <p className="font-body text-[15px] leading-relaxed mb-4" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
                The story of Liimra Naturals began with the realization that modern diets have moved away from natural, nutrient-rich foods.
              </p>
              <p className="font-body text-[15px] leading-relaxed" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
                Millets, ancient grains packed with essential nutrients, emerged as the solution to today's nutritional challenges.
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute left-[-2rem] top-4 bottom-4 w-px" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--liimra-border)), transparent)" }}></div>
              <h3 className="font-display font-black text-2xl mb-4" style={{ color: OLIVE }}>
                Our Purpose
                <span className="block text-sm font-body font-semibold tracking-widest uppercase mt-2 opacity-0 select-none">
                  _ 
                </span>
              </h3>
              <p className="font-body text-[15px] leading-relaxed mb-5" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
                At Liimra Naturals, we believe in food that is pure, honest, and real. We are on this journey because we want to make healthy choices simple and accessible for everyone.
              </p>
              <p className="font-body text-[16px] leading-relaxed font-bold italic" style={{ color: NEON }}>
                "This is more than just a business for us—it's a commitment to you and to future generations."
              </p>
            </div>
          </div>
        </div>

        <div ref={pillarsRef} className="grid md:grid-cols-3 gap-8 scroll-reveal-stagger">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover-lift"
              style={{ background: "white", boxShadow: "0 1px 4px rgba(62,76,29,0.06), 0 4px 14px rgba(62,76,29,0.07)" }}
            >
              <div
                className="mb-6 p-4 rounded-full"
                style={{ background: `rgba(174,179,10,0.12)`, color: OLIVE }}
              >
                {pillar.icon}
              </div>
              <h3
                className="font-display font-black text-xl mb-3 leading-tight"
                style={{ color: OLIVE }}
              >
                {pillar.title}
              </h3>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "hsl(var(--liimra-ink-light))" }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8" style={{ borderTop: "1px solid hsl(var(--liimra-border))" }}>
          {[
            { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>, label: "FSSAI Certified" },
            { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, label: "48-Hour Freshness" },
            { icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></>, label: "Family Business" },
            { icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>, label: "WhatsApp Support" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 font-body text-xs" style={{ color: "hsl(var(--liimra-ink-light))" }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 flex-shrink-0" style={{ color: NEON }}>
                {badge.icon}
              </svg>
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

WhyLiimraSection.displayName = "WhyLiimraSection";

export default WhyLiimraSection;
