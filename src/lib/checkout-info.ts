export const checkoutInfoKey = "luckclaws:checkoutInfo";

export type CheckoutInfo = {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
};

export function saveCheckoutInfo(info: CheckoutInfo) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(checkoutInfoKey, JSON.stringify(info));
}

export function readCheckoutInfo(): CheckoutInfo | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(checkoutInfoKey);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as CheckoutInfo;

    return parsedValue && typeof parsedValue === "object" ? parsedValue : null;
  } catch {
    return null;
  }
}
