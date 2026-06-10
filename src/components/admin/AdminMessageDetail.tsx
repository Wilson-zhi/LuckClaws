"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";

type ContactMessageDetailRow = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  order_number: string | null;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type MessageStatus = "new" | "in_progress" | "resolved" | "spam";

const statusOptions: MessageStatus[] = ["new", "in_progress", "resolved", "spam"];

const copy = {
  zh: {
    title: "消息详情",
    description: "查看客户支持消息并更新处理状态。",
    loading: "正在加载消息...",
    unableToLoad: "无法加载消息。",
    unableToUpdate: "无法更新消息状态。",
    notFound: "未找到消息。",
    backToMessages: "返回消息",
    customer: "客户",
    message: "消息",
    statusCard: "状态",
    name: "姓名",
    email: "邮箱",
    subject: "主题",
    orderNumber: "订单号",
    source: "来源",
    status: "状态",
    created: "创建时间",
    updated: "更新时间",
    reply: "回复邮件",
    saveStatus: "保存状态",
    saving: "正在保存...",
    saved: "消息状态已更新。",
    notProvided: "未填写",
    unavailable: "不可用",
    new: "新消息",
    in_progress: "处理中",
    resolved: "已解决",
    spam: "垃圾消息"
  },
  en: {
    title: "Message Detail",
    description: "Review a customer support message and update its handling status.",
    loading: "Loading message...",
    unableToLoad: "Unable to load message.",
    unableToUpdate: "Unable to update message status.",
    notFound: "Message not found.",
    backToMessages: "Back to Messages",
    customer: "Customer",
    message: "Message",
    statusCard: "Status",
    name: "Name",
    email: "Email",
    subject: "Subject",
    orderNumber: "Order number",
    source: "Source",
    status: "Status",
    created: "Created",
    updated: "Updated",
    reply: "Reply by email",
    saveStatus: "Save Status",
    saving: "Saving...",
    saved: "Message status updated.",
    notProvided: "Not provided",
    unavailable: "Unavailable",
    new: "New",
    in_progress: "In progress",
    resolved: "Resolved",
    spam: "Spam"
  }
} as const;

const selectClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

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

function mailtoHref(message: ContactMessageDetailRow) {
  const email = message.email?.trim();

  if (!email) {
    return "";
  }

  const subject = encodeURIComponent(`Re: ${message.subject?.trim() || "LUCK CLAWS Support Request"}`);

  return `mailto:${encodeURIComponent(email)}?subject=${subject}`;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function MessageDetailContent({ messageId }: { messageId: string }) {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [message, setMessage] = useState<ContactMessageDetailRow | null>(null);
  const [status, setStatus] = useState<MessageStatus>("new");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/admin/messages/${encodeURIComponent(messageId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { message?: ContactMessageDetailRow; error?: string };

        if (!response.ok) {
          throw new Error(response.status === 404 ? c.notFound : payload.error ?? c.unableToLoad);
        }

        if (active) {
          const nextMessage = payload.message ?? null;
          setMessage(nextMessage);
          setStatus(normalizeStatus(nextMessage?.status ?? null));
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
  }, [accessToken, c.notFound, c.unableToLoad, messageId]);

  async function updateStatus() {
    setActionError("");
    setActionMessage("");
    setSaving(true);

    const response = await fetch(`/api/admin/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      message?: Pick<ContactMessageDetailRow, "id" | "status" | "updated_at">;
      error?: string;
    };

    setSaving(false);

    if (!response.ok) {
      setActionError(payload.error ?? c.unableToUpdate);
      return;
    }

    setMessage((currentMessage) =>
      currentMessage
        ? {
            ...currentMessage,
            status: payload.message?.status ?? status,
            updated_at: payload.message?.updated_at ?? new Date().toISOString()
          }
        : currentMessage
    );
    setActionMessage(c.saved);
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

  if (!message) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {c.notFound}
      </div>
    );
  }

  const replyHref = mailtoHref(message);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className="ambient-card p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">{c.subject}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                {displayValue(message.subject, c.notProvided)}
              </h2>
            </div>
            {replyHref && (
              <a
                href={replyHref}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary-container px-5 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                <Mail aria-hidden className="h-4 w-4" />
                {c.reply}
              </a>
            )}
          </div>
          <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm leading-7 text-on-surface-variant">
            <p className="whitespace-pre-wrap">{displayValue(message.message, c.notProvided)}</p>
          </div>
        </section>

        <section className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">{c.customer}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <DetailField label={c.name} value={displayValue(message.name, c.notProvided)} />
            <DetailField label={c.email} value={displayValue(message.email, c.notProvided)} />
            <DetailField label={c.orderNumber} value={displayValue(message.order_number, c.notProvided)} />
            <DetailField label={c.source} value={displayValue(message.source, c.notProvided)} />
            <DetailField label={c.created} value={formatDate(message.created_at, c.unavailable)} />
            <DetailField label={c.updated} value={formatDate(message.updated_at, c.unavailable)} />
          </div>
        </section>
      </div>

      <aside className="ambient-card h-fit p-6">
        <h2 className="font-heading text-2xl font-bold">{c.statusCard}</h2>
        <div className="mt-5 grid gap-3">
          <label htmlFor="message-status" className="text-sm font-semibold text-on-surface">
            {c.status}
          </label>
          <select
            id="message-status"
            className={selectClass}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as MessageStatus);
              setActionError("");
              setActionMessage("");
            }}
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {c[statusOption]}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={saving}
            className="mt-2 inline-flex justify-center rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={updateStatus}
          >
            {saving ? c.saving : c.saveStatus}
          </button>
        </div>

        {actionError && (
          <div className="mt-4 rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
            {actionError}
          </div>
        )}
        {actionMessage && (
          <div className="mt-4 rounded-md bg-primary-container/15 p-4 text-sm font-semibold text-primary" role="status">
            {actionMessage}
          </div>
        )}
      </aside>
    </div>
  );
}

export function AdminMessageDetail({ messageId }: { messageId: string }) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: copy.zh.title, en: copy.en.title }}
          description={{ zh: copy.zh.description, en: copy.en.description }}
          layout="wide"
          backLink={{ href: "/admin/messages", label: { zh: copy.zh.backToMessages, en: copy.en.backToMessages } }}
        >
          <MessageDetailContent messageId={messageId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
