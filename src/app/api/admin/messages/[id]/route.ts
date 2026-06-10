import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export type AdminContactMessageDetailRow = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  order_number: string | null;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const contactMessageDetailColumns =
  "id, name, email, subject, message, order_number, status, source, created_at, updated_at";

const contactMessageStatuses = new Set(["new", "in_progress", "resolved", "spam"]);

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
    return NextResponse.json({ error: "Message id is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select(contactMessageDetailColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load contact message:", error.message);
    return NextResponse.json({ error: "Unable to load contact message." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json({ message: data as AdminContactMessageDetailRow });
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
    return NextResponse.json({ error: "Message id is required." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as { status?: unknown } | null;
  const nextStatus = typeof payload?.status === "string" ? payload.status.trim() : "";

  if (!contactMessageStatuses.has(nextStatus)) {
    return NextResponse.json({ error: "Invalid message status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id, status, updated_at")
    .maybeSingle();

  if (error) {
    console.error("Unable to update contact message:", error.message);
    return NextResponse.json({ error: "Unable to update contact message." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json({ message: data });
}
