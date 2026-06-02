"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/data/products";
import { roundMoney } from "@/lib/utils";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  image: string;
  alt: string;
  color?: string;
  size?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, options?: { quantity?: number; color?: string; size?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, options) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const quantity = options?.quantity ?? 1;

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                regularPrice: product.regularPrice,
                image: product.image,
                alt: product.alt,
                color: options?.color ?? product.selectedColor,
                size: options?.size ?? product.size,
                quantity
              }
            ]
          };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: "luck-claws-cart",
      partialize: (state) => ({ items: state.items })
    }
  )
);

export const getCartTotals = (items: CartItem[]) => {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, roundMoney(freeShippingThreshold - subtotal));
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return {
    subtotal,
    total: subtotal,
    count,
    freeShippingThreshold,
    remainingForFreeShipping,
    progress
  };
};

export const productById = (id: string) => products.find((product) => product.id === id);
