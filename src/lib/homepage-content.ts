import { freeShippingLabel } from "@/lib/shipping";

export const homepageHeroSettingKey = "home_hero";
export const homepageTrustBadgesSettingKey = "home_trust_badges";
export const homepageCategorySectionSettingKey = "home_category_section";
export const homepageStorySectionSettingKey = "home_story_section";

export const homepageTrustBadgeIconKeys = [
  "truck",
  "shield",
  "heart",
  "star",
  "sparkles",
  "leaf",
  "package",
  "check",
  "rotate",
  "lock"
] as const;

export type HomepageTrustBadgeIconKey = (typeof homepageTrustBadgeIconKeys)[number];

export type HomepageHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  mediaMode: "image" | "video";
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  featuredLabel: string;
  featuredText: string;
};

export type HomepageTrustBadge = {
  key: string;
  icon: HomepageTrustBadgeIconKey;
  title: string;
};

export type HomepageCategorySectionLayout = "grid_4" | "carousel";

export type HomepageCategorySectionContent = {
  enabled: boolean;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  layout: HomepageCategorySectionLayout;
  maxItems: number;
  selectedCategorySlugs: string[];
};

export const homepageStoryIconKeys = [
  "route",
  "search",
  "heart",
  "shield",
  "check",
  "sparkles",
  "truck",
  "package",
  "leaf",
  "lock"
] as const;

export type HomepageStoryIconKey = (typeof homepageStoryIconKeys)[number];

export type HomepageStoryItem = {
  key: string;
  icon: HomepageStoryIconKey;
  title: string;
  text: string;
};

export type HomepageStorySectionContent = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: HomepageStoryItem[];
  ctaLabel: string;
  ctaHref: string;
};

export type HomepageTrustBadgesValue = {
  active: boolean;
  items: HomepageTrustBadge[];
};

export const defaultHomepageHero: HomepageHeroContent = {
  eyebrow: "Premium Pet Essentials",
  title: "Pet essentials for play, walks, rest, and everyday comfort.",
  subtitle:
    "Shop practical toys, apparel, walking gear, beds, blankets, and pet supplies chosen for real daily routines.",
  primaryButtonText: "Shop Best Sellers",
  primaryButtonLink: "/collections",
  secondaryButtonText: "Explore Collections",
  secondaryButtonLink: "/collections",
  mediaMode: "image",
  imageUrl: "/images/hero-dog-running.jpg",
  imageAlt: "A happy dog running through grass, representing LUCK CLAWS pet essentials.",
  videoUrl: "",
  featuredLabel: "Featured Pick",
  featuredText: "Everyday enrichment"
};

export const defaultHomepageTrustBadges: HomepageTrustBadge[] = [
  { key: "shipping", icon: "truck", title: freeShippingLabel },
  { key: "support-policy", icon: "shield", title: "Damaged or incorrect items covered" },
  { key: "secure", icon: "shield", title: "Secure checkout" },
  { key: "materials", icon: "heart", title: "Pet-conscious materials" }
];

export const defaultHomepageCategorySection: HomepageCategorySectionContent = {
  enabled: true,
  title: "Shop by routine",
  subtitle: "Start with what your pet needs next.",
  ctaText: "Explore All Collections",
  ctaHref: "/collections",
  layout: "grid_4",
  maxItems: 4,
  selectedCategorySlugs: ["dog-toys", "cat-toys", "pet-apparel", "walking-essentials"]
};

export const defaultHomepageStorySection: HomepageStorySectionContent = {
  enabled: true,
  eyebrow: "Why LUCK CLAWS",
  title: "Built around everyday pet routines.",
  subtitle:
    "We organize pet essentials by real moments, so shopping feels clearer from the first click.",
  items: [
    {
      key: "routine-first-shopping",
      icon: "route",
      title: "Routine-first shopping",
      text: "Start with play, walks, rest, comfort, or support instead of scrolling through everything."
    },
    {
      key: "clear-product-details",
      icon: "search",
      title: "Clear product details",
      text: "Compare use cases, pricing, and product paths before checkout."
    },
    {
      key: "support-when-needed",
      icon: "heart",
      title: "Support when needed",
      text: "Questions about products or orders can go straight to support."
    }
  ],
  ctaLabel: "Explore Collections",
  ctaHref: "/collections"
};

const homepageTrustBadgeIconSet = new Set<string>(homepageTrustBadgeIconKeys);
const homepageCategorySectionLayoutSet = new Set<string>(["grid_4", "carousel"]);
const homepageStoryIconSet = new Set<string>(homepageStoryIconKeys);

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordFromUnknown(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function arrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function stringArrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value.map((item) => cleanString(item)).filter(Boolean) : undefined;
}

function numberFromUnknown(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function stringFromRecord(record: Record<string, unknown> | null, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = cleanString(record?.[key]);

    if (value) {
      return value;
    }
  }

  return fallback;
}

export function normalizeHomepageTrustBadgeIconKey(value: unknown): HomepageTrustBadgeIconKey {
  const icon = cleanString(value);

  return homepageTrustBadgeIconSet.has(icon) ? (icon as HomepageTrustBadgeIconKey) : "shield";
}

export function normalizeHomepageStoryIconKey(value: unknown): HomepageStoryIconKey {
  const icon = cleanString(value);

  return homepageStoryIconSet.has(icon) ? (icon as HomepageStoryIconKey) : "heart";
}

function normalizeHomepageCategorySectionLayout(value: unknown): HomepageCategorySectionLayout {
  const layout = cleanString(value);

  return homepageCategorySectionLayoutSet.has(layout) ? (layout as HomepageCategorySectionLayout) : "grid_4";
}

function normalizeHomepageHeroMediaMode(value: unknown, videoUrl: string): HomepageHeroContent["mediaMode"] {
  const mediaMode = cleanString(value).toLowerCase();

  if (mediaMode === "video" || mediaMode === "image") {
    return mediaMode;
  }

  return videoUrl ? "video" : defaultHomepageHero.mediaMode;
}

function normalizeHomepageCategoryMaxItems(value: unknown) {
  const parsed = numberFromUnknown(value);

  if (!parsed || parsed < 1) {
    return defaultHomepageCategorySection.maxItems;
  }

  return Math.min(Math.floor(parsed), 12);
}

export function homepageSettingValueIsActive(value: unknown) {
  const record = recordFromUnknown(value);

  if (!record) {
    return true;
  }

  if (record.active === false || record.is_active === false) {
    return false;
  }

  if (typeof record.status === "string" && record.status.trim().toLowerCase() !== "active") {
    return false;
  }

  return true;
}

export function homepageHeroFromValue(value: unknown): HomepageHeroContent {
  const record = recordFromUnknown(value);
  const videoUrl = stringFromRecord(record, ["videoUrl", "video_url", "heroVideoUrl", "hero_video_url"], defaultHomepageHero.videoUrl);

  return {
    eyebrow: stringFromRecord(record, ["eyebrow", "heroEyebrow", "hero_eyebrow"], defaultHomepageHero.eyebrow),
    title: stringFromRecord(record, ["title", "heroTitle", "hero_title"], defaultHomepageHero.title),
    subtitle: stringFromRecord(record, ["subtitle", "heroSubtitle", "hero_subtitle"], defaultHomepageHero.subtitle),
    primaryButtonText: stringFromRecord(
      record,
      ["primaryButtonText", "primary_button_text"],
      defaultHomepageHero.primaryButtonText
    ),
    primaryButtonLink: stringFromRecord(
      record,
      ["primaryButtonHref", "primary_button_href", "primaryButtonLink", "primary_button_link"],
      defaultHomepageHero.primaryButtonLink
    ),
    secondaryButtonText: stringFromRecord(
      record,
      ["secondaryButtonText", "secondary_button_text"],
      defaultHomepageHero.secondaryButtonText
    ),
    secondaryButtonLink: stringFromRecord(
      record,
      ["secondaryButtonHref", "secondary_button_href", "secondaryButtonLink", "secondary_button_link"],
      defaultHomepageHero.secondaryButtonLink
    ),
    mediaMode: normalizeHomepageHeroMediaMode(record?.mediaMode ?? record?.media_mode, videoUrl),
    imageUrl: stringFromRecord(record, ["imageUrl", "image_url", "heroImageUrl", "hero_image_url"], defaultHomepageHero.imageUrl),
    imageAlt: stringFromRecord(
      record,
      ["imageAlt", "image_alt", "heroImageAlt", "hero_image_alt"],
      defaultHomepageHero.imageAlt
    ),
    videoUrl,
    featuredLabel: stringFromRecord(
      record,
      ["featuredLabel", "featured_label"],
      defaultHomepageHero.featuredLabel
    ),
    featuredText: stringFromRecord(record, ["featuredText", "featured_text"], defaultHomepageHero.featuredText)
  };
}

export function homepageTrustBadgesFromValue(value: unknown): HomepageTrustBadge[] {
  const record = recordFromUnknown(value);
  const items = arrayFromUnknown(record?.items ?? value)
    .map((item, index): HomepageTrustBadge | null => {
      const itemRecord = recordFromUnknown(item);
      const title = stringFromRecord(itemRecord, ["title", "label", "text"], "");

      if (!itemRecord || !title) {
        return null;
      }

      return {
        key: cleanString(itemRecord.key) || `trust-badge-${index + 1}`,
        icon: normalizeHomepageTrustBadgeIconKey(itemRecord.icon),
        title
      };
    })
    .filter((item): item is HomepageTrustBadge => Boolean(item));

  return items.length > 0 ? items : defaultHomepageTrustBadges;
}

export function homepageCategorySectionFromValue(value: unknown): HomepageCategorySectionContent {
  const record = recordFromUnknown(value);
  const selectedCategorySlugs =
    stringArrayFromUnknown(record?.selectedCategorySlugs) ??
    stringArrayFromUnknown(record?.selected_category_slugs) ??
    defaultHomepageCategorySection.selectedCategorySlugs;

  return {
    enabled: record?.enabled === false ? false : defaultHomepageCategorySection.enabled,
    title: stringFromRecord(record, ["title"], defaultHomepageCategorySection.title),
    subtitle: stringFromRecord(record, ["subtitle"], defaultHomepageCategorySection.subtitle),
    ctaText: stringFromRecord(record, ["ctaText", "cta_text"], defaultHomepageCategorySection.ctaText),
    ctaHref: stringFromRecord(record, ["ctaHref", "cta_href"], defaultHomepageCategorySection.ctaHref),
    layout: normalizeHomepageCategorySectionLayout(record?.layout),
    maxItems: normalizeHomepageCategoryMaxItems(record?.maxItems ?? record?.max_items),
    selectedCategorySlugs
  };
}

export function homepageStorySectionFromValue(value: unknown): HomepageStorySectionContent {
  const record = recordFromUnknown(value);
  const items = arrayFromUnknown(record?.items)
    .map((item, index): HomepageStoryItem | null => {
      const itemRecord = recordFromUnknown(item);
      const title = stringFromRecord(itemRecord, ["title"], "");
      const text = stringFromRecord(itemRecord, ["text", "description"], "");

      if (!itemRecord || !title || !text) {
        return null;
      }

      return {
        key: cleanString(itemRecord.key) || `story-item-${index + 1}`,
        icon: normalizeHomepageStoryIconKey(itemRecord.icon),
        title,
        text
      };
    })
    .filter((item): item is HomepageStoryItem => Boolean(item));

  return {
    enabled: record?.enabled === false ? false : defaultHomepageStorySection.enabled,
    eyebrow: stringFromRecord(record, ["eyebrow", "label"], defaultHomepageStorySection.eyebrow),
    title: stringFromRecord(record, ["title"], defaultHomepageStorySection.title),
    subtitle: stringFromRecord(record, ["subtitle", "description"], defaultHomepageStorySection.subtitle),
    items: items.length > 0 ? items : defaultHomepageStorySection.items,
    ctaLabel: stringFromRecord(record, ["ctaLabel", "cta_label"], defaultHomepageStorySection.ctaLabel),
    ctaHref: stringFromRecord(record, ["ctaHref", "cta_href"], defaultHomepageStorySection.ctaHref)
  };
}

export function buildHomepageHeroValue(hero: HomepageHeroContent) {
  return {
    active: true,
    eyebrow: hero.eyebrow.trim(),
    title: hero.title.trim(),
    subtitle: hero.subtitle.trim(),
    primaryButtonText: hero.primaryButtonText.trim(),
    primaryButtonHref: hero.primaryButtonLink.trim(),
    primaryButtonLink: hero.primaryButtonLink.trim(),
    secondaryButtonText: hero.secondaryButtonText.trim(),
    secondaryButtonHref: hero.secondaryButtonLink.trim(),
    secondaryButtonLink: hero.secondaryButtonLink.trim(),
    mediaMode: hero.mediaMode,
    imageUrl: hero.imageUrl.trim(),
    imageAlt: hero.imageAlt.trim(),
    videoUrl: hero.videoUrl.trim(),
    featuredLabel: hero.featuredLabel.trim(),
    featuredText: hero.featuredText.trim()
  };
}

export function buildHomepageTrustBadgesValue(badges: HomepageTrustBadge[]): HomepageTrustBadgesValue {
  return {
    active: true,
    items: badges
      .map((badge, index) => ({
        key: badge.key.trim() || `trust-badge-${index + 1}`,
        icon: normalizeHomepageTrustBadgeIconKey(badge.icon),
        title: badge.title.trim()
      }))
      .filter((badge) => badge.title)
  };
}

export function buildHomepageCategorySectionValue(categorySection: HomepageCategorySectionContent) {
  return {
    active: true,
    enabled: categorySection.enabled,
    title: categorySection.title.trim(),
    subtitle: categorySection.subtitle.trim(),
    ctaText: categorySection.ctaText.trim(),
    ctaHref: categorySection.ctaHref.trim(),
    layout: normalizeHomepageCategorySectionLayout(categorySection.layout),
    maxItems: normalizeHomepageCategoryMaxItems(categorySection.maxItems),
    selectedCategorySlugs: categorySection.selectedCategorySlugs.map((slug) => slug.trim()).filter(Boolean)
  };
}

export function buildHomepageStorySectionValue(storySection: HomepageStorySectionContent) {
  return {
    active: true,
    enabled: storySection.enabled,
    eyebrow: storySection.eyebrow.trim(),
    title: storySection.title.trim(),
    subtitle: storySection.subtitle.trim(),
    items: storySection.items
      .map((item, index) => ({
        key: item.key.trim() || `story-item-${index + 1}`,
        icon: normalizeHomepageStoryIconKey(item.icon),
        title: item.title.trim(),
        text: item.text.trim()
      }))
      .filter((item) => item.title && item.text),
    ctaLabel: storySection.ctaLabel.trim(),
    ctaHref: storySection.ctaHref.trim()
  };
}
