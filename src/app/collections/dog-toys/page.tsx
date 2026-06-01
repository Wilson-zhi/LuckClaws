import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName, collectionProducts } from "@/data/products";

export const metadata: Metadata = {
  title: `Dog Toys | ${brandName}`,
  description:
    "Shop durable, interactive, and beautifully designed dog toys from LUCK CLAWS."
};

export default function DogToysCollectionPage() {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-14">
        <nav className="text-sm font-semibold text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-3">›</span>
          <span>Shop</span>
          <span className="mx-3">›</span>
          <span className="text-on-surface">Dog Toys</span>
        </nav>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold md:text-5xl">Dog Toys</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-on-surface-variant">
              Keep your furry friend entertained with our curated selection of durable, interactive,
              and beautifully designed toys. Built to last and styled for your home.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-on-surface-variant">
            <span>24 products</span>
            <button
              type="button"
              className="inline-flex min-w-52 items-center justify-between gap-6 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-3 text-base font-normal text-on-surface shadow-soft"
            >
              Featured <ChevronDown aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="section-shell flex gap-10 pb-16 md:pb-24">
        <FilterSidebar />
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden hide-scrollbar">
            {["All Dog Toys", "Interactive", "Chew Toys", "Plush & Squeaky", "Fetch & Toss"].map(
              (filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    index === 0
                      ? "shrink-0 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container"
                      : "shrink-0 rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant"
                  }
                >
                  {filter}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              type="button"
              className="rounded-full border-2 border-primary px-8 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
            >
              Load More Toys
            </button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

