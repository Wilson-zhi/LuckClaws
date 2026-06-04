import type { Metadata } from "next";
import { AdminCustomerDetail } from "@/components/admin/AdminCustomerDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminCustomerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Customer | ${brandName}`,
    description: "Review a LUCK CLAWS customer account profile.",
    path: "/admin/customers",
    noIndex: true
  })
};

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminCustomerDetail customerId={id} />
    </SiteShell>
  );
}
