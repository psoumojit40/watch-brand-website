"use client";

import { create } from "zustand";

export interface CartItemState {
  productId: string;
  quantity: number;
}

interface AppState {
  isMobileMenuOpen: boolean;
  activeProductId: string | null;
  isCartOpen: boolean;
  cartItems: CartItemState[];
  toastMessage: string | null;
  
  setMobileMenuOpen: (open: boolean) => void;
  setActiveProduct: (id: string | null) => void;
  setCartOpen: (open: boolean) => void;
  setCartItems: (items: CartItemState[]) => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  activeProductId: null,
  isCartOpen: false,
  cartItems: [],
  toastMessage: null,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setActiveProduct: (id) => set({ activeProductId: id }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setCartItems: (items) => set({ cartItems: items }),

  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const existing = state.cartItems.find((item) => item.productId === productId);
      let updated: CartItemState[];
      if (existing) {
        updated = state.cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...state.cartItems, { productId, quantity }];
      }
      return { cartItems: updated, isCartOpen: true, toastMessage: "Added to your luxury collection cart" };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cartItems:
        quantity <= 0
          ? state.cartItems.filter((item) => item.productId !== productId)
          : state.cartItems.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.productId !== productId),
    })),

  clearCart: () => set({ cartItems: [] }),

  showToast: (msg) => set({ toastMessage: msg }),
  hideToast: () => set({ toastMessage: null }),
}));

