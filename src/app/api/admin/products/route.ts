import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { type AdminProductMutationPayload, validateAdminProductPayload } from "@/lib/admin-products";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidateStorefrontScope } from "@/lib/storefront-cache";

export type AdminProductRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  category_slug: string | null;
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

function isMissingVideoUrlColumnError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";

  return message.includes("video_url") || message.includes("schema cache");
}

function productPayloadForDatabase(payload: AdminProductMutationPayload, includeVideoUrl: boolean) {
  if (includeVideoUrl) {
    return payload;
  }

  const basePayload: Partial<AdminProductMutationPayload> = { ...payload };
  delete basePayload.video_url;

  return basePayload;
}

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
    .select("id, title, slug, category, category_slug, price, status, inventory_status, is_sale, sort_order, homepage_section, badge, published_at, created_at")
    .order("created_at", { ascending: false });

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

  let insertResult = await supabase
    .from("products")
    .insert(productPayloadForDatabase(validation.payload, true))
    .select("id")
    .single();

  if (insertResult.error && isMissingVideoUrlColumnError(insertResult.error)) {
    if (validation.payload.video_url) {
      return NextResponse.json(
        { error: "Product video storage is not ready. Add the products.video_url column before saving video URLs." },
        { status: 500 }
      );
    }

    insertResult = await supabase
      .from("products")
      .insert(productPayloadForDatabase(validation.payload, false))
      .select("id")
      .single();
  }

  if (insertResult.error) {
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  revalidateStorefrontScope("products");

  return NextResponse.json({ product: insertResult.data }, { status: 201 });
}
