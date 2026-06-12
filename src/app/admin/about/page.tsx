import type { Metadata } from "next";
import { AdminAboutSettings } from "@/components/admin/AdminAboutSettings";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin About | ${brandName}`,
    description: "Manage LUCK CLAWS About page content.",
    path: "/admin/about",
    noIndex: true
  })
};

export default function AdminAboutPage() {
  return (
    <SiteShell>
      <AdminAboutSettings />
    </SiteShell>
  );
}
