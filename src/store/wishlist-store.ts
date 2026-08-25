"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  accountSyncReady: boolean;
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  toggleProduct: (productId: string) => void;
  setProductIds: (productIds: string[]) => void;
  setAccountSyncReady: (ready: boolean) => void;
  clear: () => void;
};

function uniqueProductIds(productIds: string[]) {
  return Array.from(new Set(productIds.filter(Boolean)));
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      accountSyncReady: false,
      addProduct: (productId) =>
        set((state) => ({ productIds: uniqueProductIds([...state.productIds, productId]) })),
      removeProduct: (productId) =>
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),
      toggleProduct: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId]
        })),
      setProductIds: (productIds) => set({ productIds: uniqueProductIds(productIds) }),
      setAccountSyncReady: (ready) => set({ accountSyncReady: ready }),
      clear: () => set({ productIds: [] })
    }),
    {
      name: "luck-claws-wishlist",
      partialize: (state) => ({ productIds: state.productIds })
    }
  )
);
