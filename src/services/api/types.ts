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
  description: string;
  images: Array<{ src: string }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    compareAtPrice?: string;
  }>;
  metafields?: Array<{
    key: string;
    value: string;
  }>;
  tags: string[];
}

export interface APIService {
  getProducts: () => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product | null>;
  createCheckout: (items: CartItem[]) => Promise<{ checkoutUrl: string }>;
}
