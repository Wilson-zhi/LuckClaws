import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { collectionConfigs } from "@/data/collections";

const config = collectionConfigs.all;

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription
};

export default function CollectionsPage() {
  return <CollectionPage config={config} />;
}
