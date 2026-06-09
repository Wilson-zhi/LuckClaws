"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatAdminStatus, useAdminLanguage } from "@/components/admin/admin-language";
import { formatPrice } from "@/lib/utils";

type AdminOrderRow = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  paypal_order_id: string | null;
  created_at: string | null;
};

function formatDate(value: string | null, unavailableLabel: string) {
  if (!value) {
    return unavailableLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function totalFromRow(order: AdminOrderRow) {
  const value = typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function OrdersTable() {
  const { accessToken } = useAdminAuth();
  const { t } = useAdminLanguage();
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { orders?: AdminOrderRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? t("unableToLoadOrders"));
        }

        if (active) {
          setOrders(payload.orders ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadOrders"));
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
  }, [accessToken, t]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingOrders")}
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

  if (orders.length === 0) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("noOrdersYet")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">{t("orders")}</th>
              <th className="px-4 py-3">{t("email")}</th>
              <th className="px-4 py-3">{t("name")}</th>
              <th className="px-4 py-3">{t("total")}</th>
              <th className="px-4 py-3">{t("currency")}</th>
              <th className="px-4 py-3">{t("payment")}</th>
              <th className="px-4 py-3">Order status</th>
              <th className="px-4 py-3">PayPal Order</th>
              <th className="px-4 py-3">{t("created")}</th>
              <th className="px-4 py-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 font-semibold text-on-surface">{order.order_number ?? t("unavailable")}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.customer_email, t("notProvided"))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.customer_name, t("notProvided"))}</td>
                <td className="px-4 py-4 font-semibold">{formatPrice(totalFromRow(order))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{order.currency ?? "USD"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatAdminStatus(order.payment_status, t)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatAdminStatus(order.fulfillment_status, t)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.paypal_order_id, t("notProvided"))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(order.created_at, t("unavailable"))}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex rounded-full border border-primary px-4 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                  >
                    {t("view")}
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

export function AdminOrders() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title={{ zh: "订单", en: "Orders" }} description={{ zh: "查看 LUCK CLAWS 订单基础信息", en: "Review recent LUCK CLAWS order basics." }} backLink>
          <OrdersTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
