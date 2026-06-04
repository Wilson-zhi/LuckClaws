import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Dashboard | ${brandName}`,
    description: "Manage LUCK CLAWS store operations.",
    path: "/admin",
    noIndex: true
  })
};

export default function AdminPage() {
  return (
    <SiteShell>
      <AdminDashboard />
    </SiteShell>
  );
}
