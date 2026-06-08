import type { Metadata } from "next";
import { AdminHomepageSettings } from "@/components/admin/AdminHomepageSettings";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Homepage | ${brandName}`,
    description: "Manage LUCK CLAWS homepage content.",
    path: "/admin/homepage",
    noIndex: true
  })
};

export default function AdminHomepagePage() {
  return (
    <SiteShell>
      <AdminHomepageSettings />
    </SiteShell>
  );
}
