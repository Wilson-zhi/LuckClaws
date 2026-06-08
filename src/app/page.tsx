import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  Leaf,
  Lock,
  Package as PackageIcon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon
} from "lucide-react";
import { ViewItemListTracker } from "@/components/analytics/EcommerceEventTrackers";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { HomeFeaturedProduct } from "@/components/sections/HomeFeaturedProduct";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName, categories } from "@/data/products";
import { type HomepageTrustBadgeIconKey } from "@/lib/homepage-content";
import { getPublicHomepageSettings } from "@/lib/homepage-settings";
import { getPublicHomepageProducts } from "@/lib/public-product-data";
import { absoluteUrl, createSeoMetadata, iconPath } from "@/lib/seo";
import { freeShippingLabel } from "@/lib/shipping";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `${brandName} | Premium Pet Toys, Apparel & Everyday Essentials`,
    description:
      "Shop thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
    path: "/",
    openGraphTitle: `${brandName} | Premium Pet Essentials`,
    openGraphDescription:
      "Thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
    twitterTitle: `${brandName} | Premium Pet Essentials`,
    twitterDescription: "Thoughtfully designed pet essentials for playful pets and modern pet parents."
  })
};

export const dynamic = "force-dynamic";

const homepageTrustIconMap = {
  truck: Truck,
  shield: ShieldCheck,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  package: PackageIcon,
  check: CheckCircle2,
  rotate: RotateCcw,
  lock: Lock
} as const satisfies Record<HomepageTrustBadgeIconKey, LucideIcon>;

function homepageTrustIcon(icon: HomepageTrustBadgeIconKey) {
  return homepageTrustIconMap[icon] ?? ShieldCheck;
}

const valueHighlights = [
  {
    title: "Designed for everyday routines",
    text: "Products are selected for daily play, walks, rest, and enrichment.",
    Icon: Sparkles
  },
  {
    title: "Clear shopping paths",
    text: "Browse by pet need, product category, or current offers without dead-end links.",
    Icon: ArrowRight
  },
  {
    title: "Support when you need it",
    text: "Order and product questions can be sent to support@luckclaws.com.",
    Icon: Heart
  }
];

export default async function HomePage() {
  const [{ featuredProduct, featuredProducts, bestSellers, newArrivals }, homepageSettings] = await Promise.all([
    getPublicHomepageProducts(),
    getPublicHomepageSettings()
  ]);
  const { hero } = homepageSettings;
  const topTrustItems: CompactTrustItem[] = homepageSettings.trustBadges.map((badge) => ({
    key: badge.key,
    label: badge.title,
    Icon: homepageTrustIcon(badge.icon)
  }));
  const primaryButtonLink = hero.primaryButtonLink || featuredProduct.productUrl;
  const secondaryButtonLink = hero.secondaryButtonLink || "/collections";
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(iconPath),
    sameAs: []
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <ViewItemListTracker products={[featuredProduct]} itemListName="Homepage Featured Product" />
      <ViewItemListTracker products={featuredProducts} itemListName="Homepage Featured Products" />
      <ViewItemListTracker products={bestSellers} itemListName="Homepage Best Sellers" />
      <ViewItemListTracker products={newArrivals} itemListName="Homepage New Arrivals" />
      <section className="section-shell grid min-h-[620px] items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {hero.eyebrow}
          </span>
          <h1 className="mt-5 max-w-xl font-heading text-4xl font-extrabold leading-tight md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-on-surface-variant">
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryButtonLink}
              className="rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              {hero.primaryButtonText}
            </Link>
            <Link
              href={secondaryButtonLink}
              className="rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold text-on-surface transition hover:border-primary hover:text-primary"
            >
              {hero.secondaryButtonText}
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-[#F9E7D0] md:-inset-5" />
          <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-lift">
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              width={720}
              height={760}
              priority
              className="h-[420px] w-full object-cover md:h-[560px]"
            />
          </div>
          <div className="absolute bottom-8 left-0 flex -translate-x-4 items-center gap-3 rounded-md bg-white px-4 py-3 shadow-ambient">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF1FF] text-tertiary">
              <Award aria-hidden className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold">{hero.featuredLabel}</p>
              <p className="text-on-surface-variant">{hero.featuredText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-4">
        <CompactTrustBar items={topTrustItems} columns="wide" className="section-shell" />
      </section>

      <section className="section-shell py-10 md:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Curated For Every Pet</h2>
          <Link href="/collections" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            Explore All Collections <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
        <Link href="/collections" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary md:hidden">
          Explore All Collections <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </section>

      <HomeFeaturedProduct product={featuredProduct} />

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold">Featured Products</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Handpicked pet essentials for play, comfort, walks, and everyday care.
            </p>
          </div>
          <Link href="/collections" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            Shop All <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} itemListName="Homepage Featured Products" />
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="section-shell">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold">Our Best Sellers</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              A focused selection of toys, apparel, walking gear, and comfort essentials.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} itemListName="Homepage Best Sellers" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">New Arrivals</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Discover the latest premium additions to our collection.
            </p>
          </div>
          <Link href="/collections" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            Shop All New <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} itemListName="Homepage New Arrivals" />
          ))}
        </div>
      </section>

      <TrustBadges />

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold">Built for Easier Shopping</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Clear product paths, practical details, and support-focused pages for launch.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {valueHighlights.map(({ title, text, Icon }) => (
            <article key={title} className="rounded-md bg-surface-container-lowest p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <NewsletterSignup />

      <section className="section-shell pt-14 md:pt-20">
        <div className="grid gap-4 rounded-lg bg-surface-container-lowest p-6 shadow-soft md:grid-cols-3 md:p-8">
          <div className="flex items-center gap-4">
            <Sparkles aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">Thoughtful everyday enrichment</p>
          </div>
          <div className="flex items-center gap-4">
            <Truck aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">{freeShippingLabel}</p>
          </div>
          <div className="flex items-center gap-4">
            <Award aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">Premium feel, pet-first comfort</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
