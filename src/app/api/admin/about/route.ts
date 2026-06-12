import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { aboutIconKeys, normalizeAboutIconKey } from "@/lib/about-paw-content";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

export type AdminAboutSettingsRow = {
  id: string;
  section_label: string | null;
  title: string | null;
  subtitle: string | null;
  supporting_line: string | null;
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

const aboutSettingsColumns = "id, section_label, title, subtitle, supporting_line";
const aboutRouteColumns =
  "id, route_key, label, icon_key, recommendation_title, recommendation_description, note_text, cta_label, cta_href, secondary_cta_label, secondary_cta_href, sort_order, enabled";
const aboutNoteColumns = "id, note_key, keyword, secondary_text, icon_key, sort_order, enabled";

type AboutSavePayload = {
  settings?: Partial<AdminAboutSettingsRow>;
  routes?: Array<Partial<AdminAboutRouteRow>>;
  notes?: Array<Partial<AdminAboutNoteRow>>;
};

type ValidationResult =
  | {
      ok: true;
      payload: {
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

  if (routes.length === 0) {
    errors.routes = "At least one route is required.";
  }

  if (notes.length === 0) {
    errors.notes = "At least one route note is required.";
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

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    payload: {
      settings: {
        id: optionalId(settings.id),
        section_label: sectionLabel,
        title,
        subtitle,
        supporting_line: supportingLine
      },
      routes: validatedRoutes,
      notes: validatedNotes
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

  const [settingsResult, routesResult, notesResult] = await Promise.all([
    supabase.from("about_page_settings").select(aboutSettingsColumns).limit(1).maybeSingle(),
    supabase
      .from("about_paw_routes")
      .select(aboutRouteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_paw_notes")
      .select(aboutNoteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false })
  ]);

  if (settingsResult.error || routesResult.error || notesResult.error) {
    console.error("Unable to load About admin content:", {
      settings: settingsResult.error?.message,
      routes: routesResult.error?.message,
      notes: notesResult.error?.message
    });

    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unable to load About page content." }, { status: 500 })
    };
  }

  return {
    ok: true as const,
    supabase,
    settings: settingsResult.data as AdminAboutSettingsRow | null,
    routes: (routesResult.data ?? []) as AdminAboutRouteRow[],
    notes: (notesResult.data ?? []) as AdminAboutNoteRow[]
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
    settings: result.settings,
    routes: result.routes,
    notes: result.notes,
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
  const { settings, routes, notes } = validation.payload;
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
          section_label: settings.section_label,
          title: settings.title,
          subtitle: settings.subtitle,
          supporting_line: settings.supporting_line
        })
        .select(aboutSettingsColumns)
        .single();

  const [settingsResult, routeWriteResults, noteWriteResults] = await Promise.all([
    settingsMutation,
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
    )
  ]);

  const routeWriteError = routeWriteResults.find((writeResult) => writeResult.error)?.error;
  const noteWriteError = noteWriteResults.find((writeResult) => writeResult.error)?.error;

  if (settingsResult.error || routeWriteError || noteWriteError) {
    console.error("Unable to save About admin content:", {
      settings: settingsResult.error?.message,
      routes: routeWriteError?.message,
      notes: noteWriteError?.message
    });

    return NextResponse.json({ error: "Unable to save About page content." }, { status: 500 });
  }

  const [routesResult, notesResult] = await Promise.all([
    supabase
      .from("about_paw_routes")
      .select(aboutRouteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("about_paw_notes")
      .select(aboutNoteColumns)
      .order("sort_order", { ascending: true, nullsFirst: false })
  ]);

  if (routesResult.error || notesResult.error) {
    console.error("Unable to reload About admin content after save:", {
      routes: routesResult.error?.message,
      notes: notesResult.error?.message
    });

    return NextResponse.json({ error: "About page content was saved but could not be reloaded." }, { status: 500 });
  }

  return NextResponse.json({
    settings: settingsResult.data as AdminAboutSettingsRow,
    routes: (routesResult.data ?? []) as AdminAboutRouteRow[],
    notes: (notesResult.data ?? []) as AdminAboutNoteRow[]
  });
}
