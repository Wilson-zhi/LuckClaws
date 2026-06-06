"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatPrice } from "@/lib/utils";

type AdminOrderRow = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  total_amount: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  paypal_order_id: string | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "不可用 / Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function displayStatus(value: string | null) {
  const normalizedValue = value?.trim() ?? "";
  const statusLabels: Record<string, string> = {
    pending: "待处理 / pending",
    paid: "已付款 / paid",
    captured: "已收款 / captured",
    failed: "失败 / failed",
    unfulfilled: "未发货 / unfulfilled",
    fulfilled: "已发货 / fulfilled",
    canceled: "已取消 / canceled"
  };

  return statusLabels[normalizedValue] ?? (normalizedValue ? normalizedValue.replaceAll("_", " ") : "待处理 / pending");
}

function displayValue(value: string | null) {
  return value?.trim() || "未填写 / Not provided";
}

function totalFromRow(order: AdminOrderRow) {
  const value = typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function OrdersTable() {
  const { accessToken } = useAdminAuth();
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
          throw new Error(payload.error ?? "无法加载订单 / Unable to load orders.");
        }

        if (active) {
          setOrders(payload.orders ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "无法加载订单 / Unable to load orders.");
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
        正在加载订单 / Loading orders...
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
        暂无订单 / No orders yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">订单 / Order</th>
              <th className="px-4 py-3">邮箱 / Email</th>
              <th className="px-4 py-3">姓名 / Name</th>
              <th className="px-4 py-3">合计 / Total</th>
              <th className="px-4 py-3">付款 / Payment</th>
              <th className="px-4 py-3">发货 / Fulfillment</th>
              <th className="px-4 py-3">PayPal Order</th>
              <th className="px-4 py-3">创建 / Created</th>
              <th className="px-4 py-3">操作 / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 font-semibold text-on-surface">{order.order_number ?? "不可用 / Unavailable"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.customer_email)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.customer_name)}</td>
                <td className="px-4 py-4 font-semibold">{formatPrice(totalFromRow(order))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(order.payment_status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayStatus(order.fulfillment_status)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{displayValue(order.paypal_order_id)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(order.created_at)}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex rounded-full border border-primary px-4 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                  >
                    查看 / View
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
        <AdminPageFrame title="订单 / Orders" description="查看 LUCK CLAWS 订单基础信息 / Review recent LUCK CLAWS order basics." backLink>
          <OrdersTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
