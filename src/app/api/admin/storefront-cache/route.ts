import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import {
  revalidateStorefrontScope,
  storefrontCacheTags,
  type StorefrontCacheScope
} from "@/lib/storefront-cache";

function isStorefrontCacheScope(value: unknown): value is StorefrontCacheScope {
  return typeof value === "string" && value in storefrontCacheTags;
}

export async function POST(request: Request) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = (await request.json().catch(() => null)) as { scope?: unknown } | null;

  if (!isStorefrontCacheScope(body?.scope)) {
    return NextResponse.json({ error: "A valid storefront cache scope is required." }, { status: 400 });
  }

  revalidateStorefrontScope(body.scope);

  return NextResponse.json({ revalidated: true, scope: body.scope });
}
