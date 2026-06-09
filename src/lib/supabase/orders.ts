import "server-only";

import { type User } from "@supabase/supabase-js";
import { normalizeCheckoutInfo, type CheckoutInfo } from "@/lib/checkout-info";
import { type CheckoutTotals, type ValidatedCheckoutItem } from "@/lib/checkout-items";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { roundMoney } from "@/lib/utils";

type SavePayPalOrderInput = {
  paypalOrderId: string;
  paypalCaptureId: string;
  checkoutInfo: CheckoutInfo | null;
  user: User | null;
  items: ValidatedCheckoutItem[];
  totals: CheckoutTotals;
};

type SupabaseOrderRow = {
  id: string;
  order_number: string | null;
};

export type SavedSupabaseOrder = {
  id: string;
  orderNumber: string;
};

function clean(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed || null;
}

function createOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `LC-${timestamp}-${suffix}`;
}

function customerNameFromInfo(checkoutInfo: CheckoutInfo | null) {
  const name = clean(normalizeCheckoutInfo(checkoutInfo ?? {}).fullName);

  return name || null;
}

function shippingAddressFromInfo(checkoutInfo: CheckoutInfo | null, customerName: string | null) {
  const normalizedInfo = normalizeCheckoutInfo(checkoutInfo ?? {});

  return {
    full_name: customerName,
    phone: clean(normalizedInfo.phone),
    address_line1: clean(normalizedInfo.address),
    address_line2: clean(normalizedInfo.apartment),
    city: clean(normalizedInfo.city),
    state: clean(normalizedInfo.state),
    postal_code: clean(normalizedInfo.zip),
    country: clean(normalizedInfo.country)
  };
}

export async function savePayPalOrderToSupabase({
  paypalOrderId,
  paypalCaptureId,
  checkoutInfo,
  user,
  items,
  totals
}: SavePayPalOrderInput): Promise<SavedSupabaseOrder> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("paypal_order_id", paypalOrderId)
    .maybeSingle();

  if (existingOrderError) {
    throw new Error(existingOrderError.message);
  }

  if (existingOrder) {
    const row = existingOrder as SupabaseOrderRow;

    return {
      id: row.id,
      orderNumber: row.order_number ?? paypalOrderId
    };
  }

  const orderNumber = createOrderNumber();
  const customerName = customerNameFromInfo(checkoutInfo);
  const customerEmail = clean(checkoutInfo?.email) ?? user?.email ?? null;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      order_number: orderNumber,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: paypalCaptureId,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddressFromInfo(checkoutInfo, customerName),
      currency: "USD",
      subtotal: roundMoney(totals.subtotal),
      shipping_amount: roundMoney(totals.shipping),
      total_amount: roundMoney(totals.total),
      payment_status: "paid",
      fulfillment_status: "processing",
      source: "paypal_sandbox"
    })
    .select("id, order_number")
    .single();

  if (orderError || !orderData) {
    throw new Error(orderError?.message ?? "Unable to save order.");
  }

  const order = orderData as SupabaseOrderRow;
  const { error: itemError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: roundMoney(item.price),
      line_total: roundMoney(item.price * item.quantity)
    }))
  );

  if (itemError) {
    throw new Error(itemError.message);
  }

  return {
    id: order.id,
    orderNumber: order.order_number ?? orderNumber
  };
}
