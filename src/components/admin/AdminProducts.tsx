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
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Sale</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-4 font-semibold text-on-surface">{displayValue(product.title)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.slug)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.category)}</td>
                <td className="px-4 py-4 font-semibold">{formatPrice(priceFromRow(product))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.inventory_status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{product.is_sale ? "Yes" : "No"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(product.created_at)}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex rounded-full border border-primary px-4 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                  >
                    View
                  </Link>
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
