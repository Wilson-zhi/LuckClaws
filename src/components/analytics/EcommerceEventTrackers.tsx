"use client";

import { useEffect } from "react";
import { type Product } from "@/data/products";
import {
  trackBeginCheckout,
  trackViewCart,
  trackViewItem,
  trackViewItemList,
  type EcommerceCartItem
} from "@/lib/ga4-ecommerce";

export function ViewItemTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewItem(product);
  }, [product]);

  return null;
}

export function ViewItemListTracker({
  products,
  itemListName
}: {
  products: Product[];
  itemListName: string;
}) {
  useEffect(() => {
    trackViewItemList(products, itemListName);
  }, [products, itemListName]);

  return null;
}

export function ViewCartTracker({ items }: { items: EcommerceCartItem[] }) {
  useEffect(() => {
    trackViewCart(items);
  }, [items]);

  return null;
}

export function BeginCheckoutTracker({ items }: { items: EcommerceCartItem[] }) {
  useEffect(() => {
    trackBeginCheckout(items);
  }, [items]);

  return null;
}
