import { useState, memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE = "#3e4c1d";
const NEON  = "#aeb30a";

const recipes = [
  {
    id: "ragi",
    tag: "Ragi · Breakfast · Kid-Approved",
    name: "Ragi Dosa",
    desc: "Crispy, thin dosa fermented with ragi flour. The natural sourness and earthy depth pair beautifully with coconut chutney. A calcium-rich, low-GI morning staple the whole family will love.",
    time: "20 min",
    servings: "4",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    steps: ["Mix ragi flour + rice flour + curd", "Ferment 6–8 hrs", "Spread thin on hot tawa", "Serve with coconut chutney"],
  },
  {
    id: "jowar",
    tag: "Jowar · Lunch · Family Favorite",
    name: "Jowar Bhakri",
    desc: "Traditional Maharashtrian flatbread — thick, slightly smoky, gluten-free. Stone-ground jowar makes it softer than commercial versions. Pairs with any curry, raw onion, and cold-pressed oil.",
    time: "15 min",
    servings: "2",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=800&q=80",
    steps: ["Boil water, add jowar flour", "Knead into soft dough", "Pat flat by hand", "Cook on dry tawa till charred edges"],
  },
  {
    id: "bajra",
    tag: "Bajra · Dinner",
    name: "Bajra Khichdi",
    desc: "One-pot warming winter khichdi with bajra, moong dal, ghee and whole spices. A Rajasthani night-time staple that is deeply nourishing, high in iron, and easy to digest.",
    time: "30 min",
    servings: "3",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80",
    steps: ["Soak bajra flour balls overnight", "Pressure cook with moong dal", "Temper with ghee, cumin, garlic", "Top with pickled onion"],
  },
  {
    id: "kangni",
    tag: "Kangni · Snack",
    name: "Kangni Upma",
    desc: "Light, protein-rich upma made with foxtail millet flour — a south Indian morning staple that keeps you energised all day. The nuttiness of kangni lifts the classic recipe beyond plain semolina.",
    time: "20 min",
    servings: "2",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    steps: ["Dry roast kangni flour briefly", "Sauté mustard seeds, onions, green chilli", "Add water and roasted flour", "Cook till fluffy, finish with lemon"],
  },
  {
    id: "kutki",
    tag: "Kutki · Lunch",
    name: "Kutki Pongal",
    desc: "Silky, comforting Pongal with little millet flour — easier to digest than rice, gentler on the gut, richer in iron. The black pepper and ghee tempering makes this a deeply satisfying one-bowl meal.",
    time: "25 min",
    servings: "3",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    steps: ["Cook kutki flour with split moong dal", "Temper with ghee, cumin, pepper, ginger", "Stir to creamy consistency", "Serve with sambar or coconut chutney"],
  },
  {
    id: "rice-flour",
    tag: "Rice Flour · Breakfast",
    name: "Soft Idli",
    desc: "Fluffy, melt-in-the-mouth idli made with stone-ground rice flour. No additives means you taste the true, clean flavour of whole rice. Lighter, softer, and more digestible than commercial rice flour idlis.",
    time: "25 min",
    servings: "12 idlis",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    steps: ["Soak rice flour + urad dal overnight", "Grind and ferment 8 hrs", "Steam in greased idli moulds", "Serve hot with sambar"],
  },
];

type Recipe = typeof recipes[0];

const RecipeCard = memo(({ r }: { r: Recipe }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden hover-lift"
            style={{ background: "white", boxShadow: "0 1px 4px rgba(62,76,29,0.06), 0 4px 14px rgba(62,76,29,0.07)" }}
    >
      {/* Image area with real dish photo */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <img
          src={r.image}
          alt={r.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ willChange: "transform" }}
        />
        {/* Difficulty pill */}
        <span
          className="absolute top-3 right-3 font-body text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded-full"
          style={{ background: "rgba(62,76,29,0.12)", color: OLIVE }}
        >
          {r.difficulty}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <div className="font-body text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: NEON }}>
          {r.tag}
        </div>
        <h3 className="font-display font-black text-xl leading-tight" style={{ color: "hsl(var(--liimra-ink))" }}>
          {r.name}
        </h3>
        <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(var(--liimra-ink-light))" }}>
          {r.desc}
        </p>

        {/* Meta row */}
        <div
          className="flex items-center gap-4 pt-3 mt-auto"
          style={{ borderTop: "1px solid hsl(72 18% 92%)" }}
        >
          <span className="flex items-center gap-1.5 font-body text-xs" style={{ color: "hsl(var(--liimra-ink-light))" }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {r.time}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs" style={{ color: "hsl(var(--liimra-ink-light))" }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
            {r.servings} servings
          </span>

          {/* Quick-steps toggle */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="ml-auto font-body text-[10px] font-bold tracking-[0.1em] uppercase transition-colors"
            style={{ color: OLIVE }}
          >
            {expanded ? "Hide steps ↑" : "Quick steps ↓"}
          </button>
        </div>

        {/* Expandable steps */}
        {expanded && (
          <ol className="flex flex-col gap-1.5 pt-3 animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderTop: "1px solid hsl(72 18% 92%)" }}>
            {r.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-xs" style={{ color: "hsl(var(--liimra-ink-mid))" }}>
                <span
                  className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px]"
                  style={{ background: "rgba(174,179,10,0.15)", color: "#6b6e00" }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
});

RecipeCard.displayName = "RecipeCard";

const RecipeSection = memo(() => {
  const sectionRef = useScrollReveal();
  const recipesRef = useScrollReveal({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="recipes" className="scroll-reveal" style={{ background: "hsl(var(--liimra-cream))", padding: "96px 0" }}>
      <div className="max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <SectionHeader
          eyebrow="Recipe Ideas"
          title={<>From our kitchen to <em className="not-italic" style={{ color: OLIVE }}>yours</em></>}
          subtitle="Quick, delicious recipes your family will love"
          typewriter
          centered
        />
      </div>

      <div ref={recipesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-reveal-stagger">
        {recipes.map((r) => (
          <RecipeCard key={r.id} r={r} />
        ))}
      </div>
    </div>
  </section>
  );
});

RecipeSection.displayName = "RecipeSection";

export default RecipeSection;
