"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatAdminStatus, useAdminLanguage } from "@/components/admin/admin-language";
import { defaultCategorySortOrder } from "@/lib/admin-categories";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminCategoryRow = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
  status: string | null;
  sort_order: number | string | null;
  show_in_nav: boolean | null;
  show_on_home: boolean | null;
  created_at: string | null;
};

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function numberFromValue(value: number | string | null) {
  if (value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function sortOrderFromRow(category: AdminCategoryRow) {
  const value = numberFromValue(category.sort_order);

  return value !== null && value > 0 ? value : defaultCategorySortOrder;
}

function displaySortOrder(category: AdminCategoryRow, defaultLabel: string) {
  const value = sortOrderFromRow(category);

  return value === defaultCategorySortOrder ? defaultLabel : String(value);
}

function CategoriesTable() {
  const { accessToken } = useAdminAuth();
  const { t } = useAdminLanguage();
  const supabase = getSupabaseBrowserClient();
  const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [archivingId, setArchivingId] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError(t("supabaseMissing"));
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadCategories() {
      try {
        const { data, error } = await browserSupabase
          .from("product_categories")
          .select(
            "id, name, slug, description, image_url, seo_title, seo_description, google_product_category, status, sort_order, show_in_nav, show_on_home, created_at, updated_at"
          )
          .order("sort_order", { ascending: true, nullsFirst: false });

        if (error) {
          throw error;
        }

        if (active) {
          setCategories((data ?? []) as AdminCategoryRow[]);
        }
      } catch (loadError: unknown) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadCategories"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, [supabase, t]);

  const hasCategories = useMemo(() => categories.length > 0, [categories]);

  const handleArchive = async (category: AdminCategoryRow) => {
    if (category.status === "archived") {
      return;
    }

    const confirmed = window.confirm(
      `${t("archive")} ${displayValue(category.name, t("notProvided"))}? ${t("archiveCategoryConfirmSuffix")}`
    );

    if (!confirmed) {
      return;
    }

    setActionError("");
    setArchivingId(category.id);

    const response = await fetch(`/api/admin/categories/${encodeURIComponent(category.id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "archive" })
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setActionError(payload.error ?? t("unableToArchiveCategory"));
      setArchivingId("");
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.map((currentCategory) =>
        currentCategory.id === category.id ? { ...currentCategory, status: "archived" } : currentCategory
      )
    );
    setArchivingId("");
  };

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

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="ambient-card border border-error/30 p-4 text-sm font-semibold text-error" role="alert">
          {actionError}
        </div>
      )}

      {!hasCategories ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {t("noCategoriesYet")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3">{t("name")}</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-4 py-3">{t("status")}</th>
                  <th className="px-4 py-3">{t("sortOrder")}</th>
                  <th className="px-4 py-3">{t("showInNav")}</th>
                  <th className="px-4 py-3">{t("showOnHome")}</th>
                  <th className="sticky right-0 z-30 min-w-[250px] border-l border-outline-variant bg-surface-container-low px-4 py-3 shadow-[-10px_0_22px_rgba(67,45,31,0.10)]">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-4 font-semibold text-on-surface">
                      {displayValue(category.name, t("notProvided"))}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {displayValue(category.slug, t("notProvided"))}
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatAdminStatus(category.status, t)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displaySortOrder(category, t("default"))}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{category.show_in_nav ? t("yes") : t("no")}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{category.show_on_home ? t("yes") : t("no")}</td>
                    <td className="sticky right-0 z-10 border-l border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-[-10px_0_22px_rgba(67,45,31,0.10)]">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="inline-flex rounded-full border border-primary px-3 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                        >
                          {t("view")}
                        </Link>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="inline-flex rounded-full bg-primary px-3 py-2 font-heading text-xs font-bold text-white transition hover:bg-primary/90"
                        >
                          {t("edit")}
                        </Link>
                        {category.status !== "archived" && (
                          <button
                            type="button"
                            className="inline-flex rounded-full border border-error/40 px-3 py-2 font-heading text-xs font-bold text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={archivingId === category.id}
                            onClick={() => handleArchive(category)}
                          >
                            {archivingId === category.id ? t("archiving") : t("archive")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryVisibilityNote() {
  const { t } = useAdminLanguage();

  return t("categoryVisibilityNote");
}

function AddCategoryLabel() {
  const { t } = useAdminLanguage();

  return t("addCategory");
}

export function AdminCategories() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title={{ zh: "分类", en: "Categories" }} description={{ zh: "管理 Supabase 商品分类记录", en: "Manage Supabase product category records." }} layout="wide" backLink>
          <div className="space-y-6">
            <div className="ambient-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <p className="max-w-3xl text-sm leading-6 text-on-surface-variant">
                <CategoryVisibilityNote />
              </p>
              <Link
                href="/admin/categories/new"
                className="inline-flex w-fit rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
              >
                <AddCategoryLabel />
              </Link>
            </div>
            <CategoriesTable />
          </div>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
