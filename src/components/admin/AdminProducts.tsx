"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatPrice } from "@/lib/utils";

type AdminProductRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  price: number | string | null;
  status: string | null;
  inventory_status: string | null;
  is_sale: boolean | null;
  created_at: string | null;
};

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

function displayStatus(value: string | null) {
  return value ? value.replaceAll("_", " ") : "Not provided";
}

function priceFromRow(product: AdminProductRow) {
  const value = typeof product.price === "number" ? product.price : Number(product.price ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function ProductsTable() {
  const { accessToken } = useAdminAuth();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { products?: AdminProductRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load products.");
        }

        if (active) {
          setProducts(payload.products ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
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
  }, [accessToken]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading products...
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

  if (products.length === 0) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        No products yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] text-left text-sm">
          <thead className="sticky top-0 z-20 bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="min-w-[260px] px-4 py-3">Title</th>
              <th className="min-w-[220px] px-4 py-3">Slug</th>
              <th className="min-w-[160px] px-4 py-3">Category</th>
              <th className="min-w-[110px] px-4 py-3">Price</th>
              <th className="min-w-[120px] px-4 py-3">Status</th>
              <th className="min-w-[150px] px-4 py-3">Inventory</th>
              <th className="min-w-[90px] px-4 py-3">Sale</th>
              <th className="min-w-[140px] px-4 py-3">Created</th>
              <th className="sticky right-0 z-30 min-w-[170px] border-l border-outline-variant bg-surface-container-low px-4 py-3 shadow-[-8px_0_18px_rgba(67,45,31,0.08)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-4 font-semibold leading-6 text-on-surface">{displayValue(product.title)}</td>
                <td className="px-4 py-4 leading-6 text-on-surface-variant">{displayValue(product.slug)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.category)}</td>
                <td className="px-4 py-4 font-semibold">{formatPrice(priceFromRow(product))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.inventory_status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{product.is_sale ? "Yes" : "No"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(product.created_at)}</td>
                <td className="sticky right-0 z-10 border-l border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-[-8px_0_18px_rgba(67,45,31,0.08)]">
                  <div className="flex min-w-max gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex rounded-full border border-primary px-4 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex rounded-full bg-primary-container px-4 py-2 font-heading text-xs font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminProducts() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title="Products" description="Prepare catalog management for the next phase." backLink>
          <div className="space-y-6">
            <div className="flex justify-end">
              <Link
                href="/admin/products/new"
                className="inline-flex rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:bg-primary/90"
              >
                Add Product
              </Link>
            </div>
            <section className="ambient-card p-6 text-sm leading-7 text-on-surface-variant md:p-8">
              Product management is being prepared. Public product pages still use the existing catalog until the next phase.
            </section>
            <ProductsTable />
          </div>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
