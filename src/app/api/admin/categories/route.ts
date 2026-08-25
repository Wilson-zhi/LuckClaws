import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { categoryStatuses, validateAdminCategoryPayload } from "@/lib/admin-categories";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidateStorefrontScope } from "@/lib/storefront-cache";

export type AdminCategoryRow = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
  sort_order: number | string | null;
  show_in_nav: boolean | null;
  show_on_home: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const categorySelect =
  "id, name, slug, description, image_url, status, sort_order, show_in_nav, show_on_home, seo_title, seo_description, google_product_category, created_at, updated_at";

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

  const status = new URL(request.url).searchParams.get("status")?.trim() ?? "";
  let query = supabase
    .from("product_categories")
    .select(categorySelect)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (categoryStatuses.includes(status as (typeof categoryStatuses)[number])) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    categories: (data ?? []) as AdminCategoryRow[]
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

  const validation = validateAdminCategoryPayload(await request.json().catch(() => null));

  if (!validation.ok) {
    return NextResponse.json({ error: "Category validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data: existingCategory, error: existingError } = await supabase
    .from("product_categories")
    .select("id")
    .eq("slug", validation.payload.slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingCategory) {
    return NextResponse.json(
      {
        error: "A category with this slug already exists.",
        errors: {
          slug: "A category with this slug already exists."
        }
      },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("product_categories")
    .insert(validation.payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateStorefrontScope("categories");

  return NextResponse.json({ category: data }, { status: 201 });
}
