export interface ProductSize {
  size: string;
  mrp: number;
  price: number;
  discount: number;
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
    rating: 4.9,
    reviews: 324,
    primaryTags: ["Low GI", "High Calcium", "Gluten-Free"],
    secondaryTags: ["Diabetes Friendly", "B-Vitamins"],
    sizes: [
      { size: "500g", mrp: 199, price: 159, discount: 20 },
      { size: "1 kg", mrp: 349, price: 289, discount: 17 },
      { size: "2 kg", mrp: 649, price: 549, discount: 15 },
    ],
    nutrients: [
      { label: "Calcium", value: "344mg" },
      { label: "GI Index", value: "Low" },
      { label: "Fibre", value: "3.6g" },
    ],
    primaryBenefit: "Nature's Calcium Vault",
    benefitDescription: "More calcium than milk gram-for-gram. Extraordinary for bone health, children's growth, and blood sugar control.",
    healthBenefits: [
      "Low GI helps control blood sugar naturally",
      "Extraordinary for bone health and children's growth",
      "Curbs cravings, steady metabolism",
    ],
    recipes: ["Ragi Mudde", "Dosas & Idlis", "Baby Food", "Porridge"],
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
    rating: 4.8,
    reviews: 218,
    primaryTags: ["High Protein", "Gluten-Free", "Antioxidants"],
    secondaryTags: ["High Fibre", "Low Carb", "Diabetes Friendly"],
    sizes: [
      { size: "500g", mrp: 189, price: 149, discount: 21 },
    ],
    nutrients: [
      { label: "Protein", value: "10.4g" },
      { label: "Fibre", value: "6.3g" },
      { label: "Antioxidants", value: "High" },
    ],
    primaryBenefit: "The Gluten-Free Wheat Alternative",
    benefitDescription: "Closest in taste and texture to whole wheat. Rich in antioxidants, B-vitamins, and fibre for steady energy all day.",
    healthBenefits: [
      "Supports gut health and steady energy",
      "High fibre keeps you fuller longer",
      "Complex carbs for sustained release",
    ],
    recipes: ["Bhakri", "Rotis", "Upma", "Pancakes"],
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
    rating: 4.9,
    reviews: 196,
    primaryTags: ["Iron-Rich", "High Fibre", "Gluten-Free"],
    secondaryTags: ["Iron", "Zinc", "High Protein"],
    sizes: [
      { size: "500g", mrp: 179, price: 139, discount: 22 },
    ],
    nutrients: [
      { label: "Iron", value: "8mg" },
      { label: "Protein", value: "11g" },
      { label: "Zinc", value: "Rich" },
    ],
    primaryBenefit: "The Iron Warrior",
    benefitDescription: "Backbone of Rajasthani winters for centuries. High iron for anaemia prevention with warming, nourishing properties.",
    healthBenefits: [
      "High iron ideal for anaemia prevention",
      "Warming properties for cold-weather nourishment",
      "Supports digestive wellness",
    ],
    recipes: ["Bajra Khichdi", "Rotis", "Thepla", "Bhakri"],
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
    rating: 0,
    reviews: 0,
    primaryTags: ["Low GI", "Iron-Rich", "Gluten-Free"],
    secondaryTags: ["Weight Management", "Diabetes Friendly"],
    sizes: [
      { size: "500g", mrp: 189, price: 149, discount: 21 },
    ],
    nutrients: [
      { label: "Carbs", value: "Low GI" },
      { label: "Iron", value: "Rich" },
      { label: "Protein", value: "High" },
    ],
    primaryBenefit: "The Ancient Grain Revived",
    benefitDescription: "One of the oldest cultivated millets. Rich in iron and low GI — perfect for weight management and blood sugar control.",
    healthBenefits: [
      "Excellent for weight management",
      "Low glycaemic index for steady energy",
      "Rich in iron and essential minerals",
    ],
    recipes: ["Kangni Upma", "Kheer", "Pulao", "Porridge"],
    colorTheme: {
      bg: "160 30% 92%",
      bgDark: "160 25% 84%",
      accent: "160 45% 30%",
      accentLight: "160 35% 50%",
      text: "160 40% 12%",
      textLight: "160 25% 35%",
    },
  },
];
