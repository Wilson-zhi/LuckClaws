import type { Metadata } from "next";
import { AdminDiscountsPageShell } from "@/components/admin/AdminDiscounts";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Discounts | ${brandName}`,
    description: "Manage LUCK CLAWS discount codes.",
    path: "/admin/discounts",
    noIndex: true
  })
};

export default function AdminDiscountsPage() {
  return (
    <SiteShell>
      <AdminDiscountsPageShell />
    </SiteShell>
  );
}
