import type { Metadata } from "next";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Categories | ${brandName}`,
    description: "Manage LUCK CLAWS product category records.",
    path: "/admin/categories",
    noIndex: true
  })
};

export default function AdminCategoriesPage() {
  return (
    <SiteShell>
      <AdminCategories />
    </SiteShell>
  );
}
