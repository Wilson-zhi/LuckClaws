import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

export type AdminNewsletterSubscriberRow = {
  id: string;
  email: string | null;
  source: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function GET(request: Request) {
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

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load newsletter subscribers:", error.message);
    return NextResponse.json({ error: "Unable to load newsletter subscribers." }, { status: 500 });
  }

  return NextResponse.json({
    subscribers: (data ?? []) as AdminNewsletterSubscriberRow[]
  });
}
