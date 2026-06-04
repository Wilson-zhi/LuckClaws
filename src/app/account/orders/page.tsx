import type { Metadata } from "next";
import { AccountOrders } from "@/components/account/AccountOrders";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Order History | ${brandName}`,
    description: "View orders linked to your LUCK CLAWS account.",
    path: "/account/orders",
    noIndex: true
  })
};

export default function AccountOrdersPage() {
  return (
    <SupportPageLayout
      eyebrow="Account"
      title="My Orders"
      description="Review orders that were placed while signed in to your LUCK CLAWS account."
    >
      <AccountOrders />
    </SupportPageLayout>
  );
}
