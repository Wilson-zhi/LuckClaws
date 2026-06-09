import { NextResponse } from "next/server";
import { type CheckoutInfo, validateCheckoutInfo } from "@/lib/checkout-info";
import { calculateCheckoutTotals, validateCheckoutItems } from "@/lib/checkout-items";
import { validateDiscountForSubtotal } from "@/lib/discount-validation";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { items?: unknown; checkoutInfo?: unknown; discountCode?: unknown };
    const checkout = await validateCheckoutItems(payload.items);
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

    const discountCode = typeof payload.discountCode === "string" ? payload.discountCode : "";
    const discount = discountCode
      ? await validateDiscountForSubtotal({
          code: discountCode,
          subtotal: checkout.totals.subtotal
        })
      : null;
    const totals = calculateCheckoutTotals(checkout.items, discount);
    const orderId = await createPayPalOrder(checkout.items, totals);

    return NextResponse.json({
      orderId,
      totals,
      discount
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create PayPal Sandbox order.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
