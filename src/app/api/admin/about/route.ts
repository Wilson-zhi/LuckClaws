import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { aboutIconKeys, normalizeAboutIconKey } from "@/lib/about-paw-content";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";
import { revalidateStorefrontScope } from "@/lib/storefront-cache";

export type AdminAboutSettingsRow = {
  id: string;
  section_key: string | null;
  section_label: string | null;
  title: string | null;
  subtitle: string | null;
  supporting_line: string | null;
};

export type AdminAboutHeroRow = {
  id: string;
  section_key: string | null;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  compass_title: string | null;
  compass_description: string | null;
};

export type AdminAboutRouteRow = {
  id: string;
  route_key: string | null;
  label: string | null;
  icon_key: string | null;
  recommendation_title: string | null;
  recommendation_description: string | null;
  note_text: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  sort_order: number | null;
  enabled: boolean | null;
};

export type AdminAboutNoteRow = {
  id: string;
  note_key: string | null;
  keyword: string | null;
  secondary_text: string | null;
  icon_key: string | null;
  sort_order: number | null;
  enabled: boolean | null;
};

export type AdminAboutCollectionSectionRow = {
  id: string;
  section_key: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  view_all_label: string | null;
  view_all_href: string | null;
};

export type AdminAboutCollectionCardRow = {
  id: string;
  card_key: string | null;
  title: string | null;
  category_slug: string | null;
  href: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number | null;
  enabled: boolean | null;
};

const aboutHeroColumns =
  "id, section_key, eyebrow, title, description, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, hero_image_url, hero_image_alt, compass_title, compass_description";
const aboutSettingsColumns = "id, section_key, section_label, title, subtitle, supporting_line";
const aboutRouteColumns =
  "id, route_key, label, icon_key, recommendation_title, recommendation_description, note_text, cta_label, cta_href, secondary_cta_label, secondary_cta_href, sort_order, enabled";
const aboutNoteColumns = "id, note_key, keyword, secondary_text, icon_key, sort_order, enabled";
const aboutCollectionSectionColumns = "id, section_key, eyebrow, title, subtitle, view_all_label, view_all_href";
const aboutCollectionCardColumns =
  "id, card_key, title, category_slug, href, image_url, image_alt, sort_order, enabled";

type AboutSavePayload = {
  hero?: Partial<AdminAboutHeroRow>;
  settings?: Partial<AdminAboutSettingsRow>;
  routes?: Array<Partial<AdminAboutRouteRow>>;
  notes?: Array<Partial<AdminAboutNoteRow>>;
  collectionSection?: Partial<AdminAboutCollectionSectionRow>;
  collectionCards?: Array<Partial<AdminAboutCollectionCardRow>>;
};

type ValidationResult =
  | {
      ok: true;
      payload: {
        hero: {
          id?: string;
          eyebrow: string;
          title: string;
          description: string;
          primary_cta_label: string;
          primary_cta_href: string;
          secondary_cta_label: string;
          secondary_cta_href: string;
          hero_image_url: string;
          hero_image_alt: string;
          compass_title: string;
          compass_description: string;
        };
        settings: {
          id?: string;
          section_label: string;
          title: string;
          subtitle: string;
          supporting_line: string;
        };
        routes: Array<{
          id?: string;
          route_key: string;
          label: string;
          icon_key: string;
          recommendation_title: string;
          recommendation_description: string;
          note_text: string;
          cta_label: string;
          cta_href: string;
          secondary_cta_label: string;
          secondary_cta_href: string;
          sort_order: number;
          enabled: boolean;
        }>;
        notes: Array<{
          id?: string;
          note_key: string;
          keyword: string;
          secondary_text: string;
          icon_key: string;
          sort_order: number;
          enabled: boolean;
        }>;
        collectionSection: {
          id?: string;
          eyebrow: string;
          title: string;
          subtitle: string;
          view_all_label: string;
          view_all_href: string;
        };
        collectionCards: Array<{
          id?: string;
          card_key: string;
          title: string;
          category_slug: string;
          href: string;
          image_url: string;
          image_alt: string;
          sort_order: number;
          enabled: boolean;
        }>;
      };
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalId(value: unknown) {
  const cleaned = cleanString(value);

  return cleaned || undefined;
}

function positiveSortOrder(value: unknown, fallback: number) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : NaN;
}

function isValidHref(value: string) {
  return value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://");
}

function logAboutError(message: string, details: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(message, details);
  }
}

function validateAboutPayload(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      ok: false,
      errors: {
        form: "Invalid About content payload."
      }
    };
  }

  const payload = body as AboutSavePayload;
  const hero = payload.hero ?? {};
  const heroEyebrow = cleanString(hero.eyebrow);
  const heroTitle = cleanString(hero.title);
  const heroDescription = cleanString(hero.description);
  const primaryCtaLabel = cleanString(hero.primary_cta_label);
  const primaryCtaHref = cleanString(hero.primary_cta_href);
  const secondaryCtaLabel = cleanString(hero.secondary_cta_label);
  const secondaryCtaHref = cleanString(hero.secondary_cta_href);
  const heroImageUrl = cleanString(hero.hero_image_url);
  const heroImageAlt = cleanString(hero.hero_image_alt);
  const compassTitle = cleanString(hero.compass_title);
  const compassDescription = cleanString(hero.compass_description);

  if (!heroEyebrow) {
    errors.hero_eyebrow = "Hero eyebrow is required.";
  }

  if (!heroTitle) {
    errors.hero_title = "Hero title is required.";
  }

  if (!heroDescription) {
    errors.hero_description = "Hero description is required.";
  }

  if (!primaryCtaLabel) {
    errors.primary_cta_label = "Primary CTA label is required.";
  }

  if (!primaryCtaHref || !isValidHref(primaryCtaHref)) {
    errors.primary_cta_href = "Primary CTA link must be a valid path or URL.";
  }

  if (!secondaryCtaLabel) {
    errors.secondary_cta_label = "Secondary CTA label is required.";
  }

  if (!secondaryCtaHref || !isValidHref(secondaryCtaHref)) {
    errors.secondary_cta_href = "Secondary CTA link must be a valid path or URL.";
  }

  if (!heroImageAlt) {
    errors.hero_image_alt = "Hero image alt text is required.";
  }

  if (!compassTitle) {
    errors.compass_title = "Compass title is required.";
  }

  if (!compassDescription) {
    errors.compass_description = "Compass description is required.";
  }

  const settings = payload.settings ?? {};
  const sectionLabel = cleanString(settings.section_label);
  const title = cleanString(settings.title);
  const subtitle = cleanString(settings.subtitle);
  const supportingLine = cleanString(settings.supporting_line);

  if (!sectionLabel) {
    errors.section_label = "Section label is required.";
  }

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!subtitle) {
    errors.subtitle = "Subtitle is required.";
  }

  if (!supportingLine) {
    errors.supporting_line = "Supporting line is required.";
  }

  const routes = Array.isArray(payload.routes) ? payload.routes : [];
  const notes = Array.isArray(payload.notes) ? payload.notes : [];
  const collectionSection = payload.collectionSection ?? {};
  const collectionSectionEyebrow = cleanString(collectionSection.eyebrow);
  const collectionSectionTitle = cleanString(collectionSection.title);
  const collectionSectionSubtitle = cleanString(collectionSection.subtitle);
  const viewAllLabel = cleanString(collectionSection.view_all_label);
  const viewAllHref = cleanString(collectionSection.view_all_href);
  const collectionCards = Array.isArray(payload.collectionCards) ? payload.collectionCards : [];

  if (!collectionSectionEyebrow) {
    errors.collection_eyebrow = "Collection section eyebrow is required.";
  }

  if (!collectionSectionTitle) {
    errors.collection_title = "Collection section title is required.";
  }

  if (!collectionSectionSubtitle) {
    errors.collection_subtitle = "Collection section subtitle is required.";
  }

  if (!viewAllLabel) {
    errors.view_all_label = "View all label is required.";
  }

  if (!viewAllHref || !isValidHref(viewAllHref)) {
    errors.view_all_href = "View all link must be a valid path or URL.";
  }

  if (routes.length === 0) {
    errors.routes = "At least one route is required.";
  }

  if (notes.length === 0) {
    errors.notes = "At least one route note is required.";
  }

  if (collectionCards.length === 0) {
    errors.collectionCards = "At least one collection card is required.";
  }

  const validatedRoutes = routes.map((route, index) => {
    const routeKey = cleanString(route.route_key);
    const label = cleanString(route.label);
    const recommendationTitle = cleanString(route.recommendation_title);
    const recommendationDescription = cleanString(route.recommendation_description);
    const noteText = cleanString(route.note_text);
    const ctaLabel = cleanString(route.cta_label);
    const ctaHref = cleanString(route.cta_href);
    const secondaryCtaLabel = cleanString(route.secondary_cta_label);
    const secondaryCtaHref = cleanString(route.secondary_cta_href);
    const sortOrder = positiveSortOrder(route.sort_order, index + 1);

    if (!routeKey) {
      errors[`routes.${index}.route_key`] = "Route key is required.";
    }

    if (!label) {
      errors[`routes.${index}.label`] = "Route label is required.";
    }

    if (!recommendationTitle) {
      errors[`routes.${index}.recommendation_title`] = "Recommendation title is required.";
    }

    if (!recommendationDescription) {
      errors[`routes.${index}.recommendation_description`] = "Recommendation description is required.";
    }

    if (!noteText) {
      errors[`routes.${index}.note_text`] = "Route note is required.";
    }

    if (!ctaLabel) {
      errors[`routes.${index}.cta_label`] = "CTA label is required.";
    }

    if (!ctaHref || !isValidHref(ctaHref)) {
      errors[`routes.${index}.cta_href`] = "CTA link must be a valid path or URL.";
    }

    if ((secondaryCtaLabel && !secondaryCtaHref) || (!secondaryCtaLabel && secondaryCtaHref)) {
      errors[`routes.${index}.secondary_cta`] = "Secondary CTA label and link must be provided together.";
    }

    if (secondaryCtaHref && !isValidHref(secondaryCtaHref)) {
      errors[`routes.${index}.secondary_cta_href`] = "Secondary CTA link must be a valid path or URL.";
    }

    if (!Number.isFinite(sortOrder)) {
      errors[`routes.${index}.sort_order`] = "Sort order must be a number.";
    }

    return {
      id: optionalId(route.id),
      route_key: routeKey,
      label,
      icon_key: normalizeAboutIconKey(route.icon_key, "paw"),
      recommendation_title: recommendationTitle,
      recommendation_description: recommendationDescription,
      note_text: noteText,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      secondary_cta_label: secondaryCtaLabel,
      secondary_cta_href: secondaryCtaHref,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : index + 1,
      enabled: route.enabled !== false
    };
  });

  const routeKeys = new Set<string>();
  validatedRoutes.forEach((route, index) => {
    if (route.route_key && routeKeys.has(route.route_key)) {
      errors[`routes.${index}.route_key`] = "Route keys must be unique.";
    }
    routeKeys.add(route.route_key);
  });

  const validatedNotes = notes.map((note, index) => {
    const noteKey = cleanString(note.note_key);
    const keyword = cleanString(note.keyword);
    const secondaryText = cleanString(note.secondary_text);
    const sortOrder = positiveSortOrder(note.sort_order, index + 1);

    if (!noteKey) {
      errors[`notes.${index}.note_key`] = "Note key is required.";
    }

    if (!keyword) {
      errors[`notes.${index}.keyword`] = "Keyword is required.";
    }

    if (!secondaryText) {
      errors[`notes.${index}.secondary_text`] = "Secondary text is required.";
    }

    if (!Number.isFinite(sortOrder)) {
      errors[`notes.${index}.sort_order`] = "Sort order must be a number.";
    }

    return {
      id: optionalId(note.id),
      note_key: noteKey,
      keyword,
      secondary_text: secondaryText,
      icon_key: normalizeAboutIconKey(note.icon_key, "paw"),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : index + 1,
      enabled: note.enabled !== false
    };
  });

  const noteKeys = new Set<string>();
  validatedNotes.forEach((note, index) => {
    if (note.note_key && noteKeys.has(note.note_key)) {
      errors[`notes.${index}.note_key`] = "Note keys must be unique.";
    }
    noteKeys.add(note.note_key);
  });

  const validatedCollectionCards = collectionCards.map((card, index) => {
    const cardKey = cleanString(card.card_key);
    const title = cleanString(card.title);
    const categorySlug = cleanString(card.category_slug);
    const href = cleanString(card.href);
    const sortOrder = positiveSortOrder(card.sort_order, index + 1);

    if (!cardKey) {
      errors[`collectionCards.${index}.card_key`] = "Card key is required.";
    }

    if (!title) {
      errors[`collectionCards.${index}.title`] = "Card title is required.";
    }

    if (!categorySlug) {
      errors[`collectionCards.${index}.category_slug`] = "Category slug is required.";
    }

    if (!href || !isValidHref(href)) {
      errors[`collectionCards.${index}.href`] = "Card link must be a valid path or URL.";
    }

    if (!Number.isFinite(sortOrder)) {
      errors[`collectionCards.${index}.sort_order`] = "Sort order must be a number.";
    }

    return {
      id: optionalId(card.id),
      card_key: cardKey,
      title,
      category_slug: categorySlug,
      href,
      image_url: cleanString(card.image_url),
      image_alt: cleanString(card.image_alt) || title,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : index + 1,
      enabled: card.enabled !== false
    };
  });

  const cardKeys = new Set<string>();
  validatedCollectionCards.forEach((card, index) => {
    if (card.card_key && cardKeys.has(card.card_key)) {
      errors[`collectionCards.${index}.card_key`] = "Card keys must be unique.";
    }
    cardKeys.add(card.card_key);
  });

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    payload: {
      hero: {
        id: optionalId(hero.id),
        eyebrow: heroEyebrow,
        title: heroTitle,
        description: heroDescription,
        primary_cta_label: primaryCtaLabel,
        primary_cta_href: primaryCtaHref,
        secondary_cta_label: secondaryCtaLabel,
        secondary_cta_href: secondaryCtaHref,
        hero_image_url: heroImageUrl,
        hero_image_alt: heroImageAlt,
        compass_title: compassTitle,
        compass_description: compassDescription
      },
      settings: {
        id: optionalId(settings.id),
        section_label: sectionLabel,
        title,
        subtitle,
        supporting_line: supportingLine
      },
      routes: validatedRoutes,
      notes: validatedNotes,
      collectionSection: {
        id: optionalId(collectionSection.id),
        eyebrow: collectionSectionEyebrow,
        title: collectionSectionTitle,
        subtitle: collectionSectionSubtitle,
        view_all_label: viewAllLabel,
        view_all_href: viewAllHref
      },
      collectionCards: validatedCollectionCards
    }
  };
}

async function getAboutAdminData(request: Request) {
  const supabase = getSupabaseAuthenticatedClientFromRequest(request);

  if (!supabase) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Authenticated Supabase session is not available." },
        { status: 500 }
      )
    };
  }

  const [
    heroResult,
    settingsResult,
    routesResult,
    notesResult,
    collectionSectionResult,
    collectionCardsResult
  ] = await Promise.all([
    supabase
      .from("about_hero_settings")
      .select(aboutHeroColumns)
      .eq("section_key", "about_hero")
      .maybeSingle(),
    supabase
      .from("about_page_settings")
      .select(aboutSettingsColumns)
      .eq("section_key", "paw_path_finder")
      .maybeSingle(),
    supabase
      .from("about_paw_routes")
      .select(aboutRouteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_paw_notes")
      .select(aboutNoteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_collection_section_settings")
      .select(aboutCollectionSectionColumns)
      .eq("section_key", "about_collections")
      .maybeSingle(),
    supabase
      .from("about_collection_cards")
      .select(aboutCollectionCardColumns)
      .order("sort_order", { ascending: true, nullsFirst: false })
  ]);

  if (
    heroResult.error ||
    settingsResult.error ||
    routesResult.error ||
    notesResult.error ||
    collectionSectionResult.error ||
    collectionCardsResult.error
  ) {
    logAboutError("Unable to load About admin content:", {
      hero: heroResult.error?.message,
      settings: settingsResult.error?.message,
      routes: routesResult.error?.message,
      notes: notesResult.error?.message,
      collectionSection: collectionSectionResult.error?.message,
      collectionCards: collectionCardsResult.error?.message
    });

    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unable to load About page content." }, { status: 500 })
    };
  }

  return {
    ok: true as const,
    supabase,
    hero: heroResult.data as AdminAboutHeroRow | null,
    settings: settingsResult.data as AdminAboutSettingsRow | null,
    routes: (routesResult.data ?? []) as AdminAboutRouteRow[],
    notes: (notesResult.data ?? []) as AdminAboutNoteRow[],
    collectionSection: collectionSectionResult.data as AdminAboutCollectionSectionRow | null,
    collectionCards: (collectionCardsResult.data ?? []) as AdminAboutCollectionCardRow[]
  };
}

export async function GET(request: Request) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const result = await getAboutAdminData(request);

  if (!result.ok) {
    return result.response;
  }

  return NextResponse.json({
    hero: result.hero,
    settings: result.settings,
    routes: result.routes,
    notes: result.notes,
    collectionSection: result.collectionSection,
    collectionCards: result.collectionCards,
    iconKeys: aboutIconKeys
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const result = await getAboutAdminData(request);

  if (!result.ok) {
    return result.response;
  }

  const validation = validateAboutPayload(await request.json().catch(() => null));

  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "About content validation failed.",
        errors: validation.errors
      },
      { status: 400 }
    );
  }

  const { supabase } = result;
  const { hero, settings, routes, notes, collectionSection, collectionCards } = validation.payload;
  const heroValues = {
    section_key: "about_hero",
    eyebrow: hero.eyebrow,
    title: hero.title,
    description: hero.description,
    primary_cta_label: hero.primary_cta_label,
    primary_cta_href: hero.primary_cta_href,
    secondary_cta_label: hero.secondary_cta_label,
    secondary_cta_href: hero.secondary_cta_href,
    hero_image_url: hero.hero_image_url,
    hero_image_alt: hero.hero_image_alt,
    compass_title: hero.compass_title,
    compass_description: hero.compass_description
  };
  const heroMutation = hero.id
    ? supabase
        .from("about_hero_settings")
        .update(heroValues)
        .eq("id", hero.id)
        .select(aboutHeroColumns)
        .maybeSingle()
    : supabase
        .from("about_hero_settings")
        .insert(heroValues)
        .select(aboutHeroColumns)
        .single();
  const settingsMutation = settings.id
    ? supabase
        .from("about_page_settings")
        .update({
          section_label: settings.section_label,
          title: settings.title,
          subtitle: settings.subtitle,
          supporting_line: settings.supporting_line
        })
        .eq("id", settings.id)
        .select(aboutSettingsColumns)
        .maybeSingle()
    : supabase
        .from("about_page_settings")
        .insert({
          section_key: "paw_path_finder",
          section_label: settings.section_label,
          title: settings.title,
          subtitle: settings.subtitle,
          supporting_line: settings.supporting_line
        })
        .select(aboutSettingsColumns)
        .single();
  const collectionSectionValues = {
    section_key: "about_collections",
    eyebrow: collectionSection.eyebrow,
    title: collectionSection.title,
    subtitle: collectionSection.subtitle,
    view_all_label: collectionSection.view_all_label,
    view_all_href: collectionSection.view_all_href
  };
  const collectionSectionMutation = collectionSection.id
    ? supabase
        .from("about_collection_section_settings")
        .update(collectionSectionValues)
        .eq("id", collectionSection.id)
        .select(aboutCollectionSectionColumns)
        .maybeSingle()
    : supabase
        .from("about_collection_section_settings")
        .insert(collectionSectionValues)
        .select(aboutCollectionSectionColumns)
        .single();

  const [
    heroResult,
    settingsResult,
    collectionSectionResult,
    routeWriteResults,
    noteWriteResults,
    collectionCardWriteResults
  ] = await Promise.all([
    heroMutation,
    settingsMutation,
    collectionSectionMutation,
    Promise.all(
      routes.map((route) => {
        const { id, ...values } = route;

        return id
          ? supabase.from("about_paw_routes").update(values).eq("id", id)
          : supabase.from("about_paw_routes").upsert(values, { onConflict: "route_key" });
      })
    ),
    Promise.all(
      notes.map((note) => {
        const { id, ...values } = note;

        return id
          ? supabase.from("about_paw_notes").update(values).eq("id", id)
          : supabase.from("about_paw_notes").upsert(values, { onConflict: "note_key" });
      })
    ),
    Promise.all(
      collectionCards.map((card) => {
        const { id, ...values } = card;

        return id
          ? supabase.from("about_collection_cards").update(values).eq("id", id)
          : supabase.from("about_collection_cards").upsert(values, { onConflict: "card_key" });
      })
    )
  ]);

  const routeWriteError = routeWriteResults.find((writeResult) => writeResult.error)?.error;
  const noteWriteError = noteWriteResults.find((writeResult) => writeResult.error)?.error;
  const collectionCardWriteError = collectionCardWriteResults.find((writeResult) => writeResult.error)?.error;

  if (
    heroResult.error ||
    settingsResult.error ||
    collectionSectionResult.error ||
    routeWriteError ||
    noteWriteError ||
    collectionCardWriteError
  ) {
    logAboutError("Unable to save About admin content:", {
      hero: heroResult.error?.message,
      settings: settingsResult.error?.message,
      collectionSection: collectionSectionResult.error?.message,
      routes: routeWriteError?.message,
      notes: noteWriteError?.message,
      collectionCards: collectionCardWriteError?.message
    });

    return NextResponse.json({ error: "Unable to save About page content." }, { status: 500 });
  }

  const [routesResult, notesResult, collectionCardsResult] = await Promise.all([
    supabase
      .from("about_paw_routes")
      .select(aboutRouteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_paw_notes")
      .select(aboutNoteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_collection_cards")
      .select(aboutCollectionCardColumns)
      .order("sort_order", { ascending: true, nullsFirst: false })
  ]);

  if (routesResult.error || notesResult.error || collectionCardsResult.error) {
    logAboutError("Unable to reload About admin content after save:", {
      routes: routesResult.error?.message,
      notes: notesResult.error?.message,
      collectionCards: collectionCardsResult.error?.message
    });

    return NextResponse.json({ error: "About page content was saved but could not be reloaded." }, { status: 500 });
  }

  revalidateStorefrontScope("about");

  return NextResponse.json({
    hero: heroResult.data as AdminAboutHeroRow,
    settings: settingsResult.data as AdminAboutSettingsRow,
    collectionSection: collectionSectionResult.data as AdminAboutCollectionSectionRow,
    routes: (routesResult.data ?? []) as AdminAboutRouteRow[],
    notes: (notesResult.data ?? []) as AdminAboutNoteRow[],
    collectionCards: (collectionCardsResult.data ?? []) as AdminAboutCollectionCardRow[]
  });
}
