"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
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
  status: string | null;
  inventory_status: string | null;
  stock_quantity: number | string | null;
  is_featured: boolean | null;
  is_sale: boolean | null;
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

function numberFromValue(value: number | string | null) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
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

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
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
          <DetailField label="Status" value={displayValue(product.status)} />
          <DetailField label="Inventory status" value={displayValue(product.inventory_status)} />
          <DetailField label="Stock quantity" value={product.stock_quantity ?? "Not provided"} />
          <DetailField label="Featured" value={displayBoolean(product.is_featured)} />
          <DetailField label="Sale" value={displayBoolean(product.is_sale)} />
          <DetailField label="SEO title" value={displayValue(product.seo_title)} />
          <DetailField label="SEO description" value={displayValue(product.seo_description)} />
          <DetailField label="Google product category" value={displayValue(product.google_product_category)} />
          <DetailField label="Created" value={formatDate(product.created_at)} />
          <DetailField label="Updated" value={formatDate(product.updated_at)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Product Images</h2>
        {images.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">No product images yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {images.map((image) => (
              <article key={image.id} className="rounded-lg border border-outline-variant bg-white p-5">
                <div className="grid gap-5 md:grid-cols-[140px_1fr] md:items-start">
                  <div className="aspect-square overflow-hidden rounded-md bg-surface-container-low">
                    {image.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt_text ?? "LUCK CLAWS product image"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center px-3 text-center text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                        No image
                      </div>
                    )}
                  </div>
                  <dl className="grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-on-surface">URL</dt>
                      <dd className="mt-1 break-all">{displayValue(image.url)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-surface">Alt text</dt>
                      <dd className="mt-1">{displayValue(image.alt_text)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-surface">Position</dt>
                      <dd className="mt-1">{image.position ?? "Not provided"}</dd>
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
