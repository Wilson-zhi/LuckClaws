import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { validateAdminCategoryPayload } from "@/lib/admin-categories";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AdminCategoryRow } from "@/app/api/admin/categories/route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const categorySelect =
  "id, name, slug, description, image_url, status, sort_order, show_in_nav, show_on_home, seo_title, seo_description, google_product_category, created_at, updated_at";

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
    return NextResponse.json({ error: "Category id is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select(categorySelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json({ category: data as AdminCategoryRow });
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
    return NextResponse.json({ error: "Category id is required." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  if (body && typeof body === "object" && !Array.isArray(body) && (body as Record<string, unknown>).action === "archive") {
    const { data, error } = await supabase
      .from("product_categories")
      .update({ status: "archived" })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ category: data });
  }

  const validation = validateAdminCategoryPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Category validation failed.", errors: validation.errors }, { status: 400 });
  }

  const { data: slugCategory, error: slugError } = await supabase
    .from("product_categories")
    .select("id")
    .eq("slug", validation.payload.slug)
    .neq("id", id)
    .maybeSingle();

  if (slugError) {
    return NextResponse.json({ error: slugError.message }, { status: 500 });
  }

  if (slugCategory) {
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
    .update(validation.payload)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json({ category: data });
}
