import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Orders | ${brandName}`,
    description: "Review LUCK CLAWS admin order basics.",
    path: "/admin/orders",
    noIndex: true
  })
};

export default function AdminOrdersPage() {
  return (
    <SiteShell>
      <AdminOrders />
    </SiteShell>
  );
}
