"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";
import {
  aboutIconKeys,
  fallbackAboutPawContent,
  normalizeAboutIconKey,
  type AboutIconKey,
  type AboutPawNoteContent,
  type AboutPawRouteContent
} from "@/lib/about-paw-content";

type AdminAboutSettingsRow = {
  id: string | null;
  section_label: string | null;
  title: string | null;
  subtitle: string | null;
  supporting_line: string | null;
};

type AdminAboutRouteRow = {
  id: string | null;
  route_key: string | null;
  label: string | null;
  icon_key: string | null;
  recommendation_title: string | null;
  recommendation_description: string | null;
  note_text: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  sort_order: number | string | null;
  enabled: boolean | null;
};

type AdminAboutNoteRow = {
  id: string | null;
  note_key: string | null;
  keyword: string | null;
  secondary_text: string | null;
  icon_key: string | null;
  sort_order: number | string | null;
  enabled: boolean | null;
};

type EditableSettings = {
  id?: string;
  section_label: string;
  title: string;
  subtitle: string;
  supporting_line: string;
};

type EditableRoute = {
  id?: string;
  route_key: string;
  label: string;
  icon_key: string;
  recommendation_title: string;
  recommendation_description: string;
  note_text: string;
  cta_label: string;
  cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  sort_order: string;
  enabled: boolean;
};

type EditableNote = {
  id?: string;
  note_key: string;
  keyword: string;
  secondary_text: string;
  icon_key: string;
  sort_order: string;
  enabled: boolean;
};

const inputClass =
  "min-h-12 w-full rounded-md border border-outline-variant bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-28 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const copy = {
  zh: {
    title: "关于页面",
    description: "管理 About 页面 Paw Path Finder 的可编辑内容。",
    loading: "正在加载 About 页面内容...",
    unableToLoad: "无法加载 About 页面内容。",
    unableToSave: "无法保存 About 页面内容。",
    saved: "About 页面内容已保存。",
    validationRequired: "请填写所有必填字段。",
    headerSection: "Paw Path Finder 标题内容",
    routesSection: "路线节点",
    notesSection: "底部路线注释",
    codeControlledTitle: "由代码控制的内容",
    codeControlled:
      "路线地图布局、节点位置、路径线条、动画、响应式行为和视觉样式仍由代码控制。这里只编辑文字、链接、图标键、排序和启用状态。",
    sectionLabel: "模块标签",
    sectionTitle: "标题",
    subtitle: "副标题",
    supportingLine: "辅助说明",
    routeKey: "路线 key",
    noteKey: "注释 key",
    label: "标签",
    iconKey: "图标",
    recommendationTitle: "推荐标题",
    recommendationDescription: "推荐描述",
    noteText: "说明文字",
    ctaLabel: "主按钮文字",
    ctaHref: "主按钮链接",
    secondaryCtaLabel: "次按钮文字",
    secondaryCtaHref: "次按钮链接",
    keyword: "关键词",
    secondaryText: "辅助文字",
    sortOrder: "排序",
    enabled: "启用",
    disabled: "已停用",
    save: "保存 About 内容",
    saving: "保存中...",
    routeHelper: "已知 key 会使用代码中的固定地图位置；未知 key 会使用安全备用位置。",
    required: "必填",
    noRoutes: "暂无路线节点。",
    noNotes: "暂无路线注释。"
  },
  en: {
    title: "About Page",
    description: "Manage editable Paw Path Finder content for the About page.",
    loading: "Loading About page content...",
    unableToLoad: "Unable to load About page content.",
    unableToSave: "Unable to save About page content.",
    saved: "About page content saved.",
    validationRequired: "Please complete all required fields.",
    headerSection: "Paw Path Finder Header",
    routesSection: "Route Nodes",
    notesSection: "Bottom Route Notes",
    codeControlledTitle: "Code-controlled fields",
    codeControlled:
      "Route map layout, node positions, path drawing, animation, responsive behavior, and visual design remain controlled by code. This page only edits copy, links, icon keys, sort order, and enabled state.",
    sectionLabel: "Section label",
    sectionTitle: "Title",
    subtitle: "Subtitle",
    supportingLine: "Supporting line",
    routeKey: "Route key",
    noteKey: "Note key",
    label: "Label",
    iconKey: "Icon",
    recommendationTitle: "Recommendation title",
    recommendationDescription: "Recommendation description",
    noteText: "Note text",
    ctaLabel: "Primary CTA label",
    ctaHref: "Primary CTA link",
    secondaryCtaLabel: "Secondary CTA label",
    secondaryCtaHref: "Secondary CTA link",
    keyword: "Keyword",
    secondaryText: "Secondary text",
    sortOrder: "Sort order",
    enabled: "Enabled",
    disabled: "Disabled",
    save: "Save About Content",
    saving: "Saving...",
    routeHelper: "Known keys use fixed map positions in code; unknown keys use safe fallback positions.",
    required: "Required",
    noRoutes: "No route nodes.",
    noNotes: "No route notes."
  }
} as const;

const iconLabels: Record<AboutIconKey, { zh: string; en: string }> = {
  paw: { zh: "爪印", en: "Paw" },
  shield: { zh: "盾牌", en: "Shield" },
  heart: { zh: "爱心", en: "Heart" },
  star: { zh: "星标", en: "Star" },
  sparkles: { zh: "闪光", en: "Sparkles" },
  leaf: { zh: "叶子", en: "Leaf" },
  truck: { zh: "卡车", en: "Truck" },
  package: { zh: "包裹", en: "Package" },
  check: { zh: "勾选", en: "Check" },
  rotate: { zh: "旋转", en: "Rotate" },
  lock: { zh: "锁", en: "Lock" },
  mail: { zh: "邮件", en: "Mail" },
  arrow: { zh: "箭头", en: "Arrow" }
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function settingsFromRow(row: AdminAboutSettingsRow | null | undefined): EditableSettings {
  const fallback = fallbackAboutPawContent.header;

  return {
    id: cleanString(row?.id) || undefined,
    section_label: cleanString(row?.section_label) || fallback.sectionLabel,
    title: cleanString(row?.title) || fallback.title,
    subtitle: cleanString(row?.subtitle) || fallback.subtitle,
    supporting_line: cleanString(row?.supporting_line) || fallback.supportingLine
  };
}

function routeFromFallback(route: AboutPawRouteContent): EditableRoute {
  return {
    route_key: route.routeKey,
    label: route.label,
    icon_key: route.iconKey,
    recommendation_title: route.recommendationTitle,
    recommendation_description: route.recommendationDescription,
    note_text: route.noteText,
    cta_label: route.ctaLabel,
    cta_href: route.ctaHref,
    secondary_cta_label: route.secondaryCtaLabel,
    secondary_cta_href: route.secondaryCtaHref,
    sort_order: String(route.sortOrder),
    enabled: route.enabled
  };
}

function routeFromRow(row: AdminAboutRouteRow): EditableRoute {
  return {
    id: cleanString(row.id) || undefined,
    route_key: cleanString(row.route_key),
    label: cleanString(row.label),
    icon_key: normalizeAboutIconKey(row.icon_key, "paw"),
    recommendation_title: cleanString(row.recommendation_title),
    recommendation_description: cleanString(row.recommendation_description),
    note_text: cleanString(row.note_text),
    cta_label: cleanString(row.cta_label),
    cta_href: cleanString(row.cta_href),
    secondary_cta_label: cleanString(row.secondary_cta_label),
    secondary_cta_href: cleanString(row.secondary_cta_href),
    sort_order: row.sort_order === null || row.sort_order === undefined ? "" : String(row.sort_order),
    enabled: row.enabled !== false
  };
}

function noteFromFallback(note: AboutPawNoteContent): EditableNote {
  return {
    note_key: note.noteKey,
    keyword: note.keyword,
    secondary_text: note.secondaryText,
    icon_key: note.iconKey,
    sort_order: String(note.sortOrder),
    enabled: note.enabled
  };
}

function noteFromRow(row: AdminAboutNoteRow): EditableNote {
  return {
    id: cleanString(row.id) || undefined,
    note_key: cleanString(row.note_key),
    keyword: cleanString(row.keyword),
    secondary_text: cleanString(row.secondary_text),
    icon_key: normalizeAboutIconKey(row.icon_key, "paw"),
    sort_order: row.sort_order === null || row.sort_order === undefined ? "" : String(row.sort_order),
    enabled: row.enabled !== false
  };
}

function sortEditableItems<T extends { sort_order: string }>(items: T[]) {
  return [...items].sort((first, second) => {
    const firstSort = Number(first.sort_order);
    const secondSort = Number(second.sort_order);

    return (Number.isFinite(firstSort) ? firstSort : 9999) - (Number.isFinite(secondSort) ? secondSort : 9999);
  });
}

function requiredFieldsAreValid(settings: EditableSettings, routes: EditableRoute[], notes: EditableNote[]) {
  const settingsValid =
    settings.section_label.trim() &&
    settings.title.trim() &&
    settings.subtitle.trim() &&
    settings.supporting_line.trim();
  const routesValid = routes.every(
    (route) =>
      route.route_key.trim() &&
      route.label.trim() &&
      route.recommendation_title.trim() &&
      route.recommendation_description.trim() &&
      route.note_text.trim() &&
      route.cta_label.trim() &&
      route.cta_href.trim() &&
      route.sort_order.trim() &&
      Number.isFinite(Number(route.sort_order))
  );
  const notesValid = notes.every(
    (note) =>
      note.note_key.trim() &&
      note.keyword.trim() &&
      note.secondary_text.trim() &&
      note.sort_order.trim() &&
      Number.isFinite(Number(note.sort_order))
  );

  return Boolean(settingsValid && routes.length > 0 && routesValid && notes.length > 0 && notesValid);
}

function Field({
  label,
  value,
  textarea = false,
  required = false,
  onChange
}: {
  label: string;
  value: string;
  textarea?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      <span>
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </span>
      {textarea ? (
        <textarea className={textareaClass} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function IconSelect({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { language } = useAdminLanguage();

  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {aboutIconKeys.map((iconKey) => (
          <option key={iconKey} value={iconKey}>
            {iconLabels[iconKey][language]} ({iconKey})
          </option>
        ))}
      </select>
    </label>
  );
}

function AdminAboutForm() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const [settings, setSettings] = useState<EditableSettings>(() => settingsFromRow(null));
  const [routes, setRoutes] = useState<EditableRoute[]>(() =>
    fallbackAboutPawContent.routes.map(routeFromFallback)
  );
  const [notes, setNotes] = useState<EditableNote[]>(() =>
    fallbackAboutPawContent.notes.map(noteFromFallback)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/about", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          settings?: AdminAboutSettingsRow | null;
          routes?: AdminAboutRouteRow[];
          notes?: AdminAboutNoteRow[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (!active) {
          return;
        }

        setSettings(settingsFromRow(payload.settings));
        setRoutes(
          payload.routes?.length
            ? sortEditableItems(payload.routes.map(routeFromRow))
            : fallbackAboutPawContent.routes.map(routeFromFallback)
        );
        setNotes(
          payload.notes?.length
            ? sortEditableItems(payload.notes.map(noteFromRow))
            : fallbackAboutPawContent.notes.map(noteFromFallback)
        );
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

  const enabledRouteCount = useMemo(() => routes.filter((route) => route.enabled).length, [routes]);
  const enabledNoteCount = useMemo(() => notes.filter((note) => note.enabled).length, [notes]);

  function updateRoute(index: number, updates: Partial<EditableRoute>) {
    setRoutes((currentRoutes) =>
      currentRoutes.map((route, routeIndex) => (routeIndex === index ? { ...route, ...updates } : route))
    );
  }

  function updateNote(index: number, updates: Partial<EditableNote>) {
    setNotes((currentNotes) =>
      currentNotes.map((note, noteIndex) => (noteIndex === index ? { ...note, ...updates } : note))
    );
  }

  async function saveAboutContent() {
    setError("");
    setSuccessMessage("");
    setValidationError("");

    if (!requiredFieldsAreValid(settings, routes, notes)) {
      setValidationError(c.validationRequired);
      return;
    }

    setSaving(true);

    const response = await fetch("/api/admin/about", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        settings,
        routes: routes.map((route) => ({
          ...route,
          sort_order: Number(route.sort_order)
        })),
        notes: notes.map((note) => ({
          ...note,
          sort_order: Number(note.sort_order)
        }))
      })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      settings?: AdminAboutSettingsRow | null;
      routes?: AdminAboutRouteRow[];
      notes?: AdminAboutNoteRow[];
      error?: string;
    };

    if (!response.ok) {
      setError(payload.error ?? c.unableToSave);
      setSaving(false);
      return;
    }

    setSettings(settingsFromRow(payload.settings));
    setRoutes(payload.routes?.length ? sortEditableItems(payload.routes.map(routeFromRow)) : routes);
    setNotes(payload.notes?.length ? sortEditableItems(payload.notes.map(noteFromRow)) : notes);
    setSuccessMessage(c.saved);
    setSaving(false);
  }

  if (loading) {
    return <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">{c.loading}</div>;
  }

  if (error && !routes.length) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <h2 className="font-heading text-xl font-bold">{c.codeControlledTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">{c.codeControlled}</p>
      </section>

      {(error || validationError || successMessage) && (
        <div
          className={`rounded-md p-4 text-sm font-semibold ${
            successMessage ? "bg-primary-container/20 text-primary" : "bg-error/10 text-error"
          }`}
          role={successMessage ? "status" : "alert"}
        >
          {successMessage || validationError || error}
        </div>
      )}

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <h2 className="font-heading text-xl font-bold">{c.headerSection}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label={c.sectionLabel}
            value={settings.section_label}
            required
            onChange={(value) => setSettings((current) => ({ ...current, section_label: value }))}
          />
          <Field
            label={c.sectionTitle}
            value={settings.title}
            required
            onChange={(value) => setSettings((current) => ({ ...current, title: value }))}
          />
          <Field
            label={c.subtitle}
            value={settings.subtitle}
            required
            textarea
            onChange={(value) => setSettings((current) => ({ ...current, subtitle: value }))}
          />
          <Field
            label={c.supportingLine}
            value={settings.supporting_line}
            required
            textarea
            onChange={(value) => setSettings((current) => ({ ...current, supporting_line: value }))}
          />
        </div>
      </section>

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold">{c.routesSection}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{c.routeHelper}</p>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant">
            {enabledRouteCount} / {routes.length} {c.enabled}
          </p>
        </div>

        {routes.length === 0 ? (
          <p className="mt-5 rounded-md bg-surface-container-low p-4 text-sm text-on-surface-variant">{c.noRoutes}</p>
        ) : (
          <div className="mt-5 grid gap-5">
            {routes.map((route, index) => (
              <article key={`${route.id ?? "new"}-${index}`} className="rounded-md border border-outline-variant p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-heading text-lg font-bold">{route.label || route.route_key}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {route.enabled ? c.enabled : c.disabled}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={route.enabled}
                      onChange={(event) => updateRoute(index, { enabled: event.target.checked })}
                    />
                    {c.enabled}
                  </label>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field
                    label={c.routeKey}
                    value={route.route_key}
                    required
                    onChange={(value) => updateRoute(index, { route_key: value })}
                  />
                  <Field
                    label={c.label}
                    value={route.label}
                    required
                    onChange={(value) => updateRoute(index, { label: value })}
                  />
                  <IconSelect
                    label={c.iconKey}
                    value={route.icon_key}
                    onChange={(value) => updateRoute(index, { icon_key: value })}
                  />
                  <Field
                    label={c.recommendationTitle}
                    value={route.recommendation_title}
                    required
                    onChange={(value) => updateRoute(index, { recommendation_title: value })}
                  />
                  <Field
                    label={c.recommendationDescription}
                    value={route.recommendation_description}
                    required
                    textarea
                    onChange={(value) => updateRoute(index, { recommendation_description: value })}
                  />
                  <Field
                    label={c.noteText}
                    value={route.note_text}
                    required
                    textarea
                    onChange={(value) => updateRoute(index, { note_text: value })}
                  />
                  <Field
                    label={c.ctaLabel}
                    value={route.cta_label}
                    required
                    onChange={(value) => updateRoute(index, { cta_label: value })}
                  />
                  <Field
                    label={c.ctaHref}
                    value={route.cta_href}
                    required
                    onChange={(value) => updateRoute(index, { cta_href: value })}
                  />
                  <Field
                    label={c.sortOrder}
                    value={route.sort_order}
                    required
                    onChange={(value) => updateRoute(index, { sort_order: value })}
                  />
                  <Field
                    label={c.secondaryCtaLabel}
                    value={route.secondary_cta_label}
                    onChange={(value) => updateRoute(index, { secondary_cta_label: value })}
                  />
                  <Field
                    label={c.secondaryCtaHref}
                    value={route.secondary_cta_href}
                    onChange={(value) => updateRoute(index, { secondary_cta_href: value })}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2 className="font-heading text-xl font-bold">{c.notesSection}</h2>
          <p className="text-sm font-semibold text-on-surface-variant">
            {enabledNoteCount} / {notes.length} {c.enabled}
          </p>
        </div>

        {notes.length === 0 ? (
          <p className="mt-5 rounded-md bg-surface-container-low p-4 text-sm text-on-surface-variant">{c.noNotes}</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {notes.map((note, index) => (
              <article key={`${note.id ?? "new"}-${index}`} className="rounded-md border border-outline-variant p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg font-bold">
                      {note.keyword} {note.secondary_text}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {note.enabled ? c.enabled : c.disabled}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={note.enabled}
                      onChange={(event) => updateNote(index, { enabled: event.target.checked })}
                    />
                    {c.enabled}
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label={c.noteKey}
                    value={note.note_key}
                    required
                    onChange={(value) => updateNote(index, { note_key: value })}
                  />
                  <IconSelect
                    label={c.iconKey}
                    value={note.icon_key}
                    onChange={(value) => updateNote(index, { icon_key: value })}
                  />
                  <Field
                    label={c.keyword}
                    value={note.keyword}
                    required
                    onChange={(value) => updateNote(index, { keyword: value })}
                  />
                  <Field
                    label={c.secondaryText}
                    value={note.secondary_text}
                    required
                    onChange={(value) => updateNote(index, { secondary_text: value })}
                  />
                  <Field
                    label={c.sortOrder}
                    value={note.sort_order}
                    required
                    onChange={(value) => updateNote(index, { sort_order: value })}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          disabled={saving}
          className="inline-flex rounded-full bg-primary px-7 py-3 font-heading text-sm font-bold text-white shadow-lift transition hover:bg-[#6f4520] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={saveAboutContent}
        >
          {saving ? c.saving : c.save}
        </button>
      </div>
    </div>
  );
}

export function AdminAboutSettings() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "关于页面", en: "About Page" }}
          description={{ zh: "管理 About 页面 Paw Path Finder 内容。", en: "Manage About page Paw Path Finder content." }}
          layout="wide"
          backLink
        >
          <AdminAboutForm />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
