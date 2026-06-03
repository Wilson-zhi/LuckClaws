"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, RotateCcw, Search, ShieldCheck, Star, Truck } from "lucide-react";
import { ViewItemListTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchFilterChips } from "@/components/search/SearchFilterChips";
import { mainProduct, products, type Product } from "@/data/products";
import { trackSearch, trackSelectItem } from "@/lib/ga4-ecommerce";
import { getProductPath } from "@/lib/product-links";
import { formatPrice } from "@/lib/utils";

const trustItems = [
  { label: "Free shipping over $50", Icon: Truck },
  { label: "30-day easy returns", Icon: RotateCcw },
  { label: "Secure checkout", Icon: ShieldCheck },
  { label: "Pet-conscious materials", Icon: Heart }
];

const collectionLinks = [
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" },
  { label: "Pet Apparel", href: "/collections/pet-apparel" },
  { label: "Walking Essentials", href: "/collections/walking-essentials" },
  { label: "Beds & Blankets", href: "/collections/beds-blankets" },
  { label: "Sale", href: "/sale" }
];

const emptyStateLinks = [
  { label: "Shop All", href: "/collections" },
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" }
];

const popularSearches = ["snuffle mat", "dog toys", "cat toys", "harness", "pet bed"];

function normalizeSearchTerm(value: string) {
  return value.trim().toLowerCase();
}

function getSearchText(product: Product) {
  return [
    product.name,
    product.category,
    product.subcategory,
    product.description,
    product.badge,
    product.selectedColor,
    product.material,
    product.materialTags?.join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getResultsSummary(count: number, query: string) {
  if (count === 0) {
    return "No products found";
  }

  if (!query) {
    return `Showing all ${count} ${count === 1 ? "product" : "products"}`;
  }

  return `Showing ${count} ${count === 1 ? "result" : "results"} for "${query}"`;
}

function searchHref(searchTerm: string) {
  return `/search?q=${encodeURIComponent(searchTerm)}`;
}

function FeaturedSearchResult({
  product,
  itemListName
}: {
  product: Product;
  itemListName: string;
}) {
  const productHref = getProductPath(product);
  const handleSelect = () => trackSelectItem(product, itemListName);

  return (
    <article className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-ambient">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <Link
          href={productHref}
          className="relative block min-h-[320px] overflow-hidden bg-surface-container md:min-h-[420px]"
          onClick={handleSelect}
          aria-label={`View ${product.name}`}
        >
          <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
            Save 25%
          </span>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Featured result</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {product.category}
              </p>
            </div>
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-container-low text-on-surface-variant"
              aria-hidden
            >
              <Heart aria-hidden className="h-5 w-5" />
            </span>
          </div>

          <Link
            href={productHref}
            className="mt-3 font-heading text-3xl font-extrabold leading-tight hover:text-primary md:text-4xl"
            onClick={handleSelect}
          >
            {product.name}
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star aria-hidden className="h-4 w-4 fill-primary-container text-primary-container" />
              {product.rating}
            </span>
            <span>{product.reviewCount} reviews</span>
            {product.selectedColor && <span>Color: {product.selectedColor}</span>}
          </div>

          <p className="mt-4 text-base leading-7 text-on-surface-variant">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="font-heading text-3xl font-bold text-error">{formatPrice(product.price)}</p>
            {product.regularPrice && (
              <p className="text-base text-on-surface-variant line-through">
                {formatPrice(product.regularPrice)}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={productHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary-container/10"
              onClick={handleSelect}
            >
              View Product
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}

function SearchEmptyState() {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-6 shadow-soft md:p-8">
      <h2 className="font-heading text-3xl font-bold">No products found</h2>
      <p className="mt-3 max-w-2xl text-on-surface-variant">
        Try a different search term or explore our most-loved collections.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {emptyStateLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full bg-primary-container px-5 py-3 text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-7 border-t border-outline-variant pt-5">
        <p className="text-sm font-bold uppercase tracking-wide text-on-surface">Popular searches</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={searchHref(term)}
              className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCollections() {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-6 shadow-soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Explore More Collections</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Continue browsing toys, apparel, walking gear, comfort essentials, and selected offers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {collectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(query);

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => getSearchText(product).includes(normalizedQuery));
  }, [query]);

  const itemListName = query ? `Search Results - ${query}` : "Search Results";
  const featuredProduct = filteredProducts.find((product) => product.id === mainProduct.id);
  const resultProducts = filteredProducts.filter((product) => product.id !== mainProduct.id);
  const resultsSummary = getResultsSummary(filteredProducts.length, query);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = searchValue.trim();

    if (!nextQuery) {
      router.push("/search");
      return;
    }

    trackSearch(nextQuery);
    router.push(searchHref(nextQuery));
  };

  return (
    <SiteShell>
      <ViewItemListTracker products={filteredProducts} itemListName={itemListName} />

      <section className="section-shell py-10 md:py-14">
        <nav className="text-sm font-semibold text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-3" aria-hidden>
            /
          </span>
          <span className="text-on-surface">Search</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
              {query ? `Search results for "${query}"` : "Search LUCK CLAWS"}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-on-surface-variant">
              Find pet toys, apparel, walking essentials, beds, blankets, and everyday favorites
              for dogs and cats.
            </p>
          </div>

          <form className="rounded-lg bg-surface-container-lowest p-4 shadow-soft" onSubmit={handleSubmit}>
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="site-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search toys, apparel, beds, walking essentials..."
                  className="h-12 w-full rounded-full border border-outline-variant bg-white pl-12 pr-4 text-base text-on-surface shadow-soft focus:border-primary focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-full bg-primary-container px-7 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                Search
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold text-on-surface-variant" aria-live="polite">
              {resultsSummary}
            </p>
          </form>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-on-surface">
            Quick collection links
          </p>
          <SearchFilterChips />
        </div>
      </section>

      <section className="bg-surface-container-low py-4">
        <div className="section-shell grid grid-cols-2 gap-3 md:grid-cols-4">
          {trustItems.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex min-h-14 items-center gap-3 rounded-md bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant shadow-soft"
            >
              <Icon aria-hidden className="h-5 w-5 shrink-0 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-16">
        {filteredProducts.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <div className="space-y-8">
            {featuredProduct && (
              <FeaturedSearchResult product={featuredProduct} itemListName={itemListName} />
            )}

            {resultProducts.length > 0 && (
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Product Results</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">{resultsSummary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                  {resultProducts.map((product) => (
                    <ProductCard key={product.id} product={product} itemListName={itemListName} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <RelatedCollections />
        </div>
      </section>
    </SiteShell>
  );
}
