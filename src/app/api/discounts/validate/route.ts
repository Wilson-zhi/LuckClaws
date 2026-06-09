import { NextResponse } from "next/server";
import { calculateCheckoutTotals, validateCheckoutItems } from "@/lib/checkout-items";
import { validateDiscountForSubtotal } from "@/lib/discount-validation";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { code?: unknown; items?: unknown };
    const code = typeof payload.code === "string" ? payload.code : "";
    const checkout = await validateCheckoutItems(payload.items);
    const discount = await validateDiscountForSubtotal({
      code,
      subtotal: checkout.totals.subtotal
    });
    const totals = calculateCheckoutTotals(checkout.items, discount);

    return NextResponse.json({
      discount,
      totals
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid code.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
