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
import { HomeProductDiscovery } from "@/components/sections/HomeProductDiscovery";
import { HomeRoutineRoute } from "@/components/sections/HomeRoutineRoute";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { type HomepageTrustBadgeIconKey } from "@/lib/homepage-content";
import { getPublicHomepageSettings } from "@/lib/homepage-settings";
import { getPublicHomepageCategories, getPublicHomepageProducts } from "@/lib/public-product-data";
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

function polishedHeroEyebrow(value: string) {
  const eyebrow = value.trim();
  const normalized = eyebrow.toLowerCase();

  if (!eyebrow || normalized.includes("premium pete") || normalized === "premium pet essentials") {
    return "PREMIUM PET ESSENTIALS";
  }

  return eyebrow;
}

function homepageTrustLabel(key: string, label: string) {
  const normalized = `${key} ${label}`.toLowerCase();

  if (normalized.includes("shipping") || normalized.includes("free shipping")) {
    return freeShippingLabel;
  }

  return label;
}

export default async function HomePage() {
  const [{ featuredProduct, featuredProducts, bestSellers, newArrivals }, homepageSettings] = await Promise.all([
    getPublicHomepageProducts(),
    getPublicHomepageSettings()
  ]);
  const { hero, categorySection } = homepageSettings;
  const heroEyebrow = polishedHeroEyebrow(hero.eyebrow);
  const homepageCategories = await getPublicHomepageCategories(categorySection);
  const topTrustItems: CompactTrustItem[] = homepageSettings.trustBadges.map((badge) => ({
    key: badge.key,
    label: homepageTrustLabel(badge.key, badge.title),
    Icon: homepageTrustIcon(badge.icon)
  }));
  const primaryButtonLink = hero.primaryButtonLink || featuredProduct.productUrl;
  const secondaryButtonLink = hero.secondaryButtonLink || "/collections";
  const categoryCtaText = categorySection.ctaText || "Explore All Collections";
  const categoryCtaHref = categorySection.ctaHref || "/collections";
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
      <section className="section-shell grid min-h-[620px] items-center gap-10 py-10 md:grid-cols-[0.92fr_1.08fr] md:py-16 lg:gap-14">
        <div className="homepage-enter">
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {heroEyebrow}
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
              className="rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition duration-200 hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              {hero.primaryButtonText}
            </Link>
            <Link
              href={secondaryButtonLink}
              className="rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold text-on-surface transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              {hero.secondaryButtonText}
            </Link>
          </div>
        </div>

        <div className="homepage-enter homepage-enter-delay-2 relative">
          <div className="absolute inset-0 rounded-xl bg-[#F9E7D0] md:-inset-5" />
          <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-lift transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_70px_rgba(25,28,30,0.14)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              width={720}
              height={760}
              priority
              className="h-[420px] w-full object-cover md:h-[560px]"
            />
          </div>
          <div className="absolute bottom-8 left-0 flex -translate-x-4 items-center gap-3 rounded-md bg-white px-4 py-3 shadow-ambient transition duration-300 hover:-translate-x-4 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
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

      <HomeRoutineRoute />

      {categorySection.enabled && homepageCategories.length > 0 && (
        <section className="bg-[#F7EBDD] py-12 md:py-16">
          <div className="section-shell">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Shop by collection</p>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">{categorySection.title}</h2>
              {categorySection.subtitle && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  {categorySection.subtitle}
                </p>
              )}
            </div>
            {categoryCtaText && categoryCtaHref && (
              <Link href={categoryCtaHref} className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
                {categoryCtaText} <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            )}
          </div>
          {categorySection.layout === "carousel" ? (
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              {homepageCategories.map((category) => (
                <div key={category.name} className="min-w-[240px] sm:min-w-[280px] md:min-w-[300px]">
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {homepageCategories.map((category) => (
                <CategoryCard key={category.name} {...category} />
              ))}
            </div>
          )}
          {categoryCtaText && categoryCtaHref && (
            <Link href={categoryCtaHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary md:hidden">
              {categoryCtaText} <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          )}
          </div>
        </section>
      )}

      <HomeProductDiscovery
        featuredProducts={featuredProducts}
        bestSellers={bestSellers}
        newArrivals={newArrivals}
      />

      <TrustBadges />

      <NewsletterSignup />
    </SiteShell>
  );
}
