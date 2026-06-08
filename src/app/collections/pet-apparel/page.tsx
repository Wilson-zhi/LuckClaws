import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { getPublicCollectionConfigForSlug } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicCollectionConfigForSlug("pet-apparel", "petApparel");

  return createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: config.href
  });
}

export default async function PetApparelCollectionPage() {
  return <CollectionPage config={await getPublicCollectionConfigForSlug("pet-apparel", "petApparel")} />;
}
