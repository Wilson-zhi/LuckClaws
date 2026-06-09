import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { validateAdminDiscountPayload } from "@/lib/admin-discounts";
import { type DiscountCodeRow } from "@/lib/discounts";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const discountColumns =
  "id, code, name, type, value, status, minimum_order_amount, max_uses, used_count, starts_at, expires_at, created_at, updated_at";

export async function GET(request: Request, { params }: RouteContext) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = getSupabaseAuthenticatedClientFromRequest(request);

  if (!supabase) {
    return NextResponse.json(
      { error: "Authenticated Supabase session is not available." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Discount id is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("discount_codes")
    .select(discountColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load discount code:", error.message);
    return NextResponse.json({ error: "Unable to load discount code." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Discount code not found." }, { status: 404 });
  }

  return NextResponse.json({ discount: data as DiscountCodeRow });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = getSupabaseAuthenticatedClientFromRequest(request);

  if (!supabase) {
    return NextResponse.json(
      { error: "Authenticated Supabase session is not available." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Discount id is required." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  if (body && typeof body === "object" && !Array.isArray(body)) {
    const action = (body as Record<string, unknown>).action;

    if (action === "archive" || action === "activate") {
      const status = action === "archive" ? "archived" : "active";
      const { data, error } = await supabase
        .from("discount_codes")
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select("id, status, updated_at")
        .maybeSingle();

      if (error) {
        console.error("Unable to update discount status:", error.message);
        return NextResponse.json({ error: "Unable to update discount code." }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: "Discount code not found." }, { status: 404 });
      }

      return NextResponse.json({ discount: data });
    }
  }

  const validation = validateAdminDiscountPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Discount validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("discount_codes")
    .update({
      ...validation.payload,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

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

    console.error("Unable to update discount code:", error.message);
    return NextResponse.json({ error: "Unable to update discount code." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Discount code not found." }, { status: 404 });
  }

  return NextResponse.json({ discount: data });
}
