"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { useAdminLanguage } from "@/components/admin/admin-language";
import {
  aboutIconKeys,
  fallbackAboutCollectionCards,
  fallbackAboutCollectionSectionContent,
  fallbackAboutHeroContent,
  fallbackAboutPawContent,
  normalizeAboutIconKey,
  type AboutCollectionCardContent,
  type AboutIconKey,
  type AboutPawNoteContent,
  type AboutPawRouteContent
} from "@/lib/about-paw-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminAboutHeroRow = {
  id: string | null;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  compass_title: string | null;
  compass_description: string | null;
};

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

type AdminAboutCollectionSectionRow = {
  id: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  view_all_label: string | null;
  view_all_href: string | null;
};

type AdminAboutCollectionCardRow = {
  id: string | null;
  card_key: string | null;
  title: string | null;
  category_slug: string | null;
  href: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number | string | null;
  enabled: boolean | null;
};

type EditableHero = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  hero_image_url: string;
  hero_image_alt: string;
  compass_title: string;
  compass_description: string;
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

type EditableCollectionSection = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  view_all_label: string;
  view_all_href: string;
};

type EditableCollectionCard = {
  id?: string;
  card_key: string;
  title: string;
  category_slug: string;
  href: string;
  image_url: string;
  image_alt: string;
  sort_order: string;
  enabled: boolean;
};

const ABOUT_IMAGE_BUCKET = "about-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const inputClass =
  "min-h-12 w-full rounded-md border border-outline-variant bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-28 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const fileInputClass =
  "block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-heading file:text-sm file:font-bold file:text-white hover:file:bg-primary/90";

const copy = {
  zh: {
    title: "关于页面",
    description: "管理 About 页面可编辑内容。",
    loading: "正在加载 About 页面内容...",
    unableToLoad: "无法加载 About 页面内容。",
    unableToSave: "无法保存 About 页面内容。",
    saved: "About 页面内容已保存。",
    validationRequired: "请填写所有必填字段。",
    uploadConfigMissing: "当前构建未配置 Supabase 上传。",
    chooseValidImage: "请选择 JPEG、PNG 或 WebP 图片。",
    imageSizeLimit: "图片必须小于或等于 5MB。",
    unableToUploadImage: "无法上传图片。",
    uploaded: "图片已上传。",
    uploading: "正在上传图片...",
    heroSection: "About Hero",
    pawSection: "Paw Path Finder",
    collectionSection: "Routine Collection Cards",
    codeControlledTitle: "由代码控制的内容",
    codeControlled:
      "Hero 布局、路线地图布局、节点位置、路径线条、动画、响应式行为和视觉样式仍由代码控制。这里仅编辑内容、链接、图标键、图片 URL、排序和启用状态。",
    eyebrow: "眉标",
    titleField: "标题",
    descriptionField: "描述",
    primaryCtaLabel: "主按钮文字",
    primaryCtaHref: "主按钮链接",
    secondaryCtaLabel: "次按钮文字",
    secondaryCtaHref: "次按钮链接",
    heroImageUrl: "Hero 图片 URL",
    heroImageAlt: "Hero 图片 Alt",
    compassTitle: "Compass 标题",
    compassDescription: "Compass 描述",
    uploadHeroImage: "上传 Hero 图片",
    sectionLabel: "模块标签",
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
    keyword: "关键词",
    secondaryText: "辅助文字",
    viewAllLabel: "查看全部文字",
    viewAllHref: "查看全部链接",
    cardKey: "卡片 key",
    categorySlug: "分类 slug",
    href: "链接",
    imageUrl: "图片 URL",
    imageAlt: "图片 Alt",
    uploadCardImage: "上传卡片图片",
    sortOrder: "排序",
    enabled: "启用",
    disabled: "已停用",
    addCard: "添加卡片",
    save: "保存 About 内容",
    saving: "保存中...",
    routeHelper: "已知 route_key 会使用代码中的固定地图位置；未知 key 使用安全备用位置。",
    uploadHelper: "支持 JPEG、PNG、WebP，最大 5MB。上传成功后会自动填入图片 URL。",
    noRoutes: "暂无路线节点。",
    noNotes: "暂无路线注释。",
    noCards: "暂无卡片。"
  },
  en: {
    title: "About Page",
    description: "Manage editable About page content.",
    loading: "Loading About page content...",
    unableToLoad: "Unable to load About page content.",
    unableToSave: "Unable to save About page content.",
    saved: "About page content saved.",
    validationRequired: "Please complete all required fields.",
    uploadConfigMissing: "Supabase upload is not configured for this build.",
    chooseValidImage: "Please choose a JPEG, PNG, or WebP image.",
    imageSizeLimit: "Image must be 5MB or smaller.",
    unableToUploadImage: "Unable to upload image.",
    uploaded: "Image uploaded.",
    uploading: "Uploading image...",
    heroSection: "About Hero",
    pawSection: "Paw Path Finder",
    collectionSection: "Routine Collection Cards",
    codeControlledTitle: "Code-controlled fields",
    codeControlled:
      "Hero layout, route map layout, node positions, path drawing, animation, responsive behavior, and visual design remain controlled by code. This page only edits content, links, icon keys, image URLs, sort order, and enabled state.",
    eyebrow: "Eyebrow",
    titleField: "Title",
    descriptionField: "Description",
    primaryCtaLabel: "Primary CTA label",
    primaryCtaHref: "Primary CTA link",
    secondaryCtaLabel: "Secondary CTA label",
    secondaryCtaHref: "Secondary CTA link",
    heroImageUrl: "Hero image URL",
    heroImageAlt: "Hero image alt",
    compassTitle: "Compass title",
    compassDescription: "Compass description",
    uploadHeroImage: "Upload Hero Image",
    sectionLabel: "Section label",
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
    keyword: "Keyword",
    secondaryText: "Secondary text",
    viewAllLabel: "View all label",
    viewAllHref: "View all link",
    cardKey: "Card key",
    categorySlug: "Category slug",
    href: "Link",
    imageUrl: "Image URL",
    imageAlt: "Image alt",
    uploadCardImage: "Upload card image",
    sortOrder: "Sort order",
    enabled: "Enabled",
    disabled: "Disabled",
    addCard: "Add Card",
    save: "Save About Content",
    saving: "Saving...",
    routeHelper: "Known route_key values use fixed map positions in code; unknown keys use safe fallback positions.",
    uploadHelper: "Supports JPEG, PNG, and WebP up to 5MB. A successful upload automatically fills the image URL.",
    noRoutes: "No route nodes.",
    noNotes: "No route notes.",
    noCards: "No cards."
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

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "");
}

function safeFileName(fileName: string) {
  return sanitizePathSegment(fileName) || "about-image";
}

function logUploadError(message: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(message, error);
  }
}

function sortEditableItems<T extends { sort_order: string }>(items: T[]) {
  return [...items].sort((first, second) => {
    const firstSort = Number(first.sort_order);
    const secondSort = Number(second.sort_order);

    return (Number.isFinite(firstSort) ? firstSort : 9999) - (Number.isFinite(secondSort) ? secondSort : 9999);
  });
}

function heroFromRow(row: AdminAboutHeroRow | null | undefined): EditableHero {
  return {
    id: cleanString(row?.id) || undefined,
    eyebrow: cleanString(row?.eyebrow) || fallbackAboutHeroContent.eyebrow,
    title: cleanString(row?.title) || fallbackAboutHeroContent.title,
    description: cleanString(row?.description) || fallbackAboutHeroContent.description,
    primary_cta_label: cleanString(row?.primary_cta_label) || fallbackAboutHeroContent.primaryCtaLabel,
    primary_cta_href: cleanString(row?.primary_cta_href) || fallbackAboutHeroContent.primaryCtaHref,
    secondary_cta_label: cleanString(row?.secondary_cta_label) || fallbackAboutHeroContent.secondaryCtaLabel,
    secondary_cta_href: cleanString(row?.secondary_cta_href) || fallbackAboutHeroContent.secondaryCtaHref,
    hero_image_url: cleanString(row?.hero_image_url) || fallbackAboutHeroContent.heroImageUrl,
    hero_image_alt: cleanString(row?.hero_image_alt) || fallbackAboutHeroContent.heroImageAlt,
    compass_title: cleanString(row?.compass_title) || fallbackAboutHeroContent.compassTitle,
    compass_description: cleanString(row?.compass_description) || fallbackAboutHeroContent.compassDescription
  };
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

function collectionSectionFromRow(row: AdminAboutCollectionSectionRow | null | undefined): EditableCollectionSection {
  return {
    id: cleanString(row?.id) || undefined,
    eyebrow: cleanString(row?.eyebrow) || fallbackAboutCollectionSectionContent.eyebrow,
    title: cleanString(row?.title) || fallbackAboutCollectionSectionContent.title,
    subtitle: cleanString(row?.subtitle) || fallbackAboutCollectionSectionContent.subtitle,
    view_all_label: cleanString(row?.view_all_label) || fallbackAboutCollectionSectionContent.viewAllLabel,
    view_all_href: cleanString(row?.view_all_href) || fallbackAboutCollectionSectionContent.viewAllHref
  };
}

function cardFromFallback(card: AboutCollectionCardContent): EditableCollectionCard {
  return {
    card_key: card.cardKey,
    title: card.title,
    category_slug: card.categorySlug,
    href: card.href,
    image_url: card.imageUrl,
    image_alt: card.imageAlt,
    sort_order: String(card.sortOrder),
    enabled: card.enabled
  };
}

function cardFromRow(row: AdminAboutCollectionCardRow): EditableCollectionCard {
  const cardKey = cleanString(row.card_key);
  const fallback = fallbackAboutCollectionCards.find((card) => card.cardKey === cardKey);

  return {
    id: cleanString(row.id) || undefined,
    card_key: cardKey,
    title: cleanString(row.title) || fallback?.title || "",
    category_slug: cleanString(row.category_slug) || fallback?.categorySlug || "",
    href: cleanString(row.href) || fallback?.href || "",
    image_url: cleanString(row.image_url) || fallback?.imageUrl || "",
    image_alt: cleanString(row.image_alt) || fallback?.imageAlt || "",
    sort_order: row.sort_order === null || row.sort_order === undefined ? "" : String(row.sort_order),
    enabled: row.enabled !== false
  };
}

function requiredFieldsAreValid({
  hero,
  settings,
  routes,
  notes,
  collectionSection,
  collectionCards
}: {
  hero: EditableHero;
  settings: EditableSettings;
  routes: EditableRoute[];
  notes: EditableNote[];
  collectionSection: EditableCollectionSection;
  collectionCards: EditableCollectionCard[];
}) {
  const heroValid =
    hero.eyebrow.trim() &&
    hero.title.trim() &&
    hero.description.trim() &&
    hero.primary_cta_label.trim() &&
    hero.primary_cta_href.trim() &&
    hero.secondary_cta_label.trim() &&
    hero.secondary_cta_href.trim() &&
    hero.hero_image_alt.trim() &&
    hero.compass_title.trim() &&
    hero.compass_description.trim();
  const pawHeaderValid =
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
  const collectionSectionValid =
    collectionSection.eyebrow.trim() &&
    collectionSection.title.trim() &&
    collectionSection.subtitle.trim() &&
    collectionSection.view_all_label.trim() &&
    collectionSection.view_all_href.trim();
  const cardsValid = collectionCards.every(
    (card) =>
      card.card_key.trim() &&
      card.title.trim() &&
      card.category_slug.trim() &&
      card.href.trim() &&
      card.image_alt.trim() &&
      card.sort_order.trim() &&
      Number.isFinite(Number(card.sort_order))
  );

  return Boolean(
    heroValid &&
      pawHeaderValid &&
      routes.length > 0 &&
      routesValid &&
      notes.length > 0 &&
      notesValid &&
      collectionSectionValid &&
      collectionCards.length > 0 &&
      cardsValid
  );
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

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return null;
  }

  return (
    <div className="aspect-[4/3] overflow-hidden rounded-md bg-surface-container-low">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt || ""} className="h-full w-full object-cover" />
    </div>
  );
}

function AdminAboutForm() {
  const { accessToken } = useAdminAuth();
  const { language } = useAdminLanguage();
  const c = copy[language];
  const supabase = getSupabaseBrowserClient();
  const [hero, setHero] = useState<EditableHero>(() => heroFromRow(null));
  const [settings, setSettings] = useState<EditableSettings>(() => settingsFromRow(null));
  const [routes, setRoutes] = useState<EditableRoute[]>(() =>
    fallbackAboutPawContent.routes.map(routeFromFallback)
  );
  const [notes, setNotes] = useState<EditableNote[]>(() =>
    fallbackAboutPawContent.notes.map(noteFromFallback)
  );
  const [collectionSection, setCollectionSection] = useState<EditableCollectionSection>(() =>
    collectionSectionFromRow(null)
  );
  const [collectionCards, setCollectionCards] = useState<EditableCollectionCard[]>(() =>
    fallbackAboutCollectionCards.map(cardFromFallback)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/admin/about", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          hero?: AdminAboutHeroRow | null;
          settings?: AdminAboutSettingsRow | null;
          routes?: AdminAboutRouteRow[];
          notes?: AdminAboutNoteRow[];
          collectionSection?: AdminAboutCollectionSectionRow | null;
          collectionCards?: AdminAboutCollectionCardRow[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? c.unableToLoad);
        }

        if (!active) {
          return;
        }

        setHero(heroFromRow(payload.hero));
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
        setCollectionSection(collectionSectionFromRow(payload.collectionSection));
        setCollectionCards(
          payload.collectionCards?.length
            ? sortEditableItems(payload.collectionCards.map(cardFromRow))
            : fallbackAboutCollectionCards.map(cardFromFallback)
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
  const enabledCardCount = useMemo(
    () => collectionCards.filter((card) => card.enabled).length,
    [collectionCards]
  );

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

  function updateCollectionCard(index: number, updates: Partial<EditableCollectionCard>) {
    setCollectionCards((currentCards) =>
      currentCards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...updates } : card))
    );
  }

  async function uploadAboutImage(file: File, folder: string) {
    if (!supabase) {
      throw new Error(c.uploadConfigMissing);
    }

    if (!acceptedImageTypes.has(file.type)) {
      throw new Error(c.chooseValidImage);
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(c.imageSizeLimit);
    }

    const storagePath = `${folder}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadErrorResult } = await supabase.storage.from(ABOUT_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (uploadErrorResult) {
      throw uploadErrorResult;
    }

    const { data } = supabase.storage.from(ABOUT_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  }

  async function persistHeroImageUrl(publicUrl: string) {
    if (!supabase) {
      throw new Error(c.uploadConfigMissing);
    }

    const updateQuery = hero.id
      ? supabase.from("about_hero_settings").update({ hero_image_url: publicUrl }).eq("id", hero.id)
      : supabase
          .from("about_hero_settings")
          .update({ hero_image_url: publicUrl })
          .eq("section_key", "about_hero");
    const { data, error: updateError } = await updateQuery
      .select("id, hero_image_url")
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (data) {
      return data as Pick<AdminAboutHeroRow, "id" | "hero_image_url">;
    }

    const { data: insertedData, error: insertError } = await supabase
      .from("about_hero_settings")
      .insert({
        section_key: "about_hero",
        eyebrow: hero.eyebrow,
        title: hero.title,
        description: hero.description,
        primary_cta_label: hero.primary_cta_label,
        primary_cta_href: hero.primary_cta_href,
        secondary_cta_label: hero.secondary_cta_label,
        secondary_cta_href: hero.secondary_cta_href,
        hero_image_url: publicUrl,
        hero_image_alt: hero.hero_image_alt,
        compass_title: hero.compass_title,
        compass_description: hero.compass_description
      })
      .select("id, hero_image_url")
      .single();

    if (insertError) {
      throw insertError;
    }

    return insertedData as Pick<AdminAboutHeroRow, "id" | "hero_image_url">;
  }

  async function persistCollectionCardImageUrl(index: number, publicUrl: string) {
    if (!supabase) {
      throw new Error(c.uploadConfigMissing);
    }

    const card = collectionCards[index];
    const updateQuery = card.id
      ? supabase.from("about_collection_cards").update({ image_url: publicUrl }).eq("id", card.id)
      : supabase
          .from("about_collection_cards")
          .update({ image_url: publicUrl })
          .eq("card_key", card.card_key);
    const { data, error: updateError } = await updateQuery
      .select("id, card_key, image_url")
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (!data) {
      throw new Error("Collection card row was not found. Save the card before uploading an image.");
    }

    return data as Pick<AdminAboutCollectionCardRow, "id" | "card_key" | "image_url">;
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    setUploadingKey("hero");

    try {
      const publicUrl = await uploadAboutImage(file, "hero");
      const persistedHero = await persistHeroImageUrl(publicUrl);

      setHero((current) => ({
        ...current,
        id: persistedHero.id ?? current.id,
        hero_image_url: persistedHero.hero_image_url ?? publicUrl
      }));
      setUploadMessage(c.uploaded);
    } catch (uploadErrorResult: unknown) {
      logUploadError("Unable to upload or persist About hero image:", uploadErrorResult);
      setUploadError(uploadErrorResult instanceof Error ? uploadErrorResult.message : c.unableToUploadImage);
    } finally {
      setUploadingKey("");
    }
  }

  async function handleCardImageUpload(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    const card = collectionCards[index];
    const uploadKey = `card-${index}`;
    const folder = `collections/${sanitizePathSegment(card.card_key) || "card"}`;

    setUploadingKey(uploadKey);

    try {
      const publicUrl = await uploadAboutImage(file, folder);
      const persistedCard = await persistCollectionCardImageUrl(index, publicUrl);

      updateCollectionCard(index, {
        id: persistedCard.id ?? card.id,
        image_url: persistedCard.image_url ?? publicUrl
      });
      setUploadMessage(c.uploaded);
    } catch (uploadErrorResult: unknown) {
      logUploadError("Unable to upload or persist About collection card image:", uploadErrorResult);
      setUploadError(uploadErrorResult instanceof Error ? uploadErrorResult.message : c.unableToUploadImage);
    } finally {
      setUploadingKey("");
    }
  }

  function addCollectionCard() {
    setCollectionCards((currentCards) => [
      ...currentCards,
      {
        card_key: `custom-${Date.now()}`,
        title: "",
        category_slug: "",
        href: "/collections",
        image_url: "",
        image_alt: "",
        sort_order: String(currentCards.length + 1),
        enabled: true
      }
    ]);
  }

  async function saveAboutContent() {
    setError("");
    setSuccessMessage("");
    setValidationError("");

    if (
      !requiredFieldsAreValid({
        hero,
        settings,
        routes,
        notes,
        collectionSection,
        collectionCards
      })
    ) {
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
        hero,
        settings,
        routes: routes.map((route) => ({
          ...route,
          sort_order: Number(route.sort_order)
        })),
        notes: notes.map((note) => ({
          ...note,
          sort_order: Number(note.sort_order)
        })),
        collectionSection,
        collectionCards: collectionCards.map((card) => ({
          ...card,
          sort_order: Number(card.sort_order)
        }))
      })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      hero?: AdminAboutHeroRow | null;
      settings?: AdminAboutSettingsRow | null;
      routes?: AdminAboutRouteRow[];
      notes?: AdminAboutNoteRow[];
      collectionSection?: AdminAboutCollectionSectionRow | null;
      collectionCards?: AdminAboutCollectionCardRow[];
      error?: string;
    };

    if (!response.ok) {
      setError(payload.error ?? c.unableToSave);
      setSaving(false);
      return;
    }

    setHero(heroFromRow(payload.hero));
    setSettings(settingsFromRow(payload.settings));
    setRoutes(payload.routes?.length ? sortEditableItems(payload.routes.map(routeFromRow)) : routes);
    setNotes(payload.notes?.length ? sortEditableItems(payload.notes.map(noteFromRow)) : notes);
    setCollectionSection(collectionSectionFromRow(payload.collectionSection));
    setCollectionCards(
      payload.collectionCards?.length ? sortEditableItems(payload.collectionCards.map(cardFromRow)) : collectionCards
    );
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

      {(error || validationError || successMessage || uploadError || uploadMessage) && (
        <div
          className={`rounded-md p-4 text-sm font-semibold ${
            successMessage || uploadMessage ? "bg-primary-container/20 text-primary" : "bg-error/10 text-error"
          }`}
          role={successMessage || uploadMessage ? "status" : "alert"}
        >
          {successMessage || uploadMessage || validationError || uploadError || error}
        </div>
      )}

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <h2 className="font-heading text-xl font-bold">{c.heroSection}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label={c.eyebrow} value={hero.eyebrow} required onChange={(value) => setHero((current) => ({ ...current, eyebrow: value }))} />
          <Field label={c.titleField} value={hero.title} required onChange={(value) => setHero((current) => ({ ...current, title: value }))} />
          <Field label={c.descriptionField} value={hero.description} required textarea onChange={(value) => setHero((current) => ({ ...current, description: value }))} />
          <Field label={c.primaryCtaLabel} value={hero.primary_cta_label} required onChange={(value) => setHero((current) => ({ ...current, primary_cta_label: value }))} />
          <Field label={c.primaryCtaHref} value={hero.primary_cta_href} required onChange={(value) => setHero((current) => ({ ...current, primary_cta_href: value }))} />
          <Field label={c.secondaryCtaLabel} value={hero.secondary_cta_label} required onChange={(value) => setHero((current) => ({ ...current, secondary_cta_label: value }))} />
          <Field label={c.secondaryCtaHref} value={hero.secondary_cta_href} required onChange={(value) => setHero((current) => ({ ...current, secondary_cta_href: value }))} />
          <Field label={c.heroImageUrl} value={hero.hero_image_url} onChange={(value) => setHero((current) => ({ ...current, hero_image_url: value }))} />
          <Field label={c.heroImageAlt} value={hero.hero_image_alt} required onChange={(value) => setHero((current) => ({ ...current, hero_image_alt: value }))} />
          <Field label={c.compassTitle} value={hero.compass_title} required onChange={(value) => setHero((current) => ({ ...current, compass_title: value }))} />
          <Field label={c.compassDescription} value={hero.compass_description} required textarea onChange={(value) => setHero((current) => ({ ...current, compass_description: value }))} />
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {c.uploadHeroImage}
              <input
                accept="image/jpeg,image/png,image/webp"
                className={fileInputClass}
                disabled={uploadingKey === "hero"}
                type="file"
                onChange={handleHeroImageUpload}
              />
            </label>
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">{c.uploadHelper}</p>
            {uploadingKey === "hero" && <p className="text-sm font-semibold text-on-surface-variant">{c.uploading}</p>}
          </div>
        </div>
        <div className="mt-5 max-w-sm">
          <ImagePreview src={hero.hero_image_url} alt={hero.hero_image_alt} />
        </div>
      </section>

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <h2 className="font-heading text-xl font-bold">{c.pawSection}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label={c.sectionLabel} value={settings.section_label} required onChange={(value) => setSettings((current) => ({ ...current, section_label: value }))} />
          <Field label={c.titleField} value={settings.title} required onChange={(value) => setSettings((current) => ({ ...current, title: value }))} />
          <Field label={c.subtitle} value={settings.subtitle} required textarea onChange={(value) => setSettings((current) => ({ ...current, subtitle: value }))} />
          <Field label={c.supportingLine} value={settings.supporting_line} required textarea onChange={(value) => setSettings((current) => ({ ...current, supporting_line: value }))} />
        </div>

        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold">{c.routeKey}</h3>
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
                    <input type="checkbox" checked={route.enabled} onChange={(event) => updateRoute(index, { enabled: event.target.checked })} />
                    {c.enabled}
                  </label>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label={c.routeKey} value={route.route_key} required onChange={(value) => updateRoute(index, { route_key: value })} />
                  <Field label={c.label} value={route.label} required onChange={(value) => updateRoute(index, { label: value })} />
                  <IconSelect label={c.iconKey} value={route.icon_key} onChange={(value) => updateRoute(index, { icon_key: value })} />
                  <Field label={c.recommendationTitle} value={route.recommendation_title} required onChange={(value) => updateRoute(index, { recommendation_title: value })} />
                  <Field label={c.recommendationDescription} value={route.recommendation_description} required textarea onChange={(value) => updateRoute(index, { recommendation_description: value })} />
                  <Field label={c.noteText} value={route.note_text} required textarea onChange={(value) => updateRoute(index, { note_text: value })} />
                  <Field label={c.ctaLabel} value={route.cta_label} required onChange={(value) => updateRoute(index, { cta_label: value })} />
                  <Field label={c.ctaHref} value={route.cta_href} required onChange={(value) => updateRoute(index, { cta_href: value })} />
                  <Field label={c.sortOrder} value={route.sort_order} required onChange={(value) => updateRoute(index, { sort_order: value })} />
                  <Field label={c.secondaryCtaLabel} value={route.secondary_cta_label} onChange={(value) => updateRoute(index, { secondary_cta_label: value })} />
                  <Field label={c.secondaryCtaHref} value={route.secondary_cta_href} onChange={(value) => updateRoute(index, { secondary_cta_href: value })} />
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h3 className="font-heading text-lg font-bold">{c.noteKey}</h3>
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
                    <input type="checkbox" checked={note.enabled} onChange={(event) => updateNote(index, { enabled: event.target.checked })} />
                    {c.enabled}
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label={c.noteKey} value={note.note_key} required onChange={(value) => updateNote(index, { note_key: value })} />
                  <IconSelect label={c.iconKey} value={note.icon_key} onChange={(value) => updateNote(index, { icon_key: value })} />
                  <Field label={c.keyword} value={note.keyword} required onChange={(value) => updateNote(index, { keyword: value })} />
                  <Field label={c.secondaryText} value={note.secondary_text} required onChange={(value) => updateNote(index, { secondary_text: value })} />
                  <Field label={c.sortOrder} value={note.sort_order} required onChange={(value) => updateNote(index, { sort_order: value })} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg bg-surface-container-lowest p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold">{c.collectionSection}</h2>
            <p className="mt-2 text-sm font-semibold text-on-surface-variant">
              {enabledCardCount} / {collectionCards.length} {c.enabled}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex rounded-full border border-primary px-5 py-2 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
            onClick={addCollectionCard}
          >
            {c.addCard}
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label={c.eyebrow} value={collectionSection.eyebrow} required onChange={(value) => setCollectionSection((current) => ({ ...current, eyebrow: value }))} />
          <Field label={c.titleField} value={collectionSection.title} required onChange={(value) => setCollectionSection((current) => ({ ...current, title: value }))} />
          <Field label={c.subtitle} value={collectionSection.subtitle} required textarea onChange={(value) => setCollectionSection((current) => ({ ...current, subtitle: value }))} />
          <Field label={c.viewAllLabel} value={collectionSection.view_all_label} required onChange={(value) => setCollectionSection((current) => ({ ...current, view_all_label: value }))} />
          <Field label={c.viewAllHref} value={collectionSection.view_all_href} required onChange={(value) => setCollectionSection((current) => ({ ...current, view_all_href: value }))} />
        </div>

        {collectionCards.length === 0 ? (
          <p className="mt-5 rounded-md bg-surface-container-low p-4 text-sm text-on-surface-variant">{c.noCards}</p>
        ) : (
          <div className="mt-6 grid gap-5">
            {collectionCards.map((card, index) => (
              <article key={`${card.id ?? "new"}-${index}`} className="rounded-md border border-outline-variant p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-heading text-lg font-bold">{card.title || card.card_key}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {card.enabled ? c.enabled : c.disabled}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    <input type="checkbox" checked={card.enabled} onChange={(event) => updateCollectionCard(index, { enabled: event.target.checked })} />
                    {c.enabled}
                  </label>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label={c.cardKey} value={card.card_key} required onChange={(value) => updateCollectionCard(index, { card_key: value })} />
                  <Field label={c.titleField} value={card.title} required onChange={(value) => updateCollectionCard(index, { title: value })} />
                  <Field label={c.categorySlug} value={card.category_slug} required onChange={(value) => updateCollectionCard(index, { category_slug: value })} />
                  <Field label={c.href} value={card.href} required onChange={(value) => updateCollectionCard(index, { href: value })} />
                  <Field label={c.imageUrl} value={card.image_url} onChange={(value) => updateCollectionCard(index, { image_url: value })} />
                  <Field label={c.imageAlt} value={card.image_alt} required onChange={(value) => updateCollectionCard(index, { image_alt: value })} />
                  <Field label={c.sortOrder} value={card.sort_order} required onChange={(value) => updateCollectionCard(index, { sort_order: value })} />
                  <div className="grid gap-3">
                    <label className="grid gap-2 text-sm font-semibold text-on-surface">
                      {c.uploadCardImage}
                      <input
                        accept="image/jpeg,image/png,image/webp"
                        className={fileInputClass}
                        disabled={uploadingKey === `card-${index}`}
                        type="file"
                        onChange={(event) => handleCardImageUpload(index, event)}
                      />
                    </label>
                    {uploadingKey === `card-${index}` && (
                      <p className="text-sm font-semibold text-on-surface-variant">{c.uploading}</p>
                    )}
                  </div>
                  <ImagePreview src={card.image_url} alt={card.image_alt} />
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
          description={{ zh: "管理 About 页面内容。", en: "Manage About page content." }}
          layout="wide"
          backLink
        >
          <AdminAboutForm />
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
