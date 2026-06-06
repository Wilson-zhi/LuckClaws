"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatAdminStatus, useAdminLanguage } from "@/components/admin/admin-language";
import { formatPrice } from "@/lib/utils";

type AdminOrderDetailRow = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  currency: string | null;
  subtotal: number | string | null;
  shipping_amount: number | string | null;
  total_amount: number | string | null;
  source: string | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  created_at: string | null;
};

type AdminOrderShippingAddress = {
  name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
};

type AdminOrderItem = {
  id: string;
  product_title: string | null;
  product_slug: string | null;
  quantity: number | string | null;
  unit_price: number | string | null;
  line_total: number | string | null;
};

type AdminOrderDetailPayload = {
  order?: AdminOrderDetailRow;
  shipping_address?: AdminOrderShippingAddress;
  items?: AdminOrderItem[];
  error?: string;
};

function numberFromValue(value: number | string | null) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatDate(value: string | null, unavailableLabel: string) {
  if (!value) {
    return unavailableLabel;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return unavailableLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function SummaryField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { accessToken } = useAdminAuth();
  const { t } = useAdminLanguage();
  const [order, setOrder] = useState<AdminOrderDetailRow | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AdminOrderShippingAddress | null>(null);
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const unavailableLabel = t("unavailable");
  const notProvidedLabel = t("notProvided");

  useEffect(() => {
    let active = true;

    fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as AdminOrderDetailPayload;

        if (!response.ok) {
          throw new Error(payload.error ?? t("unableToLoadOrder"));
        }

        if (active) {
          setOrder(payload.order ?? null);
          setShippingAddress(payload.shipping_address ?? null);
          setItems(payload.items ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadOrder"));
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
  }, [accessToken, orderId, t]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingOrder")}
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
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("orderNotFound")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="inline-flex rounded-full border border-primary px-5 py-2 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
        >
          {t("backToAdmin")}
        </Link>
      </div>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{t("orderSummary")}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">
              {order.order_number ?? t("orderNumberUnavailable")}
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {formatAdminStatus(order.payment_status, t)}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryField label={t("orderNumber")} value={order.order_number ?? unavailableLabel} />
          <SummaryField label={t("customerEmail")} value={displayValue(order.customer_email, notProvidedLabel)} />
          <SummaryField label={t("customerName")} value={displayValue(order.customer_name, notProvidedLabel)} />
          <SummaryField label={t("customerPhone")} value={displayValue(order.customer_phone, notProvidedLabel)} />
          <SummaryField label={t("paymentStatus")} value={formatAdminStatus(order.payment_status, t)} />
          <SummaryField label={t("fulfillmentStatus")} value={formatAdminStatus(order.fulfillment_status, t)} />
          <SummaryField label={t("currency")} value={order.currency ?? "USD"} />
          <SummaryField label={t("subtotal")} value={formatPrice(numberFromValue(order.subtotal))} />
          <SummaryField label={t("shipping")} value={formatPrice(numberFromValue(order.shipping_amount))} />
          <SummaryField label={t("total")} value={formatPrice(numberFromValue(order.total_amount))} />
          <SummaryField label={t("source")} value={displayValue(order.source, notProvidedLabel)} />
          <SummaryField label="PayPal order ID" value={displayValue(order.paypal_order_id, notProvidedLabel)} />
          <SummaryField label="PayPal capture ID" value={displayValue(order.paypal_capture_id, notProvidedLabel)} />
          <SummaryField label={t("created")} value={formatDate(order.created_at, unavailableLabel)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">{t("shippingAddress")}</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryField label={t("name")} value={displayValue(shippingAddress?.name ?? null, notProvidedLabel)} />
          <SummaryField label={t("phone")} value={displayValue(shippingAddress?.phone ?? null, notProvidedLabel)} />
          <SummaryField
            label={t("addressLine1")}
            value={displayValue(shippingAddress?.address_line1 ?? null, notProvidedLabel)}
          />
          <SummaryField
            label={t("addressLine2")}
            value={displayValue(shippingAddress?.address_line2 ?? null, notProvidedLabel)}
          />
          <SummaryField label={t("city")} value={displayValue(shippingAddress?.city ?? null, notProvidedLabel)} />
          <SummaryField label={t("state")} value={displayValue(shippingAddress?.state ?? null, notProvidedLabel)} />
          <SummaryField
            label={t("postalCode")}
            value={displayValue(shippingAddress?.postal_code ?? null, notProvidedLabel)}
          />
          <SummaryField
            label={t("country")}
            value={displayValue(shippingAddress?.country ?? null, notProvidedLabel)}
          />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">{t("orderItems")}</h2>
        {items.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">{t("noOrderItems")}</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">{t("product")}</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">{t("quantity")}</th>
                    <th className="px-4 py-3">{t("unitPrice")}</th>
                    <th className="px-4 py-3">{t("lineTotal")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/70">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 font-semibold text-on-surface">
                        {displayValue(item.product_title, notProvidedLabel)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {displayValue(item.product_slug, notProvidedLabel)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">{item.quantity ?? 0}</td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(numberFromValue(item.unit_price))}</td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(numberFromValue(item.line_total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminOrderDetail({ orderId }: { orderId: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "订单详情", en: "Order Detail" }}
          description={{
            zh: "查看订单付款、收货地址和商品明细",
            en: "Review order payment, shipping, and item details."
          }}
          backLink={{ href: "/admin/orders", label: { zh: "返回订单", en: "Back to Orders" } }}
        >
          <OrderDetailContent orderId={orderId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
