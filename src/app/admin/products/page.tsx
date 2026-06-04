import type { Metadata } from "next";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Products | ${brandName}`,
    description: "Prepare LUCK CLAWS product management tools.",
    path: "/admin/products",
    noIndex: true
  })
};

export default function AdminProductsPage() {
  return (
    <SiteShell>
      <AdminProducts />
    </SiteShell>
  );
}
