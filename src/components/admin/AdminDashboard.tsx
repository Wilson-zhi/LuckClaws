"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  Box,
  Home,
  Mail,
  MessageSquare,
  Package,
  Plus,
  Tags
} from "lucide-react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";
import { numberFromDiscountValue } from "@/lib/discounts";
import { formatPrice } from "@/lib/utils";

type DashboardSection<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

type ProductMetrics = {
  total: number;
  active: number;
  draft: number;
  archived: number;
};

type CategoryMetrics = {
  total: number;
  active: number;
};

type NewsletterMetrics = {
  total: number;
  active: number;
  unsubscribed: number;
};

type MessageMetrics = {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
};

type DiscountMetrics = {
  total: number;
  active: number;
  draft: number;
  archived: number;
};

type OrderMetrics = {
  total: number;
};

type RecentSubscriber = {
  id: string;
  email: string | null;
  status: string | null;
  created_at: string | null;
};

type RecentMessage = {
  id: string;
  email: string | null;
  subject: string | null;
  status: string | null;
  created_at: string | null;
};

type RecentDiscount = {
  id: string;
  code: string | null;
  type: string | null;
  value: number | string | null;
  status: string | null;
  created_at: string | null;
};

type RecentOrder = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  created_at: string | null;
};

type DashboardPayload = {
  products: DashboardSection<ProductMetrics>;
  categories: DashboardSection<CategoryMetrics>;
  newsletter: DashboardSection<{
    metrics: NewsletterMetrics;
    recent: RecentSubscriber[];
  }>;
  messages: DashboardSection<{
    metrics: MessageMetrics;
    recent: RecentMessage[];
  }>;
  discounts: DashboardSection<{
    metrics: DiscountMetrics;
    recent: RecentDiscount[];
  }>;
  orders: DashboardSection<{
    metrics: OrderMetrics;
    recent: RecentOrder[];
  }>;
};

type Metric = {
  label: string;
  value: number;
};

const copy = {
  zh: {
    title: "仪表盘",
    description: "管理 LUCK CLAWS 店铺运营概览。",
    loading: "正在加载仪表盘数据...",
    unableToLoad: "无法加载仪表盘数据。",
    sectionError: "暂时无法加载此模块数据。",
    products: "商品",
    categories: "分类",
    newsletter: "订阅",
    messages: "消息",
    discounts: "优惠码",
    orders: "订单",
    totalProducts: "商品总数",
    activeProducts: "上架商品",
    draftProducts: "草稿商品",
    archivedProducts: "已归档商品",
    totalCategories: "分类总数",
    activeCategories: "启用分类",
    totalSubscribers: "订阅总数",
    activeSubscribers: "启用订阅",
    unsubscribedSubscribers: "已退订",
    totalMessages: "消息总数",
    newMessages: "新消息",
    inProgressMessages: "处理中",
    resolvedMessages: "已解决",
    totalDiscounts: "优惠码总数",
    activeDiscounts: "启用优惠码",
    draftDiscounts: "草稿优惠码",
    archivedDiscounts: "已停用优惠码",
    totalOrders: "订单总数",
    recentSubscribers: "最近订阅",
    recentMessages: "最近消息",
    recentDiscounts: "最近优惠码",
    recentOrders: "最近订单",
    quickActions: "快捷操作",
    view: "查看",
    manage: "管理",
    addProduct: "新增商品",
    manageProducts: "管理商品",
    manageCategories: "管理分类",
    editHomepage: "编辑首页",
    viewNewsletter: "查看订阅",
    manageDiscounts: "管理优惠码",
    viewMessages: "查看消息",
    email: "邮箱",
    status: "状态",
    created: "创建时间",
    subject: "主题",
    code: "优惠码",
    value: "数值",
    order: "订单",
    total: "总计",
    payment: "付款",
    fulfillment: "履约",
    noRecentSubscribers: "暂无最近订阅。",
    noRecentMessages: "暂无最近消息。",
    noRecentDiscounts: "暂无最近优惠码。",
    noRecentOrders: "暂无最近订单。",
    notProvided: "未填写",
    unavailable: "不可用",
    active: "启用",
    draft: "草稿",
    archived: "已停用",
    unsubscribed: "已退订",
    new: "新消息",
    in_progress: "处理中",
    resolved: "已解决",
    spam: "垃圾消息"
  },
  en: {
    title: "Dashboard",
    description: "Manage the LUCK CLAWS store operations overview.",
    loading: "Loading dashboard data...",
    unableToLoad: "Unable to load dashboard data.",
    sectionError: "Unable to load this section right now.",
    products: "Products",
    categories: "Categories",
    newsletter: "Newsletter",
    messages: "Messages",
    discounts: "Discounts",
    orders: "Orders",
    totalProducts: "Total products",
    activeProducts: "Active products",
    draftProducts: "Draft products",
    archivedProducts: "Archived products",
    totalCategories: "Total categories",
    activeCategories: "Active categories",
    totalSubscribers: "Total subscribers",
    activeSubscribers: "Active subscribers",
    unsubscribedSubscribers: "Unsubscribed subscribers",
    totalMessages: "Total messages",
    newMessages: "New messages",
    inProgressMessages: "In progress messages",
    resolvedMessages: "Resolved messages",
    totalDiscounts: "Total discount codes",
    activeDiscounts: "Active discount codes",
    draftDiscounts: "Draft discount codes",
    archivedDiscounts: "Archived discount codes",
    totalOrders: "Total orders",
    recentSubscribers: "Recent Subscribers",
    recentMessages: "Recent Messages",
    recentDiscounts: "Recent Discount Codes",
    recentOrders: "Recent Orders",
    quickActions: "Quick Actions",
    view: "View",
    manage: "Manage",
    addProduct: "Add Product",
    manageProducts: "Manage Products",
    manageCategories: "Manage Categories",
    editHomepage: "Edit Homepage",
    viewNewsletter: "View Newsletter",
    manageDiscounts: "Manage Discounts",
    viewMessages: "View Messages",
    email: "Email",
    status: "Status",
    created: "Created",
    subject: "Subject",
    code: "Code",
    value: "Value",
    order: "Order",
    total: "Total",
    payment: "Payment",
    fulfillment: "Fulfillment",
    noRecentSubscribers: "No recent subscribers.",
    noRecentMessages: "No recent messages.",
    noRecentDiscounts: "No recent discount codes.",
    noRecentOrders: "No recent orders.",
    notProvided: "Not provided",
    unavailable: "Unavailable",
    active: "Active",
    draft: "Draft",
    archived: "Archived",
    unsubscribed: "Unsubscribed",
    new: "New",
    in_progress: "In progress",
    resolved: "Resolved",
    spam: "Spam"
  }
} as const;

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

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
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDiscountValue(discount: RecentDiscount) {
  const value = numberFromDiscountValue(discount.value);

  if (discount.type === "percentage") {
    return `${value}%`;
  }

  return formatPrice(value);
}

function statusLabel(status: string | null, language: "zh" | "en") {
  const normalizedStatus = status?.trim();
  const c = copy[language];

  switch (normalizedStatus) {
    case "active":
      return c.active;
    case "draft":
      return c.draft;
    case "archived":
      return c.archived;
    case "unsubscribed":
      return c.unsubscribed;
    case "new":
      return c.new;
    case "in_progress":
      return c.in_progress;
    case "resolved":
      return c.resolved;
    case "spam":
      return c.spam;
    default:
      return displayValue(status, c.notProvided);
  }
}

function StatusBadge({ status, language }: { status: string | null; language: "zh" | "en" }) {
  const normalizedStatus = status?.trim();
  const className =
    normalizedStatus === "active" || normalizedStatus === "new"
      ? "bg-primary-container/20 text-primary"
      : normalizedStatus === "in_progress" || normalizedStatus === "draft"
        ? "bg-[#fff5d6] text-[#8a5a00]"
        : normalizedStatus === "resolved"
          ? "bg-green-100 text-green-700"
          : "bg-surface-container-low text-on-surface-variant";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${className}`}>
      {statusLabel(status, language)}
    </span>
  );
}

function SectionError({ label }: { label: string }) {
  return (
    <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="status">
      {label}
    </div>
  );
}

function MetricGroup({
  title,
  Icon,
  metrics,
  errorLabel
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  metrics?: Metric[];
  errorLabel: string;
}) {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
      </div>

      {metrics ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md bg-surface-container-low p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{metric.label}</p>
              <p className="mt-2 font-heading text-3xl font-extrabold text-on-surface">{metric.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <SectionError label={errorLabel} />
        </div>
      )}
    </section>
  );
}

function RecentSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function QuickActions() {
  const { language } = useAdminLanguage();
  const c = copy[language];
  const actions = [
    { label: c.addProduct, href: "/admin/products/new", Icon: Plus },
    { label: c.manageProducts, href: "/admin/products", Icon: Box },
    { label: c.manageCategories, href: "/admin/categories", Icon: Tags },
    { label: c.editHomepage, href: "/admin/homepage", Icon: Home },
    { label: c.viewNewsletter, href: "/admin/newsletter", Icon: Mail },
    { label: c.manageDiscounts, href: "/admin/discounts", Icon: BadgePercent },
    { label: c.viewMessages, href: "/admin/messages", Icon: MessageSquare }
  ];

  return (
    <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
      <h2 className="font-heading text-xl font-bold">{c.quickActions}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md border border-outline-variant bg-white px-4 py-3 text-sm font-bold text-on-surface transition hover:border-primary hover:text-primary"
          >
            <Icon aria-hidden className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function DashboardOverview({ dashboard }: { dashboard: DashboardPayload }) {
  const { language } = useAdminLanguage();
  const c = copy[language];

  const productMetrics = dashboard.products.ok
    ? [
        { label: c.totalProducts, value: dashboard.products.data.total },
        { label: c.activeProducts, value: dashboard.products.data.active },
        { label: c.draftProducts, value: dashboard.products.data.draft },
        { label: c.archivedProducts, value: dashboard.products.data.archived }
      ]
    : undefined;

  const categoryMetrics = dashboard.categories.ok
    ? [
        { label: c.totalCategories, value: dashboard.categories.data.total },
        { label: c.activeCategories, value: dashboard.categories.data.active }
      ]
    : undefined;

  const newsletterMetrics = dashboard.newsletter.ok
    ? [
        { label: c.totalSubscribers, value: dashboard.newsletter.data.metrics.total },
        { label: c.activeSubscribers, value: dashboard.newsletter.data.metrics.active },
        { label: c.unsubscribedSubscribers, value: dashboard.newsletter.data.metrics.unsubscribed }
      ]
    : undefined;

  const messageMetrics = dashboard.messages.ok
    ? [
        { label: c.totalMessages, value: dashboard.messages.data.metrics.total },
        { label: c.newMessages, value: dashboard.messages.data.metrics.new },
        { label: c.inProgressMessages, value: dashboard.messages.data.metrics.in_progress },
        { label: c.resolvedMessages, value: dashboard.messages.data.metrics.resolved }
      ]
    : undefined;

  const discountMetrics = dashboard.discounts.ok
    ? [
        { label: c.totalDiscounts, value: dashboard.discounts.data.metrics.total },
        { label: c.activeDiscounts, value: dashboard.discounts.data.metrics.active },
        { label: c.draftDiscounts, value: dashboard.discounts.data.metrics.draft },
        { label: c.archivedDiscounts, value: dashboard.discounts.data.metrics.archived }
      ]
    : undefined;

  const orderMetrics = dashboard.orders.ok
    ? [{ label: c.totalOrders, value: dashboard.orders.data.metrics.total }]
    : undefined;

  return (
    <div className="space-y-6">
      <QuickActions />

      <div className="grid gap-5 xl:grid-cols-2">
        <MetricGroup title={c.products} Icon={Box} metrics={productMetrics} errorLabel={c.sectionError} />
        <MetricGroup title={c.categories} Icon={Tags} metrics={categoryMetrics} errorLabel={c.sectionError} />
        <MetricGroup title={c.newsletter} Icon={Mail} metrics={newsletterMetrics} errorLabel={c.sectionError} />
        <MetricGroup title={c.messages} Icon={MessageSquare} metrics={messageMetrics} errorLabel={c.sectionError} />
        <MetricGroup title={c.discounts} Icon={BadgePercent} metrics={discountMetrics} errorLabel={c.sectionError} />
        <MetricGroup title={c.orders} Icon={Package} metrics={orderMetrics} errorLabel={c.sectionError} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <RecentSection title={c.recentSubscribers}>
          {dashboard.newsletter.ok ? (
            dashboard.newsletter.data.recent.length > 0 ? (
              <div className="divide-y divide-outline-variant/70">
                {dashboard.newsletter.data.recent.map((subscriber) => (
                  <div key={subscriber.id} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <p className="break-words text-sm font-bold text-on-surface">
                        {displayValue(subscriber.email, c.notProvided)}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {formatDate(subscriber.created_at, c.unavailable)}
                      </p>
                    </div>
                    <StatusBadge status={subscriber.status} language={language} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-on-surface-variant">{c.noRecentSubscribers}</p>
            )
          ) : (
            <SectionError label={c.sectionError} />
          )}
        </RecentSection>

        <RecentSection title={c.recentMessages}>
          {dashboard.messages.ok ? (
            dashboard.messages.data.recent.length > 0 ? (
              <div className="divide-y divide-outline-variant/70">
                {dashboard.messages.data.recent.map((message) => (
                  <div key={message.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div>
                      <p className="break-words text-sm font-bold text-on-surface">
                        {displayValue(message.subject, c.notProvided)}
                      </p>
                      <p className="mt-1 break-words text-xs text-on-surface-variant">
                        {displayValue(message.email, c.notProvided)} · {formatDate(message.created_at, c.unavailable)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={message.status} language={language} />
                      <Link
                        href={`/admin/messages/${message.id}`}
                        className="inline-flex rounded-full border border-primary px-3 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10"
                      >
                        {c.view}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-on-surface-variant">{c.noRecentMessages}</p>
            )
          ) : (
            <SectionError label={c.sectionError} />
          )}
        </RecentSection>

        <RecentSection title={c.recentDiscounts}>
          {dashboard.discounts.ok ? (
            dashboard.discounts.data.recent.length > 0 ? (
              <div className="divide-y divide-outline-variant/70">
                {dashboard.discounts.data.recent.map((discount) => (
                  <div key={discount.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div>
                      <p className="break-words text-sm font-bold text-on-surface">
                        {displayValue(discount.code, c.notProvided)}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {formatDiscountValue(discount)} · {formatDate(discount.created_at, c.unavailable)}
                      </p>
                    </div>
                    <StatusBadge status={discount.status} language={language} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-on-surface-variant">{c.noRecentDiscounts}</p>
            )
          ) : (
            <SectionError label={c.sectionError} />
          )}
        </RecentSection>

        <RecentSection title={c.recentOrders}>
          {dashboard.orders.ok ? (
            dashboard.orders.data.recent.length > 0 ? (
              <div className="divide-y divide-outline-variant/70">
                {dashboard.orders.data.recent.map((order) => (
                  <div key={order.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div>
                      <p className="break-words text-sm font-bold text-on-surface">
                        {displayValue(order.order_number, order.id)}
                      </p>
                      <p className="mt-1 break-words text-xs text-on-surface-variant">
                        {displayValue(order.customer_email, c.notProvided)} · {formatDate(order.created_at, c.unavailable)}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-on-surface">
                      {formatPrice(numberFromDiscountValue(order.total_amount))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-on-surface-variant">{c.noRecentOrders}</p>
            )
          ) : (
            <SectionError label={c.sectionError} />
          )}
        </RecentSection>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as DashboardPayload | { error?: string };

        if (!response.ok) {
          throw new Error("error" in payload && payload.error ? payload.error : c.unableToLoad);
        }

        if (active) {
          setDashboard(payload as DashboardPayload);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : c.unableToLoad);
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
  }, [accessToken, c.unableToLoad]);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {c.loading}
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {error || c.unableToLoad}
      </div>
    );
  }

  return <DashboardOverview dashboard={dashboard} />;
}

export function AdminDashboard() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: copy.zh.title, en: copy.en.title }}
          description={{ zh: copy.zh.description, en: copy.en.description }}
          layout="wide"
        >
          <AdminDashboardContent />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
