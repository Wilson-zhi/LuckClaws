import type { Metadata } from "next";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Add Admin Category | ${brandName}`,
    description: "Create a LUCK CLAWS Supabase category record.",
    path: "/admin/categories/new",
    noIndex: true
  })
};

export default function AdminCategoryNewPage() {
  return (
    <SiteShell>
      <AdminCategoryForm mode="create" />
    </SiteShell>
  );
}
