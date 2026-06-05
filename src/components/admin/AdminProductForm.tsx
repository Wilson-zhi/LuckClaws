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

  if (
    form.product_highlights.some(
      (item) => hasContent(item.title, item.text, item.icon) && (!item.title.trim() || !item.text.trim())
    )
  ) {
    errors.product_highlights = "Product highlight rows with content must include title and text.";
  }

  if (
    form.detail_rows.some(
      (item) => hasContent(item.label, item.value) && (!item.label.trim() || !item.value.trim())
    )
  ) {
    errors.detail_rows = "Detail rows with content must include label and value.";
  }

  if (
    form.product_faqs.some(
      (item) => hasContent(item.question, item.answer) && (!item.question.trim() || !item.answer.trim())
    )
  ) {
    errors.product_faqs = "FAQ rows with content must include question and answer.";
  }

  if (
    form.accordion_sections.some(
      (item) => hasContent(item.title, item.content) && (!item.title.trim() || !item.content.trim())
    )
  ) {
    errors.accordion_sections = "Accordion sections with content must include title and content.";
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
      title="Product Highlights"
      description="Shown as product benefit cards. Icon is optional."
      addLabel="Add Highlight"
      emptyMessage="No product highlights. The product page will use fallback content if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { title: "", text: "", icon: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">Highlight {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              Remove
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Title
              <input className={inputClass} value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Icon optional
              <input className={inputClass} placeholder="paw" value={item.icon} onChange={(event) => updateItem(index, "icon", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
              Text
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
      title="Details at a Glance"
      description="Shown as compact label and value rows."
      addLabel="Add Detail Row"
      emptyMessage="No detail rows. The product page will use fallback content if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { label: "", value: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Label
            <input className={inputClass} value={item.label} onChange={(event) => updateItem(index, "label", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Value
            <input className={inputClass} value={item.value} onChange={(event) => updateItem(index, "value", event.target.value)} />
          </label>
          <button
            type="button"
            className="h-11 rounded-full border border-outline-variant px-4 font-heading text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            Remove
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
            Text
            <input className={inputClass} value={item.text} onChange={(event) => updateItem(index, event.target.value)} />
          </label>
          <button
            type="button"
            className="h-11 rounded-full border border-outline-variant px-4 font-heading text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          >
            Remove
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
      title="Product Questions / FAQ"
      description="Shown in the product questions section."
      addLabel="Add FAQ"
      emptyMessage="No product FAQs. The product page will use fallback questions if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { question: "", answer: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">FAQ {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              Remove
            </button>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Question
            <input className={inputClass} value={item.question} onChange={(event) => updateItem(index, "question", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Answer
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
      title="Accordion Sections"
      description="Shown in the expandable product information area."
      addLabel="Add Accordion Section"
      emptyMessage="No accordion sections. The product page will use fallback sections if available."
      error={error}
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { title: "", content: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-on-surface">Section {index + 1}</p>
            <button
              type="button"
              className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-container/10"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              Remove
            </button>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Title
            <input className={inputClass} value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Content
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
      title="Related Product Slugs"
      description="Enter product slugs to control related products. Blank entries are ignored."
      addLabel="Add Related Product"
      emptyMessage="No related product slugs. The product page will choose related products automatically."
      isEmpty={items.length === 0}
      onAdd={() => onChange([...items, { slug: "" }])}
    >
      {items.map((item, index) => (
        <div key={index} className="grid gap-4 rounded-md border border-outline-variant bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Product slug
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
            Remove
          </button>
        </div>
      ))}
    </RepeatableSection>
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
                title="Best For"
                description="Short use-case bullets for the product page."
                addLabel="Add Best For Item"
                emptyMessage="No Best For items. The product page will use fallback content if available."
                items={form.best_for}
                onChange={(items) => updateField("best_for", items)}
              />
              <TextItemsEditor
                title="Care Instructions"
                description="Short care bullets for the product page."
                addLabel="Add Care Instruction"
                emptyMessage="No care instructions. The product page will use fallback content if available."
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
