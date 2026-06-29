"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { type Product } from "@/data/products";
import { getProductPath } from "@/lib/product-links";
import { formatPrice } from "@/lib/utils";

type HomeProductDiscoveryProps = {
  featuredProduct: Product;
  products: Product[];
};

type DiscoveryTabKey = "featured" | "best" | "new";

const discoveryTabs: Array<{
  key: DiscoveryTabKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    key: "featured",
    label: "Featured",
    eyebrow: "The daily edit",
    title: "Focused picks for the routines that happen every day.",
    description: "A tighter edit of practical products for play, walks, rest, and comfort."
  },
  {
    key: "best",
    label: "Best Sellers",
    eyebrow: "Most chosen",
    title: "Easy choices for repeat daily use.",
    description: "Popular essentials selected for clear comparison and everyday usefulness."
  },
  {
    key: "new",
    label: "New Arrivals",
    eyebrow: "Fresh finds",
    title: "Newer picks for better pet routines.",
    description: "Recently added products and seasonal updates for dogs, cats, and modern homes."
  }
];

function fallbackProductImage(product: Product) {
  const normalized = `${product.name} ${product.slug} ${product.category}`.toLowerCase();

  if (normalized.includes("puzzle")) {
    return "/images/premium-puzzle-feeder.jpg";
  }

  if (normalized.includes("snuffle")) {
    return "/images/interactive-snuffle-mat-lifestyle.jpg";
  }

  if (normalized.includes("cat")) {
    return "/images/organic-catnip-mouse.jpg";
  }

  if (normalized.includes("walk") || normalized.includes("leash") || normalized.includes("harness")) {
    return "/images/category-walking-essentials.jpg";
  }

  if (normalized.includes("apparel") || normalized.includes("sweater") || normalized.includes("tee")) {
    return "/images/category-pet-apparel.jpg";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "/images/category-beds-blankets.jpg";
  }

  return "/images/category-dog-toys.jpg";
}

function productStory(product: Product) {
  const text = (product.shortDescription || product.description || "").trim();

  if (!text || text.length < 40 || /^\d+$/.test(text.replace(/\s+/g, ""))) {
    return "A practical, polished pick for everyday pet routines, selected to make play, comfort, and product comparison feel simpler.";
  }

  return text;
}

function uniqueBySlug(products: Product[]) {
  return Array.from(new Map(products.map((product) => [product.slug, product])).values());
}

export function HomeProductDiscovery({ featuredProduct, products }: HomeProductDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<DiscoveryTabKey>("featured");
  const activeTabContent = discoveryTabs.find((tab) => tab.key === activeTab) ?? discoveryTabs[0];
  const tabProducts = useMemo(() => {
    if (activeTab === "best") {
      return uniqueBySlug(products.length ? products : [featuredProduct]);
    }

    if (activeTab === "new") {
      const newProducts = products.filter(
        (product) => product.isNew || product.badge?.toLowerCase().includes("new")
      );

      return uniqueBySlug(newProducts.length ? newProducts : [...products].reverse());
    }

    return uniqueBySlug([featuredProduct, ...products]);
  }, [activeTab, featuredProduct, products]);
  const activeProduct = tabProducts[0] ?? featuredProduct;
  const href = getProductPath(activeProduct);
  const supportingProducts = tabProducts
    .filter((product) => product.slug !== activeProduct.slug)
    .slice(0, 4);
  const benefits = activeProduct.benefits?.length
    ? activeProduct.benefits.slice(0, 3)
    : ["Useful for daily routines", "Clear product details before checkout", "Chosen for play, rest, or comfort"];

  return (
    <section id="best-sellers" className="bg-[#F3E5D2] py-14 md:py-20">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {activeTabContent.eyebrow}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {activeTabContent.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-[#6B5540] md:text-base">
              {activeTabContent.description}
            </p>
          </div>
          <div className="flex w-full gap-2 overflow-x-auto rounded-full border border-[#E0C39C] bg-[#FFF8ED]/75 p-1 shadow-soft hide-scrollbar md:w-auto">
            {discoveryTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`min-w-max rounded-full px-5 py-2.5 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  activeTab === tab.key
                    ? "bg-[#2C1A0D] text-white shadow-soft"
                    : "text-[#6B4A2F] hover:bg-white hover:text-primary"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="grid overflow-hidden rounded-[2rem] border border-[#E3C9A8] bg-[#FFF9EF] shadow-lift md:grid-cols-[0.95fr_1.05fr] lg:grid-cols-1">
            <Link
              href={href}
              className="group relative min-h-[360px] overflow-hidden bg-[#F7EAD8] md:min-h-[460px]"
            >
              {activeProduct.badge && (
                <span className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
                  {activeProduct.badge}
                </span>
              )}
              <Image
                src={fallbackProductImage(activeProduct)}
                alt={activeProduct.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
              />
            </Link>

            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {activeProduct.category}
              </p>
              <Link
                href={href}
                className="mt-3 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <h3 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#24170E] md:text-4xl">
                  {activeProduct.name}
                </h3>
              </Link>
              <p className="mt-4 text-sm leading-6 text-[#6B5540] md:text-base">
                {productStory(activeProduct)}
              </p>
              <p className="mt-5 font-heading text-3xl font-extrabold text-primary">
                {formatPrice(activeProduct.price)}
              </p>
              <ul className="mt-6 grid gap-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm font-semibold leading-6 text-[#4E3928]">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-extrabold text-on-primary-container transition hover:-translate-y-0.5 hover:bg-[#C87500] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              >
                View Product
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </div>
          </article>

          {supportingProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
              {supportingProducts.map((product) => (
                <ProductCard key={product.id} product={product} itemListName="Homepage Everyday Edit" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
