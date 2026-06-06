"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
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

function formatDate(value: string | null) {
  if (!value) {
    return "不可用 / Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "不可用 / Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function displayValue(value: string | null) {
  return value?.trim() || "未填写 / Not provided";
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
    canceled: "已取消 / canceled",
    paypal: "PayPal"
  };

  return statusLabels[normalizedValue] ?? (normalizedValue ? normalizedValue.replaceAll("_", " ") : "待处理 / pending");
}

function SummaryField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { accessToken } = useAdminAuth();
  const [order, setOrder] = useState<AdminOrderDetailRow | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AdminOrderShippingAddress | null>(null);
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error(payload.error ?? "无法加载订单 / Unable to load order.");
        }

        if (active) {
          setOrder(payload.order ?? null);
          setShippingAddress(payload.shipping_address ?? null);
          setItems(payload.items ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "无法加载订单 / Unable to load order.");
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
  }, [accessToken, orderId]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        正在加载订单 / Loading order...
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
        未找到订单 / Order not found.
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
          返回后台 / Back to Admin
        </Link>
      </div>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">订单概览 / Order Summary</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">
              {order.order_number ?? "订单号不可用 / Order number unavailable"}
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {displayStatus(order.payment_status)}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryField label="订单号 / Order number" value={order.order_number ?? "不可用 / Unavailable"} />
          <SummaryField label="客户邮箱 / Customer email" value={displayValue(order.customer_email)} />
          <SummaryField label="客户姓名 / Customer name" value={displayValue(order.customer_name)} />
          <SummaryField label="客户电话 / Customer phone" value={displayValue(order.customer_phone)} />
          <SummaryField label="付款状态 / Payment status" value={displayStatus(order.payment_status)} />
          <SummaryField label="发货状态 / Fulfillment status" value={displayStatus(order.fulfillment_status)} />
          <SummaryField label="币种 / Currency" value={order.currency ?? "USD"} />
          <SummaryField label="小计 / Subtotal" value={formatPrice(numberFromValue(order.subtotal))} />
          <SummaryField label="运费 / Shipping" value={formatPrice(numberFromValue(order.shipping_amount))} />
          <SummaryField label="合计 / Total" value={formatPrice(numberFromValue(order.total_amount))} />
          <SummaryField label="来源 / Source" value={displayStatus(order.source)} />
          <SummaryField label="PayPal order ID" value={displayValue(order.paypal_order_id)} />
          <SummaryField label="PayPal capture ID" value={displayValue(order.paypal_capture_id)} />
          <SummaryField label="创建 / Created" value={formatDate(order.created_at)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">收货地址 / Shipping Address</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryField label="姓名 / Name" value={displayValue(shippingAddress?.name ?? null)} />
          <SummaryField label="电话 / Phone" value={displayValue(shippingAddress?.phone ?? null)} />
          <SummaryField label="地址行 1 / Address line 1" value={displayValue(shippingAddress?.address_line1 ?? null)} />
          <SummaryField label="地址行 2 / Address line 2" value={displayValue(shippingAddress?.address_line2 ?? null)} />
          <SummaryField label="城市 / City" value={displayValue(shippingAddress?.city ?? null)} />
          <SummaryField label="州 / State" value={displayValue(shippingAddress?.state ?? null)} />
          <SummaryField label="邮编 / Postal code" value={displayValue(shippingAddress?.postal_code ?? null)} />
          <SummaryField label="国家 / Country" value={displayValue(shippingAddress?.country ?? null)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">订单商品 / Order Items</h2>
        {items.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">未找到订单商品 / No order items found.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">商品 / Product</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">数量 / Quantity</th>
                    <th className="px-4 py-3">单价 / Unit Price</th>
                    <th className="px-4 py-3">行合计 / Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/70">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 font-semibold text-on-surface">
                        {displayValue(item.product_title)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">{displayValue(item.product_slug)}</td>
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
          title="订单详情 / Order Detail"
          description="查看订单付款、收货地址和商品明细 / Review order payment, shipping, and item details."
          backLink={{ href: "/admin/orders", label: "返回订单 / Back to Orders" }}
        >
          <OrderDetailContent orderId={orderId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
