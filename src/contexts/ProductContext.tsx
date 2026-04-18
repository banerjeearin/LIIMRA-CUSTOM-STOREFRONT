import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "@/services/api/productService";
import type { Product } from "@/data/products";
import type { Collection } from "@/services/api/types";

interface ProductContextType {
  products: Product[];
  collections: Collection[];
  isLoading: boolean;
  error: Error | null;
  getProduct: (id: string) => Product | undefined;
  getProductsByGoal: (goal: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const goalProducts: Record<string, string[]> = {
  all: ["ragi", "jowar", "bajra", "kangni", "kutki", "kodo", "rice-flour", "indrayani-rice"],
  sugar: ["ragi", "jowar", "kangni", "kutki"],
  weight: ["jowar", "kangni", "kutki", "kodo"],
  nutrition: ["ragi", "bajra", "jowar", "kangni"],
  gut: ["kutki", "kodo", "bajra", "indrayani-rice"],
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: productAPI.getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const {
    data: collections = [],
    isLoading: isLoadingCollections,
    error: collectionsError,
  } = useQuery<Collection[], Error>({
    queryKey: ["collections"],
    queryFn: productAPI.getCollections,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const isLoading = isLoadingProducts || isLoadingCollections;
  const error = productsError || collectionsError;

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductsByGoal = (goal: string) => {
    const productIds = goalProducts[goal] || goalProducts.all;
    return products
      .filter((p) => {
        const slug = p.displayName?.toLowerCase().trim().replace(/\s+/g, "-") || p.id;
        return productIds.includes(slug);
      })
      .sort((a, b) => {
        const slugA = a.displayName?.toLowerCase().trim().replace(/\s+/g, "-") || a.id;
        const slugB = b.displayName?.toLowerCase().trim().replace(/\s+/g, "-") || b.id;
        return productIds.indexOf(slugA) - productIds.indexOf(slugB);
      });
  };

  if (error) {
    console.error("Error loading products:", error);
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        collections,
        isLoading,
        error,
        getProduct,
        getProductsByGoal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};
