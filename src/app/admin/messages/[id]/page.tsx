import type { Metadata } from "next";
import { AdminMessageDetail } from "@/components/admin/AdminMessageDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

type AdminMessageDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Admin Message | ${brandName}`,
    description: "Review a LUCK CLAWS customer support message.",
    path: "/admin/messages",
    noIndex: true
  })
};

export default async function AdminMessageDetailPage({ params }: AdminMessageDetailPageProps) {
  const { id } = await params;

  return (
    <SiteShell>
      <AdminMessageDetail messageId={id} />
    </SiteShell>
  );
}
