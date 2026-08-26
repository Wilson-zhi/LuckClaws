import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SearchPageContent } from "@/components/search/SearchPageContent";
import { brandName, mainProduct } from "@/data/products";
import { getPublicHeaderNavigationItems, getPublicProducts } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Search Pet Products | ${brandName}`,
    description:
      "Search LUCK CLAWS pet toys, apparel, walking essentials, beds, blankets, and enrichment products.",
    path: "/search"
  })
};

export const revalidate = 60;

export default async function SearchPage() {
  const [products, navigationItems] = await Promise.all([
    getPublicProducts(),
    getPublicHeaderNavigationItems()
  ]);

  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent
        products={products}
        featuredProductSlug={mainProduct.slug}
        navigationItems={navigationItems}
      />
    </Suspense>
  );
}

function SearchPageFallback() {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-14">
        <h1 className="font-heading text-4xl font-extrabold md:text-5xl">Search LUCK CLAWS</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-on-surface-variant">
          Find pet toys, apparel, walking essentials, beds, blankets, and everyday favorites.
        </p>
      </section>
    </SiteShell>
  );
}
