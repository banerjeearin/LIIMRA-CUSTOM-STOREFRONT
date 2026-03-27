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
    title: "Zero Risk",
    description:
      "30-day money-back. Even if your kids won't eat it.",
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
