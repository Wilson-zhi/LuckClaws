"use client";

import Link from "next/link";
import { BadgePercent, Box, Home, LayoutDashboard, Mail, MessageSquare, Package, Tags, Users } from "lucide-react";
import {
  AdminLanguageProvider,
  type AdminLabel,
  useAdminLanguagePreference
} from "@/components/admin/admin-language";

type AdminPageFrameProps = {
  title: AdminLabel;
  description?: AdminLabel;
  layout?: "default" | "wide";
  backLink?:
    | boolean
    | {
        href: string;
        label: AdminLabel;
      };
  children: React.ReactNode;
};

const adminNavItems = [
  { labelKey: "dashboard", href: "/admin", Icon: LayoutDashboard },
  { labelKey: "homepage", href: "/admin/homepage", Icon: Home },
  { label: { zh: "订阅", en: "Newsletter" }, href: "/admin/newsletter", Icon: Mail },
  { label: { zh: "消息", en: "Messages" }, href: "/admin/messages", Icon: MessageSquare },
  { label: { zh: "优惠码", en: "Discounts" }, href: "/admin/discounts", Icon: BadgePercent },
  { labelKey: "orders", href: "/admin/orders", Icon: Package },
  { labelKey: "customers", href: "/admin/customers", Icon: Users },
  { labelKey: "categories", href: "/admin/categories", Icon: Tags },
  { labelKey: "products", href: "/admin/products", Icon: Box }
] as const;

export function AdminPageFrame({
  title,
  description,
  layout = "default",
  backLink = false,
  children
}: AdminPageFrameProps) {
  const languageContext = useAdminLanguagePreference();
  const { language, setLanguage, t, text } = languageContext;
  const normalizedBackLink =
    typeof backLink === "object"
      ? backLink
      : backLink
        ? { href: "/admin", label: { zh: "返回后台", en: "Back to Admin" } }
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
    <AdminLanguageProvider value={languageContext}>
      <section className={`${shellClass} py-10 md:py-14`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            {normalizedBackLink && (
              <Link
                href={normalizedBackLink.href}
                className="mb-8 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface"
              >
                <span aria-hidden>&larr;</span>
                <span className="ml-2">{text(normalizedBackLink.label)}</span>
              </Link>
            )}
            <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              {t("admin")}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight md:text-6xl">{text(title)}</h1>
            {description && (
              <p className="mt-5 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
                {text(description)}
              </p>
            )}
          </div>

          <div
            className="inline-flex w-fit rounded-full border border-outline-variant bg-surface-container-lowest p-1 shadow-soft"
            aria-label="Admin language"
          >
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                language === "zh" ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"
              }`}
              aria-pressed={language === "zh"}
              onClick={() => setLanguage("zh")}
            >
              中文
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                language === "en" ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"
              }`}
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
          </div>
        </div>
      </section>

      <section className={`${shellClass} pb-16 md:pb-24`}>
        <div className={bodyGridClass}>
          <nav className="rounded-lg bg-surface-container-lowest p-4 shadow-soft" aria-label="Admin navigation">
            <div className="grid gap-2">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-primary-container/10 hover:text-primary"
                >
                  <item.Icon aria-hidden className="h-4 w-4 shrink-0" />
                  {"label" in item ? text(item.label) : t(item.labelKey)}
                </Link>
              ))}
            </div>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </AdminLanguageProvider>
  );
}
