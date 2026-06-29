import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
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
import { HomePosterHero } from "@/components/sections/HomePosterHero";
import { HomeProductDiscovery } from "@/components/sections/HomeProductDiscovery";
import { HomeRoutineRoute } from "@/components/sections/HomeRoutineRoute";
import { HomeRoutineStrip } from "@/components/sections/HomeRoutineStrip";
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

function polishedHeroTitle(value: string) {
  const title = value.trim();

  if (
    !title ||
    title === "Thoughtfully Designed Pet Essentials for Happier Dogs & Cats" ||
    title === "Pet essentials for play, walks, rest, and everyday comfort." ||
    title === "Pet essentials for everyday routines."
  ) {
    return "Everyday pet essentials, styled for real life.";
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

function localHeroVideoExists() {
  return existsSync(join(process.cwd(), "public", "media", "home-hero.mp4"));
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
  const hasHeroVideo = localHeroVideoExists();
  const topTrustItems: CompactTrustItem[] = homepageSettings.trustBadges.map((badge) => ({
    key: badge.key,
    label: homepageTrustLabel(badge.key, badge.title),
    Icon: homepageTrustIcon(badge.icon)
  }));
  const primaryButtonLink = "/collections";
  const secondaryButtonLink = "#shop-by-routine";
  const primaryButtonText =
    hero.primaryButtonText.trim() && hero.primaryButtonText.trim() !== "Shop Best Sellers"
      ? hero.primaryButtonText.trim()
      : "Shop the Edit";
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
      <HomePosterHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        imageUrl={hero.imageUrl}
        imageAlt={hero.imageAlt}
        primaryButtonText={primaryButtonText}
        primaryButtonLink={primaryButtonLink}
        secondaryButtonText={secondaryButtonText}
        secondaryButtonLink={secondaryButtonLink}
        featuredLabel={hero.featuredLabel}
        featuredText={hero.featuredText}
        hasVideo={hasHeroVideo}
        products={heroProductTiles}
      />

      <HomeRoutineStrip />

      <section className="bg-[#F3E5D2] py-4">
        <CompactTrustBar items={topTrustItems} columns="wide" className="section-shell" />
      </section>

      <HomeRoutineRoute categories={homepageCategories} />

      <HomeProductDiscovery featuredProduct={featuredProduct} products={bestSellers} />

      <TrustBadges />

      <NewsletterSignup />
    </SiteShell>
  );
}
