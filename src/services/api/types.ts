import { Product } from "@/data/products";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  mrp: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  descriptionHtml: string;
  images: {
    edges: Array<{ node: { url: string; src?: string } }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string };
        compareAtPrice?: { amount: string } | null;
      };
    }>;
  };
  metafields?: Array<{
    key: string;
    value: string;
  } | null>;
  tags: string[];
}

export interface APIService {
  getProducts: () => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product | null>;
  createCheckout: (items: CartItem[]) => Promise<{ checkoutUrl: string }>;
}
