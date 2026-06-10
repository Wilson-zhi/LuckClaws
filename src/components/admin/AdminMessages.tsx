"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";

type ContactMessageListRow = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  order_number: string | null;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type MessageStatus = "new" | "in_progress" | "resolved" | "spam";

const statusOptions: Array<"all" | MessageStatus> = ["all", "new", "in_progress", "resolved", "spam"];

const copy = {
  zh: {
    title: "消息",
    description: "查看并处理来自联系表单的客户支持消息。",
    loading: "正在加载消息...",
    unableToLoad: "无法加载消息。",
    noMessages: "暂无消息。",
    noMatches: "没有符合筛选条件的消息。",
    filter: "状态筛选",
    all: "全部",
    email: "邮箱",
    name: "姓名",
    subject: "主题",
    orderNumber: "订单号",
    status: "状态",
    created: "创建时间",
    actions: "操作",
    view: "查看",
    notProvided: "未填写",
    unavailable: "不可用",
    showing: "显示",
    new: "新消息",
    in_progress: "处理中",
    resolved: "已解决",
    spam: "垃圾消息"
  },
  en: {
    title: "Messages",
    description: "Review and manage customer support messages from the contact form.",
    loading: "Loading messages...",
    unableToLoad: "Unable to load messages.",
    noMessages: "No messages yet.",
    noMatches: "No messages match your filters.",
    filter: "Status filter",
    all: "All",
    email: "Email",
    name: "Name",
    subject: "Subject",
    orderNumber: "Order number",
    status: "Status",
    created: "Created",
    actions: "Actions",
    view: "View",
    notProvided: "Not provided",
    unavailable: "Unavailable",
    showing: "Showing",
    new: "New",
    in_progress: "In progress",
    resolved: "Resolved",
    spam: "Spam"
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

function normalizeStatus(status: string | null): MessageStatus {
  const normalizedStatus = status?.trim();

  if (
    normalizedStatus === "new" ||
    normalizedStatus === "in_progress" ||
    normalizedStatus === "resolved" ||
    normalizedStatus === "spam"
  ) {
    return normalizedStatus;
  }

  return "new";
}

function statusLabel(status: string | null, language: "zh" | "en") {
  const normalizedStatus = normalizeStatus(status);

  return copy[language][normalizedStatus];
}

function MessageStatusBadge({ status, language }: { status: string | null; language: "zh" | "en" }) {
  const normalizedStatus = normalizeStatus(status);
  const badgeClass =
    normalizedStatus === "new"
      ? "bg-primary-container/20 text-primary"
      : normalizedStatus === "in_progress"
        ? "bg-[#fff5d6] text-[#8a5a00]"
        : normalizedStatus === "resolved"
          ? "bg-green-100 text-green-700"
          : "bg-error/10 text-error";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass}`}>
      {statusLabel(status, language)}
    </span>
  );
}

function MessagesTable() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [messages, setMessages] = useState<ContactMessageListRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/messages", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { messages?: ContactMessageListRow[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (active) {
          setMessages(payload.messages ?? []);
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

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        const status = normalizeStatus(message.status);

        return statusFilter === "all" || status === statusFilter;
      }),
    [messages, statusFilter]
  );

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
            <select
              className={selectClass}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? c.all : c[status]}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm font-semibold text-on-surface-variant" aria-live="polite">
            {c.showing} {filteredMessages.length} / {messages.length}
          </p>
        </div>
      </section>

      {messages.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {c.noMessages}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          {c.noMatches}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">{c.email}</th>
                  <th className="px-4 py-3">{c.name}</th>
                  <th className="px-4 py-3">{c.subject}</th>
                  <th className="px-4 py-3">{c.orderNumber}</th>
                  <th className="px-4 py-3">{c.status}</th>
                  <th className="px-4 py-3">{c.created}</th>
                  <th className="sticky right-0 border-l border-outline-variant bg-surface-container-low px-4 py-3 shadow-[-8px_0_14px_rgba(39,26,12,0.06)]">
                    {c.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {filteredMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-4 py-4 font-semibold text-on-surface">
                      {displayValue(message.email, c.notProvided)}
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {displayValue(message.name, c.notProvided)}
                    </td>
                    <td className="max-w-[320px] px-4 py-4 font-semibold text-on-surface">
                      <span className="line-clamp-2">{displayValue(message.subject, c.notProvided)}</span>
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {displayValue(message.order_number, c.notProvided)}
                    </td>
                    <td className="px-4 py-4">
                      <MessageStatusBadge status={message.status} language={language} />
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {formatDate(message.created_at, c.unavailable)}
                    </td>
                    <td className="sticky right-0 border-l border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-[-8px_0_14px_rgba(39,26,12,0.06)]">
                      <Link
                        href={`/admin/messages/${message.id}`}
                        className="inline-flex rounded-full bg-primary-container px-4 py-2 font-heading text-xs font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                      >
                        {c.view}
                      </Link>
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

export function AdminMessages() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: copy.zh.title, en: copy.en.title }}
          description={{ zh: copy.zh.description, en: copy.en.description }}
          layout="wide"
          backLink
        >
          <MessagesTable />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
