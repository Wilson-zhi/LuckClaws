"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";

type NewsletterSubscriberRow = {
  id: string;
  email: string | null;
  source: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const copy = {
  zh: {
    title: "订阅",
    description: "管理 LUCK CLAWS 邮件订阅用户。",
    loading: "正在加载订阅用户...",
    unableToLoad: "无法加载订阅用户。",
    unableToUpdate: "无法更新订阅状态。",
    unableToDelete: "无法删除订阅用户。",
    noSubscribers: "暂无订阅用户。",
    noMatches: "没有符合筛选条件的订阅用户。",
    filter: "状态筛选",
    all: "全部",
    active: "Active",
    unsubscribed: "Unsubscribed",
    email: "Email",
    source: "来源",
    status: "状态",
    created: "创建时间",
    updated: "更新时间",
    actions: "操作",
    markActive: "标记为 active",
    markUnsubscribed: "标记为 unsubscribed",
    delete: "删除",
    deleting: "删除中...",
    updating: "更新中...",
    confirmDelete: "确定删除这个订阅用户吗？",
    unavailable: "不可用",
    notProvided: "未填写",
    showing: "显示"
  },
  en: {
    title: "Newsletter",
    description: "Manage LUCK CLAWS email subscribers.",
    loading: "Loading subscribers...",
    unableToLoad: "Unable to load subscribers.",
    unableToUpdate: "Unable to update subscriber status.",
    unableToDelete: "Unable to delete subscriber.",
    noSubscribers: "No subscribers yet.",
    noMatches: "No subscribers match your filters.",
    filter: "Status filter",
    all: "All",
    active: "Active",
    unsubscribed: "Unsubscribed",
    email: "Email",
    source: "Source",
    status: "Status",
    created: "Created",
    updated: "Updated",
    actions: "Actions",
    markActive: "Mark active",
    markUnsubscribed: "Mark unsubscribed",
    delete: "Delete",
    deleting: "Deleting...",
    updating: "Updating...",
    confirmDelete: "Delete this subscriber?",
    unavailable: "Unavailable",
    notProvided: "Not provided",
    showing: "Showing"
  }
} as const;

const selectClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

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

function displayValue(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

function SubscriberStatusBadge({ status }: { status: string | null }) {
  const normalizedStatus = status?.trim() || "active";
  const isActive = normalizedStatus === "active";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        isActive
          ? "bg-primary-container/20 text-primary"
          : "bg-surface-container-low text-on-surface-variant"
      }`}
    >
      {normalizedStatus.replaceAll("_", " ")}
    </span>
  );
}

function NewsletterTable() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/newsletter", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { subscribers?: NewsletterSubscriberRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (active) {
          setSubscribers(payload.subscribers ?? []);
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

  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((subscriber) => {
        const status = subscriber.status?.trim() || "active";

        return statusFilter === "all" || status === statusFilter;
      }),
    [statusFilter, subscribers]
  );

  async function updateSubscriberStatus(subscriber: NewsletterSubscriberRow, status: "active" | "unsubscribed") {
    if (subscriber.status === status) {
      return;
    }

    setActionError("");
    setUpdatingId(subscriber.id);

    const response = await fetch(`/api/admin/newsletter/${encodeURIComponent(subscriber.id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      subscriber?: Pick<NewsletterSubscriberRow, "id" | "status" | "updated_at">;
      error?: string;
    };

    if (!response.ok) {
      setActionError(payload.error ?? c.unableToUpdate);
      setUpdatingId("");
      return;
    }

    setSubscribers((currentSubscribers) =>
      currentSubscribers.map((currentSubscriber) =>
        currentSubscriber.id === subscriber.id
          ? {
              ...currentSubscriber,
              status: payload.subscriber?.status ?? status,
              updated_at: payload.subscriber?.updated_at ?? new Date().toISOString()
            }
          : currentSubscriber
      )
    );
    setUpdatingId("");
  }

  async function deleteSubscriber(subscriber: NewsletterSubscriberRow) {
    const confirmed = window.confirm(c.confirmDelete);

    if (!confirmed) {
      return;
    }

    setActionError("");
    setDeletingId(subscriber.id);

    const response = await fetch(`/api/admin/newsletter/${encodeURIComponent(subscriber.id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setActionError(payload.error ?? c.unableToDelete);
      setDeletingId("");
      return;
    }

    setSubscribers((currentSubscribers) =>
      currentSubscribers.filter((currentSubscriber) => currentSubscriber.id !== subscriber.id)
    );
    setDeletingId("");
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
      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="grid max-w-xs gap-2 text-sm font-semibold text-on-surface">
            {c.filter}
            <select className={selectClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{c.all}</option>
              <option value="active">{c.active}</option>
              <option value="unsubscribed">{c.unsubscribed}</option>
            </select>
          </label>
          <p className="text-sm font-semibold text-on-surface-variant" aria-live="polite">
            {c.showing} {filteredSubscribers.length} / {subscribers.length}
          </p>
        </div>
      </section>

      {actionError && (
        <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {actionError}
        </div>
      )}

      {subscribers.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {c.noSubscribers}
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {c.noMatches}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">{c.email}</th>
                  <th className="px-4 py-3">{c.source}</th>
                  <th className="px-4 py-3">{c.status}</th>
                  <th className="px-4 py-3">{c.created}</th>
                  <th className="px-4 py-3">{c.updated}</th>
                  <th className="px-4 py-3">{c.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-4 py-4 font-semibold text-on-surface">
                      {displayValue(subscriber.email, c.notProvided)}
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {displayValue(subscriber.source, c.notProvided)}
                    </td>
                    <td className="px-4 py-4">
                      <SubscriberStatusBadge status={subscriber.status} />
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {formatDate(subscriber.created_at, c.unavailable)}
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {formatDate(subscriber.updated_at, c.unavailable)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={updatingId === subscriber.id || subscriber.status === "active"}
                          className="inline-flex rounded-full border border-primary px-3 py-2 font-heading text-xs font-bold text-primary transition hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => updateSubscriberStatus(subscriber, "active")}
                        >
                          {updatingId === subscriber.id ? c.updating : c.markActive}
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === subscriber.id || subscriber.status === "unsubscribed"}
                          className="inline-flex rounded-full border border-outline-variant px-3 py-2 font-heading text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => updateSubscriberStatus(subscriber, "unsubscribed")}
                        >
                          {updatingId === subscriber.id ? c.updating : c.markUnsubscribed}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === subscriber.id}
                          className="inline-flex rounded-full border border-error/40 px-3 py-2 font-heading text-xs font-bold text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => deleteSubscriber(subscriber)}
                        >
                          {deletingId === subscriber.id ? c.deleting : c.delete}
                        </button>
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

export function AdminNewsletter() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "订阅", en: "Newsletter" }}
          description={{ zh: "管理 LUCK CLAWS 邮件订阅用户。", en: "Manage LUCK CLAWS email subscribers." }}
          layout="wide"
          backLink
        >
          <NewsletterTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
