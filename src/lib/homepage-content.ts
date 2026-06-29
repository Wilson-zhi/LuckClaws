import { freeShippingLabel } from "@/lib/shipping";

export const homepageHeroSettingKey = "home_hero";
export const homepageTrustBadgesSettingKey = "home_trust_badges";
export const homepageCategorySectionSettingKey = "home_category_section";

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
  imageUrl: string;
  imageAlt: string;
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
  imageUrl: "/images/hero-dog-running.jpg",
  imageAlt: "A happy dog running through grass, representing LUCK CLAWS pet essentials.",
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

const homepageTrustBadgeIconSet = new Set<string>(homepageTrustBadgeIconKeys);
const homepageCategorySectionLayoutSet = new Set<string>(["grid_4", "carousel"]);

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

function normalizeHomepageCategorySectionLayout(value: unknown): HomepageCategorySectionLayout {
  const layout = cleanString(value);

  return homepageCategorySectionLayoutSet.has(layout) ? (layout as HomepageCategorySectionLayout) : "grid_4";
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
    imageUrl: stringFromRecord(record, ["imageUrl", "image_url", "heroImageUrl", "hero_image_url"], defaultHomepageHero.imageUrl),
    imageAlt: stringFromRecord(
      record,
      ["imageAlt", "image_alt", "heroImageAlt", "hero_image_alt"],
      defaultHomepageHero.imageAlt
    ),
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
    imageUrl: hero.imageUrl.trim(),
    imageAlt: hero.imageAlt.trim(),
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
