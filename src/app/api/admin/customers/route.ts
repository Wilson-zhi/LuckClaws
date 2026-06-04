import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
};

type CountRow = {
  user_id: string | null;
};

type CountQueryResult = {
  data: CountRow[] | null;
  error: { message: string } | null;
};

export type AdminCustomerRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  address_count: number;
  order_count: number;
};

function countByUserId(rows: CountRow[] | null) {
  const counts = new Map<string, number>();

  rows?.forEach((row) => {
    if (row.user_id) {
      counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
    }
  });

  return counts;
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

  const userIds = usersData.users.map((user) => user.id);
  const emptyCountResult: CountQueryResult = { data: [], error: null };
  const [addressesResult, ordersResult] =
    userIds.length > 0
      ? await Promise.all([
          supabase.from("addresses").select("user_id").in("user_id", userIds).limit(1000),
          supabase.from("orders").select("user_id").in("user_id", userIds).limit(1000)
        ])
      : [emptyCountResult, emptyCountResult];

  if (addressesResult.error) {
    return NextResponse.json({ error: addressesResult.error.message }, { status: 500 });
  }

  if (ordersResult.error) {
    return NextResponse.json({ error: ordersResult.error.message }, { status: 500 });
  }

  const profilesById = new Map(((profilesData ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
  const addressCounts = countByUserId((addressesResult.data ?? []) as CountRow[]);
  const orderCounts = countByUserId((ordersResult.data ?? []) as CountRow[]);
  const customers = usersData.users.map<AdminCustomerRow>((user) => {
    const profile = profilesById.get(user.id);

    return {
      id: user.id,
      email: user.email ?? null,
      full_name: profile?.full_name ?? null,
      role: profile?.role ?? null,
      created_at: profile?.created_at ?? user.created_at ?? null,
      address_count: addressCounts.get(user.id) ?? 0,
      order_count: orderCounts.get(user.id) ?? 0
    };
  });

  return NextResponse.json({ customers });
}
