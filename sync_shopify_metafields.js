import fs from 'fs';

// -----------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------
// Load from environment — copy .env.example to .env and fill in your values
// Never commit your actual token to git!
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
const STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || "353a64-a5.myshopify.com";
const GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

// -----------------------------------------------------
// PAYLOAD DATA TO SYNC
// -----------------------------------------------------
const PAYLOADS = {
  Jowar: {
    display_name: 'JOWAR',
    scientific_name: 'Sorghum bicolor',
    common_name: 'Sorghum',
    emoji: '🌿',
    status: 'High Protein',
    badge: 'High Protein',
    tagline: '🍞 Tastes like wheat. None of the gluten.',
    primary_benefit: 'The Gluten-Free Wheat Alternative',
    benefit_description: 'With 11.7g protein and 10.2g of fibre per 100g, Jowar provides steady energy and supports muscle maintenance without the gluten.',
    scientific_highlight: '11.7g protein & 10.2g fibre — the perfect gluten-free macro profile',
    image_bg: 'linear-gradient(160deg, hsl(32 45% 35%), hsl(28 40% 22%))',
    rating: '4.8',
    reviews: '218',
    // JSON
    primary_tags: JSON.stringify(["High Protein", "High Fibre", "Gluten-Free"]),
    secondary_tags: JSON.stringify(["Low Carb", "Diabetes Friendly"]),
    health_benefits: JSON.stringify(["Supports gut health and steady energy", "High fibre keeps you fuller longer", "High protein for muscle maintenance and recovery"]),
    recipes: JSON.stringify(["Bhakri", "Rotis", "Upma", "Pancakes"]),
    uses: JSON.stringify(["Bhakri", "Rotis", "Upma", "Pancakes", "Bread", "Porridge"]),
    color_theme: JSON.stringify({"bg": "20 80% 96%", "bgDark": "20 70% 90%", "accent": "20 75% 40%", "accentLight": "20 65% 65%", "text": "20 60% 18%", "textLight": "20 40% 40%"}),
    nutritional_facts: JSON.stringify([{"value": "321 kcal", "label": "Energy / 100g"}, {"value": "11.7g", "label": "Protein / 100g"}, {"value": "79.88g", "label": "Carbohydrates / 100g"}, {"value": "10.2g", "label": "Fiber / 100g"}, {"value": "5.3mg", "label": "Iron / 100g"}, {"value": "3.45mg", "label": "Fat / 100g"}]),
    nutrients: JSON.stringify([{"label": "Protein", "value": "11.7g"}, {"label": "Fibre", "value": "10.2g"}, {"label": "Energy", "value": "321 kcal"}]),
  },
  Bajra: {
    display_name: 'BAJRA',
    scientific_name: 'Pennisetum glaucum',
    common_name: 'Pearl Millet',
    emoji: '✨',
    status: 'Iron-Rich',
    badge: 'Iron-Rich',
    tagline: '🔥 Rajasthan\'s winter secret. Warming & iron-rich.',
    primary_benefit: 'The Iron Warrior',
    benefit_description: 'Backbone of Rajasthani winters for centuries. High iron for anaemia prevention with warming, nourishing properties.',
    scientific_highlight: '8mg iron/100g — fights anaemia naturally',
    image_bg: 'linear-gradient(160deg, hsl(42 42% 32%), hsl(38 38% 20%))',
    rating: '4.9',
    reviews: '196',
    // JSON
    primary_tags: JSON.stringify(["Iron-Rich", "High Fibre", "Gluten-Free"]),
    secondary_tags: JSON.stringify(["Iron", "Zinc", "High Protein"]),
    health_benefits: JSON.stringify(["High iron ideal for anaemia prevention", "Warming properties for cold-weather nourishment", "Supports digestive wellness"]),
    recipes: JSON.stringify(["Bajra Khichdi", "Rotis", "Thepla", "Bhakri"]),
    uses: JSON.stringify(["Bajra Khichdi", "Rotis", "Thepla", "Bhakri", "Porridge", "Laddoo"]),
    color_theme: JSON.stringify({"bg": "45 80% 90%", "bgDark": "45 70% 82%", "accent": "38 55% 45%", "accentLight": "42 60% 60%", "text": "40 50% 15%", "textLight": "40 35% 38%"}),
    nutritional_facts: JSON.stringify([{"value": "8mg", "label": "Iron / 100g"}, {"value": "11.6g", "label": "Protein / 100g"}, {"value": "1.2g", "label": "Fibre / 100g"}, {"value": "GI 54", "label": "Glycaemic Index"}, {"value": "42mg", "label": "Calcium / 100g"}, {"value": "137mg", "label": "Magnesium / 100g"}]),
    nutrients: JSON.stringify([{"label": "Iron", "value": "8mg"}, {"label": "Protein", "value": "11g"}, {"label": "Zinc", "value": "Rich"}]),
  }
};

const JSON_FIELDS = ['primary_tags', 'secondary_tags', 'health_benefits', 'recipes', 'uses', 'color_theme', 'nutritional_facts', 'nutrients'];

async function executeGraphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });
  
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return JSON.parse(text);
}

async function run() {
  console.log("🚀 Starting Shopify Metafield Sync...");
  
  // 1. Fetch all products to find Jowar and Bajra IDs
  const getProductsQuery = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;
  
  // 1. Fetch specific product by ID provided by user
  const GET_PRODUCT_QUERY = `
    query {
      product(id: "gid://shopify/Product/8665250791587") {
        id
        title
      }
    }
  `;
  
  console.log("📡 Fetching precise product: 8665250791587...");
  const res = await executeGraphQL(GET_PRODUCT_QUERY);
  
  if (res.errors) {
    console.error("❌ Root Level GraphQL Errors:");
    console.error(JSON.stringify(res.errors, null, 2));
    return;
  }
  
  if (!res.data || !res.data.product) {
    console.error("❌ Failed to fetch product. Is the ID correct? Does the token have read_products?");
    console.error(JSON.stringify(res, null, 2));
    return;
  }
  
  const product = res.data.product;
  let target = null;
  let payload = null;
  
  // Decide which payload to use
  if (product.title.toLowerCase().includes('jowar') || product.title.toLowerCase().includes('sorghum')) {
    target = 'Jowar';
    payload = PAYLOADS['Jowar'];
  } else if (product.title.toLowerCase().includes('bajra') || product.title.toLowerCase().includes('pearl')) {
    target = 'Bajra';
    payload = PAYLOADS['Bajra'];
  } else {
    // Force fallback to Jowar if the title is weird but they gave us the ID while asking for Jowar right before this
    console.log("⚠️ Product name (" + product.title + ") didn't perfectly match Jowar or Bajra. Forcing Jowar payload based on context!");
    target = 'Jowar';
    payload = PAYLOADS['Jowar'];
  }
    
    if (target && payload) {
      console.log(`\n========================================`);
      console.log(`✅ Found Match: ${product.title} (ID: ${product.id})`);
      console.log(`⚙️ Generating ${target} Mutations...`);
      
      const metafields = [];
      for (const [key, value] of Object.entries(payload)) {
        if (!value) continue;
        
        let type = 'single_line_text_field'; // Default
        if (typeof value === 'number' || (typeof value === 'string' && key === 'rating')) {
          type = 'number_integer';
          if (key === 'rating') type = 'number_decimal';
        }
        if (JSON_FIELDS.includes(key)) {
           type = 'json';
        }
        
        metafields.push({
          ownerId: product.id,
          namespace: 'custom',
          key: key,
          type: type,
          value: value.toString()
        });
      }
      
      const mutation = `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              key
              namespace
              value
              createdAt
              updatedAt
            }
            userErrors {
              field
              message
              code
            }
          }
        }
      `;
      
      console.log(`⚡ Sending ${metafields.length} Metafields to Shopify Admin API...`);
      const mutRes = await executeGraphQL(mutation, { metafields });
      
      if (mutRes.errors) {
         console.error("❌ Root Level GraphQL Errors:");
         console.error(JSON.stringify(mutRes.errors, null, 2));
      } else if (mutRes.data && mutRes.data.metafieldsSet && mutRes.data.metafieldsSet.userErrors && mutRes.data.metafieldsSet.userErrors.length > 0) {
        console.error("❌ User Errors occurred writing metafields:");
        console.error(mutRes.data.metafieldsSet.userErrors);
      } else if (mutRes.data && mutRes.data.metafieldsSet) {
         console.log(`🎉 SUCCESS! Wrote ${mutRes.data.metafieldsSet.metafields.length} metadata blocks for ${target}.`);
      } else {
         console.error("❌ Unknown error. Response payload: ", mutRes);
      }
    }
}

run().catch(e => {
  console.error("💥 FAILED: ", e);
});
