"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { defaultProductSortOrder } from "@/lib/admin-products";
import { formatPrice } from "@/lib/utils";

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
  created_at: string | null;
  updated_at: string | null;
};

type AdminProductImage = {
  id: string;
  url: string | null;
  alt_text: string | null;
  position: number | string | null;
};

type AdminProductDetailPayload = {
  product?: AdminProductDetailRow;
  images?: AdminProductImage[];
  error?: string;
};

type ProductHighlightDisplayItem = {
  title: string;
  text: string;
  icon?: string;
};

type DetailRowDisplayItem = {
  label: string;
  value: string;
};

type ProductFaqDisplayItem = {
  question: string;
  answer: string;
};

type AccordionSectionDisplayItem = {
  title: string;
  content: string;
};

type GalleryImageDisplayItem = {
  url: string;
  alt: string;
  position: number;
  isPrimary: boolean;
};

function numberFromValue(value: number | string | null) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function sortOrderDisplayValue(value: number | string | null) {
  if (value === null || value === "") {
    return "Default";
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0 || numberValue === defaultProductSortOrder) {
    return "Default";
  }

  return String(numberValue);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function displayValue(value: string | null) {
  return value?.trim() || "Not provided";
}

function displayBoolean(value: boolean | null) {
  return value ? "Yes" : "No";
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

function productHighlightsFromValue(value: unknown): ProductHighlightDisplayItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const title = cleanText(record?.title);
      const text = cleanText(record?.text);
      const icon = cleanText(record?.icon);

      return title && text
        ? {
            title,
            text,
            ...(icon ? { icon } : {})
          }
        : null;
    })
    .filter((item): item is ProductHighlightDisplayItem => Boolean(item));
}

function detailRowsFromValue(value: unknown): DetailRowDisplayItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const label = cleanText(record?.label);
      const rowValue = cleanText(record?.value);

      return label && rowValue ? { label, value: rowValue } : null;
    })
    .filter((item): item is DetailRowDisplayItem => Boolean(item));
}

function textItemsFromValue(value: unknown): string[] {
  return arrayFromUnknown(value)
    .map((item) => {
      if (typeof item === "string") {
        return cleanText(item);
      }

      return cleanText(recordFromUnknown(item)?.text);
    })
    .filter(Boolean);
}

function productFaqsFromValue(value: unknown): ProductFaqDisplayItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const question = cleanText(record?.question) || cleanText(record?.title);
      const answer = cleanText(record?.answer) || cleanText(record?.content);

      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is ProductFaqDisplayItem => Boolean(item));
}

function accordionSectionsFromValue(value: unknown): AccordionSectionDisplayItem[] {
  return arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const title = cleanText(record?.title);
      const content = cleanText(record?.content);

      return title && content ? { title, content } : null;
    })
    .filter((item): item is AccordionSectionDisplayItem => Boolean(item));
}

function relatedProductSlugsFromValue(value: unknown): string[] {
  return arrayFromUnknown(value).map((item) => cleanText(item)).filter(Boolean);
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

function galleryImagesFromValue(value: unknown): GalleryImageDisplayItem[] {
  const images = arrayFromUnknown(value)
    .map((item, index) => {
      if (typeof item === "string") {
        const url = cleanText(item);

        return url
          ? {
              url,
              alt: "",
              position: index + 1,
              isPrimary: false
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
            isPrimary: booleanFromUnknown(record?.is_primary) || booleanFromUnknown(record?.isPrimary)
          }
        : null;
    })
    .filter((item): item is GalleryImageDisplayItem => Boolean(item))
    .sort((first, second) => first.position - second.position);

  if (images.length === 0) {
    return [];
  }

  const primaryIndex = images.findIndex((image) => image.isPrimary);
  const normalizedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return images.map((image, index) => ({
    ...image,
    position: index + 1,
    isPrimary: index === normalizedPrimaryIndex
  }));
}

function galleryImagesFromRows(rows: AdminProductImage[]): GalleryImageDisplayItem[] {
  return rows
    .map((row, index) => {
      const url = cleanText(row.url);

      return url
        ? {
            url,
            alt: cleanText(row.alt_text),
            position: numberFromUnknown(row.position) ?? index + 1,
            isPrimary: false
          }
        : null;
    })
    .filter((item): item is GalleryImageDisplayItem => Boolean(item))
    .sort((first, second) => first.position - second.position);
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function ContentCard({ title, isEmpty, children }: { title: string; isEmpty: boolean; children: React.ReactNode }) {
  return (
    <article className="rounded-md bg-surface-container-low p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{title}</h3>
      {isEmpty ? (
        <p className="mt-3 text-sm font-semibold text-on-surface">Not provided</p>
      ) : (
        <div className="mt-3 grid gap-3">{children}</div>
      )}
    </article>
  );
}

function ProductHighlightsCard({ value }: { value: unknown }) {
  const items = productHighlightsFromValue(value);

  return (
    <ContentCard title="Product Highlights" isEmpty={items.length === 0}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-md bg-white p-4">
          <p className="font-bold text-on-surface">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.text}</p>
          {item.icon ? <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">Icon: {item.icon}</p> : null}
        </div>
      ))}
    </ContentCard>
  );
}

function DetailRowsCard({ value }: { value: unknown }) {
  const rows = detailRowsFromValue(value);

  return (
    <ContentCard title="Details at a Glance" isEmpty={rows.length === 0}>
      <dl className="grid gap-3">
        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="rounded-md bg-white p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{row.label}</dt>
            <dd className="mt-2 font-semibold text-on-surface">{row.value}</dd>
          </div>
        ))}
      </dl>
    </ContentCard>
  );
}

function TextItemsCard({ title, value }: { title: string; value: unknown }) {
  const items = textItemsFromValue(value);

  return (
    <ContentCard title={title} isEmpty={items.length === 0}>
      <ul className="grid gap-2 rounded-md bg-white p-4 text-sm leading-6 text-on-surface-variant">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </ContentCard>
  );
}

function ProductFaqsCard({ value }: { value: unknown }) {
  const items = productFaqsFromValue(value);

  return (
    <ContentCard title="Product FAQs" isEmpty={items.length === 0}>
      {items.map((item, index) => (
        <div key={`${item.question}-${index}`} className="rounded-md bg-white p-4">
          <p className="font-bold text-on-surface">{item.question}</p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.answer}</p>
        </div>
      ))}
    </ContentCard>
  );
}

function AccordionSectionsCard({ value }: { value: unknown }) {
  const items = accordionSectionsFromValue(value);

  return (
    <ContentCard title="Accordion Sections" isEmpty={items.length === 0}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-md bg-white p-4">
          <p className="font-bold text-on-surface">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.content}</p>
        </div>
      ))}
    </ContentCard>
  );
}

function RelatedProductSlugsCard({ value }: { value: unknown }) {
  const items = relatedProductSlugsFromValue(value);

  return (
    <ContentCard title="Related Product Slugs" isEmpty={items.length === 0}>
      <div className="flex flex-wrap gap-2 rounded-md bg-white p-4">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold text-primary">
            {item}
          </span>
        ))}
      </div>
    </ContentCard>
  );
}

function ProductDetailContent({ productId }: { productId: string }) {
  const { accessToken } = useAdminAuth();
  const [product, setProduct] = useState<AdminProductDetailRow | null>(null);
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as AdminProductDetailPayload;

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load product.");
        }

        if (active) {
          setProduct(payload.product ?? null);
          setImages(payload.images ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load product.");
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
  }, [accessToken, productId]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading product...
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

  if (!product) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Product not found.
      </div>
    );
  }

  const galleryImages = galleryImagesFromValue(product.images);
  const displayedGalleryImages = galleryImages.length > 0 ? galleryImages : galleryImagesFromRows(images);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="inline-flex rounded-full bg-primary px-5 py-2 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
        >
          Edit Product
        </Link>
        <Link
          href="/admin"
          className="inline-flex rounded-full border border-primary px-5 py-2 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
        >
          Back to Admin
        </Link>
      </div>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Product Detail</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">{displayValue(product.title)}</h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {displayValue(product.status)}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Title" value={displayValue(product.title)} />
          <DetailField label="Slug" value={displayValue(product.slug)} />
          <DetailField label="Category" value={displayValue(product.category)} />
          <DetailField label="Description" value={displayValue(product.description)} />
          <DetailField label="Price" value={formatPrice(numberFromValue(product.price))} />
          <DetailField
            label="Compare at price"
            value={product.compare_at_price === null ? "Not provided" : formatPrice(numberFromValue(product.compare_at_price))}
          />
          <DetailField label="Currency" value={product.currency ?? "USD"} />
          <DetailField label="Image URL" value={displayValue(product.image_url)} />
          <DetailField label="Image alt text" value={displayValue(product.image_alt)} />
          <DetailField label="Status" value={displayValue(product.status)} />
          <DetailField label="Inventory status" value={displayValue(product.inventory_status)} />
          <DetailField label="Stock quantity" value={product.stock_quantity ?? "Not provided"} />
          <DetailField label="Featured" value={displayBoolean(product.is_featured)} />
          <DetailField label="Sale" value={displayBoolean(product.is_sale)} />
          <DetailField label="Sort order" value={sortOrderDisplayValue(product.sort_order)} />
          <DetailField label="Homepage section" value={displayValue(product.homepage_section)} />
          <DetailField label="Badge" value={displayValue(product.badge)} />
          <DetailField label="Published at" value={formatDate(product.published_at)} />
          <DetailField label="Short description" value={displayValue(product.short_description)} />
          <DetailField label="SEO title" value={displayValue(product.seo_title)} />
          <DetailField label="SEO description" value={displayValue(product.seo_description)} />
          <DetailField label="Google product category" value={displayValue(product.google_product_category)} />
          <DetailField label="Created" value={formatDate(product.created_at)} />
          <DetailField label="Updated" value={formatDate(product.updated_at)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Editable Product Detail Content</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ProductHighlightsCard value={product.product_highlights} />
          <DetailRowsCard value={product.detail_rows} />
          <TextItemsCard title="Best For" value={product.best_for} />
          <TextItemsCard title="Care Instructions" value={product.care_instructions} />
          <ProductFaqsCard value={product.product_faqs} />
          <AccordionSectionsCard value={product.accordion_sections} />
          <RelatedProductSlugsCard value={product.related_product_slugs} />
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Product Image</h2>
        {product.image_url ? (
          <div className="mt-6 grid gap-5 md:grid-cols-[180px_1fr] md:items-start">
            <div className="aspect-square overflow-hidden rounded-md bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={`${product.title ?? "LUCK CLAWS product"} image`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Image URL</p>
              <p className="mt-2 break-all text-sm leading-6 text-on-surface-variant">{product.image_url}</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">No product image yet.</p>
        )}
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Product Image Gallery</h2>
        {displayedGalleryImages.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">No gallery images yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {displayedGalleryImages.map((image) => (
              <article key={`${image.url}-${image.position}`} className="rounded-lg border border-outline-variant bg-white p-5">
                <div className="grid gap-5 md:grid-cols-[140px_1fr] md:items-start">
                  <div className="aspect-square overflow-hidden rounded-md bg-surface-container-low">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt || "LUCK CLAWS product image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <dl className="grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-on-surface">Primary</dt>
                      <dd className="mt-1">{image.isPrimary ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-surface">URL</dt>
                      <dd className="mt-1 break-all">{image.url}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-surface">Alt text</dt>
                      <dd className="mt-1">{image.alt || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-surface">Position</dt>
                      <dd className="mt-1">{image.position}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminProductDetail({ productId }: { productId: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title="Product Detail"
          description="Review Supabase product records before public catalog migration."
          backLink={{ href: "/admin/products", label: "Back to Products" }}
        >
          <ProductDetailContent productId={productId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
