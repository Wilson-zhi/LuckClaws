import type { Metadata } from "next";
import { AdminNewsletter } from "@/components/admin/AdminNewsletter";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Newsletter | ${brandName}`,
    description: "Manage LUCK CLAWS newsletter subscribers.",
    path: "/admin/newsletter",
    noIndex: true
  })
};

export default function AdminNewsletterPage() {
  return (
    <SiteShell>
      <AdminNewsletter />
    </SiteShell>
  );
}
