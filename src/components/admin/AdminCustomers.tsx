"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";

type AdminCustomerRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  address_count: number;
  order_count: number;
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

function CustomersTable() {
  const { accessToken } = useAdminAuth();
  const { t } = useAdminLanguage();
  const [customers, setCustomers] = useState<AdminCustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/customers", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { customers?: AdminCustomerRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? t("unableToLoadCustomers"));
        }

        if (active) {
          setCustomers(payload.customers ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadCustomers"));
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
        {t("loadingCustomers")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {error || t("customerManagementFallback")}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("noCustomersYet")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">{t("email")}</th>
              <th className="px-4 py-3">{t("name")}</th>
              <th className="px-4 py-3">{t("role")}</th>
              <th className="px-4 py-3">{t("registered")}</th>
              <th className="px-4 py-3">{t("addresses")}</th>
              <th className="px-4 py-3">{t("orders")}</th>
              <th className="px-4 py-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-4 font-semibold text-on-surface">{customer.email ?? t("notProvided")}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.full_name ?? t("notAdded")}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.role ?? "customer"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(customer.created_at, t("unavailable"))}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.address_count}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.order_count}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
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

export function AdminCustomers() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title={{ zh: "客户", en: "Customers" }} description={{ zh: "查看客户资料和后台角色", en: "View customer profile basics and admin roles." }} backLink>
          <CustomersTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
