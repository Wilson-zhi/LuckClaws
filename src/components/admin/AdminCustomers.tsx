"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";

type AdminCustomerRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  address_count: number;
  order_count: number;
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

function CustomersTable() {
  const { accessToken } = useAdminAuth();
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
          throw new Error(payload.error ?? "无法加载客户 / Unable to load customers.");
        }

        if (active) {
          setCustomers(payload.customers ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "无法加载客户 / Unable to load customers.");
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
        正在加载客户 / Loading customers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        客户管理暂时无法加载 / Customer management will be connected here.
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        暂无客户 / No customers found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">邮箱 / Email</th>
              <th className="px-4 py-3">姓名 / Name</th>
              <th className="px-4 py-3">角色 / Role</th>
              <th className="px-4 py-3">注册时间 / Registered</th>
              <th className="px-4 py-3">地址 / Addresses</th>
              <th className="px-4 py-3">订单 / Orders</th>
              <th className="px-4 py-3">操作 / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-4 font-semibold text-on-surface">{customer.email ?? "未填写 / Not provided"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.full_name ?? "未添加 / Not added"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.role ?? "customer"}</td>
                <td className="px-4 py-4 text-on-surface-variant">{formatDate(customer.created_at)}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.address_count}</td>
                <td className="px-4 py-4 text-on-surface-variant">{customer.order_count}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
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

export function AdminCustomers() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title="客户 / Customers" description="查看客户资料和后台角色 / View customer profile basics and admin roles." backLink>
          <CustomersTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
