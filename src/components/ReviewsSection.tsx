import { memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Pune · Ragi Flour · Repeat buyer",
    text: "I switched my family from refined flour to Liimra's ragi three months ago. Kids actually ask for seconds now. The difference in how my kids sleep and perform at school has been remarkable.",
    initial: "P",
    highlight: "Kids actually ask for seconds now",
  },
  {
    name: "Suresh Pillai",
    location: "Chennai · Ragi + Jowar Combo",
    text: "Sugar dropped from 138 to 112 in 6 weeks of switching to ragi rotis. Doctor was surprised. I'm not stopping Liimra anytime soon.",
    initial: "S",
    highlight: "Sugar dropped from 138 to 112 in 6 weeks",
  },
  {
    name: "Rekha Patel",
    location: "Ahmedabad · Bajra Flour",
    text: "The aroma when you open the bag is something else. Mother-in-law approved — and she hasn't approved anything in 20 years. Asked me to order more bajra.",
    initial: "R",
    highlight: "Mother-in-law approved",
  },
  {
    name: "Anita Deshmukh",
    location: "Mumbai · Complete Collection · Mom of 2",
    text: "My 4-year-old has always been a picky eater. I was skeptical about millets, but the ragi pancakes are now his weekend favorite. Finally, healthy food that doesn't feel like a battle.",
    initial: "A",
    highlight: "Picky eater now asks for ragi pancakes",
  },
  {
    name: "Vikram Singh",
    location: "Delhi · Kangni + Jowar · Fitness enthusiast",
    text: "Been tracking macros for 3 years. Liimra's kangni flour is a game-changer for my cut phase. High protein, low GI, and actually tastes good. Lost 4kg in 6 weeks without feeling deprived.",
    initial: "V",
    highlight: "Lost 4kg in 6 weeks",
  },
  {
    name: "Lakshmi Iyer",
    location: "Bangalore · Sugar Control Trio · Age 62",
    text: "My daughter ordered this for me after my diabetes diagnosis. I was resistant at first — didn't want to give up my regular rotis. But jowar tastes almost the same, and my HbA1c improved from 8.5 to 7.1 in 3 months.",
    initial: "L",
    highlight: "HbA1c improved from 8.5 to 7.1",
  },
];

const ratingBars = [
  { star: 5, pct: 84 },
  { star: 4, pct: 11 },
  { star: 3, pct: 3 },
  { star: 2, pct: 1 },
  { star: 1, pct: 1 },
];

const Stars = memo(({ size = "w-3.5 h-3.5" }: { size?: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} viewBox="0 0 24 24" className={size} style={{ fill: NEON }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
));

Stars.displayName = "Stars";

const ReviewsSection = memo(() => {
  const sectionRef = useScrollReveal();
  const reviewsRef = useScrollReveal({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="reviews" className="scroll-reveal" style={{ background: "hsl(var(--liimra-cream))", padding: "96px 0" }}>
      <div className="max-w-6xl mx-auto px-6">

      {/* Header row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12">
        <SectionHeader
          eyebrow="Customer Reviews"
          title={<><em className="not-italic" style={{ color: OLIVE }}>1,400+ families</em> trust us</>}
          typewriter
        />

        {/* Aggregate score */}
        <div className="flex items-start gap-6 flex-shrink-0">
          <div className="font-display font-black text-6xl leading-none" style={{ color: "hsl(var(--liimra-ink))" }}>4.9</div>
          <div>
            <Stars size="w-4 h-4" />
            <div className="font-body text-xs mt-1 mb-3" style={{ color: "hsl(var(--liimra-ink-light))" }}>
              Based on 1,400+ verified reviews
            </div>
            {/* Rating bars */}
            <div className="flex flex-col gap-1.5">
              {ratingBars.map((b) => (
                <div key={b.star} className="flex items-center gap-2">
                  <span className="font-body text-[10px] w-5 text-right" style={{ color: "hsl(var(--liimra-ink-light))" }}>{b.star}★</span>
                  <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--liimra-border))" }}>
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: NEON }} />
                  </div>
                  <span className="font-body text-[10px]" style={{ color: "hsl(var(--liimra-ink-light))" }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div ref={reviewsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-reveal-stagger">
        {reviews.map((r, i) => (
          <div
            key={r.name}
            className="flex flex-col gap-4 rounded-2xl p-6 hover-lift"
            style={{ background: "white", boxShadow: "0 1px 4px rgba(62,76,29,0.06), 0 4px 14px rgba(62,76,29,0.07)" }}
          >
            <div className="flex items-center justify-between">
              <Stars />
              <span className="flex items-center gap-1.5 font-body text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: OLIVE }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Verified
              </span>
            </div>

            <p className="font-body text-sm leading-relaxed flex-1" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
              "{r.text}"
              {r.highlight && (
                <span className="block mt-2 font-semibold" style={{ color: OLIVE }}>
                  ✓ {r.highlight}
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid hsl(var(--liimra-border))" }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-white text-sm flex-shrink-0"
                style={{ background: i === 0 ? OLIVE : i === 1 ? "#4a5a22" : "#5c6e28" }}
              >
                {r.initial}
              </div>
              <div>
                <div className="font-body text-sm font-semibold" style={{ color: "hsl(var(--liimra-ink))" }}>{r.name}</div>
                <div className="font-body text-xs" style={{ color: "hsl(var(--liimra-ink-light))" }}>{r.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-10">
        <a
          href="#"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: OLIVE, borderBottom: `1.5px solid ${OLIVE}`, paddingBottom: "2px" }}
        >
          Read all 1,400+ reviews
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  </section>
  );
});

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;
