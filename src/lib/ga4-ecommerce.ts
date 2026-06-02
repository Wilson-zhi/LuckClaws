import { type Product } from "@/data/products";
import { type CartItem, productById } from "@/store/cart-store";
import { roundMoney } from "@/lib/utils";

const currency = "USD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GtagItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity?: number;
  item_list_name?: string;
};

export type EcommerceCartItem = CartItem;

function sendGtagEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

function productToGtagItem(product: Product, quantity?: number, itemListName?: string): GtagItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    ...(quantity !== undefined ? { quantity } : {}),
    ...(itemListName ? { item_list_name: itemListName } : {})
  };
}

function cartItemToGtagItem(item: CartItem): GtagItem {
  const product = productById(item.id);

  return {
    item_id: item.id,
    item_name: item.name,
    item_category: product?.category ?? "Cart",
    price: item.price,
    quantity: item.quantity
  };
}

function cartValue(items: CartItem[]) {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function trackViewItem(product: Product) {
  sendGtagEvent("view_item", {
    currency,
    value: product.price,
    items: [productToGtagItem(product, 1)]
  });
}

export function trackViewItemList(products: Product[], itemListName: string) {
  if (products.length === 0) {
    return;
  }

  sendGtagEvent("view_item_list", {
    item_list_name: itemListName,
    items: products.map((product) => productToGtagItem(product, undefined, itemListName))
  });
}

export function trackSelectItem(product: Product, itemListName?: string) {
  sendGtagEvent("select_item", {
    item_list_name: itemListName,
    items: [productToGtagItem(product, undefined, itemListName)]
  });
}

export function trackAddToCart(product: Product, quantity = 1) {
  sendGtagEvent("add_to_cart", {
    currency,
    value: roundMoney(product.price * quantity),
    items: [productToGtagItem(product, quantity)]
  });
}

export function trackAddBundleToCart(products: Product[]) {
  if (products.length === 0) {
    return;
  }

  sendGtagEvent("add_to_cart", {
    currency,
    value: roundMoney(products.reduce((sum, product) => sum + product.price, 0)),
    items: products.map((product) => productToGtagItem(product, 1))
  });
}

export function trackRemoveFromCart(item: CartItem, quantity = item.quantity) {
  sendGtagEvent("remove_from_cart", {
    currency,
    value: roundMoney(item.price * quantity),
    items: [{ ...cartItemToGtagItem(item), quantity }]
  });
}

export function trackViewCart(items: CartItem[]) {
  sendGtagEvent("view_cart", {
    currency,
    value: cartValue(items),
    items: items.map(cartItemToGtagItem)
  });
}

export function trackBeginCheckout(items: CartItem[]) {
  sendGtagEvent("begin_checkout", {
    currency,
    value: cartValue(items),
    items: items.map(cartItemToGtagItem)
  });
}
