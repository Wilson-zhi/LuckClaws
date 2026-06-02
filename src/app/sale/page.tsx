import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { collectionConfigs } from "@/data/collections";
import { createSeoMetadata } from "@/lib/seo";

const config = collectionConfigs.sale;

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: config.href
  })
};

export default function SalePage() {
  return <CollectionPage config={config} />;
}
