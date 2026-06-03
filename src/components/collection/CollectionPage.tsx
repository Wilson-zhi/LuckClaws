import Link from "next/link";
import { ArrowRight, Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ViewItemListTracker } from "@/components/analytics/EcommerceEventTrackers";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { type CollectionConfig } from "@/data/collections";

type CollectionPageProps = {
  config: CollectionConfig;
};

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

export function CollectionPage({ config }: CollectionPageProps) {
  const categoryOptions = config.mobileFilters.map((filter) =>
    filter === "Interactive" ? "Interactive & Puzzles" : filter
  );
  const productCountLabel = config.productCountLabel ?? `${config.products.length} products`;
  const itemListName = `${config.title} Collection`;
  const featuredProduct = config.featuredProductId
    ? config.products.find((product) => product.id === config.featuredProductId)
    : undefined;
  const gridProducts = featuredProduct
    ? config.products.filter((product) => product.id !== featuredProduct.id)
    : config.products;

  return (
    <SiteShell>
      <ViewItemListTracker products={config.products} itemListName={itemListName} />
      <section className="section-shell py-10 md:py-14">
        <nav className="text-sm font-semibold text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-3" aria-hidden>
            /
          </span>
          <Link href="/collections" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-3" aria-hidden>
            /
          </span>
          <span className="text-on-surface">{config.title}</span>
        </nav>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold md:text-5xl">{config.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-on-surface-variant">
              {config.description}
            </p>
            {config.primaryCtaHref && config.primaryCtaLabel && (
              <Link
                href={config.primaryCtaHref}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                {config.primaryCtaLabel}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3 text-sm font-semibold text-on-surface-variant sm:flex-row sm:items-end sm:gap-6">
            <span>{productCountLabel}</span>
            <span className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface-variant shadow-soft">
              Sorted by Featured
            </span>
          </div>
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

      <section id="products" className="section-shell flex gap-10 py-12 md:py-16">
        <FilterSidebar categoryOptions={categoryOptions} />
        <div className="min-w-0 flex-1">
          <div className="mb-6 lg:hidden">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-on-surface">Browse by</p>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar" aria-label="Collection browsing cues">
              {config.mobileFilters.map((filter, index) => (
                <span
                  key={filter}
                  className={
                    index === 0
                      ? "shrink-0 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container"
                      : "shrink-0 rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant"
                  }
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {featuredProduct && (
            <div className="mb-8">
              <ProductCard
                product={featuredProduct}
                featured
                itemListName={itemListName}
                badgeLabel={config.featuredLabel}
              />
            </div>
          )}

          {gridProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {gridProducts.map((product) => (
                <ProductCard key={product.id} product={product} itemListName={itemListName} />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-lg bg-surface-container-lowest p-6 shadow-soft">
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
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
