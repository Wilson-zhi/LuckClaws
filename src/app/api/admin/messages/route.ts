import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

export type AdminContactMessageListRow = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  order_number: string | null;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const contactMessageListColumns =
  "id, name, email, subject, order_number, status, source, created_at, updated_at";

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
    .from("contact_messages")
    .select(contactMessageListColumns)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load contact messages:", error.message);
    return NextResponse.json({ error: "Unable to load contact messages." }, { status: 500 });
  }

  return NextResponse.json({
    messages: (data ?? []) as AdminContactMessageListRow[]
  });
}
