import type { Metadata } from "next";
import { AccountHome } from "@/components/account/AccountHome";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Account | ${brandName}`,
    description: "Manage your LUCK CLAWS customer account.",
    path: "/account",
    noIndex: true
  })
};

export default function AccountPage() {
  return (
    <SupportPageLayout
      eyebrow="Account"
      title="My Account"
      description="Manage your customer profile, saved addresses, and order history."
    >
      <AccountHome />
    </SupportPageLayout>
  );
}
