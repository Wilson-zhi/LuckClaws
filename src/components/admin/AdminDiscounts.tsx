"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";
import { numberFromDiscountValue, type DiscountCodeRow } from "@/lib/discounts";
import { formatPrice } from "@/lib/utils";

const copy = {
  zh: {
    title: "优惠码",
    description: "管理 LUCK CLAWS 优惠码。",
    add: "添加优惠码",
    loading: "正在加载优惠码...",
    unableToLoad: "无法加载优惠码。",
    unableToUpdate: "无法更新优惠码。",
    noDiscounts: "暂无优惠码。",
    code: "Code",
    name: "名称",
    type: "类型",
    value: "数值",
    status: "状态",
    minimum: "最低订单金额",
    maxUses: "最大使用次数",
    used: "已使用",
    starts: "开始时间",
    expires: "到期时间",
    created: "创建时间",
    actions: "操作",
    edit: "编辑",
    archive: "归档",
    activate: "启用",
    archiving: "归档中...",
    activating: "启用中...",
    unavailable: "不可用",
    notProvided: "未填写",
    confirmArchive: "确定归档这个优惠码吗？",
    confirmActivate: "确定启用这个优惠码吗？"
  },
  en: {
    title: "Discounts",
    description: "Manage LUCK CLAWS discount codes.",
    add: "Add Discount",
    loading: "Loading discounts...",
    unableToLoad: "Unable to load discount codes.",
    unableToUpdate: "Unable to update discount code.",
    noDiscounts: "No discount codes yet.",
    code: "Code",
    name: "Name",
    type: "Type",
    value: "Value",
    status: "Status",
    minimum: "Minimum order",
    maxUses: "Max uses",
    used: "Used",
    starts: "Starts",
    expires: "Expires",
    created: "Created",
    actions: "Actions",
    edit: "Edit",
    archive: "Archive",
    activate: "Activate",
    archiving: "Archiving...",
    activating: "Activating...",
    unavailable: "Unavailable",
    notProvided: "Not provided",
    confirmArchive: "Archive this discount code?",
    confirmActivate: "Activate this discount code?"
  }
} as const;

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

function formatDiscountValue(discount: DiscountCodeRow) {
  const value = numberFromDiscountValue(discount.value);

  if (discount.type === "percentage") {
    return `${value}%`;
  }

  return formatPrice(value);
}

function DiscountsTable() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [discounts, setDiscounts] = useState<DiscountCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/discounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { discounts?: DiscountCodeRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (active) {
          setDiscounts(payload.discounts ?? []);
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

  async function updateStatus(discount: DiscountCodeRow, action: "archive" | "activate") {
    const confirmed = window.confirm(action === "archive" ? c.confirmArchive : c.confirmActivate);

    if (!confirmed) {
      return;
    }

    setActionError("");
    setUpdatingId(discount.id);

    const response = await fetch(`/api/admin/discounts/${encodeURIComponent(discount.id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      discount?: Pick<DiscountCodeRow, "id" | "status" | "updated_at">;
      error?: string;
    };

    if (!response.ok) {
      setActionError(payload.error ?? c.unableToUpdate);
      setUpdatingId("");
      return;
    }

    setDiscounts((currentDiscounts) =>
      currentDiscounts.map((currentDiscount) =>
        currentDiscount.id === discount.id
          ? {
              ...currentDiscount,
              status: payload.discount?.status ?? (action === "archive" ? "archived" : "active"),
              updated_at: payload.discount?.updated_at ?? new Date().toISOString()
            }
          : currentDiscount
      )
    );
    setUpdatingId("");
  }

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {c.loading}
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

  return (
    <div className="space-y-5">
      {actionError && (
        <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {actionError}
        </div>
      )}

      {discounts.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {c.noDiscounts}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px] text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">{c.code}</th>
                  <th className="px-4 py-3">{c.name}</th>
                  <th className="px-4 py-3">{c.type}</th>
                  <th className="px-4 py-3">{c.value}</th>
                  <th className="px-4 py-3">{c.status}</th>
                  <th className="px-4 py-3">{c.minimum}</th>
                  <th className="px-4 py-3">{c.maxUses}</th>
                  <th className="px-4 py-3">{c.used}</th>
                  <th className="px-4 py-3">{c.starts}</th>
                  <th className="px-4 py-3">{c.expires}</th>
                  <th className="px-4 py-3">{c.created}</th>
                  <th className="px-4 py-3">{c.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {discounts.map((discount) => (
                  <tr key={discount.id}>
                    <td className="px-4 py-4 font-semibold text-on-surface">{displayValue(discount.code, c.notProvided)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(discount.name, c.notProvided)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(discount.type, c.notProvided)}</td>
                    <td className="px-4 py-4 font-semibold">{formatDiscountValue(discount)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{displayValue(discount.status, c.notProvided)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatPrice(numberFromDiscountValue(discount.minimum_order_amount))}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{discount.max_uses ?? c.notProvided}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{discount.used_count ?? 0}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatDate(discount.starts_at, c.unavailable)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatDate(discount.expires_at, c.unavailable)}</td>
                    <td className="px-4 py-4 text-on-surface-variant">{formatDate(discount.created_at, c.unavailable)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/discounts/${discount.id}/edit`}
                          className="inline-flex rounded-full bg-primary-container px-3 py-2 font-heading text-xs font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                        >
                          {c.edit}
                        </Link>
                        {discount.status === "archived" ? (
                          <button
                            type="button"
                            disabled={updatingId === discount.id}
                            className="inline-flex rounded-full border border-primary px-3 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => updateStatus(discount, "activate")}
                          >
                            {updatingId === discount.id ? c.activating : c.activate}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingId === discount.id}
                            className="inline-flex rounded-full border border-error/40 px-3 py-2 font-heading text-xs font-bold text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => updateStatus(discount, "archive")}
                          >
                            {updatingId === discount.id ? c.archiving : c.archive}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDiscounts() {
  return (
    <AdminPageFrame
      title={{ zh: copy.zh.title, en: copy.en.title }}
      description={{ zh: copy.zh.description, en: copy.en.description }}
      layout="wide"
      backLink
    >
      <div className="space-y-6">
        <DiscountsIntro />
        <DiscountsTable />
      </div>
    </AdminPageFrame>
  );
}

function DiscountsIntro() {
  const { language } = useAdminLanguage();
  const c = copy[language];

  return (
    <section className="ambient-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <p className="text-sm leading-7 text-on-surface-variant">
        WELCOME10 can be managed here with the same status rules used at checkout.
      </p>
      <Link
        href="/admin/discounts/new"
        className="inline-flex shrink-0 justify-center rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:bg-primary/90"
      >
        {c.add}
      </Link>
    </section>
  );
}

export function AdminDiscountsPageShell() {
  return (
    <AdminGuard>
      {() => <AdminDiscounts />}
    </AdminGuard>
  );
}
