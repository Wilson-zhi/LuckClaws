import { NextResponse } from "next/server";
import { type CheckoutInfo, validateCheckoutInfo } from "@/lib/checkout-info";
import { calculateCheckoutTotals, validateCheckoutItems } from "@/lib/checkout-items";
import { validateDiscountForSubtotal } from "@/lib/discount-validation";
import { capturePayPalOrder } from "@/lib/paypal";
import { savePayPalOrderToSupabase } from "@/lib/supabase/orders";
import { getUserFromRequest } from "@/lib/supabase/server";
import { roundMoney } from "@/lib/utils";

function getCompletedCapture(payload: Awaited<ReturnType<typeof capturePayPalOrder>>) {
  return payload.purchase_units
    ?.flatMap((unit) => unit.payments?.captures ?? [])
    .find((capture) => capture.status === "COMPLETED");
}

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.slice(0, 300) : undefined;
}

function sanitizeCheckoutInfo(value: unknown): CheckoutInfo | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const raw = value as Record<string, unknown>;

  return {
    email: sanitizeText(raw.email),
    fullName: sanitizeText(raw.fullName),
    firstName: sanitizeText(raw.firstName),
    lastName: sanitizeText(raw.lastName),
    country: sanitizeText(raw.country),
    address: sanitizeText(raw.address),
    addressLine1: sanitizeText(raw.addressLine1),
    apartment: sanitizeText(raw.apartment),
    addressLine2: sanitizeText(raw.addressLine2),
    city: sanitizeText(raw.city),
    state: sanitizeText(raw.state),
    zip: sanitizeText(raw.zip),
    postalCode: sanitizeText(raw.postalCode),
    phone: sanitizeText(raw.phone)
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      orderId?: unknown;
      items?: unknown;
      checkoutInfo?: unknown;
      discountCode?: unknown;
    };

    if (typeof payload.orderId !== "string" || !payload.orderId.trim()) {
      return NextResponse.json({ error: "PayPal order ID is required." }, { status: 400 });
    }

    const checkout = await validateCheckoutItems(payload.items);
    const discountCode = typeof payload.discountCode === "string" ? payload.discountCode : "";
    const discount = discountCode
      ? await validateDiscountForSubtotal({
          code: discountCode,
          subtotal: checkout.totals.subtotal
        })
      : null;
    const totals = calculateCheckoutTotals(checkout.items, discount);
    const checkoutInfo = sanitizeCheckoutInfo(payload.checkoutInfo);

    if (validateCheckoutInfo(checkoutInfo).length > 0) {
      return NextResponse.json(
        { error: "Please complete your checkout information before payment." },
        { status: 400 }
      );
    }

    const paypalOrderId = payload.orderId.trim();
    const capture = await capturePayPalOrder(paypalOrderId);
    const completedCapture = getCompletedCapture(capture);

    if (capture.status !== "COMPLETED" || !completedCapture || !completedCapture.id) {
      return NextResponse.json(
        {
          error: "PayPal Sandbox capture was not completed.",
          status: capture.status ?? "UNKNOWN"
        },
        { status: 400 }
      );
    }

    const capturedValue = Number(completedCapture.amount?.value);

    if (
      completedCapture.amount?.currency_code !== "USD" ||
      !Number.isFinite(capturedValue) ||
      roundMoney(capturedValue) !== totals.total
    ) {
      return NextResponse.json(
        {
          error: "Captured PayPal amount does not match the recalculated checkout total."
        },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request);
    let internalOrderId: string | undefined;
    let internalOrderNumber: string | undefined;
    let orderSaveError: string | undefined;

    try {
      const savedOrder = await savePayPalOrderToSupabase({
        paypalOrderId: capture.id ?? paypalOrderId,
        paypalCaptureId: completedCapture.id,
        checkoutInfo,
        user,
        items: checkout.items,
        totals
      });

      internalOrderId = savedOrder.id;
      internalOrderNumber = savedOrder.orderNumber;
    } catch {
      orderSaveError = "Payment captured, but internal order storage could not be confirmed. Contact support with your PayPal order ID.";
    }

    return NextResponse.json({
      orderId: capture.id ?? paypalOrderId,
      captureId: completedCapture.id,
      status: capture.status,
      amount: completedCapture.amount,
      internalOrderId,
      internalOrderNumber,
      orderSaveError
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to capture PayPal Sandbox order.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
