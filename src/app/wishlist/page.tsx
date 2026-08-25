import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { WishlistPageContent } from "@/components/wishlist/WishlistPageContent";
import { brandName } from "@/data/products";
import { getPublicProducts } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Wishlist | ${brandName}`,
    description: "Review products saved to your LUCK CLAWS wishlist.",
    path: "/wishlist",
    noIndex: true
  })
};

export default async function WishlistPage() {
  const products = await getPublicProducts();

  return (
    <SiteShell>
      <WishlistPageContent products={products} />
    </SiteShell>
  );
}
