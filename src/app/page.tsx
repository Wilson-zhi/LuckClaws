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
import { HomeDecisionGuide } from "@/components/sections/HomeDecisionGuide";
import { HomePosterHero } from "@/components/sections/HomePosterHero";
import { HomeProductDiscovery } from "@/components/sections/HomeProductDiscovery";
import { HomeRoutineRoute } from "@/components/sections/HomeRoutineRoute";
import { HomeRoutineStrip } from "@/components/sections/HomeRoutineStrip";
import { HomeStorySection } from "@/components/sections/HomeStorySection";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { type HomepageTrustBadgeIconKey } from "@/lib/homepage-content";
import { getPublicHomepageSettings } from "@/lib/homepage-settings";
import {
  getPublicHeaderNavigationItems,
  getPublicHomepageCategories,
  getPublicHomepageProducts
} from "@/lib/public-product-data";
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
  const normalized = title.toLowerCase();

  if (
    !title ||
    normalized === "thoughtfully designed pet essentials" ||
    title === "Thoughtfully Designed Pet Essentials for Happier Dogs & Cats" ||
    title === "Pet essentials for play, walks, rest, and everyday comfort." ||
    title === "Pet essentials for everyday routines." ||
    title === "Everyday pet essentials, styled for real life."
  ) {
    return "Pet essentials for daily rituals.";
  }

  return title;
}

function polishedHeroSubtitle(value: string) {
  const subtitle = value.trim();

  if (
    !subtitle ||
    subtitle ===
      "Shop toys, apparel, walking gear, beds, blankets, and everyday pet supplies chosen for play, walks, rest, and comfort." ||
    subtitle ===
      "Shop enrichment toys, cozy apparel, walking essentials, beds, blankets, and everyday favorites made for modern pet parents."
  ) {
    return "Toys, walking gear, apparel, beds, and thoughtful everyday picks for dogs, cats, and the homes they live in.";
  }

  return subtitle;
}

function polishedHeroImageUrl(value: string) {
  const imageUrl = value.trim();
  const normalized = imageUrl.toLowerCase();

  if (
    !imageUrl ||
    normalized.includes("icon") ||
    normalized.includes("logo") ||
    normalized.endsWith("/images/hero-dog.jpg")
  ) {
    return "/images/hero-dog-running.jpg";
  }

  return imageUrl;
}

function polishedHeroImageAlt(value: string) {
  const imageAlt = value.trim();

  return imageAlt && !imageAlt.toLowerCase().includes("logo")
    ? imageAlt
    : "A happy dog running outdoors, styled as a warm LUCK CLAWS pet lifestyle hero image.";
}

function localHeroVideoExists() {
  return existsSync(join(process.cwd(), "public", "media", "home-hero.mp4"));
}

function localHeroVideoUrl() {
  return "/media/home-hero.mp4";
}

function homepageTrustLabel(key: string, label: string) {
  const normalized = `${key} ${label}`.toLowerCase();

  if (normalized.includes("shipping") || normalized.includes("free shipping")) {
    return freeShippingLabel;
  }

  return label;
}

export default async function HomePage() {
  const [{ featuredProduct, bestSellers }, homepageSettings, navigationItems] = await Promise.all([
    getPublicHomepageProducts(),
    getPublicHomepageSettings(),
    getPublicHeaderNavigationItems()
  ]);
  const { hero, categorySection, storySection, decisionGuide, servicePromises, newsletter } = homepageSettings;
  const heroEyebrow = polishedHeroEyebrow(hero.eyebrow);
  const heroTitle = polishedHeroTitle(hero.title);
  const heroSubtitle = polishedHeroSubtitle(hero.subtitle);
  const heroImageUrl = polishedHeroImageUrl(hero.imageUrl);
  const heroImageAlt = polishedHeroImageAlt(hero.imageAlt);
  const savedHeroVideoUrl = hero.videoUrl.trim();
  const homepageCategories = await getPublicHomepageCategories(categorySection);
  const heroProductTiles = [featuredProduct, ...bestSellers.filter((product) => product.slug !== featuredProduct.slug)].slice(0, 2);
  const fallbackHeroVideoUrl = localHeroVideoExists() ? localHeroVideoUrl() : "";
  const heroVideoUrl = savedHeroVideoUrl || fallbackHeroVideoUrl;
  const hasHeroVideo = hero.mediaMode === "video" && Boolean(heroVideoUrl);
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
      : "Find a Routine";
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(iconPath),
    sameAs: []
  };

  return (
    <SiteShell navigationItems={navigationItems}>
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
        imageUrl={heroImageUrl}
        imageAlt={heroImageAlt}
        videoUrl={heroVideoUrl}
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

      <section className="bg-[linear-gradient(180deg,#3B2616_0%,#8A6743_38%,#F3E5D2_100%)] pb-7 pt-8">
        <CompactTrustBar items={topTrustItems} columns="wide" className="section-shell" />
      </section>

      <HomeDecisionGuide guide={decisionGuide} />

      <HomeRoutineRoute categories={homepageCategories} />

      <HomeStorySection story={storySection} />

      <HomeProductDiscovery featuredProduct={featuredProduct} products={bestSellers} />

      <TrustBadges section={servicePromises} />

      <NewsletterSignup content={newsletter} />
    </SiteShell>
  );
}
