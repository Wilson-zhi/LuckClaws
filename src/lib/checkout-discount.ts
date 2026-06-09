import { type AppliedDiscount } from "@/lib/discounts";
import { type CartItem } from "@/store/cart-store";

const checkoutDiscountStorageKey = "luck-claws-checkout-discount";

export function cartItemsToCheckoutPayload(items: CartItem[]) {
  return items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    ...(item.color ? { color: item.color } : {}),
    ...(item.size ? { size: item.size } : {})
  }));
}

export function readStoredDiscountCode() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(checkoutDiscountStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function saveStoredDiscountCode(code: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(checkoutDiscountStorageKey, code);
  } catch {
    // Ignore storage failures; server validation still controls checkout totals.
  }
}

export function clearStoredDiscountCode() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(checkoutDiscountStorageKey);
  } catch {
    // Ignore storage failures.
  }
}

export type DiscountValidationResponse = {
  discount?: AppliedDiscount | null;
  error?: string;
};
