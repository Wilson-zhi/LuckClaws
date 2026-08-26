import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { brandName } from "@/data/products";
import { getPublicCollectionConfigBySlug } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

type CollectionRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: CollectionRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const config = await getPublicCollectionConfigBySlug(slug);

  if (!config) {
    return createSeoMetadata({
      title: `Collection Not Found | ${brandName}`,
      description: "This LUCK CLAWS collection could not be found.",
      path: `/collections/${slug}`,
      noIndex: true
    });
  }

  return createSeoMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: config.href
  });
}

export default async function DynamicCollectionPage({ params }: CollectionRouteProps) {
  const { slug } = await params;
  const config = await getPublicCollectionConfigBySlug(slug);

  if (!config) {
    notFound();
  }

  return <CollectionPage config={config} />;
}
