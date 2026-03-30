import fs from 'fs';

// Simple ENV parser for this script
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1]] = val;
  }
});

const SHOPIFY_DOMAIN = env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  console.error("❌ Missing VITE_SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env");
  process.exit(1);
}

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const query = `
  query OutputDiagnostics {
    shop {
      name
      description
    }
    products(first: 5) {
      edges {
        node {
          id
          title
          metafields(identifiers: [
            {namespace: "custom", key: "product_id"},
            {namespace: "custom", key: "display_name"},
            {namespace: "custom", key: "scientific_name"},
            {namespace: "custom", key: "emoji"},
            {namespace: "custom", key: "color_theme"}
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

console.log("Connecting to", STOREFRONT_API_URL, "...");

try {
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
    },
    body: JSON.stringify({ query })
  });
  
  const text = await response.text();
  
  if (!response.ok) {
    console.error(`❌ HTTP Error: ${response.status}`);
    console.error(text);
    process.exit(1);
  }
  
  const json = JSON.parse(text);
  if (json.errors) {
    console.error("❌ GraphQL Errors:");
    console.error(JSON.stringify(json.errors, null, 2));
  } else {
    console.log("✅ Successfully connected to Shopify Storefront API!");
    console.log(`🏪 Store Name: ${json.data.shop.name}`);
    
    const products = json.data.products.edges;
    if (products.length === 0) {
      console.log("⚠️ No products found in the store yet. (Expected if Phase 3 not started)");
      console.log("Did you create any products in your Shopify Admin?");
    } else {
      console.log(`📦 Found ${products.length} product(s) in this test query.`);
      products.forEach((edge, i) => {
          console.log(`\nProduct ${i+1}: ${edge.node.title} (${edge.node.id})`);
          if (!edge.node.metafields || edge.node.metafields.every(m => m === null)) {
            console.log("   ⚠️ No accessible custom metafields found on this product.");
            console.log("      Make sure you've enabled 'Storefront API access' for your Metafield definitions!");
          } else {
            console.log("   ✅ Found Metafields:");
            edge.node.metafields.forEach(m => {
              if (m) console.log(`      - ${m.key}: ${m.value}`);
            });
          }
      });
    }
  }
} catch (e) {
  console.error("❌ Network error:", e.message);
}
