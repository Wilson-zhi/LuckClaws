import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

function getCompletedCapture(payload: Awaited<ReturnType<typeof capturePayPalOrder>>) {
  return payload.purchase_units
    ?.flatMap((unit) => unit.payments?.captures ?? [])
    .find((capture) => capture.status === "COMPLETED");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { orderId?: unknown };

    if (typeof payload.orderId !== "string" || !payload.orderId.trim()) {
      return NextResponse.json({ error: "PayPal order ID is required." }, { status: 400 });
    }

    const capture = await capturePayPalOrder(payload.orderId.trim());
    const completedCapture = getCompletedCapture(capture);

    if (capture.status !== "COMPLETED" || !completedCapture) {
      return NextResponse.json(
        {
          error: "PayPal Sandbox capture was not completed.",
          status: capture.status ?? "UNKNOWN"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      orderId: capture.id,
      captureId: completedCapture.id,
      status: capture.status,
      amount: completedCapture.amount
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to capture PayPal Sandbox order.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
