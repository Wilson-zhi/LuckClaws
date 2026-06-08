"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { type AdminLabelKey, useAdminLanguage } from "@/components/admin/admin-language";
import { categoryStatuses, slugifyCategoryName } from "@/lib/admin-categories";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type CategoryFormMode = "create" | "edit";

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status: string;
  sort_order: string;
  show_in_nav: boolean;
  show_on_home: boolean;
  seo_title: string;
  seo_description: string;
  google_product_category: string;
};

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

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  status: "active",
  sort_order: "",
  show_in_nav: true,
  show_on_home: true,
  seo_title: "",
  seo_description: "",
  google_product_category: ""
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-32 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const CATEGORY_IMAGE_BUCKET = "category-images";
const MAX_CATEGORY_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedCategoryImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const categorySelectColumns =
  "id, name, slug, description, image_url, seo_title, seo_description, google_product_category, status, sort_order, show_in_nav, show_on_home, created_at, updated_at";

function formFromCategory(category: AdminCategoryDetailRow): CategoryFormState {
  return {
    name: category.name ?? "",
    slug: category.slug ?? "",
    description: category.description ?? "",
    image_url: category.image_url ?? "",
    status: category.status ?? "draft",
    sort_order: category.sort_order === null || category.sort_order === undefined ? "" : String(category.sort_order),
    show_in_nav: Boolean(category.show_in_nav),
    show_on_home: Boolean(category.show_on_home),
    seo_title: category.seo_title ?? "",
    seo_description: category.seo_description ?? "",
    google_product_category: category.google_product_category ?? ""
  };
}

function validateForm(form: CategoryFormState, t: (key: AdminLabelKey) => string) {
  const errors: Record<string, string> = {};
  const sortOrder = Number(form.sort_order);

  if (!form.name.trim()) {
    errors.name = t("nameRequired");
  }

  if (!form.slug.trim()) {
    errors.slug = t("slugRequired");
  } else if (!slugPattern.test(form.slug.trim())) {
    errors.slug = t("slugInvalid");
  }

  if (!categoryStatuses.includes(form.status as (typeof categoryStatuses)[number])) {
    errors.status = t("categoryStatusInvalid");
  }

  if (
    form.sort_order.trim() &&
    (!Number.isFinite(sortOrder) || !Number.isInteger(sortOrder) || sortOrder <= 0)
  ) {
    errors.sort_order = t("sortInvalid");
  }

  return errors;
}

function nullableFormValue(value: string) {
  const cleaned = value.trim();

  return cleaned || null;
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
  return sanitizePathSegment(fileName) || "category-image";
}

function buildPayload(form: CategoryFormState, includeUpdatedAt = false) {
  const sortOrder = form.sort_order.trim() ? Number(form.sort_order) : null;

  return {
    name: form.name.trim(),
    slug: form.slug.trim() || slugifyCategoryName(form.name),
    description: nullableFormValue(form.description),
    image_url: nullableFormValue(form.image_url),
    status: form.status,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : null,
    show_in_nav: form.show_in_nav,
    show_on_home: form.show_on_home,
    seo_title: nullableFormValue(form.seo_title),
    seo_description: nullableFormValue(form.seo_description),
    google_product_category: nullableFormValue(form.google_product_category),
    ...(includeUpdatedAt ? { updated_at: new Date().toISOString() } : {})
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-semibold text-error">{message}</p>;
}

function CategoryFormContent({ mode, categoryId }: { mode: CategoryFormMode; categoryId?: string }) {
  const router = useRouter();
  useAdminAuth();
  const { t } = useAdminLanguage();
  const supabase = getSupabaseBrowserClient();
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !categoryId) {
      return;
    }

    if (!supabase) {
      setFormError(t("supabaseMissing"));
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

        if (!data) {
          if (active) {
            setNotFound(true);
          }
          return;
        }

        if (active) {
          setForm(formFromCategory(data as AdminCategoryDetailRow));
        }
      } catch (loadError: unknown) {
        if (active) {
          setFormError(loadError instanceof Error ? loadError.message : t("unableToLoadCategory"));
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
  }, [categoryId, mode, supabase, t]);

  const updateField = <Field extends keyof CategoryFormState>(field: Field, value: CategoryFormState[Field]) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const updateName = (name: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      name,
      slug: currentForm.slug ? currentForm.slug : slugifyCategoryName(name)
    }));
  };

  const uploadCategoryImage = async (file: File) => {
    if (!supabase) {
      throw new Error(t("uploadConfigMissing"));
    }

    if (!acceptedCategoryImageTypes.has(file.type)) {
      throw new Error(t("chooseValidImage"));
    }

    if (file.size > MAX_CATEGORY_IMAGE_SIZE_BYTES) {
      throw new Error(t("imageSizeLimit"));
    }

    const folder = sanitizePathSegment(form.slug || categoryId || "uploads") || "uploads";
    const storagePath = `categories/${folder}/${Date.now()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage.from(CATEGORY_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(CATEGORY_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  };

  const handleCategoryImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    setUploadingImage(true);

    try {
      const publicUrl = await uploadCategoryImage(file);

      updateField("image_url", publicUrl);
      setUploadMessage(t("categoryImageUploaded"));
    } catch (uploadErrorResult: unknown) {
      setUploadError(uploadErrorResult instanceof Error ? uploadErrorResult.message : t("unableToUploadCategoryImage"));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(form, t);
    setErrors(validationErrors);
    setFormError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!supabase) {
      setFormError(t("supabaseMissing"));
      return;
    }

    setSaving(true);

    const payload = buildPayload(form, mode === "edit");
    const result =
      mode === "edit"
        ? await supabase
            .from("product_categories")
            .update(payload)
            .eq("id", categoryId ?? "")
            .select("id")
            .maybeSingle()
        : await supabase
            .from("product_categories")
            .insert(payload)
            .select("id")
            .single();

    setSaving(false);

    if (result.error) {
      setFormError(result.error.message || t("unableToSaveCategory"));
      return;
    }

    if (mode === "edit" && !result.data) {
      setNotFound(true);
      return;
    }

    router.push(mode === "edit" && categoryId ? `/admin/categories/${categoryId}` : "/admin/categories");
  };

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingCategories")}
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("categoryNotFound")}
      </div>
    );
  }

  return (
    <form className="ambient-card p-6 md:p-8" onSubmit={handleSubmit}>
      {formError && (
        <div className="mb-6 rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {formError}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("categoryName")}
          <input className={inputClass} value={form.name} onChange={(event) => updateName(event.target.value)} />
          <FieldError message={errors.name} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("categorySlug")}
          <input className={inputClass} value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
          {mode === "edit" && (
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              {t("categorySlugChangeWarning")}
            </p>
          )}
          <FieldError message={errors.slug} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          {t("categoryDescription")}
          <textarea
            className={textareaClass}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            {t("imageUrl")}
            <input
              className={inputClass}
              value={form.image_url}
              onChange={(event) => updateField("image_url", event.target.value)}
            />
          </label>

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {t("uploadCategoryImage")}
              <input
                accept="image/jpeg,image/png,image/webp"
                className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-heading file:text-sm file:font-bold file:text-white hover:file:bg-primary/90"
                disabled={uploadingImage}
                type="file"
                onChange={handleCategoryImageUpload}
              />
            </label>
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              {t("categoryImageUploadHelper")}
            </p>
            {uploadingImage && (
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

          {form.image_url ? (
            <div className="relative mt-2 h-40 w-40 overflow-hidden rounded-md bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt={t("categoryImagePreview")} className="h-full w-full object-cover" />
            </div>
          ) : (
            <p className="text-sm leading-6 text-on-surface-variant">{t("noCategoryImage")}</p>
          )}
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("status")}
          <select className={inputClass} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="active">{t("active")}</option>
            <option value="draft">{t("draft")}</option>
            <option value="archived">{t("archived")}</option>
          </select>
          <p className="text-xs font-semibold leading-5 text-on-surface-variant">{t("categoryStatusHelper")}</p>
          <FieldError message={errors.status} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("sortOrder")}
          <input
            className={inputClass}
            min="1"
            placeholder={t("default")}
            step="1"
            type="number"
            value={form.sort_order}
            onChange={(event) => updateField("sort_order", event.target.value)}
          />
          <p className="text-xs font-semibold leading-5 text-on-surface-variant">{t("sortOrderHelper")}</p>
          <FieldError message={errors.sort_order} />
        </label>

        <div className="rounded-md bg-surface-container-low p-4 md:col-span-2">
          <h2 className="font-heading text-lg font-bold text-on-surface">{t("categoryDisplay")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
              <input
                checked={form.show_in_nav}
                className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
                type="checkbox"
                onChange={(event) => updateField("show_in_nav", event.target.checked)}
              />
              {t("showInNav")}
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
              <input
                checked={form.show_on_home}
                className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
                type="checkbox"
                onChange={(event) => updateField("show_on_home", event.target.checked)}
              />
              {t("showOnHome")}
            </label>
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("seoTitle")}
          <input className={inputClass} value={form.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {t("googleProductCategory")}
          <input
            className={inputClass}
            value={form.google_product_category}
            onChange={(event) => updateField("google_product_category", event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          {t("seoDescription")}
          <textarea
            className={textareaClass}
            value={form.seo_description}
            onChange={(event) => updateField("seo_description", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={saving}
        >
          {saving ? t("saving") : mode === "edit" ? t("saveCategory") : t("addCategory")}
        </button>
        <button
          type="button"
          className="inline-flex rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          onClick={() => router.push("/admin/categories")}
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

export function AdminCategoryForm({ mode, categoryId }: { mode: CategoryFormMode; categoryId?: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={mode === "edit" ? { zh: "编辑分类", en: "Edit Category" } : { zh: "添加分类", en: "Add Category" }}
          description={
            mode === "edit"
              ? { zh: "更新 Supabase 商品分类记录", en: "Update a Supabase product category record." }
              : { zh: "创建 Supabase 商品分类记录", en: "Create a Supabase product category record." }
          }
          backLink={{ href: "/admin/categories", label: { zh: "返回分类", en: "Back to Categories" } }}
        >
          <CategoryFormContent mode={mode} categoryId={categoryId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
