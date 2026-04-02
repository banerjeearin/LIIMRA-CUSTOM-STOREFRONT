import { useState, memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE_DARK  = "#3e4c1d";
const OLIVE_DEEPER = "#2d3815";
const NEON = "#aeb30a";

const grains = [
  {
    id: "ragi",
    label: "Ragi",
    image: "/products/ragi-250gm.png",
    latinName: "Eleusine coracana",
    subTitle: "Finger Millet",
    title: "Ragi — Nature's Calcium Vault",
    desc: "Ragi contains more calcium per gram than dairy milk, making it remarkable for bone density, children's growth, and preventing osteoporosis. Its low glycaemic index and slow-digesting complex carbohydrates make it the go-to flour for diabetes-friendly diets across South India. The iron, B-vitamins, and polyphenols in ragi also support cardiovascular health.",
    nutrients: [
      { value: "344mg", label: "Calcium / 100g" },
      { value: "GI 54",  label: "Glycaemic Index" },
      { value: "3.6g",  label: "Fibre / 100g" },
      { value: "7.3g",  label: "Protein / 100g" },
      { value: "3.9mg", label: "Iron / 100g" },
      { value: "Low",   label: "Glycaemic Load" },
    ],
    uses: ["Ragi Mudde", "Dosas & Idlis", "Baby Porridge", "Rotis", "Cookies", "Energy Bars"],
    highlight: "344mg calcium/100g — more than milk",
  },
  {
    id: "jowar",
    label: "Jowar",
    image: "/products/jowar-250gm.png",
    latinName: "Sorghum bicolor",
    subTitle: "Sorghum",
    title: "Jowar — The Gut-Friendly Wheat Substitute",
    desc: "Jowar is the closest millet to whole wheat in taste and texture, making it the easiest switch for Indian kitchens. Rich in antioxidant polyphenols that combat free radicals, it supports gut motility with 6.3g of fibre per 100g. Its high B-vitamin content aids energy metabolism, and the absence of gluten makes it ideal for those with gluten sensitivity.",
    nutrients: [
      { value: "10.4g", label: "Protein / 100g" },
      { value: "6.3g",  label: "Fibre / 100g" },
      { value: "GI 55", label: "Glycaemic Index" },
      { value: "4.1mg", label: "Iron / 100g" },
      { value: "High",  label: "Antioxidants" },
      { value: "27mg",  label: "Calcium / 100g" },
    ],
    uses: ["Bhakri", "Rotis", "Upma", "Pancakes", "Bread", "Porridge"],
    highlight: "3× more antioxidants than refined wheat flour",
  },
  {
    id: "bajra",
    label: "Bajra",
    image: "/products/bajra-250gm.png",
    latinName: "Pennisetum glaucum",
    subTitle: "Pearl Millet",
    title: "Bajra — The Iron & Energy Warrior",
    desc: "Bajra is Rajasthan's winter staple for good reason — its thermogenic Ayurvedic properties warm the body from within while its dense iron content (8mg/100g) makes it one of the best plant-based sources for anaemia prevention. High magnesium content supports cardiac health by relaxing blood vessels and improving insulin sensitivity.",
    nutrients: [
      { value: "8mg",   label: "Iron / 100g" },
      { value: "11.6g", label: "Protein / 100g" },
      { value: "1.2g",  label: "Fibre / 100g" },
      { value: "GI 54", label: "Glycaemic Index" },
      { value: "42mg",  label: "Calcium / 100g" },
      { value: "137mg", label: "Magnesium / 100g" },
    ],
    uses: ["Bajra Khichdi", "Rotis", "Thepla", "Bhakri", "Porridge", "Laddoo"],
    highlight: "8mg iron/100g — fights anaemia naturally",
  },
  {
    id: "kangni",
    label: "Kangni",
    image: "/products/kangni-250gm.png",
    latinName: "Setaria italica",
    subTitle: "Foxtail Millet",
    title: "Kangni — The Metabolism Booster",
    desc: "Kangni (foxtail millet) is a powerhouse for metabolic health. With 12.3g protein and 8g fibre per 100g, it keeps you fuller longer, stabilises blood sugar, and supports weight management. Rich in B-vitamins — especially thiamine (B1) at 0.59mg/100g, nearly 50% of daily requirement — it supports nerve health, energy production, and carbohydrate metabolism.",
    nutrients: [
      { value: "12.3g", label: "Protein / 100g" },
      { value: "8g",    label: "Fibre / 100g" },
      { value: "GI 50", label: "Glycaemic Index" },
      { value: "2.8mg", label: "Iron / 100g" },
      { value: "81mg",  label: "Magnesium / 100g" },
      { value: "0.59mg",label: "Thiamine B1/100g" },
    ],
    uses: ["Upma", "Pongal", "Khichdi", "Rotis", "Dosa Batter", "Porridge"],
    highlight: "Highest protein of all six flours — 12.3g/100g",
  },
  {
    id: "kutki",
    label: "Kutki",
    image: "/products/kutki-250gm.png",
    latinName: "Panicum sumatrense",
    subTitle: "Little Millet",
    title: "Kutki — The Gentle Gut Healer",
    desc: "Kutki (little millet) earns its reputation as the most digestible millet. Its high lecithin content makes it gentle on sensitive stomachs, while 7.6g of fibre per 100g feeds beneficial gut bacteria. With the highest iron content among all millets at 9.3mg/100g, it is exceptional for combating iron-deficiency anaemia. A low GI of ~50 makes it suitable for diabetics.",
    nutrients: [
      { value: "9.3mg", label: "Iron / 100g" },
      { value: "7.6g",  label: "Fibre / 100g" },
      { value: "GI ~50",label: "Glycaemic Index" },
      { value: "9.7g",  label: "Protein / 100g" },
      { value: "114mg", label: "Magnesium / 100g" },
      { value: "17mg",  label: "Calcium / 100g" },
    ],
    uses: ["Khichdi", "Pongal", "Pulao", "Rotis", "Idli Batter", "Porridge"],
    highlight: "9.3mg iron/100g — highest among all millets",
  },
  {
    id: "rice",
    label: "Rice Flour",
    image: "/products/rice-500gm.png",
    latinName: "Oryza sativa",
    subTitle: "Stone-Ground Rice",
    title: "Rice Flour — The Versatile Clean Base",
    desc: "Liimra's stone-ground rice flour is milled from whole rice grains without bleaching, refining, or additives — preserving natural starch structure and mild flavour. It is the lightest and most versatile flour in our range: ideal as a binding agent, for crispy batters, soft idlis, and as a gentle introduction for weaning infants. Naturally gluten-free and easy on the gut.",
    nutrients: [
      { value: "7.5g",  label: "Protein / 100g" },
      { value: "2.5g",  label: "Fibre / 100g" },
      { value: "0g",    label: "Gluten" },
      { value: "None",  label: "Additives" },
      { value: "None",  label: "Preservatives" },
      { value: "Stone", label: "Ground Method" },
    ],
    uses: ["Idli & Dosa", "Appam", "Chakli", "Puttu", "Baby Food", "Crispy Batters"],
    highlight: "Zero gluten · Zero additives · Zero preservatives",
  },
];

const MilletScienceSection = memo(() => {
  const [activeTab, setActiveTab] = useState("ragi");
  const active = grains.find((g) => g.id === activeTab)!;
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      id="our-millets"
      className="relative overflow-hidden scroll-reveal-blur"
      style={{ background: OLIVE_DEEPER, padding: "96px 0" }}
    >
      {/* Very faint ambient tint — barely perceptible */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${NEON}06 0%, transparent 65%)`, transform: "translate(35%, -35%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <SectionHeader
            eyebrow="The Science"
            title={<>Why our <em className="not-italic" style={{ color: NEON }}>6 flours</em> matter</>}
            subtitle="Each grain has a distinct nutritional identity. Here's the science behind every bag we grind."
            typewriter
            light
            centered
          />
        </div>

        {/* Tabs — scrollable row on mobile */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {grains.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              className="font-body text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap"
              style={
                activeTab === g.id
                  ? { background: NEON, color: OLIVE_DARK, fontWeight: 700 }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }
              }
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">

          {/* ── Visual: product image ── */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center" style={{ width: "380px", height: "460px" }}>
              <svg
                className="absolute pointer-events-none"
                style={{ width: "380px", height: "460px", top: 0, left: 0 }}
                viewBox="0 0 380 460"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Main blob — sharp edges, no filter */}
                <path fill="#1c2a09" fillOpacity="0.3">
                  <animate
                    attributeName="d"
                    dur="12s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                    values="
                      M190,32 C248,18 326,54 346,122 C368,196 352,296 302,354 C252,412 158,428 104,384 C48,338 28,240 34,164 C42,84 130,46 190,32 Z;
                      M190,22 C254,14 330,62 344,134 C360,212 336,308 282,364 C228,420 148,430 94,382 C38,332 26,232 36,154 C48,72 124,30 190,22 Z;
                      M190,38 C244,16 328,60 350,132 C374,208 350,304 298,360 C246,416 150,434 96,388 C40,340 30,238 38,160 C48,80 136,60 190,38 Z;
                      M190,26 C250,10 332,56 348,128 C366,206 344,302 292,358 C240,414 150,432 96,384 C40,334 28,234 36,156 C46,76 128,42 190,26 Z;
                      M190,32 C248,18 326,54 346,122 C368,196 352,296 302,354 C252,412 158,428 104,384 C48,338 28,240 34,164 C42,84 130,46 190,32 Z
                    "
                  />
                </path>

                {/* Droplet 1 — top-right */}
                <ellipse fill="#1c2a09" fillOpacity="0.3" cx="318" cy="58" rx="14" ry="18">
                  <animate attributeName="cx" values="318;322;314;320;318" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="cy" values="58;54;62;56;58" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="rx" values="14;16;12;15;14" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="ry" values="18;20;15;17;18" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                </ellipse>

                {/* Droplet 2 — left side */}
                <ellipse fill="#1c2a09" fillOpacity="0.3" cx="42" cy="210" rx="11" ry="16">
                  <animate attributeName="cx" values="42;38;46;40;42" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="cy" values="210;206;214;208;210" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="rx" values="11;13;9;12;11" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                </ellipse>

                {/* Droplet 3 — bottom-left */}
                <circle fill="#1c2a09" fillOpacity="0.3" cx="88" cy="418" r="10">
                  <animate attributeName="cx" values="88;84;92;86;88" dur="13s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="cy" values="418;414;422;416;418" dur="13s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="r" values="10;12;8;11;10" dur="13s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                </circle>

                {/* Droplet 4 — right side mid */}
                <ellipse fill="#1c2a09" fillOpacity="0.3" cx="356" cy="300" rx="9" ry="13">
                  <animate attributeName="cx" values="356;360;352;358;356" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                  <animate attributeName="cy" values="300;296;304;298;300" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />
                </ellipse>
              </svg>

              <img
                src={active.image}
                alt={active.label}
                loading="lazy"
                decoding="async"
                className="relative z-10 object-contain transition-all duration-500"
                style={{
                  width: "86%",
                  height: "86%",
                  filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.5))",
                  willChange: "opacity",
                }}
              />
            </div>
          </div>

          {/* ── Content ── */}
          <div>
            <div className="font-body text-xs font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: NEON }}>
              {active.subTitle} · {active.latinName}
            </div>
            <h3
              className="font-display font-black text-white leading-tight mb-3"
              style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}
            >
              {active.title}
            </h3>

            {/* Highlight callout */}
            <div
              className="inline-flex items-center gap-2 font-body text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              style={{ background: `${NEON}18`, color: NEON }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 flex-shrink-0">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {active.highlight}
            </div>

            <p className="font-body text-sm leading-relaxed mb-6 max-w-xl" style={{ color: "rgba(255,255,255,0.52)" }}>
              {active.desc}
            </p>

            {/* Nutrient stats — 3-col grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {active.nutrients.map((n) => (
                <div
                  key={n.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "0.67px solid rgba(255,255,255,0.09)" }}
                >
                  <div className="font-display font-black text-xl mb-0.5" style={{ color: NEON }}>
                    {n.value}
                  </div>
                  <div className="font-body text-[9px] leading-tight tracking-wide" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {n.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Use-case pills */}
            <div className="mb-2">
              <div className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Best used in
              </div>
              <div className="flex flex-wrap gap-2">
                {active.uses.map((u) => (
                  <span
                    key={u}
                    className="font-body text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.62)" }}
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav — quick-jump between grains */}
        <div
          className="mt-14 pt-8 flex flex-wrap items-center justify-center gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {grains.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              className="flex flex-col items-center gap-2 group transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: `linear-gradient(160deg, ${OLIVE_DARK}, #1e280d)`,
                  border: activeTab === g.id
                    ? `1.5px solid ${NEON}`
                    : "0.67px solid rgba(255,255,255,0.10)",
                }}
              >
                <img
                  src={g.image}
                  alt={g.label}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-1.5"
                  style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
                />
              </div>
              <span
                className="font-body text-[10px] font-semibold tracking-wider uppercase transition-colors"
                style={{ color: activeTab === g.id ? NEON : "rgba(255,255,255,0.38)" }}
              >
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

MilletScienceSection.displayName = "MilletScienceSection";

export default MilletScienceSection;
