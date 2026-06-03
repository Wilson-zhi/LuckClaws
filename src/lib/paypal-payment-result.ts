export const paypalPaymentResultKey = "luckclaws:paypalPaymentResult";

type PaymentResultItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  quantity: number;
  regularPrice?: number;
  color?: string;
  size?: string;
};

export type PayPalPaymentResult = {
  orderId: string;
  captureId?: string;
  status: "COMPLETED";
  amount?: {
    currency_code: "USD";
    value: string;
  };
  items: PaymentResultItem[];
  createdAt: number;
};

export function savePayPalPaymentResult(result: PayPalPaymentResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(paypalPaymentResultKey, JSON.stringify(result));
}

export function readPayPalPaymentResult() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(paypalPaymentResultKey);

  if (!storedValue) {
    return null;
  }

  try {
    const result = JSON.parse(storedValue) as PayPalPaymentResult;

    return result?.status === "COMPLETED" && typeof result.orderId === "string" ? result : null;
  } catch {
    return null;
  }
}
