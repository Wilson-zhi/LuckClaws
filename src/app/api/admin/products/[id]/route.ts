import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { validateAdminProductPayload } from "@/lib/admin-products";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export type AdminProductDetailRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  category_slug: string | null;
  description: string | null;
  price: number | string | null;
  compare_at_price: number | string | null;
  currency: string | null;
  image_url: string | null;
  image_alt: string | null;
  images: unknown;
  status: string | null;
  inventory_status: string | null;
  stock_quantity: number | string | null;
  is_featured: boolean | null;
  is_sale: boolean | null;
  sort_order: number | string | null;
  homepage_section: string | null;
  badge: string | null;
  published_at: string | null;
  short_description: string | null;
  product_highlights: unknown;
  detail_rows: unknown;
  best_for: unknown;
  care_instructions: unknown;
  product_faqs: unknown;
  accordion_sections: unknown;
  related_product_slugs: unknown;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AdminProductImageRow = {
  id: string;
  url: string | null;
  alt_text: string | null;
  position: number | string | null;
};

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
    return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  }

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(
      "id, title, slug, category, category_slug, description, price, compare_at_price, currency, image_url, image_alt, images, status, inventory_status, stock_quantity, is_featured, is_sale, sort_order, homepage_section, badge, published_at, short_description, product_highlights, detail_rows, best_for, care_instructions, product_faqs, accordion_sections, related_product_slugs, seo_title, seo_description, google_product_category, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  if (!productData) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const { data: imageData, error: imageError } = await supabase
    .from("product_images")
    .select("id, url, alt_text, position")
    .eq("product_id", id)
    .order("position", { ascending: true });

  if (imageError) {
    return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({
    product: productData as AdminProductDetailRow,
    images: (imageData ?? []) as AdminProductImageRow[]
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
    return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  if (body && typeof body === "object" && !Array.isArray(body) && (body as Record<string, unknown>).action === "archive") {
    const { data, error } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  }

  const validation = validateAdminProductPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Product validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data: slugProduct, error: slugError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", validation.payload.slug)
    .neq("id", id)
    .maybeSingle();

  if (slugError) {
    return NextResponse.json({ error: slugError.message }, { status: 500 });
  }

  if (slugProduct) {
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
    .update(validation.payload)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}
