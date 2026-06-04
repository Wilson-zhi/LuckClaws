import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
};

export type AdminCustomerRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
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

  const [{ data: usersData, error: usersError }, { data: profilesData, error: profilesError }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 50 }),
      supabase.from("profiles").select("id, full_name, role, created_at").limit(50)
    ]);

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const profilesById = new Map(
    ((profilesData ?? []) as ProfileRow[]).map((profile) => [profile.id, profile])
  );
  const customers = usersData.users.map<AdminCustomerRow>((user) => {
    const profile = profilesById.get(user.id);

    return {
      id: user.id,
      email: user.email ?? null,
      full_name: profile?.full_name ?? null,
      role: profile?.role ?? null,
      created_at: profile?.created_at ?? user.created_at ?? null
    };
  });

  return NextResponse.json({ customers });
}
