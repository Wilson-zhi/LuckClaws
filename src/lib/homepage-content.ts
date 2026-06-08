import { freeShippingLabel } from "@/lib/shipping";

export const homepageHeroSettingKey = "home_hero";
export const homepageTrustBadgesSettingKey = "home_trust_badges";

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

export type HomepageTrustBadgesValue = {
  active: boolean;
  items: HomepageTrustBadge[];
};

export const defaultHomepageHero: HomepageHeroContent = {
  eyebrow: "Premium Pet Essentials",
  title: "Thoughtfully Designed Pet Essentials for Happier Dogs & Cats",
  subtitle:
    "Shop enrichment toys, cozy apparel, walking essentials, beds, blankets, and everyday favorites made for modern pet parents.",
  primaryButtonText: "Shop Best Sellers",
  primaryButtonLink: "",
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

const homepageTrustBadgeIconSet = new Set<string>(homepageTrustBadgeIconKeys);

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordFromUnknown(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function arrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value : [];
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
