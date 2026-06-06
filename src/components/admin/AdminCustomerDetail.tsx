"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatPrice } from "@/lib/utils";

type AdminCustomerProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type AdminCustomerAddress = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_default: boolean | null;
};

type AdminCustomerOrder = {
  id: string;
  order_number: string | null;
  total_amount: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  created_at: string | null;
};

type AdminCustomerDetailPayload = {
  customer?: AdminCustomerProfile;
  addresses?: AdminCustomerAddress[];
  orders?: AdminCustomerOrder[];
  error?: string;
};

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
    canceled: "已取消 / canceled"
  };

  return statusLabels[normalizedValue] ?? (normalizedValue ? normalizedValue.replaceAll("_", " ") : "待处理 / pending");
}

function totalFromOrder(order: AdminCustomerOrder) {
  const value = typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function CustomerDetailContent({ customerId }: { customerId: string }) {
  const { accessToken } = useAdminAuth();
  const [customer, setCustomer] = useState<AdminCustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<AdminCustomerAddress[]>([]);
  const [orders, setOrders] = useState<AdminCustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/admin/customers/${encodeURIComponent(customerId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as AdminCustomerDetailPayload;

        if (!response.ok) {
          throw new Error(payload.error ?? "无法加载客户 / Unable to load customer.");
        }

        if (active) {
          setCustomer(payload.customer ?? null);
          setAddresses(payload.addresses ?? []);
          setOrders(payload.orders ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "无法加载客户 / Unable to load customer.");
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
  }, [accessToken, customerId]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        正在加载客户 / Loading customer...
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

  if (!customer) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        未找到客户 / Customer not found.
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
            <p className="text-xs font-bold uppercase tracking-wide text-primary">客户资料 / Customer Profile</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">{displayValue(customer.email)}</h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {customer.role ?? "customer"}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <ProfileField label="邮箱 / Email" value={displayValue(customer.email)} />
          <ProfileField label="姓名 / Name" value={displayValue(customer.full_name)} />
          <ProfileField label="角色 / Role" value={customer.role ?? "customer"} />
          <ProfileField label="创建 / Created" value={formatDate(customer.created_at)} />
          <ProfileField label="更新 / Updated" value={formatDate(customer.updated_at)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">保存地址 / Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">暂无保存地址 / No saved addresses.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {addresses.map((address) => (
              <article key={address.id} className="rounded-lg border border-outline-variant bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold">{displayValue(address.full_name)}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      电话 / Phone: {displayValue(address.phone)}
                    </p>
                  </div>
                  {address.is_default && (
                    <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      默认 / Default
                    </span>
                  )}
                </div>
                <div className="mt-5 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-on-surface">地址行 1 / Address line 1:</span>{" "}
                    {displayValue(address.address_line1)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">地址行 2 / Address line 2:</span>{" "}
                    {displayValue(address.address_line2)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">城市 / City:</span> {displayValue(address.city)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">州 / State:</span> {displayValue(address.state)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">邮编 / Postal code:</span>{" "}
                    {displayValue(address.postal_code)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">国家 / Country:</span>{" "}
                    {displayValue(address.country)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">订单 / Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">暂无订单 / No orders yet.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">订单 / Order</th>
                    <th className="px-4 py-3">合计 / Total</th>
                    <th className="px-4 py-3">付款 / Payment</th>
                    <th className="px-4 py-3">发货 / Fulfillment</th>
                    <th className="px-4 py-3">创建 / Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/70">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4 font-semibold text-on-surface">
                        {order.order_number ?? "不可用 / Unavailable"}
                      </td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(totalFromOrder(order))}</td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {displayStatus(order.payment_status)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {displayStatus(order.fulfillment_status)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">{formatDate(order.created_at)}</td>
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

export function AdminCustomerDetail({ customerId }: { customerId: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title="客户详情 / Customer Detail"
          description="查看客户资料、保存地址和相关订单 / Review customer profile, saved addresses, and related orders."
          backLink={{ href: "/admin/customers", label: "返回客户 / Back to Customers" }}
        >
          <CustomerDetailContent customerId={customerId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
