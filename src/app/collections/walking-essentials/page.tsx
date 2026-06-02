import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { collectionConfigs } from "@/data/collections";

const config = collectionConfigs.walkingEssentials;

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription
};

export default function WalkingEssentialsCollectionPage() {
  return <CollectionPage config={config} />;
}
