import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SearchPageContent } from "@/components/search/SearchPageContent";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Search Pet Products | ${brandName}`,
    description:
      "Search LUCK CLAWS pet toys, apparel, walking essentials, beds, blankets, and enrichment products.",
    path: "/search"
  })
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
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
