import "server-only";

import {
  aboutPawContentFromRows,
  fallbackAboutPawContent,
  type AboutPawContent
} from "@/lib/about-paw-content";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const aboutSettingsColumns = "id, section_label, title, subtitle, supporting_line";
const aboutRouteColumns =
  "id, route_key, label, icon_key, recommendation_title, recommendation_description, note_text, cta_label, cta_href, secondary_cta_label, secondary_cta_href, sort_order, enabled";
const aboutNoteColumns = "id, note_key, keyword, secondary_text, icon_key, sort_order, enabled";

export async function getPublicAboutPawContent(): Promise<AboutPawContent> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return fallbackAboutPawContent;
  }

  try {
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
      console.error("Unable to load public About Paw Path content:", {
        settings: settingsResult.error?.message,
        routes: routesResult.error?.message,
        notes: notesResult.error?.message
      });
    }

    return aboutPawContentFromRows({
      settings: settingsResult.error ? null : settingsResult.data,
      routes: routesResult.error ? null : routesResult.data,
      notes: notesResult.error ? null : notesResult.data
    });
  } catch (error) {
    console.error("Unable to load public About Paw Path content:", error);
    return fallbackAboutPawContent;
  }
}
