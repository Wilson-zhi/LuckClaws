import type { Metadata } from "next";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Edit Admin Product | ${brandName}`,
    description: "Edit a LUCK CLAWS Supabase product record.",
    path: "/admin/products",
    noIndex: true
  })
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminProductForm mode="edit" productId={id} />
    </SiteShell>
  );
}
