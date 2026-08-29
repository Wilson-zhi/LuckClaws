import { freeShippingLabel } from "@/lib/shipping";

export const homepageHeroSettingKey = "home_hero";
export const homepageTrustBadgesSettingKey = "home_trust_badges";
export const homepageCategorySectionSettingKey = "home_category_section";
export const homepageStorySectionSettingKey = "home_story_section";
export const homepageDecisionGuideSettingKey = "home_decision_guide";
export const homepageServicePromisesSettingKey = "home_service_promises";
export const homepageNewsletterSettingKey = "home_newsletter";

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

export const homepageDecisionGuideIconKeys = ["paw", "route", "bed", "help", "search", "heart"] as const;

export type HomepageDecisionGuideIconKey = (typeof homepageDecisionGuideIconKeys)[number];

export type HomepageDecisionGuideLink = {
  label: string;
  href: string;
};

export type HomepageDecisionGuideOption = {
  key: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: HomepageDecisionGuideIconKey;
  details: string[];
  links: HomepageDecisionGuideLink[];
};

export type HomepageDecisionGuideStep = {
  number: string;
  title: string;
  text: string;
};

export type HomepageDecisionGuideContent = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  stepsTitle: string;
  stepsBadge: string;
  routineTags: string[];
  steps: HomepageDecisionGuideStep[];
  options: HomepageDecisionGuideOption[];
};

export type HomepageServicePromise = {
  key: string;
  icon: HomepageTrustBadgeIconKey;
  title: string;
  text: string;
};

export type HomepageServicePromisesContent = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: HomepageServicePromise[];
};

export type HomepageNewsletterContent = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  offerText: string;
  successTitle: string;
  successMessage: string;
  editButtonText: string;
  placeholder: string;
  buttonText: string;
  submittingText: string;
  noteText: string;
  duplicateMessage: string;
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

export const defaultHomepageDecisionGuide: HomepageDecisionGuideContent = {
  enabled: true,
  eyebrow: "Routine advisor",
  title: "Choose by moment, not by aisle.",
  subtitle: "Start with what your pet needs today, then follow a shorter path to the products that make sense.",
  stepsTitle: "From moment to match",
  stepsBadge: "3 quick moves",
  routineTags: ["Play", "Walk", "Rest", "Support"],
  steps: [
    {
      number: "01",
      title: "Read the moment",
      text: "Name what your pet needs now: play, a walk, rest, or a little help."
    },
    {
      number: "02",
      title: "Follow the shortlist",
      text: "Jump straight to the few categories that fit instead of scanning every aisle."
    },
    {
      number: "03",
      title: "Choose with a why",
      text: "Compare useful picks, understand the fit, and choose with more confidence."
    }
  ],
  options: [
    {
      key: "play",
      label: "Energy to spend",
      eyebrow: "Play path",
      title: "Start with toys that make daily energy easier to direct.",
      description:
        "For chewing, chasing, sniffing, pouncing, and curious pets who need a better outlet before the day gets noisy.",
      image: "/images/category-dog-toys.jpg",
      imageAlt: "Dog toys styled on a warm neutral background.",
      icon: "paw",
      details: ["Good for enrichment", "Dog and cat paths", "Simple product comparison"],
      links: [
        { label: "Dog Toys", href: "/collections/dog-toys" },
        { label: "Cat Toys", href: "/collections/cat-toys" }
      ]
    },
    {
      key: "walk",
      label: "Heading outside",
      eyebrow: "Walk path",
      title: "Choose out-the-door essentials before adding extras.",
      description:
        "For daily walks, quick errands, and weather shifts where comfort, movement, and practical gear matter first.",
      image: "/images/category-walking-essentials.jpg",
      imageAlt: "Walking essentials arranged as a warm lifestyle product scene.",
      icon: "route",
      details: ["Walking gear first", "Apparel when useful", "Clear route to checkout"],
      links: [
        { label: "Walking Essentials", href: "/collections/walking-essentials" },
        { label: "Pet Apparel", href: "/collections/pet-apparel" }
      ]
    },
    {
      key: "rest",
      label: "A calmer home",
      eyebrow: "Rest path",
      title: "Build a softer corner for rest, recovery, and slower routines.",
      description:
        "For pets who need a better place to settle, warmer textures, or a more comfortable home routine.",
      image: "/images/category-beds-blankets.jpg",
      imageAlt: "Soft pet bedding and blanket texture in a calm home setting.",
      icon: "bed",
      details: ["Rest-focused products", "Soft everyday textures", "Less visual noise"],
      links: [
        { label: "Beds & Blankets", href: "/collections/beds-and-blankets" },
        { label: "Explore Collections", href: "/collections" }
      ]
    },
    {
      key: "support",
      label: "Need help choosing",
      eyebrow: "Support path",
      title: "Use support as part of the shopping path, not an afterthought.",
      description:
        "For product questions, order questions, or moments where you want a clearer next step before buying.",
      image: "/images/about-partners.jpg",
      imageAlt: "A warm pet lifestyle moment representing customer support and practical guidance.",
      icon: "help",
      details: ["Product questions", "Order support", "Straightforward next steps"],
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQ", href: "/faq" }
      ]
    }
  ]
};

export const defaultHomepageServicePromises: HomepageServicePromisesContent = {
  enabled: true,
  eyebrow: "Shop with clarity",
  title: "Practical promises, clearly stated.",
  description:
    "LUCK CLAWS should feel calm to shop: clear product paths, consistent service copy, and no vague claims.",
  items: [
    {
      key: "secure-checkout",
      icon: "lock",
      title: "Secure checkout",
      text: "Checkout flows stay simple, protected, and easy to review before payment."
    },
    {
      key: "clear-details",
      icon: "check",
      title: "Clear product details",
      text: "Product pages focus on price, use case, category, and practical buying details."
    },
    {
      key: "damaged-support",
      icon: "shield",
      title: "Damaged item support",
      text: "Support is available for damaged, defective, or incorrect items after delivery."
    },
    {
      key: "pet-conscious-picks",
      icon: "heart",
      title: "Pet-conscious picks",
      text: "The storefront is organized around daily routines, not overwhelming choice."
    },
    {
      key: "shipping",
      icon: "truck",
      title: freeShippingLabel,
      text: "Shipping messaging stays consistent from homepage through checkout."
    }
  ]
};

export const defaultHomepageNewsletter: HomepageNewsletterContent = {
  enabled: true,
  eyebrow: "LUCK CLAWS updates",
  title: "Better routines, fewer random buys.",
  subtitle: "Get new arrivals, routine-first product edits, and occasional offers from LUCK CLAWS.",
  offerText: "Get 10% off your first order with WELCOME10.",
  successTitle: "You're in the pack!",
  successMessage: "Thanks for joining LUCK CLAWS. Use code WELCOME10 for 10% off your first order.",
  editButtonText: "Use another email",
  placeholder: "Email address",
  buttonText: "Join the Pack",
  submittingText: "Joining...",
  noteText: "No spam. Just pet-friendly updates and offers.",
  duplicateMessage: "You're already in the pack."
};

const homepageTrustBadgeIconSet = new Set<string>(homepageTrustBadgeIconKeys);
const homepageCategorySectionLayoutSet = new Set<string>(["grid_4", "carousel"]);
const homepageStoryIconSet = new Set<string>(homepageStoryIconKeys);
const homepageDecisionGuideIconSet = new Set<string>(homepageDecisionGuideIconKeys);

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

export function normalizeHomepageDecisionGuideIconKey(value: unknown): HomepageDecisionGuideIconKey {
  const icon = cleanString(value);

  return homepageDecisionGuideIconSet.has(icon) ? (icon as HomepageDecisionGuideIconKey) : "paw";
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

export function homepageDecisionGuideFromValue(value: unknown): HomepageDecisionGuideContent {
  const record = recordFromUnknown(value);
  const routineTags =
    stringArrayFromUnknown(record?.routineTags) ??
    stringArrayFromUnknown(record?.routine_tags) ??
    defaultHomepageDecisionGuide.routineTags;
  const steps = arrayFromUnknown(record?.steps)
    .map((step, index): HomepageDecisionGuideStep | null => {
      const stepRecord = recordFromUnknown(step);
      const fallbackStep = defaultHomepageDecisionGuide.steps[index] ?? defaultHomepageDecisionGuide.steps[0];
      const title = stringFromRecord(stepRecord, ["title"], fallbackStep.title);
      const text = stringFromRecord(stepRecord, ["text", "description"], fallbackStep.text);

      if (!stepRecord || !title || !text) {
        return null;
      }

      return {
        number: stringFromRecord(stepRecord, ["number"], fallbackStep.number),
        title,
        text
      };
    })
    .filter((step): step is HomepageDecisionGuideStep => Boolean(step));
  const options = arrayFromUnknown(record?.options)
    .map((option, index): HomepageDecisionGuideOption | null => {
      const optionRecord = recordFromUnknown(option);
      const fallbackOption = defaultHomepageDecisionGuide.options[index] ?? defaultHomepageDecisionGuide.options[0];
      const title = stringFromRecord(optionRecord, ["title"], fallbackOption.title);
      const description = stringFromRecord(optionRecord, ["description", "text"], fallbackOption.description);
      const links = arrayFromUnknown(optionRecord?.links)
        .map((link, linkIndex): HomepageDecisionGuideLink | null => {
          const linkRecord = recordFromUnknown(link);
          const fallbackLink = fallbackOption.links[linkIndex] ?? fallbackOption.links[0];
          const label = stringFromRecord(linkRecord, ["label", "title"], fallbackLink.label);
          const href = stringFromRecord(linkRecord, ["href", "url"], fallbackLink.href);

          return label && href ? { label, href } : null;
        })
        .filter((link): link is HomepageDecisionGuideLink => Boolean(link));

      if (!optionRecord || !title || !description) {
        return null;
      }

      return {
        key: cleanString(optionRecord.key) || fallbackOption.key,
        label: stringFromRecord(optionRecord, ["label"], fallbackOption.label),
        eyebrow: stringFromRecord(optionRecord, ["eyebrow", "labelText", "label_text"], fallbackOption.eyebrow),
        title,
        description,
        image: stringFromRecord(optionRecord, ["image", "imageUrl", "image_url"], fallbackOption.image),
        imageAlt: stringFromRecord(optionRecord, ["imageAlt", "image_alt"], fallbackOption.imageAlt),
        icon: normalizeHomepageDecisionGuideIconKey(optionRecord.icon),
        details: stringArrayFromUnknown(optionRecord.details) ?? fallbackOption.details,
        links: links.length > 0 ? links : fallbackOption.links
      };
    })
    .filter((option): option is HomepageDecisionGuideOption => Boolean(option));

  return {
    enabled: record?.enabled === false ? false : defaultHomepageDecisionGuide.enabled,
    eyebrow: stringFromRecord(record, ["eyebrow", "label"], defaultHomepageDecisionGuide.eyebrow),
    title: stringFromRecord(record, ["title"], defaultHomepageDecisionGuide.title),
    subtitle: stringFromRecord(record, ["subtitle", "description"], defaultHomepageDecisionGuide.subtitle),
    stepsTitle: stringFromRecord(record, ["stepsTitle", "steps_title"], defaultHomepageDecisionGuide.stepsTitle),
    stepsBadge: stringFromRecord(record, ["stepsBadge", "steps_badge"], defaultHomepageDecisionGuide.stepsBadge),
    routineTags,
    steps: steps.length > 0 ? steps : defaultHomepageDecisionGuide.steps,
    options: options.length > 0 ? options : defaultHomepageDecisionGuide.options
  };
}

export function homepageServicePromisesFromValue(value: unknown): HomepageServicePromisesContent {
  const record = recordFromUnknown(value);
  const items = arrayFromUnknown(record?.items)
    .map((item, index): HomepageServicePromise | null => {
      const itemRecord = recordFromUnknown(item);
      const fallbackItem = defaultHomepageServicePromises.items[index] ?? defaultHomepageServicePromises.items[0];
      const title = stringFromRecord(itemRecord, ["title"], fallbackItem.title);
      const text = stringFromRecord(itemRecord, ["text", "description"], fallbackItem.text);

      if (!itemRecord || !title || !text) {
        return null;
      }

      return {
        key: cleanString(itemRecord.key) || fallbackItem.key,
        icon: normalizeHomepageTrustBadgeIconKey(itemRecord.icon),
        title,
        text
      };
    })
    .filter((item): item is HomepageServicePromise => Boolean(item));

  return {
    enabled: record?.enabled === false ? false : defaultHomepageServicePromises.enabled,
    eyebrow: stringFromRecord(record, ["eyebrow", "label"], defaultHomepageServicePromises.eyebrow),
    title: stringFromRecord(record, ["title"], defaultHomepageServicePromises.title),
    description: stringFromRecord(record, ["description", "subtitle"], defaultHomepageServicePromises.description),
    items: items.length > 0 ? items : defaultHomepageServicePromises.items
  };
}

export function homepageNewsletterFromValue(value: unknown): HomepageNewsletterContent {
  const record = recordFromUnknown(value);

  return {
    enabled: record?.enabled === false ? false : defaultHomepageNewsletter.enabled,
    eyebrow: stringFromRecord(record, ["eyebrow", "label"], defaultHomepageNewsletter.eyebrow),
    title: stringFromRecord(record, ["title"], defaultHomepageNewsletter.title),
    subtitle: stringFromRecord(record, ["subtitle", "description"], defaultHomepageNewsletter.subtitle),
    offerText: stringFromRecord(record, ["offerText", "offer_text"], defaultHomepageNewsletter.offerText),
    successTitle: stringFromRecord(record, ["successTitle", "success_title"], defaultHomepageNewsletter.successTitle),
    successMessage: stringFromRecord(
      record,
      ["successMessage", "success_message"],
      defaultHomepageNewsletter.successMessage
    ),
    editButtonText: stringFromRecord(
      record,
      ["editButtonText", "edit_button_text"],
      defaultHomepageNewsletter.editButtonText
    ),
    placeholder: stringFromRecord(record, ["placeholder"], defaultHomepageNewsletter.placeholder),
    buttonText: stringFromRecord(record, ["buttonText", "button_text"], defaultHomepageNewsletter.buttonText),
    submittingText: stringFromRecord(
      record,
      ["submittingText", "submitting_text"],
      defaultHomepageNewsletter.submittingText
    ),
    noteText: stringFromRecord(record, ["noteText", "note_text"], defaultHomepageNewsletter.noteText),
    duplicateMessage: stringFromRecord(
      record,
      ["duplicateMessage", "duplicate_message"],
      defaultHomepageNewsletter.duplicateMessage
    )
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

export function buildHomepageDecisionGuideValue(guide: HomepageDecisionGuideContent) {
  return {
    active: true,
    enabled: guide.enabled,
    eyebrow: guide.eyebrow.trim(),
    title: guide.title.trim(),
    subtitle: guide.subtitle.trim(),
    stepsTitle: guide.stepsTitle.trim(),
    stepsBadge: guide.stepsBadge.trim(),
    routineTags: guide.routineTags.map((tag) => tag.trim()).filter(Boolean),
    steps: guide.steps
      .map((step, index) => ({
        number: step.number.trim() || String(index + 1).padStart(2, "0"),
        title: step.title.trim(),
        text: step.text.trim()
      }))
      .filter((step) => step.title && step.text),
    options: guide.options
      .map((option, index) => ({
        key: option.key.trim() || `option-${index + 1}`,
        label: option.label.trim(),
        eyebrow: option.eyebrow.trim(),
        title: option.title.trim(),
        description: option.description.trim(),
        image: option.image.trim(),
        imageAlt: option.imageAlt.trim(),
        icon: normalizeHomepageDecisionGuideIconKey(option.icon),
        details: option.details.map((detail) => detail.trim()).filter(Boolean),
        links: option.links
          .map((link) => ({
            label: link.label.trim(),
            href: link.href.trim()
          }))
          .filter((link) => link.label && link.href)
      }))
      .filter((option) => option.label && option.title && option.description)
  };
}

export function buildHomepageServicePromisesValue(section: HomepageServicePromisesContent) {
  return {
    active: true,
    enabled: section.enabled,
    eyebrow: section.eyebrow.trim(),
    title: section.title.trim(),
    description: section.description.trim(),
    items: section.items
      .map((item, index) => ({
        key: item.key.trim() || `service-promise-${index + 1}`,
        icon: normalizeHomepageTrustBadgeIconKey(item.icon),
        title: item.title.trim(),
        text: item.text.trim()
      }))
      .filter((item) => item.title && item.text)
  };
}

export function buildHomepageNewsletterValue(newsletter: HomepageNewsletterContent) {
  return {
    active: true,
    enabled: newsletter.enabled,
    eyebrow: newsletter.eyebrow.trim(),
    title: newsletter.title.trim(),
    subtitle: newsletter.subtitle.trim(),
    offerText: newsletter.offerText.trim(),
    successTitle: newsletter.successTitle.trim(),
    successMessage: newsletter.successMessage.trim(),
    editButtonText: newsletter.editButtonText.trim(),
    placeholder: newsletter.placeholder.trim(),
    buttonText: newsletter.buttonText.trim(),
    submittingText: newsletter.submittingText.trim(),
    noteText: newsletter.noteText.trim(),
    duplicateMessage: newsletter.duplicateMessage.trim()
  };
}
