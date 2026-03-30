import { mockDataService } from "./mockData";
import { shopifyService } from "./shopify";
import type { APIService } from "./types";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const isShopifyConfigured = (): boolean =>
  Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);

// ✅ LIVE MODE — data is served from Shopify Storefront API
export const productAPI: APIService = isShopifyConfigured()
  ? shopifyService
  : mockDataService;

export const isUsingMockData = !isShopifyConfigured();
