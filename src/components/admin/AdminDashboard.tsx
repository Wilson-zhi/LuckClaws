"use client";

import Link from "next/link";
import { Box, Package, Users } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";

const adminCards = [
  {
    title: "订单 / Orders",
    href: "/admin/orders",
    description: "查看付款和发货状态 / Review payment and fulfillment status.",
    Icon: Package
  },
  {
    title: "客户 / Customers",
    href: "/admin/customers",
    description: "查看客户资料和角色 / View customer profile and role basics.",
    Icon: Users
  },
  {
    title: "商品 / Products",
    href: "/admin/products",
    description: "管理商品目录和展示设置 / Manage catalog and display settings.",
    Icon: Box
  }
];

export function AdminDashboard() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title="仪表盘 / Admin Dashboard" description="管理 LUCK CLAWS 店铺运营 / Manage LUCK CLAWS store operations.">
          <div className="grid gap-5 md:grid-cols-3">
            {adminCards.map(({ title, href, description, Icon }) => (
              <Link
                key={href}
                href={href}
                className="ambient-card p-6 transition hover:border-primary md:p-8"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
              </Link>
            ))}
          </div>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
