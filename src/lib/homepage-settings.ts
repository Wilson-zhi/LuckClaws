import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  homepageDecisionGuideFromValue,
  homepageDecisionGuideSettingKey,
  homepageCategorySectionFromValue,
  homepageCategorySectionSettingKey,
  homepageHeroFromValue,
  homepageHeroSettingKey,
  homepageNewsletterFromValue,
  homepageNewsletterSettingKey,
  homepageServicePromisesFromValue,
  homepageServicePromisesSettingKey,
  homepageStorySectionFromValue,
  homepageStorySectionSettingKey,
  homepageTrustBadgesFromValue,
  homepageTrustBadgesSettingKey,
  type HomepageCategorySectionContent,
  type HomepageDecisionGuideContent,
  type HomepageHeroContent,
  type HomepageNewsletterContent,
  type HomepageServicePromisesContent,
  type HomepageStorySectionContent,
  type HomepageTrustBadge
} from "@/lib/homepage-content";

type HomepageSettingRow = {
  key: string | null;
  value: unknown;
  status?: string | null;
};

export type PublicHomepageSettings = {
  hero: HomepageHeroContent;
  trustBadges: HomepageTrustBadge[];
  categorySection: HomepageCategorySectionContent;
  storySection: HomepageStorySectionContent;
  decisionGuide: HomepageDecisionGuideContent;
  servicePromises: HomepageServicePromisesContent;
  newsletter: HomepageNewsletterContent;
};

let homepagePublicClient: SupabaseClient | null = null;

function getHomepagePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!homepagePublicClient) {
    homepagePublicClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return homepagePublicClient;
}

function rowIsActive(row: HomepageSettingRow) {
  if (typeof row.status === "string") {
    return row.status.trim().toLowerCase() === "active";
  }

  return true;
}

async function fetchRowsWithSelect(selectColumns: string, activeOnly = false) {
  const supabase = getHomepagePublicClient();

  if (!supabase) {
    return { rows: [] as HomepageSettingRow[], error: null };
  }

  let query = supabase
    .from("homepage_settings")
    .select(selectColumns)
    .in("key", [
      homepageHeroSettingKey,
      homepageTrustBadgesSettingKey,
      homepageCategorySectionSettingKey,
      homepageStorySectionSettingKey,
      homepageDecisionGuideSettingKey,
      homepageServicePromisesSettingKey,
      homepageNewsletterSettingKey
    ]);

  if (activeOnly) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;

  return {
    rows: (data ?? []) as unknown as HomepageSettingRow[],
    error
  };
}

async function fetchHomepageSettingRows() {
  const withStatus = await fetchRowsWithSelect("key, value, status", true);

  if (!withStatus.error && withStatus.rows.length > 0) {
    return withStatus.rows;
  }

  const withStatusNoFilter = await fetchRowsWithSelect("key, value, status");

  if (!withStatusNoFilter.error && withStatusNoFilter.rows.length > 0) {
    return withStatusNoFilter.rows.filter(rowIsActive);
  }

  const base = await fetchRowsWithSelect("key, value");

  if (base.error) {
    return [];
  }

  return base.rows;
}

export async function getPublicHomepageSettings(): Promise<PublicHomepageSettings> {
  const rows = await fetchHomepageSettingRows();
  const heroRow = rows.find((row) => row.key === homepageHeroSettingKey && rowIsActive(row));
  const trustBadgesRow = rows.find((row) => row.key === homepageTrustBadgesSettingKey && rowIsActive(row));
  const categorySectionRow = rows.find(
    (row) => row.key === homepageCategorySectionSettingKey && rowIsActive(row)
  );
  const storySectionRow = rows.find((row) => row.key === homepageStorySectionSettingKey && rowIsActive(row));
  const decisionGuideRow = rows.find((row) => row.key === homepageDecisionGuideSettingKey && rowIsActive(row));
  const servicePromisesRow = rows.find((row) => row.key === homepageServicePromisesSettingKey && rowIsActive(row));
  const newsletterRow = rows.find((row) => row.key === homepageNewsletterSettingKey && rowIsActive(row));

  return {
    hero: homepageHeroFromValue(heroRow?.value),
    trustBadges: homepageTrustBadgesFromValue(trustBadgesRow?.value),
    categorySection: homepageCategorySectionFromValue(categorySectionRow?.value),
    storySection: homepageStorySectionFromValue(storySectionRow?.value),
    decisionGuide: homepageDecisionGuideFromValue(decisionGuideRow?.value),
    servicePromises: homepageServicePromisesFromValue(servicePromisesRow?.value),
    newsletter: homepageNewsletterFromValue(newsletterRow?.value)
  };
}
