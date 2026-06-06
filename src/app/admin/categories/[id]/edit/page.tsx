import type { Metadata } from "next";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminCategoryEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Edit Admin Category | ${brandName}`,
    description: "Edit a LUCK CLAWS Supabase category record.",
    path: "/admin/categories",
    noIndex: true
  })
};

export default async function AdminCategoryEditPage({ params }: AdminCategoryEditPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminCategoryForm mode="edit" categoryId={id} />
    </SiteShell>
  );
}
