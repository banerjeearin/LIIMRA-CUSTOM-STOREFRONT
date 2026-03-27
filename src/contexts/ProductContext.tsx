import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "@/services/api/productService";
import type { Product } from "@/data/products";

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  getProduct: (id: string) => Product | undefined;
  getProductsByGoal: (goal: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const goalProducts: Record<string, string[]> = {
  all: ["ragi", "jowar", "bajra", "kangni", "kutki", "rice"],
  sugar: ["ragi", "jowar", "kangni"],
  weight: ["jowar", "ragi", "kangni", "kutki"],
  nutrition: ["ragi", "bajra", "jowar"],
  gut: ["kutki", "rice", "bajra"],
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: productAPI.getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductsByGoal = (goal: string) => {
    const productIds = goalProducts[goal] || goalProducts.all;
    return products.filter((p) => productIds.includes(p.id));
  };

  if (error) {
    console.error("Error loading products:", error);
  }

  return (
    <ProductContext.Provider
      value={{
        products,
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
