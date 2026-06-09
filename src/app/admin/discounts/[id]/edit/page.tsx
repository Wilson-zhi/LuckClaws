import type { Metadata } from "next";
import { AdminDiscountForm } from "@/components/admin/AdminDiscountForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type EditDiscountPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Edit Discount | ${brandName}`,
    description: "Edit a LUCK CLAWS discount code.",
    path: "/admin/discounts",
    noIndex: true
  })
};

export default async function EditDiscountPage({ params }: EditDiscountPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminDiscountForm mode="edit" discountId={id} />
    </SiteShell>
  );
}
