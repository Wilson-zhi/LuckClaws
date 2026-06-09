import type { Metadata } from "next";
import { AccountOrderDetail } from "@/components/account/AccountOrderDetail";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AccountOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Order Details | ${brandName}`,
    description: "View details for an order linked to your LUCK CLAWS account.",
    path: "/account/orders",
    noIndex: true
  })
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const { id } = await params;

  return (
    <SupportPageLayout
      eyebrow="Account"
      title="Order Details"
      description="Review the items, shipping address, and current status for this LUCK CLAWS order."
      backLink={{ href: "/account/orders", label: "Back to Orders" }}
    >
      <AccountOrderDetail orderId={id} />
    </SupportPageLayout>
  );
}
