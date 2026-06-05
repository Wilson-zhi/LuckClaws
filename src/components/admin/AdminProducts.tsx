"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { defaultProductSortOrder } from "@/lib/admin-products";
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
  sort_order: number | string | null;
  homepage_section: string | null;
  badge: string | null;
  published_at: string | null;
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

function numberFromValue(value: number | string | null) {
  if (value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function sortOrderFromRow(product: AdminProductRow) {
  const value = numberFromValue(product.sort_order);

  return value !== null && value > 0 ? value : defaultProductSortOrder;
}

function displaySortOrder(product: AdminProductRow) {
  const value = sortOrderFromRow(product);

  return value === defaultProductSortOrder ? "Default" : String(value);
}

function createdTimeFromRow(product: AdminProductRow) {
  const time = product.created_at ? new Date(product.created_at).getTime() : 0;

  return Number.isFinite(time) ? time : 0;
}

function sortProductsForAdmin(products: AdminProductRow[]) {
  return [...products].sort((first, second) => {
    const sortDifference = sortOrderFromRow(first) - sortOrderFromRow(second);

    if (sortDifference !== 0) {
      return sortDifference;
    }

    return createdTimeFromRow(second) - createdTimeFromRow(first);
  });
}

function normalizedValue(value: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

const inputClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const selectClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

function ProductsTable() {
  const { accessToken } = useAdminAuth();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [archivingId, setArchivingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [saleFilter, setSaleFilter] = useState("all");

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
          setProducts(sortProductsForAdmin(payload.products ?? []));
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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category?.trim())
            .filter((category): category is string => Boolean(category))
        )
      ).sort((first, second) => first.localeCompare(second)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const title = normalizedValue(product.title);
      const slug = normalizedValue(product.slug);
      const category = product.category?.trim() ?? "";
      const status = product.status?.trim() ?? "";
      const inventoryStatus = product.inventory_status?.trim() ?? "";
      const matchesSearch = !search || title.includes(search) || slug.includes(search);
      const matchesCategory = categoryFilter === "all" || category === categoryFilter;
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesInventory = inventoryFilter === "all" || inventoryStatus === inventoryFilter;
      const matchesSale =
        saleFilter === "all" ||
        (saleFilter === "sale" && Boolean(product.is_sale)) ||
        (saleFilter === "non-sale" && !product.is_sale);

      return matchesSearch && matchesCategory && matchesStatus && matchesInventory && matchesSale;
    });
  }, [categoryFilter, inventoryFilter, products, saleFilter, searchTerm, statusFilter]);

  const handleArchive = async (product: AdminProductRow) => {
    if (product.status === "archived") {
      return;
    }

    const confirmed = window.confirm(
      `Archive ${displayValue(product.title)}? Archived products are hidden publicly but remain available in admin.`
    );

    if (!confirmed) {
      return;
    }

    setActionError("");
    setArchivingId(product.id);

    const response = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "archive" })
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setActionError(payload.error ?? "Unable to archive product.");
      setArchivingId("");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id ? { ...currentProduct, status: "archived" } : currentProduct
      )
    );
    setArchivingId("");
  };

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

  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,1.5fr)_minmax(180px,0.9fr)_minmax(130px,0.65fr)_minmax(170px,0.8fr)_minmax(150px,0.65fr)]">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Search by title or slug
            <input
              className={inputClass}
              placeholder="Search by title or slug"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Category
            <select className={selectClass} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Status
            <select className={selectClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Inventory
            <select
              className={selectClass}
              value={inventoryFilter}
              onChange={(event) => setInventoryFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="in_stock">in_stock</option>
              <option value="out_of_stock">out_of_stock</option>
              <option value="preorder">preorder</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Sale
            <select className={selectClass} value={saleFilter} onChange={(event) => setSaleFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="sale">Sale only</option>
              <option value="non-sale">Non-sale only</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm font-semibold text-on-surface-variant" aria-live="polite">
          Showing {filteredProducts.length} of {products.length} products.
        </p>
      </section>

      {actionError && (
        <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {actionError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          No products yet.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          No products match your filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
          <div className="max-h-[72vh] overflow-auto">
            <table className="w-full min-w-[1980px] text-left text-sm">
              <thead className="sticky top-0 z-20 bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="min-w-[340px] px-5 py-3">Title</th>
                  <th className="min-w-[280px] px-5 py-3">Slug</th>
                  <th className="min-w-[170px] px-4 py-3">Category</th>
                  <th className="min-w-[110px] px-4 py-3">Price</th>
                  <th className="min-w-[115px] px-4 py-3">Status</th>
                  <th className="min-w-[135px] px-4 py-3">Inventory</th>
                  <th className="min-w-[80px] px-4 py-3">Sale</th>
                  <th className="min-w-[95px] px-4 py-3">Sort</th>
                  <th className="min-w-[150px] px-4 py-3">Homepage</th>
                  <th className="min-w-[130px] px-4 py-3">Badge</th>
                  <th className="min-w-[130px] px-4 py-3">Created</th>
                  <th className="sticky right-0 z-30 min-w-[360px] border-l border-outline-variant bg-surface-container-low px-4 py-3 shadow-[-10px_0_22px_rgba(67,45,31,0.10)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4 font-semibold leading-6 text-on-surface">{displayValue(product.title)}</td>
                    <td className="px-5 py-4 leading-6 text-on-surface-variant">{displayValue(product.slug)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.category)}</td>
                    <td className="px-4 py-4 font-semibold">{formatPrice(priceFromRow(product))}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.status)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayStatus(product.inventory_status)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{product.is_sale ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displaySortOrder(product)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.homepage_section)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(product.badge)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatDate(product.created_at)}</td>
                    <td className="sticky right-0 z-10 border-l border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-[-10px_0_22px_rgba(67,45,31,0.10)]">
                      <div className="flex min-w-[328px] flex-wrap gap-2 whitespace-nowrap">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex rounded-full border border-primary px-3 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex rounded-full bg-primary-container px-3 py-2 font-heading text-xs font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                        >
                          Edit
                        </Link>
                        {product.status === "active" && product.slug ? (
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full border border-outline-variant px-3 py-2 font-heading text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
                          >
                            Preview
                          </Link>
                        ) : (
                          <span
                            className="inline-flex rounded-full border border-outline-variant px-3 py-2 font-heading text-xs font-bold text-on-surface-variant/70"
                            title="Product is not public."
                          >
                            Not public
                          </span>
                        )}
                        {product.status !== "archived" && (
                          <button
                            type="button"
                            className="inline-flex rounded-full border border-error/40 px-3 py-2 font-heading text-xs font-bold text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={archivingId === product.id}
                            onClick={() => handleArchive(product)}
                          >
                            {archivingId === product.id ? "Archiving..." : "Archive"}
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

export function AdminProducts() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title="Products" description="Manage Supabase product records." layout="wide" backLink>
          <div className="space-y-6">
            <section className="ambient-card flex flex-col gap-4 p-5 text-sm leading-7 text-on-surface-variant md:flex-row md:items-center md:justify-between md:p-6">
              <p className="max-w-4xl">
                Active products are visible on the public storefront. Draft and archived products stay hidden from public product pages,
                collections, search, product feed, and sitemap.
              </p>
              <Link
                href="/admin/products/new"
                className="inline-flex shrink-0 justify-center rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:bg-primary/90"
              >
                Add Product
              </Link>
            </section>
            <ProductsTable />
          </div>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
