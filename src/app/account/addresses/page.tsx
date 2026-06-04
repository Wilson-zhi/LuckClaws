import type { Metadata } from "next";
import { AccountAddresses } from "@/components/account/AccountAddresses";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Saved Addresses | ${brandName}`,
    description: "Manage saved shipping addresses for your LUCK CLAWS account.",
    path: "/account/addresses",
    noIndex: true
  })
};

export default function AccountAddressesPage() {
  return (
    <SupportPageLayout
      eyebrow="Account"
      title="Saved Addresses"
      description="Add, update, or remove shipping addresses linked to your customer account."
    >
      <AccountAddresses />
    </SupportPageLayout>
  );
}
