import { mockDataService } from "./mockData";
import { shopifyService } from "./shopify";
import type { APIService } from "./types";

const isShopifyConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_SHOPIFY_STORE_DOMAIN &&
    import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
};

export const productAPI: APIService = isShopifyConfigured()
  ? shopifyService
  : mockDataService;

export const isUsingMockData = !isShopifyConfigured();
