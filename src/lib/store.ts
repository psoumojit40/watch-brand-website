"use client";

import { create } from "zustand";

interface AppState {
  isMobileMenuOpen: boolean;
  activeProductId: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveProduct: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  activeProductId: null,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setActiveProduct: (id) => set({ activeProductId: id }),
}));
