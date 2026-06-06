import type { Metadata } from "next";
import { AdminCategoryDetail } from "@/components/admin/AdminCategoryDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminCategoryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Category | ${brandName}`,
    description: "Review a LUCK CLAWS Supabase category record in the admin dashboard.",
    path: "/admin/categories",
    noIndex: true
  })
};

export default async function AdminCategoryDetailPage({ params }: AdminCategoryDetailPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminCategoryDetail categoryId={id} />
    </SiteShell>
  );
}
