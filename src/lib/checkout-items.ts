import { getProduct } from "@/data/products";
import { DEFAULT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { roundMoney } from "@/lib/utils";

export type CheckoutItemInput = {
  id: string;
  quantity: number;
  color?: string;
  size?: string;
};

export type ValidatedCheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  category: string;
  shippingRate: number;
  color?: string;
  size?: string;
};

export type CheckoutTotals = {
  subtotal: number;
  shipping: number;
  total: number;
  hasFreeShipping: boolean;
};

export type CheckoutValidationResult = {
  items: ValidatedCheckoutItem[];
  totals: CheckoutTotals;
};

function isCheckoutItemInput(value: unknown): value is CheckoutItemInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CheckoutItemInput>;

  const quantity = item.quantity;

  return typeof item.id === "string" && Number.isInteger(quantity) && quantity !== undefined && quantity > 0 && quantity <= 99;
}

export function calculateCheckoutTotals(items: ValidatedCheckoutItem[]): CheckoutTotals {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping =
    items.length === 0 || hasFreeShipping
      ? 0
      : roundMoney(items.reduce((highestRate, item) => Math.max(highestRate, item.shippingRate), DEFAULT_SHIPPING_RATE));

  return {
    subtotal,
    shipping,
    total: roundMoney(subtotal + shipping),
    hasFreeShipping
  };
}

export function validateCheckoutItems(value: unknown): CheckoutValidationResult {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Checkout must include at least one item.");
  }

  const items = value.map((item) => {
    if (!isCheckoutItemInput(item)) {
      throw new Error("Checkout item quantity or product ID is invalid.");
    }

    const product = getProduct(item.id);

    if (!product) {
      throw new Error(`Unknown product ID: ${item.id}`);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      alt: product.alt,
      category: product.category,
      shippingRate: product.shippingRate ?? DEFAULT_SHIPPING_RATE,
      color: item.color ?? product.selectedColor,
      size: item.size ?? product.size
    };
  });

  const totals = calculateCheckoutTotals(items);

  if (totals.total <= 0) {
    throw new Error("Checkout total must be greater than zero.");
  }

  return { items, totals };
}

export function toCheckoutItemInputs(items: CheckoutItemInput[]) {
  return items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    ...(item.color ? { color: item.color } : {}),
    ...(item.size ? { size: item.size } : {})
  }));
}
