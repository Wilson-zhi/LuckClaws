import { NextResponse } from "next/server";
import { validateCheckoutItems } from "@/lib/checkout-items";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { items?: unknown };
    const checkout = validateCheckoutItems(payload.items);
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
