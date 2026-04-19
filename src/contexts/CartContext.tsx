import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import type { CartItem } from "@/services/api/types";
import { productAPI } from "@/services/api/productService";
import { useAnalytics } from "@/contexts/AnalyticsContext";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  proceedToCheckout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 0; // Unconditional free shipping
const STANDARD_SHIPPING_COST = 0;

const CART_STORAGE_KEY = "liimra-cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);
  const { trackEcommerce } = useAnalytics();

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;

  const addItem = (newItem: Omit<CartItem, "id">) => {
    trackEcommerce("AddToCart", { 
      content_ids: [newItem.productId],
      content_type: 'product',
      value: newItem.price * newItem.quantity,
      currency: "INR"
    });

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + newItem.quantity,
        };
        return updatedCart;
      }

      const id = `${newItem.productId}-${newItem.variantId}-${Date.now()}`;
      return [...prevCart, { ...newItem, id }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.id === itemId);
      if (itemToRemove) {
        trackEcommerce("RemoveFromCart", {
          content_ids: [itemToRemove.productId],
          content_type: 'product',
          value: itemToRemove.price * itemToRemove.quantity,
          currency: "INR"
        });
      }
      return prevCart.filter((item) => item.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const proceedToCheckout = async () => {
    trackEcommerce("InitiateCheckout", {
      content_ids: cart.map(i => i.productId),
      value: total,
      currency: "INR"
    });

    try {
      const { checkoutUrl } = await productAPI.createCheckout(cart);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to create checkout. Please try again or contact support.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        shipping,
        total,
        isOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        proceedToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
