"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { readCheckoutInfo } from "@/lib/checkout-info";
import { trackPurchase } from "@/lib/ga4-ecommerce";
import { savePayPalPaymentResult } from "@/lib/paypal-payment-result";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/utils";
import { type CartItem } from "@/store/cart-store";

type PayPalSandboxButtonsProps = {
  items: CartItem[];
  total: number;
  shipping: number;
  checkoutMode: "cart" | "buy-now";
};

type PayPalCreateOrderResponse = {
  orderId?: string;
  error?: string;
};

type PayPalCaptureOrderResponse = {
  orderId?: string;
  captureId?: string;
  status?: string;
  amount?: {
    currency_code: "USD";
    value: string;
  };
  internalOrderId?: string;
  internalOrderNumber?: string;
  orderSaveError?: string;
  error?: string;
};

type PayPalApproveData = {
  orderID?: string;
};

type PayPalButtonActions = {
  reject: () => void;
};

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close?: () => void;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: Record<string, string>;
        createOrder: () => Promise<string>;
        onApprove: (data: PayPalApproveData) => Promise<void>;
        onCancel: () => void;
        onError: (error: unknown) => void;
        onInit?: (_data: unknown, actions: PayPalButtonActions) => void;
      }) => PayPalButtonsInstance;
    };
  }
}

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const paypalScriptSrc = clientId
  ? `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`
  : "";

function checkoutItemsPayload(items: CartItem[]) {
  return items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    ...(item.color ? { color: item.color } : {}),
    ...(item.size ? { size: item.size } : {})
  }));
}

export function PayPalSandboxButtons({
  items,
  total,
  shipping,
  checkoutMode
}: PayPalSandboxButtonsProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const itemSignature = useMemo(() => JSON.stringify(checkoutItemsPayload(items)), [items]);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.paypal || items.length === 0) {
      return;
    }

    buttonsRef.current?.close?.();
    containerRef.current.innerHTML = "";
    setError("");
    setMessage("");

    const buttons = window.paypal.Buttons({
      style: {
        layout: "vertical",
        shape: "pill",
        label: "pay"
      },
      onInit: (_data, actions) => {
        if (items.length === 0) {
          actions.reject();
        }
      },
      createOrder: async () => {
        setError("");
        setMessage("Creating PayPal Sandbox order...");
        const response = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            checkoutMode,
            items: checkoutItemsPayload(items)
          })
        });
        const payload = (await response.json()) as PayPalCreateOrderResponse;

        if (!response.ok || !payload.orderId) {
          throw new Error(payload.error ?? "Unable to create PayPal Sandbox order.");
        }

        setMessage("PayPal Sandbox order created. Continue in the PayPal window.");

        return payload.orderId;
      },
      onApprove: async (data) => {
        if (!data.orderID) {
          throw new Error("PayPal did not return an order ID.");
        }

        setError("");
        setMessage("Capturing PayPal Sandbox payment...");
        const supabase = getSupabaseBrowserClient();
        const { data: sessionData } = supabase
          ? await supabase.auth.getSession()
          : { data: { session: null } };
        const accessToken = sessionData.session?.access_token;
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          },
          body: JSON.stringify({
            orderId: data.orderID,
            items: checkoutItemsPayload(items),
            checkoutInfo: readCheckoutInfo()
          })
        });
        const payload = (await response.json()) as PayPalCaptureOrderResponse;

        if (!response.ok || payload.status !== "COMPLETED" || !payload.orderId) {
          throw new Error(payload.error ?? "PayPal Sandbox capture was not completed.");
        }

        trackPurchase({
          transactionId: payload.orderId,
          items,
          value: payload.amount?.value ? Number(payload.amount.value) : total,
          shipping
        });
        savePayPalPaymentResult({
          orderId: payload.orderId,
          captureId: payload.captureId,
          status: "COMPLETED",
          amount: payload.amount,
          internalOrderId: payload.internalOrderId,
          internalOrderNumber: payload.internalOrderNumber,
          orderSaveError: payload.orderSaveError,
          items,
          createdAt: Date.now()
        });
        router.push(`/checkout/success?orderId=${encodeURIComponent(payload.orderId)}`);
      },
      onCancel: () => {
        router.push(`/checkout/cancel${checkoutMode === "buy-now" ? "?mode=buy-now" : ""}`);
      },
      onError: (paypalError) => {
        setMessage("");
        setError(paypalError instanceof Error ? paypalError.message : "PayPal Sandbox payment could not be completed.");
      }
    });

    buttonsRef.current = buttons;
    buttons.render(containerRef.current).catch((renderError: unknown) => {
      setError(renderError instanceof Error ? renderError.message : "Unable to render PayPal Sandbox buttons.");
    });

    return () => {
      buttons.close?.();
    };
  }, [checkoutMode, itemSignature, items, router, scriptReady, shipping, total]);

  if (!clientId) {
    return (
      <div className="rounded-md border border-error/30 bg-error/10 p-5 text-sm leading-6 text-on-surface-variant">
        PayPal Sandbox client ID is not configured yet. Set{" "}
        <span className="font-semibold text-on-surface">NEXT_PUBLIC_PAYPAL_CLIENT_ID</span> to render the PayPal
        Sandbox button.
      </div>
    );
  }

  return (
    <div>
      <Script
        id="paypal-sandbox-sdk"
        src={paypalScriptSrc}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setError("Unable to load the PayPal Sandbox SDK.")}
      />
      <div className="rounded-md bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">
        Sandbox payment mode is active for testing. The PayPal amount should match the checkout
        total of <span className="font-semibold text-on-surface">{formatPrice(total)}</span>.
      </div>
      <div ref={containerRef} className="mt-5 min-h-36" />
      {message && (
        <p className="mt-3 text-sm leading-6 text-on-surface-variant" role="status" aria-live="polite">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm leading-6 text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
