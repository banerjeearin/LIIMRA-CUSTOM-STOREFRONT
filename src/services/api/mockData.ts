import { products } from "@/data/products";
import type { Product } from "@/data/products";
import type { CartItem, APIService } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDataService: APIService = {
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return products;
  },

  getProduct: async (id: string): Promise<Product | null> => {
    await delay(200);
    return products.find((p) => p.id === id) || null;
  },

  getCollections: async () => {
    await delay(300);
    return [];
  },

  createCheckout: async (items: CartItem[]): Promise<{ checkoutUrl: string }> => {
    await delay(300);
    return { checkoutUrl: "https://mock-checkout.com/?cart=" + items.length };
  },

  getPolicy: async (type: "refundPolicy" | "privacyPolicy" | "termsOfService" | "shippingPolicy") => {
    await delay(300);
    return {
      title: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      body: `<p>This is a mock response for the <strong>${type}</strong>. When a live Shopify connection is established, the authentic legal document provided in the Storefront settings will be rendered here.</p>`
    };
  }
};
