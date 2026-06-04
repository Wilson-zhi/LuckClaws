import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

type AddressRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_default: boolean | null;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  total_amount: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  created_at: string | null;
};

async function loadProfile(customerId: string): Promise<{ profile: ProfileRow | null; error: string | null }> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      profile: null,
      error: "Supabase server environment variables are not configured."
    };
  }

  const profileResult = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .eq("id", customerId)
    .maybeSingle();

  if (!profileResult.error) {
    return {
      profile: profileResult.data as ProfileRow | null,
      error: null
    };
  }

  const fallbackResult = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .eq("id", customerId)
    .maybeSingle();

  return {
    profile: (fallbackResult.data ?? null) as ProfileRow | null,
    error: fallbackResult.error?.message ?? null
  };
}

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
    return NextResponse.json({ error: "Customer id is required." }, { status: 400 });
  }

  const [{ data: userData, error: userError }, profileResult] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    loadProfile(id)
  ]);

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!userData.user) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  if (profileResult.error) {
    return NextResponse.json({ error: profileResult.error }, { status: 500 });
  }

  const [{ data: addresses, error: addressesError }, { data: orders, error: ordersError }] =
    await Promise.all([
      supabase
        .from("addresses")
        .select("id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default")
        .eq("user_id", id)
        .order("is_default", { ascending: false }),
      supabase
        .from("orders")
        .select("id, order_number, total_amount, payment_status, fulfillment_status, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(25)
    ]);

  if (addressesError) {
    return NextResponse.json({ error: addressesError.message }, { status: 500 });
  }

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const profile = profileResult.profile;

  return NextResponse.json({
    customer: {
      id: userData.user.id,
      email: userData.user.email ?? null,
      full_name: profile?.full_name ?? null,
      role: profile?.role ?? null,
      created_at: profile?.created_at ?? userData.user.created_at ?? null,
      updated_at: profile?.updated_at ?? null
    },
    addresses: (addresses ?? []) as AddressRow[],
    orders: (orders ?? []) as OrderRow[]
  });
}
