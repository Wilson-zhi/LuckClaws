import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/product/ProductDetailTemplate";
import { brandName, mainProduct } from "@/data/products";
import { getPublicProductBySlug, getPublicRelatedProducts } from "@/lib/public-product-data";
import { getProductPathBySlug } from "@/lib/product-links";
import { createProductMetadata } from "@/lib/product-seo";
import { createSeoMetadata } from "@/lib/seo";

type ProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return createSeoMetadata({
      title: `Product Not Found | ${brandName}`,
      description: "This LUCK CLAWS product could not be found.",
      path: getProductPathBySlug(slug),
      noIndex: true
    });
  }

  return createProductMetadata(product);
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product || product.slug === mainProduct.slug) {
    notFound();
  }

  return <ProductDetailTemplate product={product} relatedProducts={await getPublicRelatedProducts(product)} />;
}
