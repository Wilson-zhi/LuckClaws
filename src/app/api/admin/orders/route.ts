import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type AdminOrderRow = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  paypal_order_id: string | null;
  created_at: string | null;
};

export async function GET(request: Request) {
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

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_email, customer_name, total_amount, currency, payment_status, fulfillment_status, paypal_order_id, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: (data ?? []) as AdminOrderRow[]
  });
}
