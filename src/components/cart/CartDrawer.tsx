"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { products as staticProducts } from "@/data/products";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, updateQuantity, removeFromCart } =
    useAppStore();

  const detailedItems = cartItems
    .map((item) => {
      const product = staticProducts.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is { productId: string; quantity: number; product: typeof staticProducts[0] } => item !== null);

  const subtotal = detailedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0d0c0a] border-l border-[#c9a96e]/30 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2e2617]/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-[#14120e]">
                  <ShoppingCart size={18} className="text-[#c9a96e]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#e6ce96]">
                    Your Collection Cart
                  </h2>
                  <p className="text-[10px] tracking-wider uppercase text-[#a39474]/70">
                    {cartItems.length} {cartItems.length === 1 ? "Timepiece" : "Timepieces"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-[#d6c5a3]/70 hover:bg-[#c9a96e]/10 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {detailedItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a96e]/20 bg-[#12100d]">
                    <ShoppingCart size={28} className="text-[#c9a96e]/40" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#a39474]">
                    Your collection cart is empty
                  </p>
                  <p className="text-xs text-cream/50 max-w-xs">
                    Explore our master watch collections to curate your personal luxury selection.
                  </p>
                  <Link href="/collections" onClick={() => setCartOpen(false)}>
                    <Button variant="outline" size="sm" className="mt-2">
                      Explore Collections
                    </Button>
                  </Link>
                </div>
              ) : (
                detailedItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-lg border border-[#2e2617]/80 bg-[#12100e] p-3.5 transition-colors hover:border-[#c9a96e]/40"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-[#0a0a0a] border border-[#2e2617]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e]">
                            {product.collection}
                          </p>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-cream/40 hover:text-red-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 className="text-xs font-medium text-cream line-clamp-1">
                          {product.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded border border-[#2e2617] bg-[#0a0a0a] text-xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:text-[#c9a96e] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 font-mono text-[11px] text-cream">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:text-[#c9a96e] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <p className="text-xs font-light text-[#c9a96e]">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Subtotal & Checkout */}
            {detailedItems.length > 0 && (
              <div className="border-t border-[#2e2617]/80 bg-[#0c0b08] px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#a39474]">
                  <span>Subtotal (Incl. Taxes)</span>
                  <span className="text-base font-light text-[#c9a96e]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block"
                >
                  <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>

                <p className="text-center text-[9px] tracking-wider uppercase text-cream/40">
                  Complimentary Insured Shipping & Atelier Warranty Included
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
