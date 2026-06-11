import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { getPublicCollectionConfigForSlug } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicCollectionConfigForSlug("beds-blankets", "bedsBlankets");

  return createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: "/collections/beds-and-blankets"
  });
}

export default async function BedsAndBlanketsCollectionPage() {
  return <CollectionPage config={await getPublicCollectionConfigForSlug("beds-blankets", "bedsBlankets")} />;
}
