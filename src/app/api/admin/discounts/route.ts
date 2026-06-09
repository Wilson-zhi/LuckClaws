import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { validateAdminDiscountPayload } from "@/lib/admin-discounts";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { type DiscountCodeRow } from "@/lib/discounts";

const discountColumns =
  "id, code, name, type, value, status, minimum_order_amount, max_uses, used_count, starts_at, expires_at, created_at, updated_at";

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
    .from("discount_codes")
    .select(discountColumns)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load discount codes." }, { status: 500 });
  }

  return NextResponse.json({
    discounts: (data ?? []) as DiscountCodeRow[]
  });
}

export async function POST(request: Request) {
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

  const validation = validateAdminDiscountPayload(await request.json().catch(() => null));

  if (!validation.ok) {
    return NextResponse.json({ error: "Discount validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("discount_codes")
    .insert(validation.payload)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error: "A discount code with this code already exists.",
          errors: {
            code: "A discount code with this code already exists."
          }
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Unable to create discount code." }, { status: 500 });
  }

  return NextResponse.json({ discount: data }, { status: 201 });
}
