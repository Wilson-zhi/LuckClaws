"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { defaultProductSortOrder, homepageSections, inventoryStatuses, productStatuses } from "@/lib/admin-products";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type ProductFormMode = "create" | "edit";

type ProductFormState = {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  compare_at_price: string;
  currency: string;
  image_url: string;
  status: string;
  inventory_status: string;
  stock_quantity: string;
  is_featured: boolean;
  is_sale: boolean;
  sort_order: string;
  homepage_section: string;
  badge: string;
  published_at: string;
  short_description: string;
  product_highlights: string;
  detail_rows: string;
  best_for: string;
  care_instructions: string;
  product_faqs: string;
  accordion_sections: string;
  related_product_slugs: string;
  seo_title: string;
  seo_description: string;
  google_product_category: string;
};

type AdminProductDetailRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  description: string | null;
  price: number | string | null;
  compare_at_price: number | string | null;
  currency: string | null;
  image_url: string | null;
  status: string | null;
  inventory_status: string | null;
  stock_quantity: number | string | null;
  is_featured: boolean | null;
  is_sale: boolean | null;
  sort_order: number | string | null;
  homepage_section: string | null;
  badge: string | null;
  published_at: string | null;
  short_description: string | null;
  product_highlights: unknown;
  detail_rows: unknown;
  best_for: unknown;
  care_instructions: unknown;
  product_faqs: unknown;
  accordion_sections: unknown;
  related_product_slugs: unknown;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
};

type ProductResponse = {
  product?: AdminProductDetailRow;
  errors?: Record<string, string>;
  error?: string;
};

const emptyForm: ProductFormState = {
  title: "",
  slug: "",
  category: "",
  description: "",
  price: "",
  compare_at_price: "",
  currency: "USD",
  image_url: "",
  status: "active",
  inventory_status: "in_stock",
  stock_quantity: "",
  is_featured: false,
  is_sale: false,
  sort_order: "",
  homepage_section: "",
  badge: "",
  published_at: "",
  short_description: "",
  product_highlights: "",
  detail_rows: "",
  best_for: "",
  care_instructions: "",
  product_faqs: "",
  accordion_sections: "",
  related_product_slugs: "",
  seo_title: "",
  seo_description: "",
  google_product_category: ""
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-32 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const jsonTextareaClass = `${textareaClass} font-mono text-sm leading-6`;

const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const jsonFieldHelp =
  "Use valid JSON array format. Leave blank to use the product page fallback content.";

const productHighlightsExample = `[
  {
    "title": "Everyday play ready",
    "text": "Built for supervised daily enrichment.",
    "icon": "paw"
  }
]`;

const detailRowsExample = `[
  {
    "label": "Product type",
    "value": "Dog puzzle and enrichment toy"
  },
  {
    "label": "Material focus",
    "value": "Wood"
  }
]`;

const textItemsExample = `[
  {
    "text": "Supervised play sessions"
  },
  {
    "text": "Adding variety to daily activity"
  }
]`;

const productFaqsExample = `[
  {
    "question": "Is this product suitable for puppies?",
    "answer": "Use only with supervision and choose based on your pet's size and chewing habits."
  }
]`;

const accordionSectionsExample = `[
  {
    "title": "Product Details",
    "content": "Designed for supervised enrichment and everyday play."
  },
  {
    "title": "Safety Notice",
    "content": "Supervise pets during play and remove the toy if damaged."
  }
]`;

function stringValue(value: string | number | null) {
  return value === null ? "" : String(value);
}

function sortOrderFormValue(value: string | number | null) {
  if (value === null || value === "") {
    return "";
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed === defaultProductSortOrder) {
    return "";
  }

  return String(parsed);
}

function dateTimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

function jsonTextValue(value: unknown) {
  return Array.isArray(value) && value.length > 0 ? JSON.stringify(value, null, 2) : "";
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
  return sanitizePathSegment(fileName) || "product-image";
}

function formFromProduct(product: AdminProductDetailRow): ProductFormState {
  return {
    title: product.title ?? "",
    slug: product.slug ?? "",
    category: product.category ?? "",
    description: product.description ?? "",
    price: stringValue(product.price),
    compare_at_price: stringValue(product.compare_at_price),
    currency: product.currency ?? "USD",
    image_url: product.image_url ?? "",
    status: product.status ?? "active",
    inventory_status: product.inventory_status ?? "in_stock",
    stock_quantity: stringValue(product.stock_quantity),
    is_featured: Boolean(product.is_featured),
    is_sale: Boolean(product.is_sale),
    sort_order: sortOrderFormValue(product.sort_order),
    homepage_section: product.homepage_section ?? "",
    badge: product.badge ?? "",
    published_at: dateTimeLocalValue(product.published_at),
    short_description: product.short_description ?? "",
    product_highlights: jsonTextValue(product.product_highlights),
    detail_rows: jsonTextValue(product.detail_rows),
    best_for: jsonTextValue(product.best_for),
    care_instructions: jsonTextValue(product.care_instructions),
    product_faqs: jsonTextValue(product.product_faqs),
    accordion_sections: jsonTextValue(product.accordion_sections),
    related_product_slugs: Array.isArray(product.related_product_slugs)
      ? product.related_product_slugs
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
          .join(", ")
      : "",
    seo_title: product.seo_title ?? "",
    seo_description: product.seo_description ?? "",
    google_product_category: product.google_product_category ?? ""
  };
}

function buildPayload(form: ProductFormState) {
  const jsonArrayPayload = (value: string) => (value.trim() ? (JSON.parse(value) as unknown[]) : null);
  const relatedProductSlugs = form.related_product_slugs
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    description: form.description,
    price: form.price,
    compare_at_price: form.compare_at_price,
    currency: form.currency,
    image_url: form.image_url,
    status: form.status,
    inventory_status: form.inventory_status,
    stock_quantity: form.stock_quantity,
    is_featured: form.is_featured,
    is_sale: form.is_sale,
    sort_order: form.sort_order,
    homepage_section: form.homepage_section,
    badge: form.badge,
    published_at: form.published_at ? new Date(form.published_at).toISOString() : "",
    short_description: form.short_description,
    product_highlights: jsonArrayPayload(form.product_highlights),
    detail_rows: jsonArrayPayload(form.detail_rows),
    best_for: jsonArrayPayload(form.best_for),
    care_instructions: jsonArrayPayload(form.care_instructions),
    product_faqs: jsonArrayPayload(form.product_faqs),
    accordion_sections: jsonArrayPayload(form.accordion_sections),
    related_product_slugs: relatedProductSlugs.length > 0 ? relatedProductSlugs : null,
    seo_title: form.seo_title,
    seo_description: form.seo_description,
    google_product_category: form.google_product_category
  };
}

function validateJsonArrayField(
  errors: Record<string, string>,
  field: keyof ProductFormState,
  value: string,
  label: string
) {
  if (!value.trim()) {
    return;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      errors[field] = `${label} must be a JSON array.`;
    }
  } catch {
    errors[field] = `${label} must be valid JSON.`;
  }
}

function validateForm(form: ProductFormState) {
  const errors: Record<string, string> = {};
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const price = Number(form.price);

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!form.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(form.slug.trim())) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens.";
  }

  if (!form.price.trim()) {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be greater than or equal to 0.";
  }

  if (form.compare_at_price.trim()) {
    const compareAtPrice = Number(form.compare_at_price);

    if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
      errors.compare_at_price = "Compare at price must be greater than or equal to 0.";
    }
  }

  if (form.stock_quantity.trim()) {
    const stockQuantity = Number(form.stock_quantity);

    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      errors.stock_quantity = "Stock quantity must be greater than or equal to 0.";
    }
  }

  if (form.sort_order.trim()) {
    const sortOrder = Number(form.sort_order);

    if (!Number.isFinite(sortOrder) || !Number.isInteger(sortOrder) || sortOrder <= 0) {
      errors.sort_order = "Sort order must be a positive whole number, or leave it blank.";
    }
  }

  if (!productStatuses.includes(form.status as (typeof productStatuses)[number])) {
    errors.status = "Status must be active, draft, or archived.";
  }

  if (!inventoryStatuses.includes(form.inventory_status as (typeof inventoryStatuses)[number])) {
    errors.inventory_status = "Inventory status must be in stock, out of stock, or preorder.";
  }

  if (
    form.homepage_section &&
    !homepageSections.includes(form.homepage_section as (typeof homepageSections)[number])
  ) {
    errors.homepage_section = "Homepage section must be featured, best_seller, new_arrivals, or blank.";
  }

  if (form.published_at && Number.isNaN(new Date(form.published_at).getTime())) {
    errors.published_at = "Published date must be a valid date.";
  }

  validateJsonArrayField(errors, "product_highlights", form.product_highlights, "Product highlights");
  validateJsonArrayField(errors, "detail_rows", form.detail_rows, "Details at a Glance");
  validateJsonArrayField(errors, "best_for", form.best_for, "Best For");
  validateJsonArrayField(errors, "care_instructions", form.care_instructions, "Care Instructions");
  validateJsonArrayField(errors, "product_faqs", form.product_faqs, "Product FAQs");
  validateJsonArrayField(errors, "accordion_sections", form.accordion_sections, "Accordion sections");

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm font-semibold text-error" role="alert">
      {message}
    </p>
  );
}

function JsonArrayField({
  label,
  value,
  error,
  example,
  onChange
}: {
  label: string;
  value: string;
  error?: string;
  example: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      <textarea className={jsonTextareaClass} value={value} onChange={(event) => onChange(event.target.value)} />
      <p className="text-xs font-semibold leading-5 text-on-surface-variant">{jsonFieldHelp}</p>
      <details className="rounded-md bg-surface-container-lowest p-3 text-xs text-on-surface-variant">
        <summary className="cursor-pointer font-bold text-on-surface">Example format</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono leading-5">{example}</pre>
      </details>
      <FieldError message={error} />
    </label>
  );
}

function ProductFormContent({ mode, productId }: { mode: ProductFormMode; productId?: string }) {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const supabase = getSupabaseBrowserClient();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !productId) {
      return;
    }

    let active = true;

    fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as ProductResponse;

        if (!response.ok || !payload.product) {
          throw new Error(payload.error ?? "Unable to load product.");
        }

        if (active) {
          setForm(formFromProduct(payload.product));
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setFormError(loadError instanceof Error ? loadError.message : "Unable to load product.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [accessToken, mode, productId]);

  const updateField = <Field extends keyof ProductFormState>(field: Field, value: ProductFormState[Field]) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    if (!acceptedImageTypes.has(file.type)) {
      setUploadError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setUploadError("Image must be 5MB or smaller.");
      return;
    }

    if (!supabase) {
      setUploadError("Supabase is not configured for uploads in this build.");
      return;
    }

    setUploading(true);

    const folderSlug = sanitizePathSegment(form.slug) || "uploads";
    const storagePath = `products/${folderSlug}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadErrorResult } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false
      });

    if (uploadErrorResult) {
      setUploadError(uploadErrorResult.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);

    updateField("image_url", data.publicUrl);
    setUploadMessage("Image uploaded. Image URL has been updated.");
    setUploading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);

    const response = await fetch(mode === "edit" ? `/api/admin/products/${encodeURIComponent(productId ?? "")}` : "/api/admin/products", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload(form))
    });

    const payload = (await response.json()) as ProductResponse;

    if (!response.ok) {
      setErrors(payload.errors ?? {});
      setFormError(payload.error ?? "Unable to save product.");
      setSaving(false);
      return;
    }

    router.push(mode === "edit" && productId ? `/admin/products/${productId}` : "/admin/products");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading product...
      </div>
    );
  }

  if (mode === "edit" && formError && !form.title) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {formError}
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
          Title
          <input className={inputClass} value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          <FieldError message={errors.title} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Slug
          <input className={inputClass} value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
          {mode === "edit" && (
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              Changing slug may change the public product URL.
            </p>
          )}
          <FieldError message={errors.slug} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Category
          <input className={inputClass} value={form.category} onChange={(event) => updateField("category", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Price
          <input
            className={inputClass}
            min="0"
            step="0.01"
            type="number"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
          />
          <FieldError message={errors.price} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Compare at price
          <input
            className={inputClass}
            min="0"
            step="0.01"
            type="number"
            value={form.compare_at_price}
            onChange={(event) => updateField("compare_at_price", event.target.value)}
          />
          <FieldError message={errors.compare_at_price} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Currency
          <input className={inputClass} value={form.currency} onChange={(event) => updateField("currency", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          Image URL
          <input className={inputClass} value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} />
        </label>

        <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Upload product image
            <input
              accept="image/jpeg,image/png,image/webp"
              className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-heading file:font-bold file:text-on-primary-container"
              disabled={uploading}
              type="file"
              onChange={handleImageUpload}
            />
          </label>
          {uploading && <p className="text-sm font-semibold text-on-surface-variant">Uploading image...</p>}
          {uploadMessage && <p className="text-sm font-semibold text-primary">{uploadMessage}</p>}
          {uploadError && (
            <p className="text-sm font-semibold text-error" role="alert">
              {uploadError}
            </p>
          )}
          {form.image_url ? (
            <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
              <div className="aspect-square overflow-hidden rounded-md bg-surface-container-lowest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Product image preview" className="h-full w-full object-cover" />
              </div>
              <p className="break-all text-sm leading-6 text-on-surface-variant">{form.image_url}</p>
            </div>
          ) : null}
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Status
          <select className={inputClass} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <p className="text-xs font-semibold leading-5 text-on-surface-variant">
            active = visible publicly; draft = hidden from public storefront; archived = hidden and kept for record.
          </p>
          <FieldError message={errors.status} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Inventory status
          <select
            className={inputClass}
            value={form.inventory_status}
            onChange={(event) => updateField("inventory_status", event.target.value)}
          >
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="preorder">Preorder</option>
          </select>
          <FieldError message={errors.inventory_status} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Stock quantity
          <input
            className={inputClass}
            min="0"
            step="1"
            type="number"
            value={form.stock_quantity}
            onChange={(event) => updateField("stock_quantity", event.target.value)}
          />
          <FieldError message={errors.stock_quantity} />
        </label>

        <div className="grid gap-3 rounded-md bg-surface-container-low p-4 md:col-span-2 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
            <input
              checked={form.is_featured}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
              type="checkbox"
              onChange={(event) => updateField("is_featured", event.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
            <input
              checked={form.is_sale}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
              type="checkbox"
              onChange={(event) => updateField("is_sale", event.target.checked)}
            />
            Sale
          </label>
        </div>

        <div className="grid gap-5 rounded-md bg-surface-container-low p-4 md:col-span-2 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="font-heading text-lg font-bold text-on-surface">Storefront display</h2>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              Control product ordering, homepage placement, and card badges.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Sort order
            <input
              className={inputClass}
              min="1"
              placeholder="Default"
              step="1"
              type="number"
              value={form.sort_order}
              onChange={(event) => updateField("sort_order", event.target.value)}
            />
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              Lower numbers appear first. Leave blank/default for normal ordering.
            </p>
            <FieldError message={errors.sort_order} />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Homepage section
            <select
              className={inputClass}
              value={form.homepage_section}
              onChange={(event) => updateField("homepage_section", event.target.value)}
            >
              <option value="">None</option>
              <option value="featured">featured</option>
              <option value="best_seller">best_seller</option>
              <option value="new_arrivals">new_arrivals</option>
            </select>
            <FieldError message={errors.homepage_section} />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Badge
            <input
              className={inputClass}
              placeholder="Best Seller, New, Sale, Featured"
              value={form.badge}
              onChange={(event) => updateField("badge", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Published at
            <input
              className={inputClass}
              type="datetime-local"
              value={form.published_at}
              onChange={(event) => updateField("published_at", event.target.value)}
            />
            <FieldError message={errors.published_at} />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          Description
          <textarea className={textareaClass} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
        </label>

        <div className="grid gap-5 rounded-md bg-surface-container-low p-4 md:col-span-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-on-surface">Product detail content</h2>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              These fields control the public product detail page. Leave any field blank to keep the current fallback content.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Short description
            <textarea
              className={textareaClass}
              value={form.short_description}
              onChange={(event) => updateField("short_description", event.target.value)}
            />
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              Used near the top of the product page. Leave blank to use Description.
            </p>
          </label>

          <div className="grid gap-5 xl:grid-cols-2">
            <JsonArrayField
              label="Product Highlights"
              value={form.product_highlights}
              error={errors.product_highlights}
              example={productHighlightsExample}
              onChange={(value) => updateField("product_highlights", value)}
            />
            <JsonArrayField
              label="Details at a Glance"
              value={form.detail_rows}
              error={errors.detail_rows}
              example={detailRowsExample}
              onChange={(value) => updateField("detail_rows", value)}
            />
            <JsonArrayField
              label="Best For"
              value={form.best_for}
              error={errors.best_for}
              example={textItemsExample}
              onChange={(value) => updateField("best_for", value)}
            />
            <JsonArrayField
              label="Care Instructions"
              value={form.care_instructions}
              error={errors.care_instructions}
              example={textItemsExample}
              onChange={(value) => updateField("care_instructions", value)}
            />
            <JsonArrayField
              label="Product Questions / FAQ"
              value={form.product_faqs}
              error={errors.product_faqs}
              example={productFaqsExample}
              onChange={(value) => updateField("product_faqs", value)}
            />
            <JsonArrayField
              label="Accordion Sections"
              value={form.accordion_sections}
              error={errors.accordion_sections}
              example={accordionSectionsExample}
              onChange={(value) => updateField("accordion_sections", value)}
            />
          </div>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Related product slugs
            <input
              className={inputClass}
              placeholder="plush-foraging-toy, beginner-snuffle-mat"
              value={form.related_product_slugs}
              onChange={(event) => updateField("related_product_slugs", event.target.value)}
            />
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              Enter comma-separated slugs. Leave blank to use automatic related products.
            </p>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          SEO title
          <input className={inputClass} value={form.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          SEO description
          <textarea className={textareaClass} value={form.seo_description} onChange={(event) => updateField("seo_description", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          Google product category
          <input
            className={inputClass}
            value={form.google_product_category}
            onChange={(event) => updateField("google_product_category", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Product" : "Add Product"}
        </button>
        <button
          type="button"
          className="inline-flex rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AdminProductForm({ mode, productId }: { mode: ProductFormMode; productId?: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={mode === "edit" ? "Edit Product" : "Add Product"}
          description={mode === "edit" ? "Update a Supabase product record." : "Create a Supabase product record."}
          backLink={{ href: "/admin/products", label: "Back to Products" }}
        >
          <ProductFormContent mode={mode} productId={productId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
