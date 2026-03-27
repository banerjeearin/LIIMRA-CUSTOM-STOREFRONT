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

  createCheckout: async (items: CartItem[]): Promise<{ checkoutUrl: string }> => {
    await delay(500);
    console.log("Mock checkout created with items:", items);
    return {
      checkoutUrl: "/checkout-success?mock=true",
    };
  },
};
