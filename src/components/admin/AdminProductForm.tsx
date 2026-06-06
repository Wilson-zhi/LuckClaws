"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { defaultProductSortOrder, homepageSections, inventoryStatuses, productStatuses } from "@/lib/admin-products";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type ProductFormMode = "create" | "edit";

type ProductHighlightFormItem = {
  title: string;
  text: string;
  icon: string;
};

type DetailRowFormItem = {
  label: string;
  value: string;
};

type TextItemFormItem = {
  text: string;
};

type ProductFaqFormItem = {
  question: string;
  answer: string;
};

type AccordionSectionFormItem = {
  title: string;
  content: string;
};

type RelatedProductSlugFormItem = {
  slug: string;
};

type ProductGalleryImageFormItem = {
  url: string;
  alt: string;
  position: number;
  is_primary: boolean;
};

type ProductFormState = {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  compare_at_price: string;
  currency: string;
  image_url: string;
  image_alt: string;
  images: ProductGalleryImageFormItem[];
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
  product_highlights: ProductHighlightFormItem[];
  detail_rows: DetailRowFormItem[];
  best_for: TextItemFormItem[];
  care_instructions: TextItemFormItem[];
  product_faqs: ProductFaqFormItem[];
  accordion_sections: AccordionSectionFormItem[];
  related_product_slugs: RelatedProductSlugFormItem[];
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
  image_alt: string | null;
  images: unknown;
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
  image_alt: "",
  images: [],
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
  product_highlights: [],
  detail_rows: [],
  best_for: [],
  care_instructions: [],
  product_faqs: [],
  accordion_sections: [],
  related_product_slugs: [],
  seo_title: "",
  seo_description: "",
  google_product_category: ""
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-32 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

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

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordFromUnknown(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function arrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function productHighlightsFormValue(value: unknown): ProductHighlightFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);

      return {
        title: cleanText(record?.title),
        text: cleanText(record?.text),
        icon: cleanText(record?.icon)
      };
    })
    .filter((item) => item.title || item.text || item.icon);
}

function detailRowsFormValue(value: unknown): DetailRowFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);

      return {
        label: cleanText(record?.label),
        value: cleanText(record?.value)
      };
    })
    .filter((item) => item.label || item.value);
}

function textItemsFormValue(value: unknown): TextItemFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      if (typeof item === "string") {
        return { text: cleanText(item) };
      }

      const record = recordFromUnknown(item);

      return {
        text: cleanText(record?.text)
      };
    })
    .filter((item) => item.text);
}

function productFaqsFormValue(value: unknown): ProductFaqFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);

      return {
        question: cleanText(record?.question) || cleanText(record?.title),
        answer: cleanText(record?.answer) || cleanText(record?.content)
      };
    })
    .filter((item) => item.question || item.answer);
}

function accordionSectionsFormValue(value: unknown): AccordionSectionFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);

      return {
        title: cleanText(record?.title),
        content: cleanText(record?.content)
      };
    })
    .filter((item) => item.title || item.content);
}

function relatedProductSlugsFormValue(value: unknown): RelatedProductSlugFormItem[] {
  return arrayFromUnknown(value)
    .map((item) => ({
      slug: cleanText(item)
    }))
    .filter((item) => item.slug);
}

function numberFromUnknown(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function booleanFromUnknown(value: unknown) {
  return value === true || value === "true";
}

function normalizeGalleryImages(images: ProductGalleryImageFormItem[]) {
  const validImages = images
    .map((image, index) => ({
      url: image.url.trim(),
      alt: image.alt.trim(),
      position: index + 1,
      is_primary: image.is_primary
    }))
    .filter((image) => image.url);

  if (validImages.length === 0) {
    return [];
  }

  const primaryIndex = validImages.findIndex((image) => image.is_primary);
  const orderedImages =
    primaryIndex >= 0
      ? [validImages[primaryIndex], ...validImages.filter((_, index) => index !== primaryIndex)]
      : validImages;

  return orderedImages.map((image, index) => ({
    ...image,
    position: index + 1,
    is_primary: index === 0
  }));
}

function galleryImagesFormValue(value: unknown): ProductGalleryImageFormItem[] {
  const images = arrayFromUnknown(value)
    .map((item, index) => {
      if (typeof item === "string") {
        const url = cleanText(item);

        return url
          ? {
              url,
              alt: "",
              position: index + 1,
              is_primary: false
            }
          : null;
      }

      const record = recordFromUnknown(item);
      const url = cleanText(record?.url);
      const alt = cleanText(record?.alt) || cleanText(record?.alt_text) || cleanText(record?.altText);
      const position = numberFromUnknown(record?.position);

      return url
        ? {
            url,
            alt,
            position: position && Number.isInteger(position) && position > 0 ? position : index + 1,
            is_primary: booleanFromUnknown(record?.is_primary) || booleanFromUnknown(record?.isPrimary)
          }
        : null;
    })
    .filter((item): item is ProductGalleryImageFormItem => Boolean(item))
    .sort((first, second) => first.position - second.position);

  return normalizeGalleryImages(images);
}

function primaryGalleryImage(images: ProductGalleryImageFormItem[]) {
  return images.find((image) => image.is_primary) ?? images[0] ?? null;
}

function setPrimaryGalleryImage(images: ProductGalleryImageFormItem[], selectedIndex: number) {
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return normalizeGalleryImages(images);
  }

  return normalizeGalleryImages([
    {
      ...selectedImage,
      is_primary: true
    },
    ...images
      .filter((_, index) => index !== selectedIndex)
      .map((image) => ({
        ...image,
        is_primary: false
      }))
  ]);
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
    image_alt: product.image_alt ?? "",
    images: galleryImagesFormValue(product.images),
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
    product_highlights: productHighlightsFormValue(product.product_highlights),
    detail_rows: detailRowsFormValue(product.detail_rows),
    best_for: textItemsFormValue(product.best_for),
    care_instructions: textItemsFormValue(product.care_instructions),
    product_faqs: productFaqsFormValue(product.product_faqs),
    accordion_sections: accordionSectionsFormValue(product.accordion_sections),
    related_product_slugs: relatedProductSlugsFormValue(product.related_product_slugs),
    seo_title: product.seo_title ?? "",
    seo_description: product.seo_description ?? "",
    google_product_category: product.google_product_category ?? ""
  };
}

function buildPayload(form: ProductFormState) {
  const productHighlights = form.product_highlights
    .map((item) => ({
      title: item.title.trim(),
      text: item.text.trim(),
      icon: item.icon.trim()
    }))
    .filter((item) => item.title || item.text || item.icon)
    .map((item) => ({
      title: item.title,
      text: item.text,
      ...(item.icon ? { icon: item.icon } : {})
    }));
  const detailRows = form.detail_rows
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim()
    }))
    .filter((item) => item.label || item.value);
  const bestFor = form.best_for
    .map((item) => ({ text: item.text.trim() }))
    .filter((item) => item.text);
  const careInstructions = form.care_instructions
    .map((item) => ({ text: item.text.trim() }))
    .filter((item) => item.text);
  const productFaqs = form.product_faqs
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim()
    }))
    .filter((item) => item.question || item.answer);
  const accordionSections = form.accordion_sections
    .map((item) => ({
      title: item.title.trim(),
      content: item.content.trim()
    }))
    .filter((item) => item.title || item.content);
  const relatedProductSlugs = Array.from(
    new Set(form.related_product_slugs.map((item) => item.slug.trim()).filter(Boolean))
  );
  const galleryImages = normalizeGalleryImages(form.images);
  const primaryImage = primaryGalleryImage(galleryImages);

  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    description: form.description,
    price: form.price,
    compare_at_price: form.compare_at_price,
    currency: form.currency,
    image_url: primaryImage?.url ?? form.image_url,
    image_alt: primaryImage?.alt || form.image_alt,
    images: galleryImages,
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
    product_highlights: productHighlights,
    detail_rows: detailRows,
    best_for: bestFor,
    care_instructions: careInstructions,
    product_faqs: productFaqs,
    accordion_sections: accordionSections,
    related_product_slugs: relatedProductSlugs,
    seo_title: form.seo_title,
    seo_description: form.seo_description,
    google_product_category: form.google_product_category
  };
}

function hasContent(...values: string[]) {
  return values.some((value) => value.trim());
}

function validateForm(form: ProductFormState) {
  const errors: Record<string, string> = {};
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const price = Number(form.price);

  if (!form.title.trim()) {
    errors.title = "标题必填 / Title is required.";
  }

  if (!form.slug.trim()) {
    errors.slug = "Slug 必填 / Slug is required.";
  } else if (!slugPattern.test(form.slug.trim())) {
    errors.slug = "Slug 只能使用小写字母、数字和连字符 / Slug must use lowercase letters, numbers, and hyphens.";
  }

  if (!form.price.trim()) {
    errors.price = "价格必填 / Price is required.";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "价格必须大于或等于 0 / Price must be greater than or equal to 0.";
  }

  if (form.compare_at_price.trim()) {
    const compareAtPrice = Number(form.compare_at_price);

    if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
      errors.compare_at_price = "对比价必须大于或等于 0 / Compare at price must be greater than or equal to 0.";
    }
  }

  if (form.stock_quantity.trim()) {
    const stockQuantity = Number(form.stock_quantity);

    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      errors.stock_quantity = "库存数量必须大于或等于 0 / Stock quantity must be greater than or equal to 0.";
    }
  }

  if (form.sort_order.trim()) {
    const sortOrder = Number(form.sort_order);

    if (!Number.isFinite(sortOrder) || !Number.isInteger(sortOrder) || sortOrder <= 0) {
      errors.sort_order = "排序必须是正整数，或留空 / Sort order must be a positive whole number, or leave it blank.";
    }
  }

  if (!productStatuses.includes(form.status as (typeof productStatuses)[number])) {
    errors.status = "状态必须是 active、draft 或 archived / Status must be active, draft, or archived.";
  }

  if (!inventoryStatuses.includes(form.inventory_status as (typeof inventoryStatuses)[number])) {
    errors.inventory_status = "库存状态必须是 in_stock、out_of_stock 或 preorder / Inventory status must be in stock, out of stock, or preorder.";
  }

  if (
    form.homepage_section &&
    !homepageSections.includes(form.homepage_section as (typeof homepageSections)[number])
  ) {
    errors.homepage_section = "首页展示区必须是 featured、best_seller、new_arrivals 或留空 / Homepage section must be featured, best_seller, new_arrivals, or blank.";
  }

  if (form.published_at && Number.isNaN(new Date(form.published_at).getTime())) {
    errors.published_at = "发布时间必须是有效日期 / Published date must be a valid date.";
  }

  if (
    form.product_highlights.some(
      (item) => hasContent(item.title, item.text, item.icon) && (!item.title.trim() || !item.text.trim())
    )
  ) {
    errors.product_highlights = "有内容的商品亮点必须包含标题和文案 / Product highlight rows with content must include title and text.";
  }

  if (
    form.detail_rows.some(
      (item) => hasContent(item.label, item.value) && (!item.label.trim() || !item.value.trim())
    )
  ) {
    errors.detail_rows = "有内容的概览行必须包含标签和值 / Detail rows with content must include label and value.";
  }

  if (
    form.product_faqs.some(
      (item) => hasContent(item.question, item.answer) && (!item.question.trim() || !item.answer.trim())
    )
  ) {
    errors.product_faqs = "有内容的 FAQ 必须包含问题和回答 / FAQ rows with content must include question and answer.";
  }

  if (
    form.accordion_sections.some(
      (item) => hasContent(item.title, item.content) && (!item.title.trim() || !item.content.trim())
    )
  ) {
    errors.accordion_sections = "有内容的折叠内容区必须包含标题和内容 / Accordion sections with content must include title and content.";
  }

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

function RepeatableSection({
  title,
  description,
  addLabel,
  emptyMessage,
  error,
  isEmpty,
  children,
  onAdd
}: {
  title: string;
  description?: string;
  addLabel: string;
  emptyMessage: string;
  error?: string;
  isEmpty: boolean;
  children: ReactNode;
  onAdd: () => void;
}) {
  return (
    <section className="rounded-md border border-outline-variant bg-surface-container-lowest p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-on-surface">{title}</h3>
          {description ? <p className="mt-1 text-xs font-semibold leading-5 text-on-surface-variant">{description}</p> : null}
        </div>
        <button
          type="button"
          className="inline-flex w-fit rounded-full bg-primary px-4 py-2 font-heading text-xs font-bold text-white transition hover:bg-primary/90"
          onClick={onAdd}
        >
          {addLabel}
        </button>
      </div>
      {isEmpty ? (
        <p className="mt-4 rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">{emptyMessage}</p>
      ) : (
        <div className="mt-4 grid gap-4">{children}</div>
      )}
      <FieldError message={error} />
    </section>
  );
}

function ProductHighlightsEditor({
  items,
  error,
  onChange
}: {
  items: ProductHighlightFormItem[];
  error?: string;
  onChange: (items: ProductHighlightFormItem[]) => void;
}) {
  const updateItem = (index: number, field: keyof ProductHighlightFormItem, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <RepeatableSection
      title="商品亮点 / Product Highlights"
      description="显示为商品卖点卡片；图标可选 / Shown as product benefit cards. Icon is optional."
      addLabel="添加亮点 / Add Highlight"
      emptyMessage="暂无商品亮点。商品页会使用可用的备用内容 / No product highlights. The product page will use fallback content if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { title: "", text: "", icon: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">亮点 / Highlight {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              删除 / Remove
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              标题 / Title
              <input className={inputClass} value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              图标（可选） / Icon optional
              <input className={inputClass} placeholder="paw" value={item.icon} onChange={(event) => updateItem(index, "icon", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
              文案 / Text
              <textarea className={textareaClass} value={item.text} onChange={(event) => updateItem(index, "text", event.target.value)} />
            </label>
          </div>
        </div>
      ))}
    </RepeatableSection>
  );
}

function DetailRowsEditor({
  items,
  error,
  onChange
}: {
  items: DetailRowFormItem[];
  error?: string;
  onChange: (items: DetailRowFormItem[]) => void;
}) {
  const updateItem = (index: number, field: keyof DetailRowFormItem, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <RepeatableSection
      title="商品概览 / Details at a Glance"
      description="显示为紧凑的标签和值 / Shown as compact label and value rows."
      addLabel="添加概览行 / Add Detail Row"
      emptyMessage="暂无概览行。商品页会使用可用的备用内容 / No detail rows. The product page will use fallback content if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { label: "", value: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            标签 / Label
            <input className={inputClass} value={item.label} onChange={(event) => updateItem(index, "label", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            值 / Value
            <input className={inputClass} value={item.value} onChange={(event) => updateItem(index, "value", event.target.value)} />
          </label>
          <button
            type="button"
            className="h-11 rounded-full border border-outline-variant px-4 font-heading text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            删除 / Remove
          </button>
        </div>
      ))}
    </RepeatableSection>
  );
}

function TextItemsEditor({
  title,
  description,
  addLabel,
  emptyMessage,
  items,
  onChange
}: {
  title: string;
  description: string;
  addLabel: string;
  emptyMessage: string;
  items: TextItemFormItem[];
  onChange: (items: TextItemFormItem[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { text: value } : item)));
  };

  return (
    <RepeatableSection
      title={title}
      description={description}
      addLabel={addLabel}
      emptyMessage={emptyMessage}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { text: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            文案 / Text
            <input className={inputClass} value={item.text} onChange={(event) => updateItem(index, event.target.value)} />
          </label>
          <button
            type="button"
            className="h-11 rounded-full border border-outline-variant px-4 font-heading text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            删除 / Remove
          </button>
        </div>
      ))}
    </RepeatableSection>
  );
}

function ProductFaqsEditor({
  items,
  error,
  onChange
}: {
  items: ProductFaqFormItem[];
  error?: string;
  onChange: (items: ProductFaqFormItem[]) => void;
}) {
  const updateItem = (index: number, field: keyof ProductFaqFormItem, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <RepeatableSection
      title="商品问答 / Product Questions / FAQ"
      description="显示在商品问答区域 / Shown in the product questions section."
      addLabel="添加问答 / Add FAQ"
      emptyMessage="暂无商品问答。商品页会使用可用的备用问题 / No product FAQs. The product page will use fallback questions if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { question: "", answer: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">问答 / FAQ {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              删除 / Remove
            </button>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            问题 / Question
            <input className={inputClass} value={item.question} onChange={(event) => updateItem(index, "question", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            回答 / Answer
            <textarea className={textareaClass} value={item.answer} onChange={(event) => updateItem(index, "answer", event.target.value)} />
          </label>
        </div>
      ))}
    </RepeatableSection>
  );
}

function AccordionSectionsEditor({
  items,
  error,
  onChange
}: {
  items: AccordionSectionFormItem[];
  error?: string;
  onChange: (items: AccordionSectionFormItem[]) => void;
}) {
  const updateItem = (index: number, field: keyof AccordionSectionFormItem, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <RepeatableSection
      title="折叠内容区 / Accordion Sections"
      description="显示在可展开的商品信息区域 / Shown in the expandable product information area."
      addLabel="添加折叠内容 / Add Accordion Section"
      emptyMessage="暂无折叠内容。商品页会使用可用的备用内容 / No accordion sections. The product page will use fallback sections if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { title: "", content: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">内容区 / Section {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              删除 / Remove
            </button>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            标题 / Title
            <input className={inputClass} value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            内容 / Content
            <textarea className={textareaClass} value={item.content} onChange={(event) => updateItem(index, "content", event.target.value)} />
          </label>
        </div>
      ))}
    </RepeatableSection>
  );
}

function RelatedProductSlugsEditor({
  items,
  onChange
}: {
  items: RelatedProductSlugFormItem[];
  onChange: (items: RelatedProductSlugFormItem[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { slug: value } : item)));
  };

  return (
    <RepeatableSection
      title="相关商品 Slug / Related Product Slugs"
      description="输入商品 slug 来控制相关商品；空白会被忽略 / Enter product slugs to control related products. Blank entries are ignored."
      addLabel="添加相关商品 / Add Related Product"
      emptyMessage="暂无相关商品 slug。商品页会自动选择相关商品 / No related product slugs. The product page will choose related products automatically."
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { slug: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            商品 Slug / Product slug
            <input
              className={inputClass}
              placeholder="plush-foraging-toy"
              value={item.slug}
              onChange={(event) => updateItem(index, event.target.value)}
            />
          </label>
          <button
            type="button"
            className="h-11 rounded-full border border-outline-variant px-4 font-heading text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            删除 / Remove
          </button>
        </div>
      ))}
    </RepeatableSection>
  );
}

function ProductImageGalleryEditor({
  images,
  uploading,
  uploadMessage,
  uploadError,
  onUpload,
  onChange,
  onAddImageUrl
}: {
  images: ProductGalleryImageFormItem[];
  uploading: boolean;
  uploadMessage: string;
  uploadError: string;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (images: ProductGalleryImageFormItem[]) => void;
  onAddImageUrl: () => void;
}) {
  const updateImage = (index: number, updates: Partial<ProductGalleryImageFormItem>) => {
    onChange(
      normalizeGalleryImages(
        images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...updates } : image))
      )
    );
  };
  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= images.length) {
      return;
    }

    const nextImages = [...images];
    const [image] = nextImages.splice(index, 1);
    nextImages.splice(nextIndex, 0, image);
    onChange(normalizeGalleryImages(nextImages));
  };

  return (
    <section className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-on-surface">商品图片库 / Product Image Gallery</h2>
          <p className="mt-1 text-sm leading-6 text-on-surface-variant">
            上传商品图片、选择主图并编辑 alt 文案 / Upload product gallery images, choose one primary image, and edit alt text.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex w-fit rounded-full border border-primary px-4 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
          onClick={onAddImageUrl}
        >
          添加图片 URL 到图库 / Add Image URL to Gallery
        </button>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-on-surface">
        上传图库图片 / Upload gallery images
        <input
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-heading file:font-bold file:text-on-primary-container"
          disabled={uploading}
          type="file"
          onChange={onUpload}
        />
      </label>
      {uploading && <p className="text-sm font-semibold text-on-surface-variant">正在上传图片 / Uploading image...</p>}
      {uploadMessage && <p className="text-sm font-semibold text-primary">{uploadMessage}</p>}
      {uploadError && (
        <p className="text-sm font-semibold text-error" role="alert">
          {uploadError}
        </p>
      )}

      {images.length === 0 ? (
        <p className="rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
          暂无图库图片 / No gallery images yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {images.map((image, index) => (
            <article key={`${image.url}-${index}`} className="rounded-md border border-outline-variant bg-white p-4">
              <div className="grid gap-4 lg:grid-cols-[140px_1fr] lg:items-start">
                <div className="aspect-square overflow-hidden rounded-md bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt || `Product gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {image.is_primary ? (
                      <span className="rounded-full bg-primary-container/30 px-3 py-1 text-xs font-bold text-primary">
                        主图 / Primary image
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
                      onClick={() => onChange(setPrimaryGalleryImage(images, index))}
                    >
                      设为主图 / Set as Primary
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                    >
                      上移 / Move Up
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      下移 / Move Down
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-error/50 px-3 py-1 text-xs font-bold text-error transition hover:bg-error/10"
                      onClick={() => onChange(normalizeGalleryImages(images.filter((_, imageIndex) => imageIndex !== index)))}
                    >
                      删除 / Remove
                    </button>
                  </div>
                  <label className="grid gap-2 text-sm font-semibold text-on-surface">
                    Alt 文案 / Alt text
                    <input
                      className={inputClass}
                      value={image.alt}
                      onChange={(event) => updateImage(index, { alt: event.target.value })}
                    />
                  </label>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">图片 URL / Image URL</p>
                    <p className="mt-1 break-all text-sm leading-6 text-on-surface-variant">{image.url}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
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
          throw new Error(payload.error ?? "无法加载商品 / Unable to load product.");
        }

        if (active) {
          setForm(formFromProduct(payload.product));
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setFormError(loadError instanceof Error ? loadError.message : "无法加载商品 / Unable to load product.");
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

  const uploadProductImage = async (file: File) => {
    if (!file) {
      throw new Error("请选择一张图片 / Please choose an image.");
    }

    if (!acceptedImageTypes.has(file.type)) {
      throw new Error("请选择 JPEG、PNG 或 WebP 图片 / Please choose a JPEG, PNG, or WebP image.");
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error("图片必须小于或等于 5MB / Image must be 5MB or smaller.");
    }

    if (!supabase) {
      throw new Error("当前构建未配置 Supabase 上传 / Supabase is not configured for uploads in this build.");
    }

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
      throw new Error(uploadErrorResult.message);
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  };

  const updateGalleryImages = (images: ProductGalleryImageFormItem[]) => {
    setForm((currentForm) => {
      const normalizedImages = normalizeGalleryImages(images);
      const primaryImage = primaryGalleryImage(normalizedImages);

      return {
        ...currentForm,
        images: normalizedImages,
        ...(primaryImage
          ? {
              image_url: primaryImage.url,
              image_alt: primaryImage.alt || currentForm.image_alt
            }
          : {})
      };
    });
  };

  const handleGalleryImagesUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (files.length === 0) {
      return;
    }

    setUploading(true);

    try {
      const uploadedImages: ProductGalleryImageFormItem[] = [];

      for (const file of files) {
        const publicUrl = await uploadProductImage(file);

        uploadedImages.push({
          url: publicUrl,
          alt: form.title ? `${form.title} product image` : "LUCK CLAWS product image",
          position: form.images.length + uploadedImages.length + 1,
          is_primary: false
        });
      }

      setForm((currentForm) => {
        const normalizedImages = normalizeGalleryImages([...currentForm.images, ...uploadedImages]);
        const primaryImage = primaryGalleryImage(normalizedImages);

        return {
          ...currentForm,
          images: normalizedImages,
          ...(primaryImage
            ? {
                image_url: primaryImage.url,
                image_alt: primaryImage.alt || currentForm.image_alt
              }
            : {})
        };
      });
      setUploadMessage(
        uploadedImages.length === 1
          ? "图库图片已上传 / Gallery image uploaded."
          : `已上传 ${uploadedImages.length} 张图库图片 / ${uploadedImages.length} gallery images uploaded.`
      );
    } catch (uploadErrorResult: unknown) {
      setUploadError(uploadErrorResult instanceof Error ? uploadErrorResult.message : "无法上传图库图片 / Unable to upload gallery images.");
    } finally {
      setUploading(false);
    }
  };

  const addImageUrlToGallery = () => {
    const imageUrl = form.image_url.trim();

    if (!imageUrl) {
      setUploadError("请先有主图 URL，再添加到图库 / Add an Image URL before adding it to the gallery.");
      return;
    }

    if (form.images.some((image) => image.url === imageUrl)) {
      setUploadError("此图片 URL 已在图库中 / This Image URL is already in the gallery.");
      return;
    }

    updateGalleryImages([
      ...form.images,
      {
        url: imageUrl,
        alt: form.image_alt || (form.title ? `${form.title} product image` : "LUCK CLAWS product image"),
        position: form.images.length + 1,
        is_primary: form.images.length === 0
      }
    ]);
    setUploadMessage("图片 URL 已添加到图库 / Image URL added to gallery.");
    setUploadError("");
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
      setFormError(payload.error ?? "无法保存商品 / Unable to save product.");
      setSaving(false);
      return;
    }

    router.push(mode === "edit" && productId ? `/admin/products/${productId}` : "/admin/products");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        正在加载商品 / Loading product...
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
          标题 / Title
          <input className={inputClass} value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          <FieldError message={errors.title} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Slug
          <input className={inputClass} value={form.slug} onChange={(event) => updateField("slug", event.target.value)} />
          {mode === "edit" && (
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              修改 Slug 可能会改变前台商品链接 / Changing slug may change the public product URL.
            </p>
          )}
          <FieldError message={errors.slug} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          分类 / Category
          <input className={inputClass} value={form.category} onChange={(event) => updateField("category", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          价格 / Price
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
          对比价 / Compare at price
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
          币种 / Currency
          <input className={inputClass} value={form.currency} onChange={(event) => updateField("currency", event.target.value)} />
        </label>

        <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            主图 URL（由图库主图自动更新） / Main Image URL (auto-updated from gallery primary image)
            <input className={inputClass} value={form.image_url} readOnly />
          </label>
          <p className="text-sm leading-6 text-on-surface-variant">
            使用下方商品图片库上传和管理图片 / Use Product Image Gallery below to upload and manage product images.
          </p>
          {form.image_url ? (
            <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
              <div className="aspect-square overflow-hidden rounded-md bg-surface-container-lowest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="商品图片预览 / Product image preview" className="h-full w-full object-cover" />
              </div>
              <p className="break-all text-sm leading-6 text-on-surface-variant">{form.image_url}</p>
            </div>
          ) : (
            <p className="rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
              暂无主图 URL / No main image URL yet.
            </p>
          )}
        </div>

        <ProductImageGalleryEditor
          images={form.images}
          uploading={uploading}
          uploadMessage={uploadMessage}
          uploadError={uploadError}
          onUpload={handleGalleryImagesUpload}
          onChange={updateGalleryImages}
          onAddImageUrl={addImageUrlToGallery}
        />

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          状态 / Status
          <select className={inputClass} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="active">上架 / Active</option>
            <option value="draft">草稿 / Draft</option>
            <option value="archived">已归档 / Archived</option>
          </select>
          <p className="text-xs font-semibold leading-5 text-on-surface-variant">
            上架 = 前台公开显示；草稿 = 前台隐藏；已归档 = 前台隐藏并保留记录 / Active = visible publicly; Draft = hidden from public storefront; Archived = hidden and kept for record.
          </p>
          <FieldError message={errors.status} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          库存状态 / Inventory status
          <select
            className={inputClass}
            value={form.inventory_status}
            onChange={(event) => updateField("inventory_status", event.target.value)}
          >
            <option value="in_stock">有库存 / In stock</option>
            <option value="out_of_stock">缺货 / Out of stock</option>
            <option value="preorder">预售 / Preorder</option>
          </select>
          <FieldError message={errors.inventory_status} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          库存数量 / Stock quantity
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
            推荐 / Featured
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
            <input
              checked={form.is_sale}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
              type="checkbox"
              onChange={(event) => updateField("is_sale", event.target.checked)}
            />
            促销 / Sale
          </label>
        </div>

        <div className="grid gap-5 rounded-md bg-surface-container-low p-4 md:col-span-2 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="font-heading text-lg font-bold text-on-surface">前台展示 / Storefront display</h2>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              控制商品排序、首页展示位置和卡片标签 / Control product ordering, homepage placement, and card badges.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            排序 / Sort order
            <input
              className={inputClass}
              min="1"
              placeholder="默认 / Default"
              step="1"
              type="number"
              value={form.sort_order}
              onChange={(event) => updateField("sort_order", event.target.value)}
            />
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              数字越小越靠前；留空使用默认排序 / Lower numbers appear first. Leave blank/default for normal ordering.
            </p>
            <FieldError message={errors.sort_order} />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            首页展示区 / Homepage section
            <select
              className={inputClass}
              value={form.homepage_section}
              onChange={(event) => updateField("homepage_section", event.target.value)}
            >
              <option value="">无 / None</option>
              <option value="featured">featured</option>
              <option value="best_seller">best_seller</option>
              <option value="new_arrivals">new_arrivals</option>
            </select>
            <FieldError message={errors.homepage_section} />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            标签 / Badge
            <input
              className={inputClass}
              placeholder="Best Seller, New, Sale, Featured"
              value={form.badge}
              onChange={(event) => updateField("badge", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            发布时间 / Published at
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
          描述 / Description
          <textarea className={textareaClass} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
        </label>

        <div className="grid gap-5 rounded-md bg-surface-container-low p-4 md:col-span-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-on-surface">商品详情内容 / Product detail content</h2>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              这些字段控制前台商品详情页；留空会使用当前备用内容 / These fields control the public product detail page. Leave any field blank to keep the current fallback content.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            短描述 / Short description
            <textarea
              className={textareaClass}
              value={form.short_description}
              onChange={(event) => updateField("short_description", event.target.value)}
            />
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              显示在商品页顶部附近；留空则使用 Description / Used near the top of the product page. Leave blank to use Description.
            </p>
          </label>

          <div className="grid gap-5">
            <ProductHighlightsEditor
              items={form.product_highlights}
              error={errors.product_highlights}
              onChange={(items) => updateField("product_highlights", items)}
            />
            <DetailRowsEditor
              items={form.detail_rows}
              error={errors.detail_rows}
              onChange={(items) => updateField("detail_rows", items)}
            />
            <div className="grid gap-5 xl:grid-cols-2">
              <TextItemsEditor
                title="适用场景 / Best For"
                description="商品页使用场景短要点 / Short use-case bullets for the product page."
                addLabel="添加适用场景 / Add Best For Item"
                emptyMessage="暂无适用场景。商品页会使用可用的备用内容 / No Best For items. The product page will use fallback content if available."
                items={form.best_for}
                onChange={(items) => updateField("best_for", items)}
              />
              <TextItemsEditor
                title="护理说明 / Care Instructions"
                description="商品页护理短要点 / Short care bullets for the product page."
                addLabel="添加护理说明 / Add Care Instruction"
                emptyMessage="暂无护理说明。商品页会使用可用的备用内容 / No care instructions. The product page will use fallback content if available."
                items={form.care_instructions}
                onChange={(items) => updateField("care_instructions", items)}
              />
            </div>
            <ProductFaqsEditor
              items={form.product_faqs}
              error={errors.product_faqs}
              onChange={(items) => updateField("product_faqs", items)}
            />
            <AccordionSectionsEditor
              items={form.accordion_sections}
              error={errors.accordion_sections}
              onChange={(items) => updateField("accordion_sections", items)}
            />
            <RelatedProductSlugsEditor
              items={form.related_product_slugs}
              onChange={(items) => updateField("related_product_slugs", items)}
            />
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          SEO 标题 / SEO title
          <input className={inputClass} value={form.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          SEO 描述 / SEO description
          <textarea className={textareaClass} value={form.seo_description} onChange={(event) => updateField("seo_description", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
          Google 商品分类 / Google product category
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
          {saving ? "正在保存 / Saving..." : mode === "edit" ? "保存商品 / Save Product" : "添加商品 / Add Product"}
        </button>
        <button
          type="button"
          className="inline-flex rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          onClick={() => router.push("/admin/products")}
        >
          取消 / Cancel
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
          title={mode === "edit" ? "编辑商品 / Edit Product" : "添加商品 / Add Product"}
          description={mode === "edit" ? "更新 Supabase 商品记录 / Update a Supabase product record." : "创建 Supabase 商品记录 / Create a Supabase product record."}
          backLink={{ href: "/admin/products", label: "返回商品 / Back to Products" }}
        >
          <ProductFormContent mode={mode} productId={productId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
