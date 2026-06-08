"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatAdminStatus, useAdminLanguage } from "@/components/admin/admin-language";
import { defaultCategorySortOrder } from "@/lib/admin-categories";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminCategoryDetailRow = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
  sort_order: number | string | null;
  show_in_nav: boolean | null;
  show_on_home: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const categorySelectColumns =
  "id, name, slug, description, image_url, seo_title, seo_description, google_product_category, status, sort_order, show_in_nav, show_on_home, created_at, updated_at";

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function formatDate(value: string | null, unavailableLabel: string) {
  if (!value) {
    return unavailableLabel;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return unavailableLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function sortOrderDisplayValue(value: number | string | null, defaultLabel: string) {
  if (value === null || value === "") {
    return defaultLabel;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0 || numberValue === defaultCategorySortOrder) {
    return defaultLabel;
  }

  return String(numberValue);
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function CategoryDetailContent({ categoryId }: { categoryId: string }) {
  useAdminAuth();
  const { t } = useAdminLanguage();
  const supabase = getSupabaseBrowserClient();
  const [category, setCategory] = useState<AdminCategoryDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const unavailableLabel = t("unavailable");
  const notProvidedLabel = t("notProvided");

  useEffect(() => {
    if (!supabase) {
      setError(t("supabaseMissing"));
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadCategory() {
      try {
        const { data, error } = await browserSupabase
          .from("product_categories")
          .select(categorySelectColumns)
          .eq("id", categoryId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (active) {
          setCategory((data ?? null) as AdminCategoryDetailRow | null);
        }
      } catch (loadError: unknown) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadCategory"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategory();

    return () => {
      active = false;
    };
  }, [categoryId, supabase, t]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingCategories")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {error}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("categoryNotFound")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="inline-flex rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
        >
          {t("editCategory")}
        </Link>
        <Link
          href="/admin"
          className="inline-flex rounded-full border border-primary px-6 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
        >
          {t("backToAdmin")}
        </Link>
      </div>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{t("category")}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">{displayValue(category.name, notProvidedLabel)}</h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {formatAdminStatus(category.status, t)}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[180px_1fr]">
          <div>
            {category.image_url ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-md bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.image_url} alt={t("categoryImagePreview")} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="grid h-40 w-40 place-items-center rounded-md bg-surface-container text-center text-sm font-semibold text-on-surface-variant">
                {t("noCategoryImage")}
              </div>
            )}
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label={t("name")} value={displayValue(category.name, notProvidedLabel)} />
            <DetailField label="Slug" value={displayValue(category.slug, notProvidedLabel)} />
            <DetailField label={t("status")} value={formatAdminStatus(category.status, t)} />
            <DetailField label={t("sortOrder")} value={sortOrderDisplayValue(category.sort_order, t("default"))} />
            <DetailField label={t("showInNav")} value={category.show_in_nav ? t("yes") : t("no")} />
            <DetailField label={t("showOnHome")} value={category.show_on_home ? t("yes") : t("no")} />
            <DetailField label={t("created")} value={formatDate(category.created_at, unavailableLabel)} />
            <DetailField label={t("updated")} value={formatDate(category.updated_at, unavailableLabel)} />
          </dl>
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">{t("description")}</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-on-surface-variant">
          {displayValue(category.description, notProvidedLabel)}
        </p>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">SEO</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <DetailField label={t("seoTitle")} value={displayValue(category.seo_title, notProvidedLabel)} />
          <DetailField label={t("googleProductCategory")} value={displayValue(category.google_product_category, notProvidedLabel)} />
          <DetailField label={t("seoDescription")} value={displayValue(category.seo_description, notProvidedLabel)} />
        </dl>
      </section>
    </div>
  );
}

export function AdminCategoryDetail({ categoryId }: { categoryId: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "分类详情", en: "Category Detail" }}
          description={{ zh: "查看 Supabase 商品分类记录", en: "Review Supabase product category records." }}
          backLink={{ href: "/admin/categories", label: { zh: "返回分类", en: "Back to Categories" } }}
        >
          <CategoryDetailContent categoryId={categoryId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
