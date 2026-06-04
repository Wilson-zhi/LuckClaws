"use client";

import Link from "next/link";
import { Box, LayoutDashboard, Package, Users } from "lucide-react";

type AdminPageFrameProps = {
  title: string;
  description?: string;
  backLink?: boolean;
  children: React.ReactNode;
};

const adminNavItems = [
  { label: "Dashboard", href: "/admin", Icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", Icon: Package },
  { label: "Customers", href: "/admin/customers", Icon: Users },
  { label: "Products", href: "/admin/products", Icon: Box }
];

export function AdminPageFrame({ title, description, backLink = false, children }: AdminPageFrameProps) {
  return (
    <>
      <section className="section-shell py-10 md:py-14">
        <div className="max-w-4xl">
          {backLink && (
            <Link
              href="/admin"
              className="mb-8 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface"
            >
              <span aria-hidden>&larr;</span>
              <span className="ml-2">Back to Admin</span>
            </Link>
          )}
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            Admin
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {description}
            </p>
          )}
        </div>
      </section>

      <section className="section-shell pb-16 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
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
