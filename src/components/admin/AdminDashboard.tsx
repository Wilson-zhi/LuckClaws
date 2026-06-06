"use client";

import Link from "next/link";
import { Box, Package, Users } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";

const adminCards = [
  {
    titleKey: "orders",
    href: "/admin/orders",
    descriptionKey: "reviewPaymentFulfillment",
    Icon: Package
  },
  {
    titleKey: "customers",
    href: "/admin/customers",
    descriptionKey: "viewCustomerProfiles",
    Icon: Users
  },
  {
    titleKey: "products",
    href: "/admin/products",
    descriptionKey: "manageCatalog",
    Icon: Box
  }
] as const;

function AdminDashboardCards() {
  const { t } = useAdminLanguage();

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {adminCards.map(({ titleKey, href, descriptionKey, Icon }) => (
        <Link
          key={href}
          href={href}
          className="ambient-card p-6 transition hover:border-primary md:p-8"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
            <Icon aria-hidden className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-heading text-2xl font-bold">{t(titleKey)}</h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">{t(descriptionKey)}</p>
        </Link>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title={{ zh: "仪表盘", en: "Admin Dashboard" }} description={{ zh: "管理 LUCK CLAWS 店铺运营", en: "Manage LUCK CLAWS store operations." }}>
          <AdminDashboardCards />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
