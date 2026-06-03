import { type Product } from "@/data/products";
import { type CartItem } from "@/store/cart-store";

export const buyNowCheckoutKey = "luckclaws:buyNowCheckout";

type BuyNowCheckoutPayload = {
  item: CartItem;
  createdAt: number;
};

export function createBuyNowCheckoutItem(product: Product, quantity: number): CartItem {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    regularPrice: product.regularPrice,
    image: product.image,
    alt: product.alt,
    color: product.selectedColor,
    size: product.size,
    quantity
  };
}

export function saveBuyNowCheckoutItem(product: Product, quantity: number) {
  const payload: BuyNowCheckoutPayload = {
    item: createBuyNowCheckoutItem(product, quantity),
    createdAt: Date.now()
  };

  window.sessionStorage.setItem(buyNowCheckoutKey, JSON.stringify(payload));
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as CartItem;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.alt === "string" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

export function readBuyNowCheckoutItem() {
  const storedValue = window.sessionStorage.getItem(buyNowCheckoutKey);

  if (!storedValue) {
    return null;
  }

  try {
    const payload = JSON.parse(storedValue) as Partial<BuyNowCheckoutPayload>;

    return isValidCartItem(payload.item) ? payload.item : null;
  } catch {
    return null;
  }
}
