import { NextResponse } from "next/server";
import { brandName, getProduct } from "@/data/products";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: unknown;
  billing_address?: unknown;
  currency: string | null;
  subtotal: number | string | null;
  shipping_amount: number | string | null;
  total_amount: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  source: string | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  created_at: string | null;
};

type OrderItemRow = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  quantity: number | string | null;
  unit_price: number | string | null;
  line_total: number | string | null;
};

type ShippingAddress = {
  name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
};

const orderStatuses = new Set(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]);

const orderColumns =
  "id, order_number, customer_email, customer_name, shipping_address, currency, subtotal, shipping_amount, total_amount, payment_status, fulfillment_status, source, paypal_order_id, paypal_capture_id, created_at";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFromRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function shippingAddressFromOrder(value: unknown): ShippingAddress {
  const record = isRecord(value) ? value : {};

  return {
    name: stringFromRecord(record, "full_name") ?? stringFromRecord(record, "name"),
    phone: stringFromRecord(record, "phone"),
    address_line1: stringFromRecord(record, "address_line1"),
    address_line2: stringFromRecord(record, "address_line2"),
    city: stringFromRecord(record, "city"),
    state: stringFromRecord(record, "state"),
    postal_code: stringFromRecord(record, "postal_code"),
    country: stringFromRecord(record, "country")
  };
}

function productSlugFromItem(item: OrderItemRow) {
  if (!item.product_id) {
    return null;
  }

  return getProduct(item.product_id)?.slug ?? item.product_id;
}

function productImageFromItem(item: OrderItemRow, productRows: Map<string, { image_url: string | null }>) {
  if (!item.product_id) {
    return null;
  }

  return productRows.get(item.product_id)?.image_url ?? getProduct(item.product_id)?.image ?? null;
}

function isMissingBillingColumnError(error: { message?: string; code?: string }) {
  return Boolean(
    error.code === "PGRST204" || error.message?.toLowerCase().includes("billing_address")
  );
}

export async function GET(request: Request, { params }: RouteContext) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server environment variables are not configured." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Order id is required." }, { status: 400 });
  }

  const orderResult = await supabase
    .from("orders")
    .select(`${orderColumns}, billing_address`)
    .eq("id", id)
    .maybeSingle();
  let orderData: unknown = orderResult.data;
  let orderError = orderResult.error;

  if (orderError && isMissingBillingColumnError(orderError)) {
    const fallbackResult = await supabase
      .from("orders")
      .select(orderColumns)
      .eq("id", id)
      .maybeSingle();

    orderData = fallbackResult.data;
    orderError = fallbackResult.error;
  }

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  if (!orderData) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const { data: itemData, error: itemError } = await supabase
    .from("order_items")
    .select("id, product_id, product_name, quantity, unit_price, line_total")
    .eq("order_id", id)
    .order("id", { ascending: true });

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  const itemRows = (itemData ?? []) as OrderItemRow[];
  const productIds = Array.from(
    new Set(itemRows.map((item) => item.product_id).filter((value): value is string => Boolean(value)))
  );
  const productRows = new Map<string, { image_url: string | null }>();

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("slug, image_url")
      .in("slug", productIds);

    for (const product of (products ?? []) as Array<{ slug: string | null; image_url: string | null }>) {
      if (product.slug) {
        productRows.set(product.slug, { image_url: product.image_url });
      }
    }
  }

  const order = orderData as OrderRow;
  const shippingAddress = shippingAddressFromOrder(order.shipping_address);
  const billingAddress = order.billing_address ? shippingAddressFromOrder(order.billing_address) : null;

  return NextResponse.json({
    order: {
      id: order.id,
      order_number: order.order_number,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      customer_phone: shippingAddress.phone,
      payment_status: order.payment_status,
      fulfillment_status: order.fulfillment_status,
      currency: order.currency ?? "USD",
      subtotal: order.subtotal,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      source: order.source,
      paypal_order_id: order.paypal_order_id,
      paypal_capture_id: order.paypal_capture_id,
      created_at: order.created_at,
      brand: brandName
    },
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    items: itemRows.map((item) => ({
      id: item.id,
      product_title: item.product_name,
      product_slug: productSlugFromItem(item),
      product_image: productImageFromItem(item, productRows),
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total
    }))
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server environment variables are not configured." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Order id is required." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as {
    fulfillment_status?: unknown;
    status?: unknown;
  } | null;
  const nextStatus =
    typeof payload?.fulfillment_status === "string"
      ? payload.fulfillment_status.trim()
      : typeof payload?.status === "string"
        ? payload.status.trim()
        : "";

  if (!orderStatuses.has(nextStatus)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ fulfillment_status: nextStatus })
    .eq("id", id)
    .select("id, fulfillment_status")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
