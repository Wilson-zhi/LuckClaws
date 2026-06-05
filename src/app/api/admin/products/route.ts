import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { validateAdminProductPayload } from "@/lib/admin-products";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type AdminProductRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  price: number | string | null;
  status: string | null;
  inventory_status: string | null;
  is_sale: boolean | null;
  sort_order: number | string | null;
  homepage_section: string | null;
  badge: string | null;
  published_at: string | null;
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
    .from("products")
    .select("id, title, slug, category, price, status, inventory_status, is_sale, sort_order, homepage_section, badge, published_at, created_at")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: (data ?? []) as AdminProductRow[]
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

  const validation = validateAdminProductPayload(await request.json().catch(() => null));

  if (!validation.ok) {
    return NextResponse.json({ error: "Product validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data: existingProduct, error: existingError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", validation.payload.slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingProduct) {
    return NextResponse.json(
      {
        error: "A product with this slug already exists.",
        errors: {
          slug: "A product with this slug already exists."
        }
      },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert(validation.payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}
