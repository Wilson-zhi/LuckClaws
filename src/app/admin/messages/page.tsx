import type { Metadata } from "next";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Messages | ${brandName}`,
    description: "Manage LUCK CLAWS customer support messages.",
    path: "/admin/messages",
    noIndex: true
  })
};

export default function AdminMessagesPage() {
  return (
    <SiteShell>
      <AdminMessages />
    </SiteShell>
  );
}
