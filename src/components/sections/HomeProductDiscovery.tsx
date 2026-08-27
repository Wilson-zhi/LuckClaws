"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { type Product } from "@/data/products";
import { trackSelectItem } from "@/lib/ga4-ecommerce";
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
    label: "The edit",
    eyebrow: "Everyday edit",
    title: "A few useful things, clearly shown.",
    description: "Practical picks for play, walks, rest, and the routines in between."
  },
  {
    key: "best",
    label: "Most chosen",
    eyebrow: "Most chosen",
    title: "The products pet homes return to.",
    description: "Popular essentials selected for everyday usefulness and easy comparison."
  },
  {
    key: "new",
    label: "Just in",
    eyebrow: "New arrivals",
    title: "Fresh finds for familiar routines.",
    description: "Recently added products for dogs, cats, walks, play, comfort, and rest."
  }
];

function fallbackProductImage(product: Product) {
  const normalized = `${product.name} ${product.slug} ${product.category}`.toLowerCase();

  if (normalized.includes("puzzle")) return "/images/premium-puzzle-feeder.jpg";
  if (normalized.includes("snuffle")) return "/images/interactive-snuffle-mat-lifestyle.jpg";
  if (normalized.includes("cat")) return "/images/organic-catnip-mouse.jpg";
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

function productImage(product: Product) {
  const image = product.image.trim();
  const normalized = image.toLowerCase();
  return !image || normalized.includes("icon") || normalized.includes("logo")
    ? fallbackProductImage(product)
    : image;
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
  const visibleProducts = tabProducts.slice(0, 4);

  return (
    <section id="best-sellers" className="home-editorial-products scroll-mt-24">
      <div className="section-shell">
        <header className="home-editorial-products-heading">
          <div>
            <p className="home-editorial-kicker">{activeTabContent.eyebrow}</p>
            <h2>{activeTabContent.title}</h2>
          </div>
          <div>
            <p>{activeTabContent.description}</p>
            <div className="home-editorial-product-tabs" role="tablist" aria-label="Product edit">
              {discoveryTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  data-active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="home-editorial-product-shelf" role="tabpanel" aria-live="polite">
          {visibleProducts.map((product, index) => {
            const href = getProductPath(product);

            return (
              <article key={`${activeTab}-${product.id}`} className="advisor-recommendation-enter">
                <Link
                  href={href}
                  className="home-editorial-product-image group"
                  onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                >
                  {(product.badge || product.isNew) && (
                    <span>{product.badge ?? "New"}</span>
                  )}
                  <Image
                    src={productImage(product)}
                    alt={product.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 42vw, 78vw"
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none"
                  />
                </Link>
                <div className="home-editorial-product-copy">
                  <p>{product.category}</p>
                  <Link
                    href={href}
                    onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                  >
                    <h3>{product.name}</h3>
                  </Link>
                  <div>
                    <span>
                      <strong>{formatPrice(product.price)}</strong>
                      {product.regularPrice && <small>{formatPrice(product.regularPrice)}</small>}
                    </span>
                    <AddToCartButton product={product} variant="icon">
                      <Plus aria-hidden className="h-5 w-5" />
                    </AddToCartButton>
                  </div>
                  <Link
                    href={href}
                    className="group"
                    onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                  >
                    <span>View product</span>
                    <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <Link href="/collections" className="home-editorial-products-all group">
          <span>Browse all products</span>
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </div>
    </section>
  );
}
