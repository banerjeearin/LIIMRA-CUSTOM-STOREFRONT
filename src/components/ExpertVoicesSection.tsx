import { memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE_DARK = "#3e4c1d";
const OLIVE_DEEPER = "#2d3815";
const NEON = "#aeb30a";

const experts = [
  {
    initial: "D",
    name: "Dr. Deepa Menon",
    title: "Clinical Nutritionist, Mumbai",
    quote:
      "I recommend this to my own family. Real food, not processed powder.",
    avatarBg: OLIVE_DARK,
  },
  {
    initial: "R",
    name: "Dr. Ramesh Iyer",
    title: "Diabetologist, Pune",
    quote:
      "My diabetic patients see 15-20% improvement in HbA1c within 3 months.",
    avatarBg: "#4a5a22",
  },
  {
    initial: "A",
    name: "Dr. Ananya Krishnan",
    title: "Ayurvedic Physician, Bengaluru",
    quote:
      "What our ancestors thrived on. Nutrients preserved, not destroyed.",
    avatarBg: "#5c6e28",
  },
];

const ExpertVoicesSection = memo(() => {
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden scroll-reveal-left"
      style={{ background: OLIVE_DEEPER, padding: "96px 0" }}
    >
    {/* Faint neon bottom-left glow */}
    <div
      className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
      style={{ background: `radial-gradient(circle, ${NEON}07 0%, transparent 70%)`, transform: "translate(-30%, 30%)" }}
    />

    <div className="relative max-w-6xl mx-auto px-6">
      <div className="mb-12">
        <SectionHeader
          eyebrow="Expert Voices"
          title={<>Trusted by <em className="not-italic" style={{ color: NEON }}>doctors</em></>}
          centered
          typewriter
          light
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((e) => (
          <div
            key={e.name}
            className="flex flex-col gap-4 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "0.67px solid rgba(255,255,255,0.10)" }}
          >
            {/* Opening quote mark */}
            <div className="font-display text-5xl leading-none" style={{ color: NEON, opacity: 0.4 }} aria-hidden>
              "
            </div>

            <p className="font-body text-sm leading-relaxed flex-1 -mt-4" style={{ color: "rgba(255,255,255,0.65)" }}>
              {e.quote}
            </p>

            <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-white text-base flex-shrink-0"
                style={{ background: e.avatarBg, border: `1.5px solid ${NEON}40` }}
              >
                {e.initial}
              </div>
              <div>
                <div className="font-body text-sm font-semibold text-white">{e.name}</div>
                <div className="font-body text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{e.title}</div>
              </div>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-1.5 font-body text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: NEON }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Verified Expert
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
});

ExpertVoicesSection.displayName = "ExpertVoicesSection";

export default ExpertVoicesSection;
