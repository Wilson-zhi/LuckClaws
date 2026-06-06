"use client";

import Link from "next/link";
import { Box, LayoutDashboard, Package, Users } from "lucide-react";

type AdminPageFrameProps = {
  title: string;
  description?: string;
  layout?: "default" | "wide";
  backLink?:
    | boolean
    | {
        href: string;
        label: string;
      };
  children: React.ReactNode;
};

const adminNavItems = [
  { label: "仪表盘 / Dashboard", href: "/admin", Icon: LayoutDashboard },
  { label: "订单 / Orders", href: "/admin/orders", Icon: Package },
  { label: "客户 / Customers", href: "/admin/customers", Icon: Users },
  { label: "商品 / Products", href: "/admin/products", Icon: Box }
];

export function AdminPageFrame({
  title,
  description,
  layout = "default",
  backLink = false,
  children
}: AdminPageFrameProps) {
  const normalizedBackLink =
    typeof backLink === "object"
      ? backLink
      : backLink
        ? { href: "/admin", label: "返回后台 / Back to Admin" }
        : null;
  const shellClass =
    layout === "wide"
      ? "mx-auto w-full max-w-[1840px] px-4 md:px-6 2xl:px-8"
      : "section-shell";
  const bodyGridClass =
    layout === "wide"
      ? "grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8 lg:items-start"
      : "grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start";

  return (
    <>
      <section className={`${shellClass} py-10 md:py-14`}>
        <div className="max-w-4xl">
          {normalizedBackLink && (
            <Link
              href={normalizedBackLink.href}
              className="mb-8 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface"
            >
              <span aria-hidden>&larr;</span>
              <span className="ml-2">{normalizedBackLink.label}</span>
            </Link>
          )}
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            后台 / Admin
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {description}
            </p>
          )}
        </div>
      </section>

      <section className={`${shellClass} pb-16 md:pb-24`}>
        <div className={bodyGridClass}>
          <nav className="rounded-lg bg-surface-container-lowest p-4 shadow-soft" aria-label="Admin navigation">
            <div className="grid gap-2">
              {adminNavItems.map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-primary-container/10 hover:text-primary"
                >
                  <Icon aria-hidden className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </>
  );
}
