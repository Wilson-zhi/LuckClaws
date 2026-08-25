import { brandName } from "@/data/products";
import { type ValidatedCheckoutItem, type CheckoutTotals } from "@/lib/checkout-items";

const sandboxApiBase = "https://api-m.sandbox.paypal.com";
const liveApiBase = "https://api-m.paypal.com";

type PayPalAmount = {
  currency_code: "USD";
  value: string;
};

type PayPalPurchaseUnit = {
  reference_id?: string;
  amount?: PayPalAmount;
  payments?: {
    captures?: Array<{
      id?: string;
      status?: string;
      amount?: PayPalAmount;
    }>;
  };
};

type PayPalCreateOrderResponse = {
  id?: string;
  status?: string;
};

export type PayPalCaptureResponse = {
  id?: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
};

function money(value: number) {
  return value.toFixed(2);
}

function amountBreakdown(totals: CheckoutTotals) {
  return {
    item_total: {
      currency_code: "USD",
      value: money(totals.subtotal)
    },
    shipping: {
      currency_code: "USD",
      value: money(totals.shipping)
    },
    ...(totals.discountAmount > 0
      ? {
          discount: {
            currency_code: "USD",
            value: money(totals.discountAmount)
          }
        }
      : {})
  };
}

function getPayPalApiBase() {
  const environment = process.env.PAYPAL_ENV ?? "sandbox";

  if (environment !== "sandbox") {
    throw new Error("Only PayPal Sandbox mode is enabled for this site.");
  }

  return process.env.PAYPAL_API_BASE ?? (environment === "sandbox" ? sandboxApiBase : liveApiBase);
}

function getPayPalCredentials() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal Sandbox environment variables are not configured.");
  }

  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal Sandbox.");
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new Error("PayPal Sandbox did not return an access token.");
  }

  return payload.access_token;
}

export async function createPayPalOrder(items: ValidatedCheckoutItem[], totals: CheckoutTotals) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "luck-claws-checkout",
          description: `${brandName} sandbox checkout`,
          amount: {
            currency_code: "USD",
            value: money(totals.total),
            breakdown: amountBreakdown(totals)
          },
          items: items.map((item) => ({
            name: item.name.slice(0, 120),
            sku: item.id,
            quantity: String(item.quantity),
            category: "PHYSICAL_GOODS",
            unit_amount: {
              currency_code: "USD",
              value: money(item.price)
            }
          }))
        }
      ],
      application_context: {
        brand_name: brandName,
        user_action: "PAY_NOW",
        shipping_preference: "GET_FROM_FILE"
      }
    })
  });

  const payload = (await response.json()) as PayPalCreateOrderResponse;

  if (!response.ok || !payload.id) {
    throw new Error("Unable to create PayPal Sandbox order.");
  }

  return payload.id;
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const payload = (await response.json()) as PayPalCaptureResponse;

  if (!response.ok) {
    const existingOrder = await getPayPalOrder(orderId);

    if (existingOrder.status === "COMPLETED") {
      return existingOrder;
    }

    throw new Error("Unable to capture PayPal Sandbox order.");
  }

  return payload;
}

export async function getPayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    }
  );
  const payload = (await response.json()) as PayPalCaptureResponse;

  if (!response.ok || !payload.id) {
    throw new Error("Unable to verify PayPal Sandbox order.");
  }

  return payload;
}
