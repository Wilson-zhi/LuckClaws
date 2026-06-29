"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Sparkles, Star } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { type Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductTabKey = "featured" | "best-sellers" | "new-arrivals";

type HomeProductDiscoveryProps = {
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
};

type DiscoveryTab = {
  key: ProductTabKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  itemListName: string;
  Icon: typeof Sparkles;
  products: Product[];
};

export function HomeProductDiscovery({
  featuredProducts,
  bestSellers,
  newArrivals
}: HomeProductDiscoveryProps) {
  const tabs: DiscoveryTab[] = [
    {
      key: "featured",
      label: "Featured",
      eyebrow: "Editor's route",
      title: "Start with the essentials worth noticing.",
      description:
        "A focused set of active picks for daily enrichment, easier routines, and comfortable home moments.",
      ctaLabel: "Shop Featured",
      itemListName: "Homepage Featured Products",
      Icon: Sparkles,
      products: featuredProducts
    },
    {
      key: "best-sellers",
      label: "Best Sellers",
      eyebrow: "Proven favorites",
      title: "Popular picks for everyday pet households.",
      description:
        "Products customers tend to compare first when shopping for play, walking, rest, and comfort.",
      ctaLabel: "Shop Best Sellers",
      itemListName: "Homepage Best Sellers",
      Icon: Star,
      products: bestSellers
    },
    {
      key: "new-arrivals",
      label: "New Arrivals",
      eyebrow: "Fresh finds",
      title: "Newer additions without the browsing clutter.",
      description:
        "Recent active products presented in one place so returning shoppers can scan what changed.",
      ctaLabel: "Shop New Arrivals",
      itemListName: "Homepage New Arrivals",
      Icon: Clock3,
      products: newArrivals
    }
  ];
  const [activeTab, setActiveTab] = useState<ProductTabKey>("featured");
  const active = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const visibleProducts = active.products.slice(0, 4);

  if (tabs.every((tab) => tab.products.length === 0)) {
    return null;
  }

  return (
    <section className="bg-[#FFF8EF] py-14 md:py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.84fr_1.36fr] lg:items-start">
          <div className="rounded-lg border border-[#EAD4B8] bg-white/80 p-5 shadow-soft md:p-7 lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Sparkles aria-hidden className="h-4 w-4" />
              Product discovery
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              Everyday favorites, organized by routine.
            </h2>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant md:text-base">
              Browse selected products by intent: featured picks, proven favorites, or newer arrivals.
            </p>

            <div
              className="mt-6 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
              role="tablist"
              aria-label="Homepage product groups"
            >
              {tabs.map((tab) => {
                const selected = tab.key === active.key;
                const Icon = tab.Icon;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={cn(
                      "flex min-w-max items-center justify-between gap-4 rounded-md border px-4 py-3 text-left text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:min-w-0",
                      selected
                        ? "border-primary bg-primary-container text-on-primary-container shadow-soft"
                        : "border-outline-variant bg-white text-on-surface hover:-translate-y-0.5 hover:border-primary hover:text-primary motion-reduce:hover:translate-y-0"
                    )}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </span>
                    <span className="text-xs font-semibold opacity-75">{tab.products.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{active.eyebrow}</p>
                <h3 className="mt-2 max-w-2xl font-heading text-2xl font-bold md:text-3xl">{active.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">{active.description}</p>
              </div>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-x-0"
              >
                {active.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} itemListName={active.itemListName} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
