import type { Metadata } from "next";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Add Admin Product | ${brandName}`,
    description: "Create a LUCK CLAWS Supabase product record.",
    path: "/admin/products/new",
    noIndex: true
  })
};

export default function AdminProductNewPage() {
  return (
    <SiteShell>
      <AdminProductForm mode="create" />
    </SiteShell>
  );
}
