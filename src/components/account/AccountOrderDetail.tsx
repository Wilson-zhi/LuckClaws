"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/utils";

type AccountOrderRow = {
  id: string;
  order_number: string | null;
  created_at: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  subtotal: number | string | null;
  shipping_amount: number | string | null;
  total_amount: number | string | null;
  currency: string | null;
  shipping_address: unknown;
};

type AccountOrderItemRow = {
  id: string;
  product_title: string | null;
  product_slug: string | null;
  product_image: string | null;
  quantity: number | string | null;
  unit_price: number | string | null;
  line_total: number | string | null;
};

type ShippingAddress = {
  name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFromRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function shippingAddressFromOrder(value: unknown): ShippingAddress {
  const record = isRecord(value) ? value : {};

  return {
    name: stringFromRecord(record, "full_name") ?? stringFromRecord(record, "name"),
    phone: stringFromRecord(record, "phone"),
    address_line1: stringFromRecord(record, "address_line1"),
    address_line2: stringFromRecord(record, "address_line2"),
    city: stringFromRecord(record, "city"),
    state: stringFromRecord(record, "state"),
    postal_code: stringFromRecord(record, "postal_code"),
    country: stringFromRecord(record, "country")
  };
}

function numberFromValue(value: number | string | null) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function displayStatus(value: string | null) {
  return value ? value.replaceAll("_", " ") : "pending";
}

function displayValue(value: string | null, fallback = "Not provided") {
  return value?.trim() || fallback;
}

function SummaryField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

export function AccountOrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [order, setOrder] = useState<AccountOrderRow | null>(null);
  const [items, setItems] = useState<AccountOrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/account/login");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace("/account/login");
        return;
      }

      const response = await fetch(`/api/account/orders/${encodeURIComponent(orderId)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const payload = (await response.json()) as {
        order?: AccountOrderRow;
        items?: AccountOrderItemRow[];
        error?: string;
      };

      if (!active) {
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          setOrder(null);
        } else {
          setError(payload.error ?? "Unable to load order.");
        }
        setLoading(false);
        return;
      }

      setOrder(payload.order ?? null);
      setItems(payload.items ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [orderId, router, supabase]);

  if (!supabase) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Supabase public environment variables are not configured for this build.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading order...
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

  if (!order) {
    return (
      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Order not found</h2>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          This order is not available for the current account.
        </p>
        <Link
          href="/account/orders"
          className="mt-6 inline-flex rounded-full border border-primary px-5 py-2 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
        >
          Back to Orders
        </Link>
      </section>
    );
  }

  const address = shippingAddressFromOrder(order.shipping_address);

  return (
    <div className="space-y-6">
      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{formatDate(order.created_at)}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">
              {order.order_number ?? "Order number unavailable"}
            </h2>
          </div>
          <div className="text-left md:text-right">
            <p className="font-heading text-2xl font-bold">{formatPrice(numberFromValue(order.total_amount))}</p>
            <p className="mt-1 text-sm uppercase tracking-wide text-on-surface-variant">{order.currency ?? "USD"}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryField label="Payment status" value={displayStatus(order.payment_status)} />
          <SummaryField label="Order status" value={displayStatus(order.fulfillment_status)} />
          <SummaryField label="Subtotal" value={formatPrice(numberFromValue(order.subtotal))} />
          <SummaryField label="Shipping" value={formatPrice(numberFromValue(order.shipping_amount))} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Shipping Address</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryField label="Name" value={displayValue(address.name)} />
          <SummaryField label="Phone" value={displayValue(address.phone)} />
          <SummaryField label="Address line 1" value={displayValue(address.address_line1)} />
          <SummaryField label="Address line 2" value={displayValue(address.address_line2)} />
          <SummaryField label="City" value={displayValue(address.city)} />
          <SummaryField label="State" value={displayValue(address.state)} />
          <SummaryField label="Postal code" value={displayValue(address.postal_code)} />
          <SummaryField label="Country" value={displayValue(address.country)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Purchased Items</h2>
        {items.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">No order items found.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit price</th>
                    <th className="px-4 py-3">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/70">
                  {items.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-4">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={displayValue(item.product_title, "Order item")}
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-md object-cover"
                            />
                          ) : (
                            <div className="grid h-14 w-14 place-items-center rounded-md bg-surface-container-low text-xs text-on-surface-variant">
                              No image
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 font-semibold text-on-surface">
                          {displayValue(item.product_title)}
                        </td>
                        <td className="px-4 py-4 text-on-surface-variant">
                          {item.product_slug ? (
                            <Link href={`/products/${item.product_slug}`} className="font-semibold text-primary hover:text-on-surface">
                              {item.product_slug}
                            </Link>
                          ) : (
                            "Not provided"
                          )}
                        </td>
                        <td className="px-4 py-4 text-on-surface-variant">{item.quantity ?? 0}</td>
                        <td className="px-4 py-4 font-semibold">{formatPrice(numberFromValue(item.unit_price))}</td>
                        <td className="px-4 py-4 font-semibold">{formatPrice(numberFromValue(item.line_total))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
