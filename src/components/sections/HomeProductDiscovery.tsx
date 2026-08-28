"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Pause,
  PawPrint,
  Play,
  Plus,
  Sparkles,
  type LucideIcon
} from "lucide-react";
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
  titleLines: [string, string, string];
  handNote: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    key: "featured",
    label: "The edit",
    eyebrow: "Everyday edit",
    title: "A few useful things, clearly shown.",
    titleLines: ["A few useful", "things,", "clearly shown."],
    handNote: "pick, play, repeat",
    description: "Practical picks for play, walks, rest, and the routines in between.",
    icon: PawPrint
  },
  {
    key: "best",
    label: "Most chosen",
    eyebrow: "Most chosen",
    title: "The products pet homes return to.",
    titleLines: ["The products", "pet homes", "return to."],
    handNote: "pack favorites",
    description: "Popular essentials selected for everyday usefulness and easy comparison.",
    icon: Flame
  },
  {
    key: "new",
    label: "Just in",
    eyebrow: "New arrivals",
    title: "Fresh finds for familiar routines.",
    titleLines: ["Fresh finds", "for familiar", "routines."],
    handNote: "new tricks inside",
    description: "Recently added products for dogs, cats, walks, play, comfort, and rest.",
    icon: Sparkles
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

function priceParts(value: number) {
  const [whole, fraction = "00"] = value.toFixed(2).split(".");

  return {
    whole: Number(whole).toLocaleString("en-US"),
    fraction
  };
}

export function HomeProductDiscovery({ featuredProduct, products }: HomeProductDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<DiscoveryTabKey>("featured");
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const shelfRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
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
  const visibleProducts = tabProducts.slice(0, 8);

  const scrollToProduct = useCallback(
    (requestedIndex: number, behavior: ScrollBehavior = "smooth") => {
      const shelf = shelfRef.current;
      if (!shelf || visibleProducts.length === 0) return;

      const nextIndex = (requestedIndex + visibleProducts.length) % visibleProducts.length;
      const cards = shelf.querySelectorAll<HTMLElement>("[data-product-card]");
      const card = cards[nextIndex];
      if (!card) return;

      shelf.scrollTo({ left: card.offsetLeft - shelf.offsetLeft, behavior });
      setActiveIndex(nextIndex);
    },
    [visibleProducts.length]
  );

  useEffect(() => {
    setActiveIndex(0);
    shelfRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeTab]);

  useEffect(() => {
    if (!autoPlay || isInteracting || visibleProducts.length < 2) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      scrollToProduct(activeIndex + 1);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeIndex, autoPlay, isInteracting, scrollToProduct, visibleProducts.length]);

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    []
  );

  const handleShelfScroll = () => {
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const shelf = shelfRef.current;
      if (!shelf) return;

      const cards = Array.from(shelf.querySelectorAll<HTMLElement>("[data-product-card]"));
      if (!cards.length) return;

      const closestIndex = cards.reduce(
        (bestIndex, card, index) =>
          Math.abs(card.offsetLeft - shelf.scrollLeft) <
          Math.abs(cards[bestIndex].offsetLeft - shelf.scrollLeft)
            ? index
            : bestIndex,
        0
      );

      setActiveIndex(closestIndex);
    });
  };

  return (
    <section id="best-sellers" className="home-editorial-products scroll-mt-24">
      <div className="section-shell">
        <header className="home-editorial-products-heading home-editorial-motion-reveal">
          <div className="home-editorial-product-title-art">
            <p className="home-editorial-kicker">{activeTabContent.eyebrow}</p>
            <h2 aria-label={activeTabContent.title}>
              <span data-title-line="lead">{activeTabContent.titleLines[0]}</span>
              <span data-title-line="sticker">{activeTabContent.titleLines[1]}</span>
              <strong data-title-line="finish">{activeTabContent.titleLines[2]}</strong>
              <em>{activeTabContent.handNote}</em>
            </h2>
            <span className="home-editorial-product-title-stamp" aria-hidden="true">
              <PawPrint />
              <span>
                <strong>Handpicked</strong>
                <small>for real routines</small>
              </span>
            </span>
          </div>
          <div className="home-editorial-product-mode">
            <div className="home-editorial-product-mode-intro">
              <span aria-hidden="true">
                <Sparkles />
              </span>
              <div>
                <small>Pick a shelf</small>
                <strong>How do you want to browse?</strong>
                <p>{activeTabContent.description}</p>
              </div>
            </div>
            <div className="home-editorial-product-tabs" role="tablist" aria-label="Product edit">
              {discoveryTabs.map((tab, index) => {
                const TabIcon = tab.icon;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    data-active={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span aria-hidden="true">
                      <TabIcon />
                    </span>
                    <span>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <strong>{tab.label}</strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div
          className="home-editorial-product-carousel"
          aria-roledescription="carousel"
          aria-label={`${activeTabContent.label} products`}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsInteracting(false);
            }
          }}
        >
          <div className="home-editorial-product-toolbar">
            <p aria-live="polite">
              <small>On the shelf</small>
              <strong>
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <i aria-hidden="true">of</i>
                <span>{String(visibleProducts.length).padStart(2, "0")}</span>
              </strong>
            </p>
            <div aria-label="Product carousel controls">
              <button
                type="button"
                aria-label={autoPlay ? "Pause product carousel" : "Play product carousel"}
                aria-pressed={!autoPlay}
                onClick={() => setAutoPlay((current) => !current)}
              >
                {autoPlay ? <Pause aria-hidden /> : <Play aria-hidden />}
              </button>
              <button type="button" aria-label="Previous product" onClick={() => scrollToProduct(activeIndex - 1)}>
                <ArrowLeft aria-hidden />
              </button>
              <button type="button" aria-label="Next product" onClick={() => scrollToProduct(activeIndex + 1)}>
                <ArrowRight aria-hidden />
              </button>
            </div>
          </div>

          <div className="home-editorial-product-window">
            <div
              ref={shelfRef}
              className="home-editorial-product-shelf"
              role="tabpanel"
              aria-live={autoPlay ? "off" : "polite"}
              onScroll={handleShelfScroll}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onPointerCancel={() => setIsInteracting(false)}
            >
              {visibleProducts.map((product, index) => {
                const href = getProductPath(product);
                const price = priceParts(product.price);

                return (
                  <article
                    key={`${activeTab}-${product.id}`}
                    data-product-card
                    data-active={activeIndex === index}
                    className="advisor-recommendation-enter"
                  >
                    <Link
                      href={href}
                      className="home-editorial-product-image group"
                      onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                    >
                      {(product.badge || product.isNew) && (
                        <span className="home-editorial-product-badge">{product.badge ?? "New"}</span>
                      )}
                      <span className="home-editorial-product-pick" aria-hidden="true">
                        <small>Pick</small>
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
                      <div className="home-editorial-product-meta">
                        <p>{product.category}</p>
                        <span>{activeTabContent.label}</span>
                      </div>
                      <Link
                        href={href}
                        className="home-editorial-product-name"
                        onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                      >
                        <h3>{product.name}</h3>
                      </Link>
                      <div className="home-editorial-product-purchase">
                        <span
                          className="home-editorial-product-price"
                          aria-label={`Price ${formatPrice(product.price)}`}
                        >
                          <small>Pick price</small>
                          <span className="home-editorial-product-price-lockup" aria-hidden="true">
                            <i>$</i>
                            <strong>{price.whole}</strong>
                            <sup>.{price.fraction}</sup>
                          </span>
                          {product.regularPrice && <del>{formatPrice(product.regularPrice)}</del>}
                        </span>
                        <AddToCartButton
                          product={product}
                          variant="icon"
                          className="home-editorial-product-cart"
                        >
                          <Plus aria-hidden className="h-5 w-5" />
                        </AddToCartButton>
                      </div>
                      <Link
                        href={href}
                        className="home-editorial-product-view group"
                        onClick={() => trackSelectItem(product, "Homepage Everyday Edit")}
                      >
                        <span>
                          <small>Take a closer look</small>
                          <strong>View this pick</strong>
                        </span>
                        <i aria-hidden="true">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                        </i>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="home-editorial-product-pagination" aria-label="Choose a product slide">
            {visibleProducts.map((product, index) => (
              <button
                key={`${activeTab}-dot-${product.id}`}
                type="button"
                aria-label={`Show ${product.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => scrollToProduct(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>

        <Link href="/collections" className="home-editorial-products-all group">
          <span>Browse all products</span>
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </div>
    </section>
  );
}
