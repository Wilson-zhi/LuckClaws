import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email ?? null
    },
    role: "admin"
  });
}
