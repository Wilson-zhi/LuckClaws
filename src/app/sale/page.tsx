import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { collectionConfigs } from "@/data/collections";
import { getPublicCollectionConfig } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

const config = collectionConfigs.sale;

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: config.href
  })
};

export const revalidate = 60;

export default async function SalePage() {
  return <CollectionPage config={await getPublicCollectionConfig("sale")} />;
}
