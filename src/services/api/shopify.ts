import type { Product, ProductSize } from "@/data/products";
import type { CartItem, APIService, ShopifyProduct, ShopifyCollection, Collection } from "./types";

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
  const imageBg = parseMetafield(metafields, "image_bg") || "linear-gradient(160deg, hsl(0 0% 30%), hsl(0 0% 20%))";

  const rating = parseFloat(parseMetafield(metafields, "rating")) || 4.5;
  const reviews = parseInt(parseMetafield(metafields, "reviews")) || 0;

  // Bundle Fields
  const isBundle = shopifyProduct.tags.includes("is_bundle") || shopifyProduct.tags.includes("bundle") || (parseMetafield(metafields, "ribbon") !== "");
  const ribbon = parseMetafield(metafields, "ribbon");
  const subtitle = parseMetafield(metafields, "subtitle");
  const savePct = Number(parseMetafield(metafields, "save_pct")) || 15;
  const bundleTag = parseMetafield(metafields, "tag");

  let bundleItems: any = [];
  const bundleEdges = (shopifyProduct as any).bundleMetafield?.references?.edges;
  if (bundleEdges && bundleEdges.length > 0) {
    bundleItems = bundleEdges.map((edge: any) => {
      const p = edge.node;
      const v = p.variants.edges[0]?.node;
      return {
        id: p.id,
        name: p.title,
        image: p.images.edges[0]?.node?.src || "",
        mrp: v?.compareAtPrice ? Number(v.compareAtPrice.amount) : Number(v?.price.amount) || 0,
        price: Number(v?.price.amount) || 0,
        weight: v?.title !== "Default Title" ? (v?.title + " · " + p.title) : "250g",
        variantId: v?.id || ""
      };
    });
  }

  return {
    id,
    name: displayName || shopifyProduct.title,
    displayName: displayName || shopifyProduct.title,
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
    primaryBenefit,
    benefitDescription,
    healthBenefits,
    recipes,
    colorTheme,
    image: imageNodes[0]?.url || imageNodes[0]?.src || "",
    imageBg,
    tagline,
    detailedDescription: detailedDescription,
    descriptionHtml: shopifyProduct.descriptionHtml,
    scientificHighlight: parseMetafield(metafields, "scientific_highlight"),
    nutritionalFacts: parseMetafieldJSON(metafields, "nutritional_facts") as any || [],
    uses: parseMetafieldJSON(metafields, "uses") as any || [],
    isBundle,
    ribbon,
    subtitle,
    savePct,
    bundleTag,
    bundleItems
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
                {namespace: "custom", key: "image_bg"},
                {namespace: "custom", key: "ribbon"},
                {namespace: "custom", key: "subtitle"},
                {namespace: "custom", key: "save_pct"},
                {namespace: "custom", key: "tag"}
              ]) {
                key
                value
              }
              bundleMetafield: metafield(namespace: "custom", key: "bundle_items") {
                references(first: 10) {
                  edges {
                    node {
                      ... on Product {
                        id
                        title
                        images(first: 1) {
                          edges {
                            node {
                              src
                            }
                          }
                        }
                        variants(first: 1) {
                          edges {
                            node {
                              id
                              title
                              price { amount }
                              compareAtPrice { amount }
                            }
                          }
                        }
                      }
                    }
                  }
                }
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

  getCollections: async (): Promise<Collection[]> => {
    const products = await shopifyService.getProducts();

    const query = `
      query GetCollections {
        collections(first: 10) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              products(first: 20) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyFetch(query);
    const shopifyCollections = data.collections.edges.map((edge: { node: ShopifyCollection }) => edge.node);

    return shopifyCollections.map((sc: any) => {
      const collectionProductIds = sc.products.edges.map((e: any) => e.node.id);
      
      // Match Shopify IDs or standard IDs
      const collectionProducts = products.filter(p => 
        collectionProductIds.includes(p.id) || 
        collectionProductIds.some((cid: string) => cid.includes(p.id)) ||
        collectionProductIds.some((cid: string) => p.id.includes(cid.split('/').pop() || ''))
      );

      // Extract raw text for subtitle fallback
      const rawText = sc.descriptionHtml?.replace(/<[^>]*>?/gm, '').trim() || "";

      return {
        id: sc.handle,
        title: sc.title,
        handle: sc.handle,
        descriptionHtml: sc.descriptionHtml,
        products: collectionProducts,
        ribbon: sc.title.includes("Complete") ? "✦ Best Value" : "✦ Most Popular",
        subtitle: rawText.substring(0, 120),
        savePct: 22, // Default fallback
        tag: "Healthy Picks",
      };
    });
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
    checkoutUrl.hostname = "checkout.liimra.in";

    return {
      checkoutUrl: checkoutUrl.toString(),
    };
  },
};
