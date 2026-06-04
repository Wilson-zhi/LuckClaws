import type { Metadata } from "next";
import { AdminProductDetail } from "@/components/admin/AdminProductDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Product | ${brandName}`,
    description: "Review a LUCK CLAWS Supabase product record in the admin dashboard.",
    path: "/admin/products",
    noIndex: true
  })
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminProductDetail productId={id} />
    </SiteShell>
  );
}
