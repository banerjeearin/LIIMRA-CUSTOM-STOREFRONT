import type { Product, ProductSize } from "@/data/products";
import type { CartItem, APIService, ShopifyProduct } from "./types";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const shopifyFetch = async (query: string, variables?: Record<string, unknown>) => {
  const response = await fetch(STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
};

const parseMetafield = (metafields: Array<{ key: string; value: string }>, key: string): string => {
  const field = metafields?.find((m) => m.key === key);
  return field?.value || "";
};

const parseMetafieldJSON = (metafields: Array<{ key: string; value: string }>, key: string): unknown => {
  const value = parseMetafield(metafields, key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const mapShopifyProductToProduct = (shopifyProduct: ShopifyProduct): Product => {
  const metafields = shopifyProduct.metafields || [];
  
  const sizes: ProductSize[] = shopifyProduct.variants.map((variant) => {
    const price = parseFloat(variant.price);
    const mrp = variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return {
      size: variant.title,
      price,
      mrp,
      discount,
      variantId: variant.id,
    };
  });

  const nutrients = (parseMetafieldJSON(metafields, "nutrients") as Array<{ label: string; value: string }>) || [];
  const nutritionalFacts = (parseMetafieldJSON(metafields, "nutritional_facts") as Array<{ label: string; value: string }>) || [];
  const healthBenefits = (parseMetafieldJSON(metafields, "health_benefits") as string[]) || [];
  const recipes = (parseMetafieldJSON(metafields, "recipes") as string[]) || [];
  const uses = (parseMetafieldJSON(metafields, "uses") as string[]) || [];
  const primaryTags = (parseMetafieldJSON(metafields, "primary_tags") as string[]) || [];
  const secondaryTags = (parseMetafieldJSON(metafields, "secondary_tags") as string[]) || [];
  const colorTheme = (parseMetafieldJSON(metafields, "color_theme") as Product["colorTheme"]) || {
    bg: "0 0% 96%",
    bgDark: "0 0% 90%",
    accent: "0 0% 30%",
    accentLight: "0 0% 60%",
    text: "0 0% 15%",
    textLight: "0 0% 40%",
  };

  const id = parseMetafield(metafields, "product_id") || shopifyProduct.id;
  const displayName = parseMetafield(metafields, "display_name") || shopifyProduct.title;
  const scientificName = parseMetafield(metafields, "scientific_name") || "";
  const commonName = parseMetafield(metafields, "common_name") || "";
  const emoji = parseMetafield(metafields, "emoji") || "🌾";
  const status = parseMetafield(metafields, "status") || "";
  const badge = parseMetafield(metafields, "badge") || "";
  const tagline = parseMetafield(metafields, "tagline") || "";
  const primaryBenefit = parseMetafield(metafields, "primary_benefit") || "";
  const benefitDescription = parseMetafield(metafields, "benefit_description") || "";
  const detailedDescription = parseMetafield(metafields, "detailed_description") || shopifyProduct.description;
  const scientificHighlight = parseMetafield(metafields, "scientific_highlight") || "";
  const imageBg = parseMetafield(metafields, "image_bg") || "linear-gradient(160deg, hsl(0 0% 30%), hsl(0 0% 20%))";

  const rating = parseFloat(parseMetafield(metafields, "rating")) || 4.5;
  const reviews = parseInt(parseMetafield(metafields, "reviews")) || 0;

  return {
    id,
    name: shopifyProduct.title,
    displayName,
    scientificName,
    commonName,
    emoji,
    status,
    badge,
    rating,
    reviews,
    primaryTags,
    secondaryTags,
    sizes,
    nutrients,
    nutritionalFacts,
    primaryBenefit,
    benefitDescription,
    detailedDescription,
    scientificHighlight,
    healthBenefits,
    recipes,
    uses,
    colorTheme,
    image: shopifyProduct.images[0]?.src || "",
    imageBg,
    tagline,
  };
};

export const shopifyService: APIService = {
  getProducts: async (): Promise<Product[]> => {
    const query = `
      query GetProducts {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              images(first: 5) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                  }
                }
              }
              metafields(identifiers: [
                {namespace: "custom", key: "product_id"},
                {namespace: "custom", key: "display_name"},
                {namespace: "custom", key: "scientific_name"},
                {namespace: "custom", key: "common_name"},
                {namespace: "custom", key: "emoji"},
                {namespace: "custom", key: "status"},
                {namespace: "custom", key: "badge"},
                {namespace: "custom", key: "tagline"},
                {namespace: "custom", key: "rating"},
                {namespace: "custom", key: "reviews"},
                {namespace: "custom", key: "primary_tags"},
                {namespace: "custom", key: "secondary_tags"},
                {namespace: "custom", key: "nutrients"},
                {namespace: "custom", key: "nutritional_facts"},
                {namespace: "custom", key: "primary_benefit"},
                {namespace: "custom", key: "benefit_description"},
                {namespace: "custom", key: "detailed_description"},
                {namespace: "custom", key: "scientific_highlight"},
                {namespace: "custom", key: "health_benefits"},
                {namespace: "custom", key: "recipes"},
                {namespace: "custom", key: "uses"},
                {namespace: "custom", key: "color_theme"},
                {namespace: "custom", key: "image_bg"}
              ]) {
                key
                value
              }
              tags
            }
          }
        }
      }
    `;

    const data = await shopifyFetch(query);
    const shopifyProducts = data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node);
    return shopifyProducts.map(mapShopifyProductToProduct);
  },

  getProduct: async (id: string): Promise<Product | null> => {
    const products = await shopifyService.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  createCheckout: async (items: CartItem[]): Promise<{ checkoutUrl: string }> => {
    const lineItems = items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    const mutation = `
      mutation CreateCheckout($lineItems: [CheckoutLineItemInput!]!) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    const data = await shopifyFetch(mutation, { lineItems });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(
        `Checkout error: ${data.checkoutCreate.checkoutUserErrors.map((e: { message: string }) => e.message).join(", ")}`
      );
    }

    return {
      checkoutUrl: data.checkoutCreate.checkout.webUrl,
    };
  },
};
