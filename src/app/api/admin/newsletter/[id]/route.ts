import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const subscriberStatuses = new Set(["active", "unsubscribed"]);

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
    return NextResponse.json({ error: "Subscriber id is required." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as { status?: unknown } | null;
  const nextStatus = typeof payload?.status === "string" ? payload.status.trim() : "";

  if (!subscriberStatuses.has(nextStatus)) {
    return NextResponse.json({ error: "Invalid subscriber status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id, status, updated_at")
    .maybeSingle();

  if (error) {
    console.error("Unable to update newsletter subscriber:", error.message);
    return NextResponse.json({ error: "Unable to update subscriber status." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
  }

  return NextResponse.json({ subscriber: data });
}

export async function DELETE(request: Request, { params }: RouteContext) {
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
    return NextResponse.json({ error: "Subscriber id is required." }, { status: 400 });
  }

  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);

  if (error) {
    console.error("Unable to delete newsletter subscriber:", error.message);
    return NextResponse.json({ error: "Unable to delete subscriber." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
