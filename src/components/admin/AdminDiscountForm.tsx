"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";
import { normalizeDiscountCode, type DiscountCodeRow } from "@/lib/discounts";

type AdminDiscountFormProps = {
  mode: "create" | "edit";
  discountId?: string;
};

type DiscountFormState = {
  code: string;
  name: string;
  type: "percentage" | "fixed_amount";
  value: string;
  status: "active" | "draft" | "archived";
  minimum_order_amount: string;
  max_uses: string;
  starts_at: string;
  expires_at: string;
};

const copy = {
  zh: {
    addTitle: "添加优惠码",
    editTitle: "编辑优惠码",
    description: "设置优惠码规则，结账时会按这些规则验证。",
    loading: "正在加载优惠码...",
    save: "保存优惠码",
    saving: "保存中...",
    cancel: "取消",
    code: "Code",
    name: "名称",
    type: "类型",
    percentage: "百分比",
    fixed: "固定金额",
    value: "数值",
    status: "状态",
    active: "active",
    draft: "draft",
    archived: "archived",
    minimum: "最低订单金额",
    maxUses: "最大使用次数",
    starts: "开始时间",
    expires: "到期时间",
    codeHelp: "Code 会自动保存为大写。",
    unableToLoad: "无法加载优惠码。",
    unableToSave: "无法保存优惠码。"
  },
  en: {
    addTitle: "Add Discount",
    editTitle: "Edit Discount",
    description: "Set discount rules that checkout will validate.",
    loading: "Loading discount code...",
    save: "Save Discount",
    saving: "Saving...",
    cancel: "Cancel",
    code: "Code",
    name: "Name",
    type: "Type",
    percentage: "Percentage",
    fixed: "Fixed amount",
    value: "Value",
    status: "Status",
    active: "active",
    draft: "draft",
    archived: "archived",
    minimum: "Minimum order amount",
    maxUses: "Max uses",
    starts: "Starts at",
    expires: "Expires at",
    codeHelp: "Code is automatically saved uppercase.",
    unableToLoad: "Unable to load discount code.",
    unableToSave: "Unable to save discount code."
  }
} as const;

const emptyFormState: DiscountFormState = {
  code: "",
  name: "",
  type: "percentage",
  value: "",
  status: "active",
  minimum_order_amount: "",
  max_uses: "",
  starts_at: "",
  expires_at: ""
};

const inputClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

function dateTimeLocalFromIso(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

function stringFromValue(value: number | string | null) {
  return value === null ? "" : String(value);
}

function formFromDiscount(discount: DiscountCodeRow): DiscountFormState {
  return {
    code: discount.code ?? "",
    name: discount.name ?? "",
    type: discount.type === "fixed_amount" ? "fixed_amount" : "percentage",
    value: stringFromValue(discount.value),
    status: discount.status === "draft" || discount.status === "archived" ? discount.status : "active",
    minimum_order_amount: stringFromValue(discount.minimum_order_amount),
    max_uses: stringFromValue(discount.max_uses),
    starts_at: dateTimeLocalFromIso(discount.starts_at),
    expires_at: dateTimeLocalFromIso(discount.expires_at)
  };
}

function DiscountFormContent({ mode, discountId }: AdminDiscountFormProps) {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [form, setForm] = useState<DiscountFormState>(emptyFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !discountId) {
      return;
    }

    let active = true;

    fetch(`/api/admin/discounts/${encodeURIComponent(discountId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as { discount?: DiscountCodeRow; error?: string };

        if (!response.ok || !payload.discount) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (active) {
          setForm(formFromDiscount(payload.discount));
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
  }, [accessToken, c.unableToLoad, discountId, mode]);

  function updateField<Key extends keyof DiscountFormState>(field: Key, value: DiscountFormState[Key]) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: field === "code" ? normalizeDiscountCode(value) : value
    }));
    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});

    const response = await fetch(
      mode === "edit" && discountId
        ? `/api/admin/discounts/${encodeURIComponent(discountId)}`
        : "/api/admin/discounts",
      {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      errors?: Record<string, string>;
      discount?: { id?: string };
    };

    if (!response.ok) {
      setError(payload.error ?? c.unableToSave);
      setFieldErrors(payload.errors ?? {});
      setSaving(false);
      return;
    }

    router.push("/admin/discounts");
  }

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {c.loading}
      </div>
    );
  }

  if (error && mode === "edit" && !form.code) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {error}
      </div>
    );
  }

  return (
    <form className="ambient-card grid gap-5 p-6 md:p-8" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {error}
        </div>
      )}

      <label className="grid gap-2 text-sm font-semibold text-on-surface">
        {c.code}
        <input
          className={inputClass}
          value={form.code}
          onChange={(event) => updateField("code", event.target.value)}
        />
        <span className="text-xs font-normal text-on-surface-variant">{c.codeHelp}</span>
        {fieldErrors.code && <span className="text-sm font-semibold text-error">{fieldErrors.code}</span>}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-on-surface">
        {c.name}
        <input className={inputClass} value={form.name} onChange={(event) => updateField("name", event.target.value)} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.type}
          <select className={inputClass} value={form.type} onChange={(event) => updateField("type", event.target.value as DiscountFormState["type"])}>
            <option value="percentage">{c.percentage}</option>
            <option value="fixed_amount">{c.fixed}</option>
          </select>
          {fieldErrors.type && <span className="text-sm font-semibold text-error">{fieldErrors.type}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.value}
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={form.value}
            onChange={(event) => updateField("value", event.target.value)}
          />
          {fieldErrors.value && <span className="text-sm font-semibold text-error">{fieldErrors.value}</span>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.status}
          <select className={inputClass} value={form.status} onChange={(event) => updateField("status", event.target.value as DiscountFormState["status"])}>
            <option value="active">{c.active}</option>
            <option value="draft">{c.draft}</option>
            <option value="archived">{c.archived}</option>
          </select>
          {fieldErrors.status && <span className="text-sm font-semibold text-error">{fieldErrors.status}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.minimum}
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={form.minimum_order_amount}
            onChange={(event) => updateField("minimum_order_amount", event.target.value)}
          />
          {fieldErrors.minimum_order_amount && (
            <span className="text-sm font-semibold text-error">{fieldErrors.minimum_order_amount}</span>
          )}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.maxUses}
          <input
            className={inputClass}
            type="number"
            min="1"
            step="1"
            value={form.max_uses}
            onChange={(event) => updateField("max_uses", event.target.value)}
          />
          {fieldErrors.max_uses && <span className="text-sm font-semibold text-error">{fieldErrors.max_uses}</span>}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.starts}
          <input
            className={inputClass}
            type="datetime-local"
            value={form.starts_at}
            onChange={(event) => updateField("starts_at", event.target.value)}
          />
          {fieldErrors.starts_at && <span className="text-sm font-semibold text-error">{fieldErrors.starts_at}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          {c.expires}
          <input
            className={inputClass}
            type="datetime-local"
            value={form.expires_at}
            onChange={(event) => updateField("expires_at", event.target.value)}
          />
          {fieldErrors.expires_at && <span className="text-sm font-semibold text-error">{fieldErrors.expires_at}</span>}
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? c.saving : c.save}
        </button>
        <button
          type="button"
          className="rounded-full border border-outline-variant px-7 py-3 font-heading font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
          onClick={() => router.push("/admin/discounts")}
        >
          {c.cancel}
        </button>
      </div>
    </form>
  );
}

export function AdminDiscountForm({ mode, discountId }: AdminDiscountFormProps) {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: mode === "create" ? copy.zh.addTitle : copy.zh.editTitle, en: mode === "create" ? copy.en.addTitle : copy.en.editTitle }}
          description={{ zh: copy.zh.description, en: copy.en.description }}
          backLink={{ href: "/admin/discounts", label: { zh: "返回优惠码", en: "Back to Discounts" } }}
        >
          <DiscountFormContent mode={mode} discountId={discountId} />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
