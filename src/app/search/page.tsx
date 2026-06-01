import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchFilterChips } from "@/components/search/SearchFilterChips";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName, searchProducts } from "@/data/products";

export const metadata: Metadata = {
  title: `Search Results for toys | ${brandName}`,
  description: "Search results for premium pet toys from LUCK CLAWS."
};

export default function SearchPage() {
  const [featured, ...rest] = searchProducts;

  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr] lg:items-end">
          <div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
              Showing results for <br /> &quot;toys&quot;
            </h1>
            <p className="mt-3 text-lg text-on-surface-variant">
              We found 42 items matching your search.
            </p>
          </div>
          <SearchFilterChips />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1.1fr]">
          <ProductCard product={featured} featured />
          <div className="grid grid-cols-2 gap-6">
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            className="rounded-full border-2 border-outline px-8 py-3 font-heading font-bold transition hover:border-primary hover:text-primary"
          >
            Load More Results
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
