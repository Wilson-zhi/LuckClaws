import type { Metadata } from "next";
import { AdminDiscountForm } from "@/components/admin/AdminDiscountForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Add Discount | ${brandName}`,
    description: "Create a LUCK CLAWS discount code.",
    path: "/admin/discounts/new",
    noIndex: true
  })
};

export default function NewDiscountPage() {
  return (
    <SiteShell>
      <AdminDiscountForm mode="create" />
    </SiteShell>
  );
}
