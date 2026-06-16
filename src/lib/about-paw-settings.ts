import "server-only";

import {
  fallbackPublicAboutContent,
  publicAboutContentFromRows,
  type AboutContentDiagnostics,
  type PublicAboutContent
} from "@/lib/about-paw-content";
import { getSupabasePublicServerClient } from "@/lib/supabase/server";

const aboutHeroColumns =
  "id, section_key, eyebrow, title, description, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, hero_image_url, hero_image_alt, compass_title, compass_description";
const aboutSettingsColumns = "id, section_key, section_label, title, subtitle, supporting_line";
const aboutRouteColumns =
  "id, route_key, label, icon_key, recommendation_title, recommendation_description, note_text, cta_label, cta_href, secondary_cta_label, secondary_cta_href, sort_order, enabled";
const aboutNoteColumns = "id, note_key, keyword, secondary_text, icon_key, sort_order, enabled";
const aboutCollectionSectionColumns = "id, section_key, eyebrow, title, subtitle, view_all_label, view_all_href";
const aboutCollectionCardColumns =
  "id, card_key, title, category_slug, href, image_url, image_alt, sort_order, enabled";

export async function getPublicAboutContent(): Promise<PublicAboutContent> {
  const supabase = getSupabasePublicServerClient();

  if (!supabase) {
    const fallbackContent = {
      ...fallbackPublicAboutContent,
      diagnostics: {
        ...fallbackPublicAboutContent.diagnostics,
        errors: {
          unexpected: "Supabase public server client is not configured."
        }
      }
    };

    if (process.env.NODE_ENV === "development") {
      console.info("About content source diagnostics:", fallbackContent.diagnostics);
    }

    return fallbackContent;
  }

  try {
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
        .eq("enabled", true)
        .order("sort_order", { ascending: true, nullsFirst: false }),
      supabase
        .from("about_paw_notes")
        .select(aboutNoteColumns)
        .eq("enabled", true)
        .order("sort_order", { ascending: true, nullsFirst: false }),
      supabase
        .from("about_collection_section_settings")
        .select(aboutCollectionSectionColumns)
        .eq("section_key", "about_collections")
        .maybeSingle(),
      supabase
        .from("about_collection_cards")
        .select(aboutCollectionCardColumns)
        .eq("enabled", true)
        .order("sort_order", { ascending: true, nullsFirst: false })
    ]);

    const queryErrors: AboutContentDiagnostics["errors"] = {
      hero: heroResult.error?.message,
      pawSettings: settingsResult.error?.message,
      routes: routesResult.error?.message,
      notes: notesResult.error?.message,
      collectionSection: collectionSectionResult.error?.message,
      collectionCards: collectionCardsResult.error?.message
    };
    const hasQueryErrors = Object.values(queryErrors).some(Boolean);

    if (hasQueryErrors) {
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to load public About content:", queryErrors);
      }
    }

    const content = publicAboutContentFromRows({
      hero: heroResult.error ? null : heroResult.data,
      pawSettings: settingsResult.error ? null : settingsResult.data,
      routes: routesResult.error ? null : routesResult.data,
      notes: notesResult.error ? null : notesResult.data,
      collectionSection: collectionSectionResult.error ? null : collectionSectionResult.data,
      collectionCards: collectionCardsResult.error ? null : collectionCardsResult.data,
      errors: queryErrors
    });

    if (process.env.NODE_ENV === "development") {
      console.info("About content source diagnostics:", content.diagnostics);
    }

    return content;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unable to load public About content:", error);
    }
    return {
      ...fallbackPublicAboutContent,
      diagnostics: {
        ...fallbackPublicAboutContent.diagnostics,
        errors: {
          unexpected: error instanceof Error ? error.message : "Unexpected About content fetch error."
        }
      }
    };
  }
}

export const getPublicAboutPawContent = getPublicAboutContent;
