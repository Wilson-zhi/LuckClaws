import type { Metadata } from "next";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Order | ${brandName}`,
    description: "Review a LUCK CLAWS order in the admin dashboard.",
    path: "/admin/orders",
    noIndex: true
  })
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminOrderDetail orderId={id} />
    </SiteShell>
  );
}
