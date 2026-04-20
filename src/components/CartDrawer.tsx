import { memo, useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";

const OLIVE = "#3e4c1d";
const OLIVE2 = "#3B6D11";
const NEON = "#aeb30a";
const SAGE = "#EAF3DE";
const BORDER = "#ddd8cc";
const INK = "#2c2c1a";
const INK_MID = "#555";
const RED = "#c0392b";

const CartDrawer = memo(() => {
  const [showCoupon, setShowCoupon] = useState(false);
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
    addItem,
  } = useCart();

  // Find a product for upsell that is not currently in the cart
  const upsellProduct = useMemo(() => {
    const available = products.find((p) => !cart.some((item) => item.productId === p.id));
    return available || products[0]; // fallback to first product if cart has everything
  }, [cart]);

  const upsellSize = upsellProduct?.sizes[0];

  const handleAddUpsell = () => {
    if (!upsellProduct || !upsellSize) return;
    addItem({
      productId: upsellProduct.id,
      variantId: upsellSize.size,
      name: upsellProduct.name,
      price: upsellSize.price,
      mrp: upsellSize.mrp,
      size: upsellSize.size,
      image: upsellProduct.image,
      quantity: 1,
    });
  };

  const totalDiscount = cart.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0);
  const discountPercentage = subtotal > 0 ? Math.round((totalDiscount / (subtotal + totalDiscount)) * 100) : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col p-0 border-l"
        style={{ maxWidth: "480px", background: "hsl(40 33% 96%)", borderColor: BORDER }}
      >
        <SheetHeader className="px-5 py-4 border-b bg-[hsl(40,33%,96%)]" style={{ borderColor: BORDER }}>
          <div className="flex justify-between items-center w-full">
            <SheetTitle className="font-display text-[22px] tracking-wide" style={{ color: INK }}>
              Your Cart ({cartCount})
            </SheetTitle>
          </div>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 px-6">
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
            <div className="flex-1 overflow-y-auto">
              {/* Free Shipping Banner */}
              <div
                className="mx-4 mt-3 mb-2 rounded-[10px] p-[10px] flex items-center gap-[10px]"
                style={{ background: "linear-gradient(135deg, #3B6D11 0%, #2d5209 100%)" }}
              >
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" className="flex-shrink-0">
                  <rect x="1" y="5" width="13" height="9" rx="2" fill="#9FE1CB" />
                  <path d="M14 8h4l2.5 4V14H14V8z" fill="#5DCAA5" />
                  <circle cx="5.5" cy="14.5" r="1.8" fill="#EAF3DE" />
                  <circle cx="16.5" cy="14.5" r="1.8" fill="#EAF3DE" />
                </svg>
                <div className="font-body text-[11px] font-semibold leading-[1.5] text-[#EAF3DE]">
                  <strong className="text-[#c5e88a] font-extrabold">FREE delivery</strong> on this order<br />
                  No minimum · Always free at Liimra
                </div>
              </div>

              {/* Savings Banner */}
              {totalDiscount > 0 && (
                <div className="sticky top-0 z-10 bg-[hsl(40,33%,96%)] pt-1 pb-2 px-4 shadow-sm border-b" style={{ borderColor: BORDER }}>
                  <div className="bg-[#EAF3DE] border border-[#c5e88a] rounded-[8px] py-1.5 px-3 flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(197,232,138,0.3)]">
                    <span className="text-[14px]">🎉</span>
                    <span className="font-body text-[12px] font-bold text-[#27500A]">
                      You're saving ₹{totalDiscount.toFixed(2)} today!
                    </span>
                  </div>
                </div>
              )}

              {/* Free Gift Progress Bar */}
              <div className="mx-4 mt-2 mb-3 bg-white p-[12px] rounded-[10px]" style={{ border: "1.5px solid #c5e88a" }}>
                <div className="flex justify-between items-end mb-[8px]">
                  <span className="font-display text-[12px] text-[#27500A] leading-tight">
                    {subtotal < 999 
                      ? <>Add <strong>₹{(999 - subtotal).toFixed(2)}</strong> more to unlock a <strong>Free Recipe Book</strong></>
                      : <>🎉 You've unlocked a <strong>Free Recipe Book!</strong></>
                    }
                  </span>
                  {subtotal < 999 && <span className="font-body text-[9px] text-[#555] font-medium ml-2">{Math.floor(Math.min((subtotal / 999) * 100, 100))}%</span>}
                </div>
                <div className="w-full bg-[#f2f9ec] rounded-full h-[6px] overflow-hidden" style={{ border: "1px solid #e2f0d9" }}>
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%`, background: "linear-gradient(90deg, #5DCAA5 0%, #3B6D11 100%)" }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex flex-col">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const description = product?.primaryBenefit || product?.primaryTags?.[0] || "Authentic grain";
                  const sizeObj = product?.sizes.find((s) => {
                    const s1 = s.size.toLowerCase().replace(/[^a-z0-9]/g, '').replace('gm', 'g');
                    const s2 = item.size.toLowerCase().replace(/[^a-z0-9]/g, '').replace('gm', 'g');
                    return s1 === s2 || (s.variantId && item.variantId && s.variantId === item.variantId);
                  });
                  
                  return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3.5 border-b"
                    style={{ borderColor: BORDER }}
                  >
                    <div
                      className="w-[54px] h-[54px] rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: "linear-gradient(160deg, hsl(74 30% 26%), hsl(74 35% 18%))" }}
                    >
                      <div className="w-[38px] h-[38px] rounded-[6px] opacity-70 bg-[#e8e3d0] relative">
                         <img
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-contain p-1 mix-blend-multiply"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-[2px]">
                        <div className="flex flex-col">
                          <h4 className="font-display text-[18px] tracking-wide leading-none" style={{ color: INK }}>
                            {product?.displayName || item.name}
                          </h4>
                          {product?.rating && product?.reviews && (
                            <div className="flex items-center gap-1 mt-1.5 mb-1">
                              <span className="text-[10px] text-[#f59e0b] leading-none">★</span>
                              <span className="font-body text-[10px] font-bold leading-none" style={{ color: INK }}>{product.rating}</span>
                              <span className="font-body text-[10px] text-[#999] leading-none">({product.reviews})</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-md hover:bg-red-50 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-[6px] mb-2 flex-wrap mt-[2px]">
                        <span className="font-body text-[10px] font-bold text-[#3e4c1d] bg-[#f2f9ec] px-2 py-[3px] rounded-[4px] border border-[#c5e88a] leading-none">
                          {item.size}
                        </span>
                        
                        {product?.badge ? (
                          <span className="font-body text-[10px] font-bold text-[#b58c14] bg-[#fdf8e7] px-2 py-[3px] rounded-[4px] border border-[#f5df9a] flex items-center gap-[3px] leading-none">
                            <span className="text-[9px]">⭐</span> {product.badge}
                          </span>
                        ) : product?.primaryTags?.length ? (
                          <span className="font-body text-[10px] font-medium text-[#555] bg-[#f8f9fa] px-2 py-[3px] rounded-[4px] border border-[#e9ecef] leading-none">
                            {product.primaryTags.slice(0, 2).join(' · ')}
                          </span>
                        ) : null}

                        {sizeObj?.stock && sizeObj.stock <= 10 && (
                          <span className="font-body text-[10px] font-bold text-[#c0392b] bg-[#fcebeb] px-2 py-[3px] rounded-[4px] border border-[#fad4d4] leading-none">
                            Only {sizeObj.stock} left
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-white"
                            style={{ border: `1px solid ${BORDER}`, color: INK }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-body text-[12px] font-bold w-[14px] text-center" style={{ color: INK }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors text-white"
                            style={{ background: OLIVE, borderColor: OLIVE }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.mrp > item.price && (
                            <p className="font-body text-[10px] font-medium line-through" style={{ color: RED }}>
                              ₹{item.mrp * item.quantity}
                            </p>
                          )}
                          <p className="font-display text-[14px] font-extrabold" style={{ color: INK }}>
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>

              {/* Upsell */}
              {upsellProduct && upsellSize && (
                <div
                  className="mx-4 my-2 rounded-[10px] p-[12px]"
                  style={{ border: "1.5px solid #c5e88a", background: "linear-gradient(to bottom, #fcfff9, #f2f9ec)" }}
                >
                  <div className="font-display text-[14px] font-bold mb-[8px] text-[#27500A] leading-tight">
                    Complete your millet pantry — {upsellProduct.displayName || upsellProduct.name} ₹{upsellSize.price}
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="w-[54px] h-[54px] rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: upsellProduct.imageBg || "linear-gradient(160deg, hsl(74 30% 26%), hsl(74 35% 18%))" }}
                    >
                      <div className="w-[38px] h-[38px] rounded-[6px] opacity-70 bg-[#e8e3d0] relative">
                         <img
                          src={upsellProduct.image}
                          alt={upsellProduct.name}
                          className="absolute inset-0 w-full h-full object-contain p-1 mix-blend-multiply"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-body text-[11px] font-bold text-[#3e4c1d]">{upsellProduct.primaryTags?.[0] || "Rich in nutrients"}</div>
                      <div className="font-body text-[10px] mt-[2px] text-[#555]">Often bought together</div>
                    </div>
                    <button
                      onClick={handleAddUpsell}
                      className="font-body text-[11px] font-bold text-white rounded-[6px] px-[12px] py-[8px] transition-transform hover:scale-105 shadow-sm"
                      style={{ background: OLIVE }}
                    >
                      + Add to cart
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div className="mx-4 my-2 flex items-center justify-center">
                {!showCoupon ? (
                  <button 
                    onClick={() => setShowCoupon(true)}
                    className="font-body text-[11px] text-[#888] hover:text-[#27500A] transition-colors py-1"
                  >
                    Have a promo code? <span className="underline underline-offset-2">Tap here</span>
                  </button>
                ) : (
                  <div className="flex gap-1.5 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      readOnly
                      className="flex-1 font-body text-[11px] bg-white rounded-[8px] px-2.5 py-2 outline-none"
                      style={{ border: `1px solid ${BORDER}`, color: INK }}
                    />
                    <button
                      className="font-display text-[10px] font-bold bg-white rounded-[8px] px-3 py-2 cursor-pointer transition-colors"
                      style={{ border: `1.5px solid ${OLIVE2}`, color: OLIVE2 }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Strip */}
              <div className="mx-4 my-3 rounded-[8px] p-[10px] flex items-center justify-center gap-2" style={{ background: SAGE, border: "1px solid #c5e88a" }}>
                <span className="text-[14px]">🌿</span>
                <span className="font-body text-[10px] font-bold text-[#27500A]">
                  100% Natural · No Preservatives · Stone-milled
                </span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-2.5 px-4 pb-[6px] border-t bg-[hsl(40,33%,96%)]" style={{ borderColor: BORDER }}>
              <div className="flex justify-between font-body text-[11px] mb-1" style={{ color: INK_MID }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body text-[11px] mb-1 font-bold" style={{ color: OLIVE2 }}>
                <span>Delivery</span>
                <span>FREE ✓</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between font-body text-[10px] font-semibold mb-1" style={{ color: OLIVE2 }}>
                  <span>You save</span>
                  <span>₹{totalDiscount.toFixed(2)} ({discountPercentage}% off)</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-1 mt-1 border-t" style={{ borderColor: BORDER }}>
                <div className="flex flex-col">
                  <span className="font-display text-[20px] leading-none mb-1" style={{ color: INK }}>Total</span>
                  <span className="font-body text-[9px] text-[#888] leading-none">Inclusive of taxes</span>
                </div>
                <span className="font-display text-[20px] leading-none" style={{ color: INK }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* WhatsApp Nudge */}
            <div className="mx-4 my-1.5 rounded-[8px] p-[7px_11px] flex items-center gap-2" style={{ background: "#f0faf0", border: "1px solid #a5d6a7" }}>
              <span className="text-[16px] flex-shrink-0">💬</span>
              <div className="font-body text-[9px] text-[#1b5e20] leading-[1.5] font-medium">
                Order Confirmation and tracking sent on <strong className="font-bold">Whatsapp</strong>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4 bg-[hsl(40,33%,96%)]">
              <button
                onClick={proceedToCheckout}
                className="w-full text-white rounded-[10px] p-[13px] text-center font-display text-[12px] font-extrabold tracking-[0.06em] uppercase transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${OLIVE} 0%, #2d5209 100%)`,
                  boxShadow: `0 4px 16px rgba(62,76,29,0.3)`,
                }}
              >
                {totalDiscount > 0 
                  ? `Claim my ₹${totalDiscount.toFixed(2)} savings →` 
                  : "Complete my healthy order →"}
              </button>
              <div className="text-center font-body text-[9px] font-medium text-[#aaa] mt-2 pb-1">
                🔒 Secure checkout powered by Shopify
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
});

CartDrawer.displayName = "CartDrawer";

export default CartDrawer;
