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
import { HomeFeaturedStory } from "@/components/sections/HomeFeaturedStory";
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
import { formatPrice } from "@/lib/utils";

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

function polishedHeroTitle(value: string) {
  const title = value.trim();

  if (
    !title ||
    title === "Thoughtfully Designed Pet Essentials for Happier Dogs & Cats" ||
    title === "Pet essentials for play, walks, rest, and everyday comfort."
  ) {
    return "Pet essentials for everyday routines.";
  }

  return title;
}

function polishedHeroSubtitle(value: string) {
  const subtitle = value.trim();

  if (
    !subtitle ||
    subtitle ===
      "Shop enrichment toys, cozy apparel, walking essentials, beds, blankets, and everyday favorites made for modern pet parents."
  ) {
    return "Shop toys, apparel, walking gear, beds, blankets, and everyday pet supplies chosen for play, walks, rest, and comfort.";
  }

  return subtitle;
}

function homepageTrustLabel(key: string, label: string) {
  const normalized = `${key} ${label}`.toLowerCase();

  if (normalized.includes("shipping") || normalized.includes("free shipping")) {
    return freeShippingLabel;
  }

  return label;
}

export default async function HomePage() {
  const [{ featuredProduct, bestSellers }, homepageSettings] = await Promise.all([
    getPublicHomepageProducts(),
    getPublicHomepageSettings()
  ]);
  const { hero, categorySection } = homepageSettings;
  const heroEyebrow = polishedHeroEyebrow(hero.eyebrow);
  const heroTitle = polishedHeroTitle(hero.title);
  const heroSubtitle = polishedHeroSubtitle(hero.subtitle);
  const homepageCategories = await getPublicHomepageCategories(categorySection);
  const heroProductTiles = [featuredProduct, ...bestSellers.filter((product) => product.slug !== featuredProduct.slug)].slice(0, 2);
  const topTrustItems: CompactTrustItem[] = homepageSettings.trustBadges.map((badge) => ({
    key: badge.key,
    label: homepageTrustLabel(badge.key, badge.title),
    Icon: homepageTrustIcon(badge.icon)
  }));
  const primaryButtonLink =
    hero.primaryButtonLink && hero.primaryButtonLink !== "/collections" ? hero.primaryButtonLink : "#best-sellers";
  const secondaryButtonLink =
    hero.secondaryButtonLink && hero.secondaryButtonLink !== "/collections"
      ? hero.secondaryButtonLink
      : "#shop-by-routine";
  const primaryButtonText = hero.primaryButtonText.trim() || "Shop Best Sellers";
  const secondaryButtonText =
    hero.secondaryButtonText.trim() && hero.secondaryButtonText.trim() !== "Explore Collections"
      ? hero.secondaryButtonText.trim()
      : "Shop by Routine";
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
      <ViewItemListTracker products={bestSellers} itemListName="Homepage Best Sellers" />
      <section className="section-shell grid min-h-[680px] items-center gap-10 py-10 md:grid-cols-[0.88fr_1.12fr] md:py-16 lg:gap-16">
        <div className="homepage-enter">
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {heroEyebrow}
          </span>
          <h1 className="mt-5 max-w-2xl font-heading text-4xl font-extrabold leading-[1.04] tracking-tight text-[#24170E] md:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#6B5540] md:text-lg">
            {heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#6B4210]">
            {["Clear product paths", "Secure checkout", "Support when needed"].map((chip) => (
              <span key={chip} className="rounded-full border border-[#E5C99F] bg-white/70 px-3 py-2 shadow-soft">
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryButtonLink}
              className="group inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition duration-200 hover:-translate-y-0.5 hover:bg-[#C87500] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              {primaryButtonText}
              <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
            </Link>
            <Link
              href={secondaryButtonLink}
              className="rounded-full border border-[#B8976D] bg-white/70 px-6 py-3 text-sm font-bold text-[#4B2E17] transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-white hover:text-primary hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>

        <div className="homepage-enter homepage-enter-delay-2 relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[#F4D9AE] md:-inset-5" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#F7EAD8] shadow-lift transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_70px_rgba(68,43,20,0.16)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              width={720}
              height={760}
              priority
              className="h-[460px] w-full object-cover md:h-[620px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#28180B]/42 via-transparent to-transparent" />
          </div>
          <div className="absolute left-0 top-8 flex -translate-x-4 items-center gap-3 rounded-lg border border-[#E5C99F] bg-white/95 px-4 py-3 shadow-ambient transition duration-300 hover:-translate-x-4 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF1CF] text-primary">
              <Award aria-hidden className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold">{hero.featuredLabel}</p>
              <p className="text-on-surface-variant">{hero.featuredText}</p>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 grid w-[min(360px,calc(100%-2.5rem))] gap-3">
            {heroProductTiles.map((product) => (
              <Link
                key={product.id}
                href={product.productUrl}
                className="group flex items-center gap-3 rounded-xl border border-white/75 bg-white/94 p-3 shadow-ambient transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F7EAD8]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="64px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold uppercase tracking-wide text-primary">
                    {product.category}
                  </span>
                  <span className="mt-1 block truncate font-heading text-sm font-bold text-[#24170E]">
                    {product.name}
                  </span>
                </span>
                <span className="shrink-0 font-heading text-sm font-extrabold text-primary">
                  {formatPrice(product.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F3E5D2] py-4">
        <CompactTrustBar items={topTrustItems} columns="wide" className="section-shell" />
      </section>

      <HomeRoutineRoute categories={homepageCategories} />

      <HomeFeaturedStory product={featuredProduct} />

      <HomeProductDiscovery products={bestSellers} />

      <TrustBadges />

      <NewsletterSignup />
    </SiteShell>
  );
}
