"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { type AdminLabelKey, useAdminLanguage } from "@/components/admin/admin-language";
import {
  buildHomepageHeroValue,
  buildHomepageTrustBadgesValue,
  defaultHomepageHero,
  homepageHeroFromValue,
  homepageHeroSettingKey,
  homepageTrustBadgeIconKeys,
  homepageTrustBadgesFromValue,
  homepageTrustBadgesSettingKey,
  normalizeHomepageTrustBadgeIconKey,
  type HomepageHeroContent,
  type HomepageTrustBadge,
  type HomepageTrustBadgeIconKey
} from "@/lib/homepage-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type HomepageSettingRow = {
  key: string | null;
  value: unknown;
};

type EditableTrustBadge = HomepageTrustBadge & {
  id: string;
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-32 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const HOMEPAGE_IMAGE_BUCKET = "homepage-images";
const MAX_HOMEPAGE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedHomepageImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const iconLabelKeys = {
  truck: "iconTruck",
  shield: "iconShield",
  heart: "iconHeart",
  star: "iconStar",
  sparkles: "iconSparkles",
  leaf: "iconLeaf",
  package: "iconPackage",
  check: "iconCheck",
  rotate: "iconRotate",
  lock: "iconLock"
} as const satisfies Record<HomepageTrustBadgeIconKey, AdminLabelKey>;

function createBadgeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `badge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function editableBadgesFromValue(value: unknown): EditableTrustBadge[] {
  return homepageTrustBadgesFromValue(value).map((badge) => ({
    ...badge,
    id: createBadgeId()
  }));
}

function settingRowsByKey(rows: HomepageSettingRow[]) {
  return new Map(rows.map((row) => [row.key, row.value]));
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "");
}

function safeFileName(fileName: string) {
  return sanitizePathSegment(fileName) || "homepage-image";
}

function HeroField({
  label,
  value,
  textarea = false,
  onChange
}: {
  label: string;
  value: string;
  textarea?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      {textarea ? (
        <textarea className={textareaClass} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function AdminHomepageFormContent() {
  const { t } = useAdminLanguage();
  const supabase = getSupabaseBrowserClient();
  const [hero, setHero] = useState<HomepageHeroContent>(defaultHomepageHero);
  const [badges, setBadges] = useState<EditableTrustBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError(t("supabaseMissing"));
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadHomepageSettings() {
      try {
        const { data, error: loadError } = await browserSupabase
          .from("homepage_settings")
          .select("key, value")
          .in("key", [homepageHeroSettingKey, homepageTrustBadgesSettingKey]);

        if (loadError) {
          throw loadError;
        }

        if (!active) {
          return;
        }

        const rowsByKey = settingRowsByKey((data ?? []) as HomepageSettingRow[]);

        setHero(homepageHeroFromValue(rowsByKey.get(homepageHeroSettingKey)));
        setBadges(editableBadgesFromValue(rowsByKey.get(homepageTrustBadgesSettingKey)));
      } catch (loadError: unknown) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadHomepage"));
          setHero(defaultHomepageHero);
          setBadges(editableBadgesFromValue(undefined));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHomepageSettings();

    return () => {
      active = false;
    };
  }, [supabase, t]);

  const savedBadges = useMemo(
    () =>
      badges
        .map((badge) => ({
          key: badge.key,
          icon: normalizeHomepageTrustBadgeIconKey(badge.icon),
          title: badge.title
        }))
        .filter((badge) => badge.title.trim()),
    [badges]
  );

  const updateHeroField = (field: keyof HomepageHeroContent, value: string) => {
    setHero((currentHero) => ({
      ...currentHero,
      [field]: value
    }));
  };

  const updateBadge = (id: string, field: keyof HomepageTrustBadge, value: string) => {
    setBadges((currentBadges) =>
      currentBadges.map((badge) =>
        badge.id === id
          ? {
              ...badge,
              [field]: field === "icon" ? normalizeHomepageTrustBadgeIconKey(value) : value
            }
          : badge
      )
    );
  };

  const addBadge = () => {
    setBadges((currentBadges) => [
      ...currentBadges,
      {
        id: createBadgeId(),
        key: `trust-badge-${currentBadges.length + 1}`,
        icon: "truck",
        title: ""
      }
    ]);
  };

  const removeBadge = (id: string) => {
    setBadges((currentBadges) => currentBadges.filter((badge) => badge.id !== id));
  };

  const moveBadge = (id: string, direction: "up" | "down") => {
    setBadges((currentBadges) => {
      const index = currentBadges.findIndex((badge) => badge.id === id);
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= currentBadges.length) {
        return currentBadges;
      }

      const nextBadges = [...currentBadges];
      const [movedBadge] = nextBadges.splice(index, 1);

      nextBadges.splice(nextIndex, 0, movedBadge);

      return nextBadges;
    });
  };

  const uploadHomepageImage = async (file: File) => {
    if (!supabase) {
      throw new Error(t("uploadConfigMissing"));
    }

    if (!acceptedHomepageImageTypes.has(file.type)) {
      throw new Error(t("chooseValidImage"));
    }

    if (file.size > MAX_HOMEPAGE_IMAGE_SIZE_BYTES) {
      throw new Error(t("imageSizeLimit"));
    }

    const storagePath = `homepage/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadErrorResult } = await supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (uploadErrorResult) {
      throw uploadErrorResult;
    }

    const { data } = supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  };

  const handleHeroImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    setUploadingHeroImage(true);

    try {
      const publicUrl = await uploadHomepageImage(file);

      updateHeroField("imageUrl", publicUrl);
      setUploadMessage(t("homepageImageUploaded"));
    } catch (uploadErrorResult: unknown) {
      setUploadError(
        uploadErrorResult instanceof Error ? uploadErrorResult.message : t("unableToUploadHomepageImage")
      );
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError(t("supabaseMissing"));
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    const { error: saveError } = await supabase.from("homepage_settings").upsert(
      [
        {
          key: homepageHeroSettingKey,
          status: "active",
          value: buildHomepageHeroValue(hero)
        },
        {
          key: homepageTrustBadgesSettingKey,
          status: "active",
          value: buildHomepageTrustBadgesValue(savedBadges)
        }
      ],
      { onConflict: "key" }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message || t("unableToSaveHomepage"));
      return;
    }

    setSuccessMessage(t("homepageSaved"));
  };

  const handleBadgeIconChange = (id: string) => (event: ChangeEvent<HTMLSelectElement>) => {
    updateBadge(id, "icon", event.target.value);
  };

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingHomepage")}
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="ambient-card border border-error/30 p-4 text-sm font-semibold text-error" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="ambient-card border border-primary/20 p-4 text-sm font-semibold text-primary" role="status">
          {successMessage}
        </div>
      )}

      <section className="ambient-card p-6 md:p-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">{t("heroContent")}</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t("homepageContentDescription")}</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <HeroField label={t("heroEyebrow")} value={hero.eyebrow} onChange={(value) => updateHeroField("eyebrow", value)} />
          <HeroField label={t("heroTitle")} value={hero.title} onChange={(value) => updateHeroField("title", value)} />
          <div className="md:col-span-2">
            <HeroField
              textarea
              label={t("heroSubtitle")}
              value={hero.subtitle}
              onChange={(value) => updateHeroField("subtitle", value)}
            />
          </div>
          <HeroField
            label={t("primaryButtonText")}
            value={hero.primaryButtonText}
            onChange={(value) => updateHeroField("primaryButtonText", value)}
          />
          <HeroField
            label={t("primaryButtonLink")}
            value={hero.primaryButtonLink}
            onChange={(value) => updateHeroField("primaryButtonLink", value)}
          />
          <HeroField
            label={t("secondaryButtonText")}
            value={hero.secondaryButtonText}
            onChange={(value) => updateHeroField("secondaryButtonText", value)}
          />
          <HeroField
            label={t("secondaryButtonLink")}
            value={hero.secondaryButtonLink}
            onChange={(value) => updateHeroField("secondaryButtonLink", value)}
          />
          <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {t("heroImageUrl")}
              <input
                className={inputClass}
                value={hero.imageUrl}
                onChange={(event) => updateHeroField("imageUrl", event.target.value)}
              />
            </label>

            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-on-surface">
                {t("uploadHomepageImage")}
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-heading file:text-sm file:font-bold file:text-white hover:file:bg-primary/90"
                  disabled={uploadingHeroImage}
                  type="file"
                  onChange={handleHeroImageUpload}
                />
              </label>
              <p className="text-xs font-semibold leading-5 text-on-surface-variant">
                {t("homepageImageUploadHelper")}
              </p>
              {uploadingHeroImage && (
                <p className="text-sm font-semibold text-on-surface-variant">{t("uploadingImage")}</p>
              )}
              {uploadMessage && (
                <p className="text-sm font-semibold text-primary" role="status">
                  {uploadMessage}
                </p>
              )}
              {uploadError && (
                <p className="text-sm font-semibold text-error" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            {hero.imageUrl ? (
              <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-surface-container-lowest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.imageUrl} alt={hero.imageAlt || t("heroImagePreview")} className="h-full w-full object-cover" />
                </div>
                <p className="break-all text-sm leading-6 text-on-surface-variant">{hero.imageUrl}</p>
              </div>
            ) : (
              <p className="rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
                {t("noHomepageImage")}
              </p>
            )}
          </div>
          <HeroField
            label={t("heroImageAltText")}
            value={hero.imageAlt}
            onChange={(value) => updateHeroField("imageAlt", value)}
          />
          <HeroField
            label={t("featuredLabel")}
            value={hero.featuredLabel}
            onChange={(value) => updateHeroField("featuredLabel", value)}
          />
          <HeroField
            label={t("featuredText")}
            value={hero.featuredText}
            onChange={(value) => updateHeroField("featuredText", value)}
          />
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">{t("trustBadges")}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t("trustBadgesDescription")}</p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit rounded-full bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
            onClick={addBadge}
          >
            {t("addBadge")}
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {badges.length === 0 ? (
            <p className="rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface-variant">
              {t("noTrustBadges")}
            </p>
          ) : (
            badges.map((badge, index) => (
              <div key={badge.id} className="rounded-md border border-outline-variant bg-surface-container-low p-4">
                <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <label className="grid gap-2 text-sm font-semibold text-on-surface">
                    {t("trustBadgeIcon")}
                    <select className={inputClass} value={badge.icon} onChange={handleBadgeIconChange(badge.id)}>
                      {homepageTrustBadgeIconKeys.map((icon) => (
                        <option key={icon} value={icon}>
                          {t(iconLabelKeys[icon])}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-on-surface">
                    {t("trustBadgeTitle")}
                    <input
                      className={inputClass}
                      value={badge.title}
                      onChange={(event) => updateBadge(badge.id, "title", event.target.value)}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={index === 0}
                    onClick={() => moveBadge(badge.id, "up")}
                  >
                    {t("moveUp")}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={index === badges.length - 1}
                    onClick={() => moveBadge(badge.id, "down")}
                  >
                    {t("moveDown")}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-error/40 bg-white px-4 py-2 text-xs font-bold text-error transition hover:bg-error/10"
                    onClick={() => removeBadge(badge.id)}
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t("saving") : t("saveHomepage")}
        </button>
      </div>
    </form>
  );
}

export function AdminHomepageSettings() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "首页", en: "Homepage" }}
          description={{ zh: "管理首页内容和信任标识。", en: "Manage homepage hero content and trust badges." }}
          backLink
        >
          <AdminHomepageFormContent />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
