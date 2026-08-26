import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { getPublicCollectionConfigForSlug } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicCollectionConfigForSlug("dog-toys", "dogToys");

  return createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: config.href
  });
}

export default async function DogToysCollectionPage() {
  return <CollectionPage config={await getPublicCollectionConfigForSlug("dog-toys", "dogToys")} />;
}
