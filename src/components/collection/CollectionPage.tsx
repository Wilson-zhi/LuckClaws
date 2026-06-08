"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Heart, ShieldCheck, SlidersHorizontal, Truck, X } from "lucide-react";
import { ViewItemListTracker } from "@/components/analytics/EcommerceEventTrackers";
import { FilterControls, FilterSidebar, type FilterOption } from "@/components/collection/FilterSidebar";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { type CollectionConfig } from "@/data/collections";
import { type Product } from "@/data/products";
import { freeShippingLabel } from "@/lib/shipping";

type CollectionPageProps = {
  config: CollectionConfig;
};

const allFilterValue = "__all__";

const priceRanges = [
  { label: "Under $15", value: "under-15" },
  { label: "$15 - $30", value: "15-30" },
  { label: "$30 - $50", value: "30-50" },
  { label: "Over $50", value: "over-50" }
] satisfies FilterOption[];

const trustItems: CompactTrustItem[] = [
  { key: "shipping", label: freeShippingLabel, Icon: Truck },
  { key: "support-policy", label: "Damaged or incorrect items covered", Icon: ShieldCheck },
  { key: "secure", label: "Secure checkout", Icon: ShieldCheck },
  { key: "materials", label: "Pet-conscious materials", Icon: Heart }
];

const fallbackCollectionLinks = [
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" },
  { label: "Pet Apparel", href: "/collections/pet-apparel" },
  { label: "Walking Essentials", href: "/collections/walking-essentials" },
  { label: "Beds & Blankets", href: "/collections/beds-blankets" },
  { label: "Sale", href: "/sale" }
];

function normalizeFilterValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function optionLabelToValue(label: string, index: number) {
  return index === 0 && label.toLowerCase().startsWith("all")
    ? allFilterValue
    : normalizeFilterValue(label);
}

function productSearchText(product: Product) {
  return [product.name, product.category, product.subcategory, product.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function productMaterials(product: Product) {
  return [...(product.materialTags ?? []), product.material]
    .filter((material): material is string => Boolean(material))
    .map((material) => material.trim())
    .filter(Boolean);
}

function matchesCategoryFilter(product: Product, selectedCategory: string) {
  if (selectedCategory === allFilterValue) {
    return true;
  }

  if (product.collectionSlug === selectedCategory) {
    return true;
  }

  const text = productSearchText(product);

  switch (selectedCategory) {
    case "dog-toys":
      return product.category === "Dog Toys";
    case "cat-toys":
      return product.category === "Cat Toys";
    case "pet-apparel":
    case "apparel":
      return product.category === "Pet Apparel";
    case "walking":
    case "walking-essentials":
      return product.category === "Walking Essentials";
    case "beds":
    case "beds-blankets":
    case "comfort":
      return product.category === "Beds & Blankets";
    case "interactive":
    case "interactive-puzzles":
      return product.subcategory === "Enrichment Toys" || text.includes("puzzle");
    case "chew-toys":
      return product.subcategory === "Chew Toys" || text.includes("chew");
    case "plush-squeaky":
      return product.subcategory === "Plush & Squeaky" || text.includes("plush") || text.includes("squeak");
    case "fetch-toss":
      return product.subcategory === "Fetch & Toss" || text.includes("fetch") || text.includes("tug");
    case "chase":
      return (product.collectionSlug === "cat-toys" || product.category === "Cat Toys") && (text.includes("chase") || text.includes("feather") || text.includes("wand"));
    case "catnip":
      return (product.collectionSlug === "cat-toys" || product.category === "Cat Toys") && text.includes("catnip");
    case "plush":
      return (product.collectionSlug === "cat-toys" || product.category === "Cat Toys") && (text.includes("plush") || text.includes("mouse"));
    case "enrichment":
      return text.includes("enrichment");
    case "sweaters":
      return (product.collectionSlug === "pet-apparel" || product.category === "Pet Apparel") && text.includes("sweater");
    case "tees":
      return (product.collectionSlug === "pet-apparel" || product.category === "Pet Apparel") && (text.includes("tee") || text.includes("t-shirt"));
    case "cozy-layers":
      return (product.collectionSlug === "pet-apparel" || product.category === "Pet Apparel") && (text.includes("cozy") || text.includes("layer") || text.includes("sweater"));
    case "everyday":
      return (product.collectionSlug === "pet-apparel" || product.category === "Pet Apparel") && text.includes("everyday");
    case "leashes":
      return (product.collectionSlug === "walking-essentials" || product.category === "Walking Essentials") && text.includes("leash");
    case "harnesses":
      return (product.collectionSlug === "walking-essentials" || product.category === "Walking Essentials") && text.includes("harness");
    case "collars":
      return (product.collectionSlug === "walking-essentials" || product.category === "Walking Essentials") && text.includes("collar");
    case "accessories":
      return (product.collectionSlug === "walking-essentials" || product.category === "Walking Essentials") && (text.includes("accessory") || text.includes("pouch"));
    case "blankets":
      return (product.collectionSlug === "beds-blankets" || product.category === "Beds & Blankets") && text.includes("blanket");
    case "rest-mats":
      return (product.collectionSlug === "beds-blankets" || product.category === "Beds & Blankets") && text.includes("mat");
    case "cozy-favorites":
      return (product.collectionSlug === "beds-blankets" || product.category === "Beds & Blankets") && (text.includes("cozy") || text.includes("comfort"));
    default:
      return text.includes(selectedCategory.replace(/-/g, " "));
  }
}

function matchesMaterialFilters(product: Product, selectedMaterials: string[]) {
  if (selectedMaterials.length === 0) {
    return true;
  }

  const materials = productMaterials(product).map(normalizeFilterValue);

  return selectedMaterials.some((selectedMaterial) => materials.includes(selectedMaterial));
}

function matchesPriceFilter(product: Product, selectedPrice: string) {
  switch (selectedPrice) {
    case "under-15":
      return product.price < 15;
    case "15-30":
      return product.price >= 15 && product.price <= 30;
    case "30-50":
      return product.price > 30 && product.price <= 50;
    case "over-50":
      return product.price > 50;
    default:
      return true;
  }
}

function countProducts(products: Product[], predicate: (product: Product) => boolean) {
  return products.reduce((count, product) => count + (predicate(product) ? 1 : 0), 0);
}

function productCountLabel(count: number) {
  return `${count} ${count === 1 ? "product" : "products"}`;
}

export function CollectionPage({ config }: CollectionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(allFilterValue);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState(allFilterValue);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalCount = config.products.length;
  const itemListName = `${config.title} Collection`;
  const collectionLinks = config.exploreLinks ?? fallbackCollectionLinks;

  const categoryOptions = useMemo<FilterOption[]>(
    () => {
      const sourceOptions =
        config.categoryFilterOptions ??
        config.mobileFilters.map((filter, index) => {
          const label = filter === "Interactive" ? "Interactive & Puzzles" : filter;

          return {
            label,
            value: optionLabelToValue(label, index)
          };
        });

      return sourceOptions.map((option) => {
        return {
          ...option,
          count: countProducts(config.products, (product) => matchesCategoryFilter(product, option.value))
        };
      });
    },
    [config.categoryFilterOptions, config.mobileFilters, config.products]
  );

  const materialOptions = useMemo<FilterOption[]>(() => {
    const materialSet = new Map<string, string>();

    config.products.forEach((product) => {
      productMaterials(product).forEach((material) => {
        materialSet.set(normalizeFilterValue(material), material);
      });
    });

    return Array.from(materialSet.entries())
      .map(([value, label]) => ({
        label,
        value,
        count: countProducts(config.products, (product) =>
          productMaterials(product).map(normalizeFilterValue).includes(value)
        )
      }))
      .sort((first, second) => first.label.localeCompare(second.label));
  }, [config.products]);

  const priceOptions = useMemo<FilterOption[]>(
    () =>
      priceRanges.map((range) => ({
        ...range,
        count: countProducts(config.products, (product) => matchesPriceFilter(product, range.value))
      })),
    [config.products]
  );

  const filteredProducts = useMemo(
    () =>
      config.products.filter(
        (product) =>
          matchesCategoryFilter(product, selectedCategory) &&
          matchesMaterialFilters(product, selectedMaterials) &&
          matchesPriceFilter(product, selectedPrice)
      ),
    [config.products, selectedCategory, selectedMaterials, selectedPrice]
  );

  const hasActiveFilters =
    selectedCategory !== allFilterValue || selectedMaterials.length > 0 || selectedPrice !== allFilterValue;
  const featuredProduct = config.featuredProductId
    ? filteredProducts.find((product) => product.id === config.featuredProductId)
    : undefined;
  const gridProducts = featuredProduct
    ? filteredProducts.filter((product) => product.id !== featuredProduct.id)
    : filteredProducts;

  const clearFilters = () => {
    setSelectedCategory(allFilterValue);
    setSelectedMaterials([]);
    setSelectedPrice(allFilterValue);
  };

  const filterProps = {
    categoryOptions,
    materialOptions,
    priceOptions,
    selectedCategory,
    selectedMaterials,
    selectedPrice,
    resultCount: filteredProducts.length,
    totalCount,
    hasActiveFilters,
    onSelectCategory: (value: string) => setSelectedCategory(value),
    onToggleMaterial: (value: string) =>
      setSelectedMaterials((currentMaterials) =>
        currentMaterials.includes(value)
          ? currentMaterials.filter((material) => material !== value)
          : [...currentMaterials, value]
      ),
    onSelectPrice: (value: string) =>
      setSelectedPrice((currentPrice) => (currentPrice === value ? allFilterValue : value)),
    onClearFilters: clearFilters
  };

  return (
    <SiteShell navigationItems={config.headerNavigationItems}>
      <ViewItemListTracker products={filteredProducts} itemListName={itemListName} />
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
            <span aria-live="polite">{productCountLabel(filteredProducts.length)}</span>
            <span className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface-variant shadow-soft">
              Sorted by Featured
            </span>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-4">
        <CompactTrustBar items={trustItems} columns="wide" className="section-shell" />
      </section>

      <section id="products" className="section-shell flex gap-10 py-12 md:py-16">
        <FilterSidebar {...filterProps} />
        <div className="min-w-0 flex-1">
          <div className="mb-6 lg:hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md bg-surface-container-lowest px-4 py-3 text-left font-semibold text-on-surface shadow-soft"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-collection-filters"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal aria-hidden className="h-5 w-5 text-primary" />
                Filters
              </span>
              <span className="text-sm text-on-surface-variant">{productCountLabel(filteredProducts.length)}</span>
            </button>

            {mobileFiltersOpen && (
              <div
                id="mobile-collection-filters"
                className="mt-3 max-h-[75vh] overflow-y-auto rounded-lg bg-surface-container-low p-4 shadow-ambient"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="font-heading text-xl font-bold">Filter Products</p>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-lowest text-on-surface-variant"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                  >
                    <X aria-hidden className="h-5 w-5" />
                  </button>
                </div>
                <FilterControls {...filterProps} />
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-lg bg-surface-container-lowest p-8 text-center shadow-soft">
              <h2 className="font-heading text-3xl font-bold">No products found</h2>
              <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
                Try clearing filters or exploring another collection.
              </p>
              <button
                type="button"
                className="mt-6 rounded-full bg-primary-container px-6 py-3 font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
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
            </>
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
