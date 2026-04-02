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

const parseMetafield = (metafields: Array<{ key: string; value: string } | null>, key: string): string => {
  // Shopify returns null entries for metafields that don't exist on the product
  const field = metafields?.filter(Boolean).find((m) => m!.key === key);
  return field?.value || "";
};

const parseMetafieldJSON = (metafields: Array<{ key: string; value: string } | null>, key: string): unknown => {
  const value = parseMetafield(metafields, key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const mapShopifyProductToProduct = (shopifyProduct: ShopifyProduct): Product => {
  // Filter out null entries — Shopify returns null for metafields not set on a product
  const metafields = (shopifyProduct.metafields || []).filter(Boolean) as Array<{ key: string; value: string }>;

  // Unwrap edges/node from Storefront API response
  const variantNodes = shopifyProduct.variants?.edges?.map((e) => e.node) || [];
  const imageNodes = shopifyProduct.images?.edges?.map((e) => e.node) || [];

  const sizes: ProductSize[] = variantNodes.map((variant) => {
    const price = parseFloat(variant.price.amount);
    const mrp = variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : price;
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

  const displayName = parseMetafield(metafields, "display_name") || shopifyProduct.title;

  // Derive a stable slug from display_name (e.g. "RAGI" → "ragi", "RICE FLOUR" → "rice-flour")
  const idFromMetafield = parseMetafield(metafields, "product_id");
  const id = idFromMetafield ||
    (displayName ? displayName.toLowerCase().trim().replace(/\s+/g, "-") : shopifyProduct.id);
  const scientificName = parseMetafield(metafields, "scientific_name") || "";
  const commonName = parseMetafield(metafields, "common_name") || "";
  const emoji = parseMetafield(metafields, "emoji") || "🌾";
  const status = parseMetafield(metafields, "status") || "";
  const badge = parseMetafield(metafields, "badge") || "";
  const tagline = parseMetafield(metafields, "tagline") || "";
  const primaryBenefit = parseMetafield(metafields, "primary_benefit") || "";
  const benefitDescription = parseMetafield(metafields, "benefit_description") || "";
  const detailedDescription = parseMetafield(metafields, "detailed_description") || shopifyProduct.descriptionHtml;
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
    image: imageNodes[0]?.url || imageNodes[0]?.src || "",
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
              descriptionHtml
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
    const lines = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    const mutation = `
      mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await shopifyFetch(mutation, { lines });

    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(
        `Checkout error: ${data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(", ")}`
      );
    }

    const rawCheckoutUrl = data.cartCreate.cart.checkoutUrl;
    const checkoutUrl = new URL(rawCheckoutUrl);
    checkoutUrl.hostname = SHOPIFY_DOMAIN;

    return {
      checkoutUrl: checkoutUrl.toString(),
    };
  },
};
