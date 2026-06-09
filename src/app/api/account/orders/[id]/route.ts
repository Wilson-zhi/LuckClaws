import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { getSupabaseAdminClient, getUserFromRequest } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type OrderItemRow = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  quantity: number | string | null;
  unit_price: number | string | null;
  line_total: number | string | null;
};

function productSlugFromItem(item: OrderItemRow, productRows: Map<string, { image_url: string | null }>) {
  if (!item.product_id) {
    return null;
  }

  if (productRows.has(item.product_id)) {
    return item.product_id;
  }

  return getProduct(item.product_id)?.slug ?? item.product_id;
}

function productImageFromItem(item: OrderItemRow, productRows: Map<string, { image_url: string | null }>) {
  if (!item.product_id) {
    return null;
  }

  return productRows.get(item.product_id)?.image_url ?? getProduct(item.product_id)?.image ?? null;
}

export async function GET(request: Request, { params }: RouteContext) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
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

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, created_at, payment_status, fulfillment_status, subtotal, shipping_amount, total_amount, currency, shipping_address"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

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

  return NextResponse.json({
    order: orderData,
    items: itemRows.map((item) => ({
      id: item.id,
      product_title: item.product_name,
      product_slug: productSlugFromItem(item, productRows),
      product_image: productImageFromItem(item, productRows),
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total
    }))
  });
}
