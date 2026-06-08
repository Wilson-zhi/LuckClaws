import "server-only";

import {
  homepageHeroFromValue,
  homepageHeroSettingKey,
  homepageSettingValueIsActive,
  homepageTrustBadgesFromValue,
  homepageTrustBadgesSettingKey,
  type HomepageHeroContent,
  type HomepageTrustBadge
} from "@/lib/homepage-content";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type HomepageSettingRow = {
  key: string | null;
  value: unknown;
  active?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
};

export type PublicHomepageSettings = {
  hero: HomepageHeroContent;
  trustBadges: HomepageTrustBadge[];
};

function rowIsActive(row: HomepageSettingRow) {
  if (row.active === false || row.is_active === false) {
    return false;
  }

  if (typeof row.status === "string" && row.status.trim().toLowerCase() !== "active") {
    return false;
  }

  return homepageSettingValueIsActive(row.value);
}

async function fetchRowsWithSelect(selectColumns: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { rows: [] as HomepageSettingRow[], error: null };
  }

  const { data, error } = await supabase
    .from("homepage_settings")
    .select(selectColumns)
    .in("key", [homepageHeroSettingKey, homepageTrustBadgesSettingKey]);

  return {
    rows: (data ?? []) as unknown as HomepageSettingRow[],
    error
  };
}

async function fetchHomepageSettingRows() {
  const withStatus = await fetchRowsWithSelect("key, value, status, is_active, active");

  if (!withStatus.error) {
    return withStatus.rows;
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

  return {
    hero: homepageHeroFromValue(heroRow?.value),
    trustBadges: homepageTrustBadgesFromValue(trustBadgesRow?.value)
  };
}
