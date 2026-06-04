import "server-only";

import { type User } from "@supabase/supabase-js";
import { getSupabaseAdminClient, getUserFromRequest } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403 | 500; message: string };

type ProfileRoleRow = {
  role: string | null;
};

export async function requireAdminFromRequest(request: Request): Promise<AdminAuthResult> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false,
      status: 500,
      message: "Supabase server environment variables are not configured."
    };
  }

  const user = await getUserFromRequest(request);

  if (!user) {
    return {
      ok: false,
      status: 401,
      message: "Authentication is required."
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500,
      message: error.message
    };
  }

  const profile = data as ProfileRoleRow | null;

  if (profile?.role !== "admin") {
    return {
      ok: false,
      status: 403,
      message: "Admin access is required."
    };
  }

  return {
    ok: true,
    user
  };
}
