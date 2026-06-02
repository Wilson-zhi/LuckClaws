import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { collectionConfigs } from "@/data/collections";

const config = collectionConfigs.sale;

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription
};

export default function SalePage() {
  return <CollectionPage config={config} />;
}
