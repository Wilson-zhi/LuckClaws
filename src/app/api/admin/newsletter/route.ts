import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

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

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server environment variables are not configured." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    subscribers: (data ?? []) as AdminNewsletterSubscriberRow[]
  });
}
