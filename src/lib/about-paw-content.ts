export type AboutPawHeaderContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  supportingLine: string;
};

export type AboutPawRouteContent = {
  routeKey: string;
  label: string;
  iconKey: string;
  recommendationTitle: string;
  recommendationDescription: string;
  noteText: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  sortOrder: number;
  enabled: boolean;
};

export type AboutPawNoteContent = {
  noteKey: string;
  keyword: string;
  secondaryText: string;
  iconKey: string;
  sortOrder: number;
  enabled: boolean;
};

export type AboutPawContent = {
  header: AboutPawHeaderContent;
  routes: AboutPawRouteContent[];
  notes: AboutPawNoteContent[];
};

export type AboutIconKey =
  | "paw"
  | "shield"
  | "heart"
  | "star"
  | "sparkles"
  | "leaf"
  | "truck"
  | "package"
  | "check"
  | "rotate"
  | "lock"
  | "mail"
  | "arrow";

export const aboutIconKeys: AboutIconKey[] = [
  "paw",
  "shield",
  "heart",
  "star",
  "sparkles",
  "leaf",
  "truck",
  "package",
  "check",
  "rotate",
  "lock",
  "mail",
  "arrow"
];

export const fallbackAboutPawContent: AboutPawContent = {
  header: {
    sectionLabel: "Routine Route",
    title: "The Paw Path Finder",
    subtitle: "Choose your pet's next moment, then follow a clearer route to the right products.",
    supportingLine: "Less scrolling. More certainty. Start with the routine before checkout."
  },
  routes: [
    {
      routeKey: "play",
      label: "Play",
      iconKey: "sparkles",
      recommendationTitle: "Playful energy, easier choices",
      recommendationDescription: "For curious pets who need toys, textures, and daily enrichment.",
      noteText: "Start here when your pet needs activity, chewing, chasing, or enrichment.",
      ctaLabel: "Dog Toys",
      ctaHref: "/collections/dog-toys",
      secondaryCtaLabel: "Cat Toys",
      secondaryCtaHref: "/collections/cat-toys",
      sortOrder: 1,
      enabled: true
    },
    {
      routeKey: "walk",
      label: "Walk",
      iconKey: "truck",
      recommendationTitle: "Out-the-door essentials",
      recommendationDescription: "For everyday walks, quick errands, and longer strolls.",
      noteText: "Start here when you need movement, comfort, and simple walking gear.",
      ctaLabel: "Walking Essentials",
      ctaHref: "/collections/walking-essentials",
      secondaryCtaLabel: "Pet Apparel",
      secondaryCtaHref: "/collections/pet-apparel",
      sortOrder: 2,
      enabled: true
    },
    {
      routeKey: "rest",
      label: "Rest",
      iconKey: "heart",
      recommendationTitle: "Cozy corners and slower moments",
      recommendationDescription: "For rest, recovery, warmth, and calmer routines.",
      noteText: "Start here when your pet needs a softer place to settle.",
      ctaLabel: "Beds & Blankets",
      ctaHref: "/collections/beds-and-blankets",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      sortOrder: 3,
      enabled: true
    },
    {
      routeKey: "comfort",
      label: "Comfort",
      iconKey: "package",
      recommendationTitle: "Everyday comfort without overthinking",
      recommendationDescription:
        "For practical apparel and products that are easier to compare before checkout.",
      noteText: "Start here when comfort, fit, and everyday use matter most.",
      ctaLabel: "Pet Apparel",
      ctaHref: "/collections/pet-apparel",
      secondaryCtaLabel: "Explore Collections",
      secondaryCtaHref: "/collections",
      sortOrder: 4,
      enabled: true
    },
    {
      routeKey: "support",
      label: "Support",
      iconKey: "mail",
      recommendationTitle: "Not sure where to start?",
      recommendationDescription: "Tell us what you are shopping for or what happened with an order.",
      noteText: "Support is part of the path, not an afterthought.",
      ctaLabel: "Contact Us",
      ctaHref: "/contact",
      secondaryCtaLabel: "Explore Collections",
      secondaryCtaHref: "/collections",
      sortOrder: 5,
      enabled: true
    }
  ],
  notes: [
    {
      noteKey: "useful",
      keyword: "Useful",
      secondaryText: "before novelty",
      iconKey: "paw",
      sortOrder: 1,
      enabled: true
    },
    {
      noteKey: "comfort",
      keyword: "Comfort",
      secondaryText: "before complication",
      iconKey: "heart",
      sortOrder: 2,
      enabled: true
    },
    {
      noteKey: "clear-details",
      keyword: "Clear details",
      secondaryText: "before checkout",
      iconKey: "sparkles",
      sortOrder: 3,
      enabled: true
    },
    {
      noteKey: "support",
      keyword: "Support",
      secondaryText: "after purchase",
      iconKey: "arrow",
      sortOrder: 4,
      enabled: true
    }
  ]
};

type AboutPawSettingsRow = {
  section_label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  supporting_line?: string | null;
};

type AboutPawRouteRow = {
  route_key?: string | null;
  label?: string | null;
  icon_key?: string | null;
  recommendation_title?: string | null;
  recommendation_description?: string | null;
  note_text?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_href?: string | null;
  sort_order?: number | string | null;
  enabled?: boolean | null;
};

type AboutPawNoteRow = {
  note_key?: string | null;
  keyword?: string | null;
  secondary_text?: string | null;
  icon_key?: string | null;
  sort_order?: number | string | null;
  enabled?: boolean | null;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberFromValue(value: unknown, fallback: number) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((first, second) => first.sortOrder - second.sortOrder);
}

export function normalizeAboutIconKey(value: unknown, fallback: AboutIconKey = "paw"): AboutIconKey {
  const cleaned = cleanString(value).toLowerCase();

  return aboutIconKeys.includes(cleaned as AboutIconKey) ? (cleaned as AboutIconKey) : fallback;
}

export function aboutPawHeaderFromRow(row: AboutPawSettingsRow | null | undefined): AboutPawHeaderContent {
  const fallback = fallbackAboutPawContent.header;

  if (!row) {
    return fallback;
  }

  return {
    sectionLabel: cleanString(row.section_label) || fallback.sectionLabel,
    title: cleanString(row.title) || fallback.title,
    subtitle: cleanString(row.subtitle) || fallback.subtitle,
    supportingLine: cleanString(row.supporting_line) || fallback.supportingLine
  };
}

export function aboutPawRoutesFromRows(rows: AboutPawRouteRow[] | null | undefined): AboutPawRouteContent[] {
  if (!rows?.length) {
    return fallbackAboutPawContent.routes;
  }

  const normalizedRoutes = rows
    .map((row, index): AboutPawRouteContent | null => {
      const routeKey = cleanString(row.route_key);
      const label = cleanString(row.label);
      const recommendationTitle = cleanString(row.recommendation_title);
      const recommendationDescription = cleanString(row.recommendation_description);
      const noteText = cleanString(row.note_text);
      const ctaLabel = cleanString(row.cta_label);
      const ctaHref = cleanString(row.cta_href);

      if (!routeKey || !label || !recommendationTitle || !recommendationDescription || !noteText || !ctaLabel || !ctaHref) {
        return null;
      }

      return {
        routeKey,
        label,
        iconKey: normalizeAboutIconKey(row.icon_key, "paw"),
        recommendationTitle,
        recommendationDescription,
        noteText,
        ctaLabel,
        ctaHref,
        secondaryCtaLabel: cleanString(row.secondary_cta_label),
        secondaryCtaHref: cleanString(row.secondary_cta_href),
        sortOrder: numberFromValue(row.sort_order, index + 1),
        enabled: row.enabled !== false
      } satisfies AboutPawRouteContent;
    })
    .filter((route): route is AboutPawRouteContent => Boolean(route));

  const enabledRoutes = sortBySortOrder(normalizedRoutes.filter((route) => route.enabled));

  return enabledRoutes.length > 0 ? enabledRoutes : fallbackAboutPawContent.routes;
}

export function aboutPawNotesFromRows(rows: AboutPawNoteRow[] | null | undefined): AboutPawNoteContent[] {
  if (!rows?.length) {
    return fallbackAboutPawContent.notes;
  }

  const normalizedNotes = rows
    .map((row, index): AboutPawNoteContent | null => {
      const noteKey = cleanString(row.note_key);
      const keyword = cleanString(row.keyword);
      const secondaryText = cleanString(row.secondary_text);

      if (!noteKey || !keyword || !secondaryText) {
        return null;
      }

      return {
        noteKey,
        keyword,
        secondaryText,
        iconKey: normalizeAboutIconKey(row.icon_key, "paw"),
        sortOrder: numberFromValue(row.sort_order, index + 1),
        enabled: row.enabled !== false
      } satisfies AboutPawNoteContent;
    })
    .filter((note): note is AboutPawNoteContent => Boolean(note));

  const enabledNotes = sortBySortOrder(normalizedNotes.filter((note) => note.enabled));

  return enabledNotes.length > 0 ? enabledNotes : fallbackAboutPawContent.notes;
}

export function aboutPawContentFromRows({
  settings,
  routes,
  notes
}: {
  settings?: AboutPawSettingsRow | null;
  routes?: AboutPawRouteRow[] | null;
  notes?: AboutPawNoteRow[] | null;
}): AboutPawContent {
  return {
    header: aboutPawHeaderFromRow(settings),
    routes: aboutPawRoutesFromRows(routes),
    notes: aboutPawNotesFromRows(notes)
  };
}
