export interface ProductSize {
  size: string;
  mrp: number;
  price: number;
  discount: number;
  variantId?: string;
}

export interface NutrientHighlight {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  displayName: string;
  scientificName: string;
  commonName: string;
  emoji: string;
  status: string;
  rating: number;
  reviews: number;
  primaryTags: string[];
  secondaryTags: string[];
  sizes: ProductSize[];
  nutrients: NutrientHighlight[];
  primaryBenefit: string;
  benefitDescription: string;
  healthBenefits: string[];
  recipes: string[];
  colorTheme: {
    bg: string;
    bgDark: string;
    accent: string;
    accentLight: string;
    text: string;
    textLight: string;
  };
  image: string;
  imageBg: string;
  tagline: string;
  detailedDescription: string;
  scientificHighlight: string;
  nutritionalFacts: NutrientHighlight[];
  uses: string[];
  badge: string;
}

export const products: Product[] = [
  {
    id: "ragi",
    name: "Ragi Flour",
    displayName: "RAGI",
    scientificName: "Eleusine coracana",
    commonName: "Finger Millet",
    emoji: "🌾",
    status: "#1 Bestseller",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 324,
    primaryTags: ["Low GI", "High Calcium", "Gluten-Free"],
    secondaryTags: ["Diabetes Friendly", "B-Vitamins"],
    image: "/products/ragi-250gm.png",
    imageBg: "linear-gradient(160deg, hsl(74 30% 26%), hsl(74 35% 18%))",
    tagline: "💚 Kids love it. Moms trust it. Doctors recommend it.",
    sizes: [
      { size: "250g", mrp: 139, price: 109, discount: 22 },
      { size: "500g", mrp: 199, price: 159, discount: 20 },
      { size: "1kg", mrp: 369, price: 289, discount: 22 },
    ],
    nutrients: [
      { label: "Calcium", value: "344mg" },
      { label: "GI Index", value: "Low" },
      { label: "Fibre", value: "3.6g" },
    ],
    nutritionalFacts: [
      { value: "344mg", label: "Calcium / 100g" },
      { value: "GI 54", label: "Glycaemic Index" },
      { value: "3.6g", label: "Fibre / 100g" },
      { value: "7.3g", label: "Protein / 100g" },
      { value: "3.9mg", label: "Iron / 100g" },
      { value: "Low", label: "Glycaemic Load" },
    ],
    primaryBenefit: "Nature's Calcium Vault",
    benefitDescription: "More calcium than milk gram-for-gram. Extraordinary for bone health, children's growth, and blood sugar control.",
    detailedDescription: "Ragi contains more calcium per gram than dairy milk, making it remarkable for bone density, children's growth, and preventing osteoporosis. Its low glycaemic index and slow-digesting complex carbohydrates make it the go-to flour for diabetes-friendly diets across South India. The iron, B-vitamins, and polyphenols in ragi also support cardiovascular health.",
    scientificHighlight: "344mg calcium/100g — more than milk",
    healthBenefits: [
      "Low GI helps control blood sugar naturally",
      "Extraordinary for bone health and children's growth",
      "Curbs cravings, steady metabolism",
    ],
    recipes: ["Ragi Mudde", "Dosas & Idlis", "Baby Food", "Porridge"],
    uses: ["Ragi Mudde", "Dosas & Idlis", "Baby Porridge", "Rotis", "Cookies", "Energy Bars"],
    colorTheme: {
      bg: "142 30% 94%",
      bgDark: "142 30% 85%",
      accent: "145 40% 25%",
      accentLight: "145 35% 55%",
      text: "145 40% 15%",
      textLight: "145 30% 35%",
    },
  },
  {
    id: "jowar",
    name: "Jowar Flour",
    displayName: "JOWAR",
    scientificName: "Sorghum bicolor",
    commonName: "Sorghum",
    emoji: "🌿",
    status: "High Protein",
    badge: "High Protein",
    rating: 4.8,
    reviews: 218,
    primaryTags: ["High Protein", "Gluten-Free", "Antioxidants"],
    secondaryTags: ["High Fibre", "Low Carb", "Diabetes Friendly"],
    image: "/products/jowar-250gm.png",
    imageBg: "linear-gradient(160deg, hsl(32 45% 35%), hsl(28 40% 22%))",
    tagline: "🍞 Tastes like wheat. None of the gluten.",
    sizes: [
      { size: "250g", mrp: 129, price: 99, discount: 23 },
      { size: "500g", mrp: 189, price: 149, discount: 21 },
      { size: "1kg", mrp: 349, price: 279, discount: 20 },
    ],
    nutrients: [
      { label: "Protein", value: "10.4g" },
      { label: "Fibre", value: "6.3g" },
      { label: "Antioxidants", value: "High" },
    ],
    nutritionalFacts: [
      { value: "10.4g", label: "Protein / 100g" },
      { value: "6.3g", label: "Fibre / 100g" },
      { value: "GI 55", label: "Glycaemic Index" },
      { value: "4.1mg", label: "Iron / 100g" },
      { value: "High", label: "Antioxidants" },
      { value: "27mg", label: "Calcium / 100g" },
    ],
    primaryBenefit: "The Gluten-Free Wheat Alternative",
    benefitDescription: "Closest in taste and texture to whole wheat. Rich in antioxidants, B-vitamins, and fibre for steady energy all day.",
    detailedDescription: "Jowar is the closest millet to whole wheat in taste and texture, making it the easiest switch for Indian kitchens. Rich in antioxidant polyphenols that combat free radicals, it supports gut motility with 6.3g of fibre per 100g. Its high B-vitamin content aids energy metabolism, and the absence of gluten makes it ideal for those with gluten sensitivity.",
    scientificHighlight: "3× more antioxidants than refined wheat flour",
    healthBenefits: [
      "Supports gut health and steady energy",
      "High fibre keeps you fuller longer",
      "Complex carbs for sustained release",
    ],
    recipes: ["Bhakri", "Rotis", "Upma", "Pancakes"],
    uses: ["Bhakri", "Rotis", "Upma", "Pancakes", "Bread", "Porridge"],
    colorTheme: {
      bg: "20 80% 96%",
      bgDark: "20 70% 90%",
      accent: "20 75% 40%",
      accentLight: "20 65% 65%",
      text: "20 60% 18%",
      textLight: "20 40% 40%",
    },
  },
  {
    id: "bajra",
    name: "Bajra Flour",
    displayName: "BAJRA",
    scientificName: "Pennisetum glaucum",
    commonName: "Pearl Millet",
    emoji: "✨",
    status: "Iron-Rich",
    badge: "Iron-Rich",
    rating: 4.9,
    reviews: 196,
    primaryTags: ["Iron-Rich", "High Fibre", "Gluten-Free"],
    secondaryTags: ["Iron", "Zinc", "High Protein"],
    image: "/products/bajra-250gm.png",
    imageBg: "linear-gradient(160deg, hsl(42 42% 32%), hsl(38 38% 20%))",
    tagline: "🔥 Rajasthan's winter secret. Warming & iron-rich.",
    sizes: [
      { size: "250g", mrp: 119, price: 89, discount: 25 },
      { size: "500g", mrp: 179, price: 139, discount: 22 },
      { size: "1kg", mrp: 329, price: 259, discount: 21 },
    ],
    nutrients: [
      { label: "Iron", value: "8mg" },
      { label: "Protein", value: "11g" },
      { label: "Zinc", value: "Rich" },
    ],
    nutritionalFacts: [
      { value: "8mg", label: "Iron / 100g" },
      { value: "11.6g", label: "Protein / 100g" },
      { value: "1.2g", label: "Fibre / 100g" },
      { value: "GI 54", label: "Glycaemic Index" },
      { value: "42mg", label: "Calcium / 100g" },
      { value: "137mg", label: "Magnesium / 100g" },
    ],
    primaryBenefit: "The Iron Warrior",
    benefitDescription: "Backbone of Rajasthani winters for centuries. High iron for anaemia prevention with warming, nourishing properties.",
    detailedDescription: "Bajra is Rajasthan's winter staple for good reason — its thermogenic Ayurvedic properties warm the body from within while its dense iron content (8mg/100g) makes it one of the best plant-based sources for anaemia prevention. High magnesium content supports cardiac health by relaxing blood vessels and improving insulin sensitivity.",
    scientificHighlight: "8mg iron/100g — fights anaemia naturally",
    healthBenefits: [
      "High iron ideal for anaemia prevention",
      "Warming properties for cold-weather nourishment",
      "Supports digestive wellness",
    ],
    recipes: ["Bajra Khichdi", "Rotis", "Thepla", "Bhakri"],
    uses: ["Bajra Khichdi", "Rotis", "Thepla", "Bhakri", "Porridge", "Laddoo"],
    colorTheme: {
      bg: "45 80% 90%",
      bgDark: "45 70% 82%",
      accent: "38 55% 45%",
      accentLight: "42 60% 60%",
      text: "40 50% 15%",
      textLight: "40 35% 38%",
    },
  },
  {
    id: "kangni",
    name: "Kangni Flour",
    displayName: "KANGNI",
    scientificName: "Setaria italica",
    commonName: "Foxtail Millet",
    emoji: "🌱",
    status: "Coming Soon",
    badge: "Coming Soon",
    rating: 4.7,
    reviews: 89,
    primaryTags: ["Low GI", "Iron-Rich", "Gluten-Free"],
    secondaryTags: ["Weight Management", "Diabetes Friendly"],
    image: "/products/kangni-250gm.png",
    imageBg: "linear-gradient(160deg, hsl(160 35% 28%), hsl(160 40% 18%))",
    tagline: "⚡ Highest protein. Metabolism booster.",
    sizes: [
      { size: "250g", mrp: 129, price: 99, discount: 23 },
      { size: "500g", mrp: 189, price: 149, discount: 21 },
      { size: "1kg", mrp: 349, price: 279, discount: 20 },
    ],
    nutrients: [
      { label: "Carbs", value: "Low GI" },
      { label: "Iron", value: "Rich" },
      { label: "Protein", value: "High" },
    ],
    nutritionalFacts: [
      { value: "12.3g", label: "Protein / 100g" },
      { value: "8g", label: "Fibre / 100g" },
      { value: "GI 50", label: "Glycaemic Index" },
      { value: "2.8mg", label: "Iron / 100g" },
      { value: "81mg", label: "Magnesium / 100g" },
      { value: "0.59mg", label: "Thiamine B1/100g" },
    ],
    primaryBenefit: "The Ancient Grain Revived",
    benefitDescription: "One of the oldest cultivated millets. Rich in iron and low GI — perfect for weight management and blood sugar control.",
    detailedDescription: "Kangni (foxtail millet) is a powerhouse for metabolic health. With 12.3g protein and 8g fibre per 100g, it keeps you fuller longer, stabilises blood sugar, and supports weight management. Rich in B-vitamins — especially thiamine (B1) at 0.59mg/100g, nearly 50% of daily requirement — it supports nerve health, energy production, and carbohydrate metabolism.",
    scientificHighlight: "Highest protein of all six flours — 12.3g/100g",
    healthBenefits: [
      "Excellent for weight management",
      "Low glycaemic index for steady energy",
      "Rich in iron and essential minerals",
    ],
    recipes: ["Kangni Upma", "Kheer", "Pulao", "Porridge"],
    uses: ["Upma", "Pongal", "Khichdi", "Rotis", "Dosa Batter", "Porridge"],
    colorTheme: {
      bg: "160 30% 92%",
      bgDark: "160 25% 84%",
      accent: "160 45% 30%",
      accentLight: "160 35% 50%",
      text: "160 40% 12%",
      textLight: "160 25% 35%",
    },
  },
  {
    id: "kutki",
    name: "Kutki Flour",
    displayName: "KUTKI",
    scientificName: "Panicum sumatrense",
    commonName: "Little Millet",
    emoji: "🌾",
    status: "Gut-Friendly",
    badge: "Gut-Friendly",
    rating: 4.8,
    reviews: 142,
    primaryTags: ["High Iron", "High Fibre", "Gluten-Free"],
    secondaryTags: ["Gut Health", "Diabetes Friendly"],
    image: "/products/kutki-250gm.png",
    imageBg: "linear-gradient(160deg, hsl(160 35% 28%), hsl(160 40% 18%))",
    tagline: "🌿 Gentle on gut. Highest iron.",
    sizes: [
      { size: "250g", mrp: 139, price: 109, discount: 22 },
      { size: "500g", mrp: 199, price: 159, discount: 20 },
      { size: "1kg", mrp: 369, price: 289, discount: 22 },
    ],
    nutrients: [
      { label: "Iron", value: "9.3mg" },
      { label: "Fibre", value: "7.6g" },
      { label: "GI Index", value: "~50" },
    ],
    nutritionalFacts: [
      { value: "9.3mg", label: "Iron / 100g" },
      { value: "7.6g", label: "Fibre / 100g" },
      { value: "GI ~50", label: "Glycaemic Index" },
      { value: "9.7g", label: "Protein / 100g" },
      { value: "114mg", label: "Magnesium / 100g" },
      { value: "17mg", label: "Calcium / 100g" },
    ],
    primaryBenefit: "The Gentle Gut Healer",
    benefitDescription: "Most digestible millet with highest iron content. Gentle on sensitive stomachs while fighting anaemia.",
    detailedDescription: "Kutki (little millet) earns its reputation as the most digestible millet. Its high lecithin content makes it gentle on sensitive stomachs, while 7.6g of fibre per 100g feeds beneficial gut bacteria. With the highest iron content among all millets at 9.3mg/100g, it is exceptional for combating iron-deficiency anaemia. A low GI of ~50 makes it suitable for diabetics.",
    scientificHighlight: "9.3mg iron/100g — highest among all millets",
    healthBenefits: [
      "Highest iron content among all millets",
      "Gentle on sensitive stomachs",
      "Supports gut health with high fibre",
    ],
    recipes: ["Khichdi", "Pongal", "Pulao", "Rotis"],
    uses: ["Khichdi", "Pongal", "Pulao", "Rotis", "Idli Batter", "Porridge"],
    colorTheme: {
      bg: "160 30% 92%",
      bgDark: "160 25% 84%",
      accent: "160 45% 30%",
      accentLight: "160 35% 50%",
      text: "160 40% 12%",
      textLight: "160 25% 35%",
    },
  },
  {
    id: "rice",
    name: "Rice Flour",
    displayName: "RICE",
    scientificName: "Oryza sativa",
    commonName: "Stone-Ground Rice",
    emoji: "🍚",
    status: "Versatile",
    badge: "Versatile",
    rating: 4.9,
    reviews: 267,
    primaryTags: ["Gluten-Free", "Light", "Versatile"],
    secondaryTags: ["No Additives", "Stone Ground"],
    image: "/products/rice-500gm.png",
    imageBg: "linear-gradient(160deg, hsl(0 0% 95%), hsl(0 0% 85%))",
    tagline: "✨ Pure. Clean. Versatile.",
    sizes: [
      { size: "500g", mrp: 149, price: 119, discount: 20 },
      { size: "1kg", mrp: 279, price: 229, discount: 18 },
      { size: "2kg", mrp: 529, price: 429, discount: 19 },
    ],
    nutrients: [
      { label: "Protein", value: "7.5g" },
      { label: "Fibre", value: "2.5g" },
      { label: "Gluten", value: "0g" },
    ],
    nutritionalFacts: [
      { value: "7.5g", label: "Protein / 100g" },
      { value: "2.5g", label: "Fibre / 100g" },
      { value: "0g", label: "Gluten" },
      { value: "None", label: "Additives" },
      { value: "None", label: "Preservatives" },
      { value: "Stone", label: "Ground Method" },
    ],
    primaryBenefit: "The Versatile Clean Base",
    benefitDescription: "Stone-ground rice flour without bleaching or additives. Light, versatile, and perfect for crispy batters and soft idlis.",
    detailedDescription: "Liimra's stone-ground rice flour is milled from whole rice grains without bleaching, refining, or additives — preserving natural starch structure and mild flavour. It is the lightest and most versatile flour in our range: ideal as a binding agent, for crispy batters, soft idlis, and as a gentle introduction for weaning infants. Naturally gluten-free and easy on the gut.",
    scientificHighlight: "Zero gluten · Zero additives · Zero preservatives",
    healthBenefits: [
      "Naturally gluten-free and easy to digest",
      "No additives or preservatives",
      "Ideal for sensitive stomachs and babies",
    ],
    recipes: ["Idli & Dosa", "Appam", "Chakli", "Puttu"],
    uses: ["Idli & Dosa", "Appam", "Chakli", "Puttu", "Baby Food", "Crispy Batters"],
    colorTheme: {
      bg: "0 0% 96%",
      bgDark: "0 0% 90%",
      accent: "0 0% 30%",
      accentLight: "0 0% 60%",
      text: "0 0% 15%",
      textLight: "0 0% 40%",
    },
  },
];
