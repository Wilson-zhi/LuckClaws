import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Customers | ${brandName}`,
    description: "Review LUCK CLAWS customer account basics.",
    path: "/admin/customers",
    noIndex: true
  })
};

export default function AdminCustomersPage() {
  return (
    <SiteShell>
      <AdminCustomers />
    </SiteShell>
  );
}
