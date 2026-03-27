import { memo } from "react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

const CartDrawer = memo(() => {
  const {
    cart,
    cartCount,
    subtotal,
    shipping,
    total,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    proceedToCheckout,
  } = useCart();

  const freeShippingThreshold = 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col" style={{ maxWidth: "480px" }}>
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-black" style={{ color: OLIVE }}>
            Your Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "hsl(72 18% 92%)" }}
            >
              <ShoppingBag size={40} style={{ color: OLIVE, opacity: 0.4 }} />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold mb-1" style={{ color: OLIVE }}>
                Your cart is empty
              </p>
              <p className="font-body text-sm text-[hsl(var(--liimra-ink-light))]">
                Add some delicious millets to get started!
              </p>
            </div>
          </div>
        ) : (
          <>
            {remainingForFreeShipping > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-xs font-medium text-[hsl(var(--liimra-ink-mid))]">
                    Add ₹{remainingForFreeShipping} more for FREE shipping 🎉
                  </p>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "hsl(72 18% 92%)" }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%`, background: NEON }}
                  />
                </div>
              </div>
            )}

            {shipping === 0 && subtotal >= freeShippingThreshold && (
              <div
                className="mb-4 px-3 py-2 rounded-lg flex items-center gap-2"
                style={{ background: `${NEON}15` }}
              >
                <span className="text-lg">🎉</span>
                <p className="font-body text-xs font-semibold" style={{ color: OLIVE }}>
                  You've unlocked FREE shipping!
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ background: "hsl(72 18% 96%)" }}
                  >
                    <div
                      className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(160deg, hsl(74 30% 26%), hsl(74 35% 18%))" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-display font-bold text-sm" style={{ color: OLIVE }}>
                            {item.name}
                          </h4>
                          <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))]">{item.size}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-md hover:bg-red-50 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                            style={{ background: "white", border: `1px solid ${OLIVE}` }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} style={{ color: OLIVE }} />
                          </button>
                          <span className="font-body text-sm font-semibold w-8 text-center" style={{ color: OLIVE }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                            style={{ background: OLIVE }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} style={{ color: "white" }} />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.mrp > item.price && (
                            <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))] line-through">
                              ₹{item.mrp * item.quantity}
                            </p>
                          )}
                          <p className="font-display font-bold text-base" style={{ color: OLIVE }}>
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: "hsl(72 18% 88%)" }}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[hsl(var(--liimra-ink-mid))]">Subtotal</span>
                  <span className="font-semibold" style={{ color: OLIVE }}>
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[hsl(var(--liimra-ink-mid))]">Shipping</span>
                  <span className="font-semibold" style={{ color: shipping === 0 ? NEON : OLIVE }}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div
                  className="flex justify-between font-display text-lg font-black pt-2"
                  style={{ borderTop: "1px solid hsl(72 18% 88%)" }}
                >
                  <span style={{ color: OLIVE }}>Total</span>
                  <span style={{ color: OLIVE }}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full font-body text-sm tracking-[0.12em] uppercase px-6 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  background: OLIVE,
                  color: "white",
                  boxShadow: "0 4px 16px rgba(62,76,29,0.25)",
                }}
              >
                Proceed to Checkout
              </button>

              <p className="font-body text-xs text-center text-[hsl(var(--liimra-ink-light))] mt-3">
                Secure checkout powered by Shopify
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
});

CartDrawer.displayName = "CartDrawer";

export default CartDrawer;
