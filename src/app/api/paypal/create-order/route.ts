import { NextResponse } from "next/server";
import { type CheckoutInfo, validateCheckoutInfo } from "@/lib/checkout-info";
import { validateCheckoutItems } from "@/lib/checkout-items";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { items?: unknown; checkoutInfo?: unknown };
    const checkout = validateCheckoutItems(payload.items);
    const checkoutInfo =
      payload.checkoutInfo && typeof payload.checkoutInfo === "object" && !Array.isArray(payload.checkoutInfo)
        ? (payload.checkoutInfo as CheckoutInfo)
        : null;

    if (validateCheckoutInfo(checkoutInfo).length > 0) {
      return NextResponse.json(
        { error: "Please complete your checkout information before payment." },
        { status: 400 }
      );
    }

    const orderId = await createPayPalOrder(checkout.items, checkout.totals);

    return NextResponse.json({
      orderId,
      totals: checkout.totals
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create PayPal Sandbox order.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
