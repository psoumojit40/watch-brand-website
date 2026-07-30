"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { products as staticProducts } from "@/data/products";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useAppStore();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card / Bank Wire");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [error, setError] = useState("");

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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push("/auth/login?callbackUrl=/cart");
      return;
    }

    if (detailedItems.length === 0) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingAddress || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to place order.");
      } else {
        setOrderSuccess(data.order);
        clearCart();
      }
    } catch (err) {
      setError("An error occurred during order processing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 flex items-center justify-center section-glow">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-2xl border border-[#c9a96e]/40 bg-[#0d0c0a] p-8 text-center space-y-6 shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>

          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a96e]">
              Order Confirmed
            </span>
            <h1 className="text-2xl font-light text-cream mt-1">Acquisition Reserved</h1>
            <p className="text-xs text-cream/60 mt-2">
              Thank you, {session?.user?.name || "Collector"}. Your order reference is{" "}
              <span className="font-mono text-[#f3d687]">#{orderSuccess.id.slice(-8).toUpperCase()}</span>.
            </p>
          </div>

          <div className="border-y border-[#2e2617] py-4 text-xs space-y-2 text-cream/70">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold text-[#c9a96e]">₹{orderSuccess.totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-400 font-medium">CONFIRMED</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/profile?tab=orders">
              <Button variant="primary" className="w-full">
                View My Orders in Profile
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="outline" className="w-full">
                Continue Browsing Timepieces
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c9a96e]">
            Official Boutique Checkout
          </p>
          <h1 className="text-3xl sm:text-4xl font-light text-cream">Your Collection Selection</h1>
        </div>

        {detailedItems.length === 0 ? (
          <div className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-16 text-center space-y-4 max-w-md mx-auto">
            <ShoppingCart size={40} className="mx-auto text-[#c9a96e]/40" />
            <h2 className="text-lg font-light text-cream">Your Cart is Empty</h2>
            <p className="text-xs text-cream/50">
              Browse our master watch collections to discover exceptional Swiss timepieces.
            </p>
            <Link href="/collections">
              <Button variant="primary" size="md" className="mt-2">
                Explore Collections
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* Left: Cart Items Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-6 space-y-4">
                <h3 className="text-sm font-medium tracking-widest uppercase text-[#e6ce96] border-b border-[#2e2617] pb-3">
                  Selected Timepieces ({detailedItems.length})
                </h3>

                <div className="divide-y divide-[#2e2617]">
                  {detailedItems.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex gap-4 items-center">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0a] border border-[#2e2617]">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e]">
                          {product.collection}
                        </span>
                        <h4 className="text-sm font-medium text-cream">{product.name}</h4>
                        <p className="text-xs text-cream/50">Ref. {product.id}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded border border-[#2e2617] bg-[#0a0a0a] text-xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 hover:text-[#c9a96e] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 font-mono text-xs text-cream">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1.5 hover:text-[#c9a96e] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-light text-[#c9a96e] min-w-[100px] text-right">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </span>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-cream/40 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#2e2617] bg-[#0d0c0a] p-4 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-[#c9a96e] shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-cream">5-Year International Warranty</h5>
                    <p className="text-[10px] text-cream/40">Full manufacture coverage</p>
                  </div>
                </div>
                <div className="rounded-xl border border-[#2e2617] bg-[#0d0c0a] p-4 flex items-center gap-3">
                  <Truck size={24} className="text-[#c9a96e] shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-cream">Insured Armored Courier</h5>
                    <p className="text-[10px] text-cream/40">Complimentary global delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Checkout Summary Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCheckout}
                className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-6 space-y-6 shadow-2xl"
              >
                <h3 className="text-sm font-medium tracking-widest uppercase text-[#e6ce96] border-b border-[#2e2617] pb-3">
                  Order Summary
                </h3>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>Insured Delivery</span>
                    <span className="text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>Duties & Taxes</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-[#2e2617] pt-3 flex justify-between text-sm font-medium text-cream">
                    <span>Total Amount</span>
                    <span className="text-base text-[#c9a96e]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 border-t border-[#2e2617] pt-4">
                  <div>
                    <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                      Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter full shipping address or boutique pickup location"
                      className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2 px-3 text-xs text-cream focus:border-[#c9a96e] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                      Payment Preference
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 px-3 text-xs text-cream focus:border-[#c9a96e] focus:outline-none"
                    >
                      <option value="UPI Payment (Google Pay / PhonePe / Paytm)">UPI Payment (Google Pay / PhonePe / Paytm)</option>
                      <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                      <option value="Credit Card / Wire Transfer">Credit Card / Wire Transfer</option>
                      <option value="Boutique Concierge Payment">Boutique Concierge Payment</option>
                      <option value="Private Banker Escrow">Private Banker Escrow</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 py-3"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Processing Reservation..." : "Confirm & Reserve Timepieces"}</span>
                  <ArrowRight size={16} />
                </Button>

                {!session && (
                  <p className="text-center text-[10px] text-gold/80 italic">
                    * You will be prompted to sign in before finalizing your reservation.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
