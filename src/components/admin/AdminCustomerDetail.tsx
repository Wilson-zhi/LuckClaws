"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { formatAdminStatus, useAdminLanguage } from "@/components/admin/admin-language";
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

function totalFromOrder(order: AdminCustomerOrder) {
  const value = typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function ProfileField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-surface-container-low p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
      <dd className="mt-2 font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function CustomerDetailContent({ customerId }: { customerId: string }) {
  const { accessToken } = useAdminAuth();
  const { t } = useAdminLanguage();
  const [customer, setCustomer] = useState<AdminCustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<AdminCustomerAddress[]>([]);
  const [orders, setOrders] = useState<AdminCustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const unavailableLabel = t("unavailable");
  const notProvidedLabel = t("notProvided");

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
          throw new Error(payload.error ?? t("unableToLoadCustomer"));
        }

        if (active) {
          setCustomer(payload.customer ?? null);
          setAddresses(payload.addresses ?? []);
          setOrders(payload.orders ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadCustomer"));
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
  }, [accessToken, customerId, t]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingCustomer")}
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
        {t("customerNotFound")}
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
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{t("customerProfile")}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">
              {displayValue(customer.email, notProvidedLabel)}
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {displayValue(customer.role, "customer")}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <ProfileField label={t("email")} value={displayValue(customer.email, notProvidedLabel)} />
          <ProfileField label={t("name")} value={displayValue(customer.full_name, notProvidedLabel)} />
          <ProfileField label={t("role")} value={displayValue(customer.role, "customer")} />
          <ProfileField label={t("created")} value={formatDate(customer.created_at, unavailableLabel)} />
          <ProfileField label={t("updated")} value={formatDate(customer.updated_at, unavailableLabel)} />
        </dl>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">{t("savedAddresses")}</h2>
        {addresses.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">{t("noSavedAddresses")}</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {addresses.map((address) => (
              <article key={address.id} className="rounded-lg border border-outline-variant bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold">
                      {displayValue(address.full_name, notProvidedLabel)}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {t("phone")}: {displayValue(address.phone, notProvidedLabel)}
                    </p>
                  </div>
                  {address.is_default && (
                    <span className="inline-flex w-fit rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {t("default")}
                    </span>
                  )}
                </div>
                <div className="mt-5 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-on-surface">{t("addressLine1")}:</span>{" "}
                    {displayValue(address.address_line1, notProvidedLabel)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">{t("addressLine2")}:</span>{" "}
                    {displayValue(address.address_line2, notProvidedLabel)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">{t("city")}:</span>{" "}
                    {displayValue(address.city, notProvidedLabel)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">{t("state")}:</span>{" "}
                    {displayValue(address.state, notProvidedLabel)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">{t("postalCode")}:</span>{" "}
                    {displayValue(address.postal_code, notProvidedLabel)}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">{t("country")}:</span>{" "}
                    {displayValue(address.country, notProvidedLabel)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ambient-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">{t("orders")}</h2>
        {orders.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-on-surface-variant">{t("noOrdersYet")}</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">{t("orderNumber")}</th>
                    <th className="px-4 py-3">{t("total")}</th>
                    <th className="px-4 py-3">{t("payment")}</th>
                    <th className="px-4 py-3">{t("fulfillment")}</th>
                    <th className="px-4 py-3">{t("created")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/70">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4 font-semibold text-on-surface">
                        {order.order_number ?? unavailableLabel}
                      </td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(totalFromOrder(order))}</td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {formatAdminStatus(order.payment_status, t)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {formatAdminStatus(order.fulfillment_status, t)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {formatDate(order.created_at, unavailableLabel)}
                      </td>
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
          title={{ zh: "客户详情", en: "Customer Detail" }}
          description={{
            zh: "查看客户资料、保存地址和相关订单",
            en: "Review customer profile, saved addresses, and related orders."
          }}
          backLink={{ href: "/admin/customers", label: { zh: "返回客户", en: "Back to Customers" } }}
        >
          <CustomerDetailContent customerId={customerId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
