"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAdminLanguage } from "@/components/admin/admin-language";
import {
  buildHomepageDecisionGuideValue,
  buildHomepageNewsletterValue,
  buildHomepageServicePromisesValue,
  defaultHomepageDecisionGuide,
  defaultHomepageNewsletter,
  defaultHomepageServicePromises,
  homepageDecisionGuideFromValue,
  homepageDecisionGuideIconKeys,
  homepageDecisionGuideSettingKey,
  homepageNewsletterFromValue,
  homepageNewsletterSettingKey,
  homepageServicePromisesFromValue,
  homepageServicePromisesSettingKey,
  homepageTrustBadgeIconKeys,
  normalizeHomepageDecisionGuideIconKey,
  normalizeHomepageTrustBadgeIconKey,
  type HomepageDecisionGuideContent,
  type HomepageDecisionGuideIconKey,
  type HomepageDecisionGuideLink,
  type HomepageDecisionGuideOption,
  type HomepageDecisionGuideStep,
  type HomepageNewsletterContent,
  type HomepageServicePromise,
  type HomepageServicePromisesContent,
  type HomepageTrustBadgeIconKey
} from "@/lib/homepage-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type HomepageSettingRow = {
  key: string | null;
  value: unknown;
};

type Copy = {
  title: string;
  description: string;
  loading: string;
  saveAll: string;
  saving: string;
  saved: string;
  loadError: string;
  saveError: string;
  enabled: string;
  routineTitle: string;
  routineDescription: string;
  serviceTitle: string;
  serviceDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
  eyebrow: string;
  sectionTitle: string;
  subtitle: string;
  stepsTitle: string;
  stepsBadge: string;
  routineTags: string;
  routeOptions: string;
  optionLabel: string;
  optionEyebrow: string;
  optionTitle: string;
  optionDescription: string;
  optionImageAlt: string;
  optionIcon: string;
  optionDetails: string;
  primaryLinkLabel: string;
  primaryLinkHref: string;
  secondaryLinkLabel: string;
  secondaryLinkHref: string;
  routeSteps: string;
  advancedSteps: string;
  stepNumber: string;
  stepTitle: string;
  stepText: string;
  addStep: string;
  serviceItems: string;
  itemKey: string;
  itemIcon: string;
  itemTitle: string;
  itemText: string;
  addItem: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  offerText: string;
  successTitle: string;
  successMessage: string;
  editButtonText: string;
  placeholder: string;
  buttonText: string;
  submittingText: string;
  noteText: string;
  duplicateMessage: string;
  requiredError: string;
  uploadImage: string;
  uploadingImage: string;
  imageUploaded: string;
  imageUploadHelper: string;
  imageUploadError: string;
  imageTypeError: string;
  imageSizeError: string;
  currentImage: string;
  editNode: string;
};

const copy = {
  zh: {
    title: "首页高级模块",
    description: "管理首页剩余的可见内容：场景导购、服务承诺和订阅模块。布局和动画仍由代码控制。",
    loading: "正在加载首页高级模块...",
    saveAll: "保存高级模块",
    saving: "正在保存...",
    saved: "首页高级模块已保存。",
    loadError: "无法加载首页高级模块。",
    saveError: "无法保存首页高级模块，请稍后重试。",
    enabled: "显示该模块",
    routineTitle: "Routine Advisor 场景导购",
    routineDescription: "编辑首页“Choose by moment”模块的文案、路线节点、步骤和链接。",
    serviceTitle: "服务承诺模块",
    serviceDescription: "编辑深色服务承诺区的标题、说明和承诺卡片。",
    newsletterTitle: "Newsletter 订阅模块",
    newsletterDescription: "编辑订阅区的标题、优惠提示、成功提示和按钮文案。",
    eyebrow: "小标题",
    sectionTitle: "标题",
    subtitle: "说明文字",
    stepsTitle: "步骤标题",
    stepsBadge: "步骤标签",
    routineTags: "场景标签（每行一个）",
    routeOptions: "路线节点",
    optionLabel: "节点标签",
    optionEyebrow: "节点小标题",
    optionTitle: "推荐标题",
    optionDescription: "推荐说明",
    optionImageAlt: "图片 Alt 文本",
    optionIcon: "图标",
    optionDetails: "细节标签（每行一个）",
    primaryLinkLabel: "主链接文字",
    primaryLinkHref: "主链接",
    secondaryLinkLabel: "副链接文字",
    secondaryLinkHref: "副链接",
    routeSteps: "导购步骤",
    advancedSteps: "导购步骤（可展开编辑）",
    stepNumber: "编号",
    stepTitle: "步骤标题",
    stepText: "步骤说明",
    addStep: "添加步骤",
    serviceItems: "承诺卡片",
    itemKey: "Key",
    itemIcon: "图标",
    itemTitle: "标题",
    itemText: "说明",
    addItem: "添加卡片",
    remove: "删除",
    moveUp: "上移",
    moveDown: "下移",
    offerText: "优惠提示",
    successTitle: "成功标题",
    successMessage: "成功说明",
    editButtonText: "重新输入按钮",
    placeholder: "输入框占位文字",
    buttonText: "按钮文字",
    submittingText: "提交中文字",
    noteText: "底部说明",
    duplicateMessage: "重复邮箱提示",
    requiredError: "启用的模块必须填写标题。",
    uploadImage: "上传本地图片",
    uploadingImage: "图片上传中...",
    imageUploaded: "图片已上传，保存后前台生效。",
    imageUploadHelper: "支持 JPEG、PNG、WebP，最大 5MB。上传成功后自动替换当前图片。",
    imageUploadError: "图片上传失败，请稍后重试。",
    imageTypeError: "只支持 JPEG、PNG 或 WebP 图片。",
    imageSizeError: "图片不能超过 5MB。",
    currentImage: "当前图片",
    editNode: "编辑"
  },
  en: {
    title: "Homepage Advanced Modules",
    description:
      "Manage the remaining homepage content: routine advisor, service promises, and newsletter copy. Layout and animation remain code-controlled.",
    loading: "Loading homepage advanced modules...",
    saveAll: "Save advanced modules",
    saving: "Saving...",
    saved: "Homepage advanced modules saved.",
    loadError: "Unable to load homepage advanced modules.",
    saveError: "Unable to save homepage advanced modules. Please try again.",
    enabled: "Show this section",
    routineTitle: "Routine Advisor",
    routineDescription: "Edit the homepage Choose by moment copy, route nodes, steps, and links.",
    serviceTitle: "Service Promises",
    serviceDescription: "Edit the dark service promise section title, description, and promise cards.",
    newsletterTitle: "Newsletter",
    newsletterDescription: "Edit the newsletter title, offer note, success message, and button copy.",
    eyebrow: "Eyebrow",
    sectionTitle: "Title",
    subtitle: "Description",
    stepsTitle: "Steps title",
    stepsBadge: "Steps badge",
    routineTags: "Routine tags, one per line",
    routeOptions: "Route nodes",
    optionLabel: "Node label",
    optionEyebrow: "Node eyebrow",
    optionTitle: "Recommendation title",
    optionDescription: "Recommendation description",
    optionImageAlt: "Image alt text",
    optionIcon: "Icon",
    optionDetails: "Detail chips, one per line",
    primaryLinkLabel: "Primary link label",
    primaryLinkHref: "Primary link",
    secondaryLinkLabel: "Secondary link label",
    secondaryLinkHref: "Secondary link",
    routeSteps: "Advisor steps",
    advancedSteps: "Advisor steps, expandable",
    stepNumber: "Number",
    stepTitle: "Step title",
    stepText: "Step text",
    addStep: "Add step",
    serviceItems: "Promise cards",
    itemKey: "Key",
    itemIcon: "Icon",
    itemTitle: "Title",
    itemText: "Text",
    addItem: "Add card",
    remove: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    offerText: "Offer text",
    successTitle: "Success title",
    successMessage: "Success message",
    editButtonText: "Edit button text",
    placeholder: "Input placeholder",
    buttonText: "Button text",
    submittingText: "Submitting text",
    noteText: "Footer note",
    duplicateMessage: "Duplicate email message",
    requiredError: "Enabled modules must have a title.",
    uploadImage: "Upload local image",
    uploadingImage: "Uploading image...",
    imageUploaded: "Image uploaded. Save to publish it.",
    imageUploadHelper: "Supports JPEG, PNG, and WebP up to 5MB. Upload replaces the current image automatically.",
    imageUploadError: "Unable to upload image. Please try again.",
    imageTypeError: "Only JPEG, PNG, or WebP images are supported.",
    imageSizeError: "Image must be 5MB or smaller.",
    currentImage: "Current image",
    editNode: "Edit"
  }
} as const satisfies Record<"zh" | "en", Copy>;

const inputClass =
  "min-h-12 w-full rounded-md border border-outline-variant bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-28 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const HOMEPAGE_IMAGE_BUCKET = "homepage-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const iconLabels: Record<HomepageTrustBadgeIconKey, { zh: string; en: string }> = {
  truck: { zh: "卡车", en: "Truck" },
  shield: { zh: "盾牌", en: "Shield" },
  heart: { zh: "爱心", en: "Heart" },
  star: { zh: "星标", en: "Star" },
  sparkles: { zh: "闪光", en: "Sparkles" },
  leaf: { zh: "叶子", en: "Leaf" },
  package: { zh: "包裹", en: "Package" },
  check: { zh: "确认", en: "Check" },
  rotate: { zh: "循环", en: "Rotate" },
  lock: { zh: "锁", en: "Lock" }
};

const guideIconLabels: Record<HomepageDecisionGuideIconKey, { zh: string; en: string }> = {
  paw: { zh: "爪印", en: "Paw" },
  route: { zh: "路线", en: "Route" },
  bed: { zh: "床", en: "Bed" },
  help: { zh: "帮助", en: "Help" },
  search: { zh: "搜索", en: "Search" },
  heart: { zh: "爱心", en: "Heart" }
};

function rowsByKey(rows: HomepageSettingRow[]) {
  return new Map(rows.map((row) => [row.key, row.value]));
}

function linesToArray(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

function textField(label: string, value: string, onChange: (value: string) => void, textarea = false) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      {textarea ? (
        <textarea className={textareaClass} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function safeFileName(fileName: string) {
  const normalized = fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return normalized || "image";
}

function moveArrayItem<T>(items: T[], index: number, direction: "up" | "down") {
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(index, 1);

  nextItems.splice(nextIndex, 0, item);

  return nextItems;
}

export function AdminHomepageAdvancedSettings() {
  const { language } = useAdminLanguage();
  const c = copy[language];
  const supabase = getSupabaseBrowserClient();
  const [guide, setGuide] = useState<HomepageDecisionGuideContent>(defaultHomepageDecisionGuide);
  const [servicePromises, setServicePromises] =
    useState<HomepageServicePromisesContent>(defaultHomepageServicePromises);
  const [newsletter, setNewsletter] = useState<HomepageNewsletterContent>(defaultHomepageNewsletter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImageKey, setUploadingImageKey] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError(c.loadError);
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadSettings() {
      const { data, error: loadError } = await browserSupabase
        .from("homepage_settings")
        .select("key, value")
        .in("key", [
          homepageDecisionGuideSettingKey,
          homepageServicePromisesSettingKey,
          homepageNewsletterSettingKey
        ]);

      if (!active) {
        return;
      }

      if (loadError) {
        console.error("Unable to load homepage advanced modules", loadError);
        setError(c.loadError);
        setLoading(false);
        return;
      }

      const settings = rowsByKey((data ?? []) as HomepageSettingRow[]);

      setGuide(homepageDecisionGuideFromValue(settings.get(homepageDecisionGuideSettingKey)));
      setServicePromises(homepageServicePromisesFromValue(settings.get(homepageServicePromisesSettingKey)));
      setNewsletter(homepageNewsletterFromValue(settings.get(homepageNewsletterSettingKey)));
      setLoading(false);
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, [c.loadError, supabase]);

  const validForSave = useMemo(
    () =>
      (!guide.enabled || guide.title.trim()) &&
      (!servicePromises.enabled || servicePromises.title.trim()) &&
      (!newsletter.enabled || newsletter.title.trim()),
    [guide.enabled, guide.title, newsletter.enabled, newsletter.title, servicePromises.enabled, servicePromises.title]
  );

  const updateGuide = <K extends keyof HomepageDecisionGuideContent>(
    field: K,
    value: HomepageDecisionGuideContent[K]
  ) => {
    setSuccess("");
    setError("");
    setGuide((current) => ({ ...current, [field]: value }));
  };

  const updateGuideStep = (index: number, field: keyof HomepageDecisionGuideStep, value: string) => {
    setSuccess("");
    setError("");
    setGuide((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [field]: value } : step))
    }));
  };

  const updateGuideOption = <K extends keyof HomepageDecisionGuideOption>(
    index: number,
    field: K,
    value: HomepageDecisionGuideOption[K]
  ) => {
    setSuccess("");
    setError("");
    setGuide((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const updateGuideOptionLink = (
    optionIndex: number,
    linkIndex: number,
    field: keyof HomepageDecisionGuideLink,
    value: string
  ) => {
    setSuccess("");
    setError("");
    setGuide((current) => ({
      ...current,
      options: current.options.map((option, currentOptionIndex) => {
        if (currentOptionIndex !== optionIndex) {
          return option;
        }

        const links = [...option.links];
        const existingLink = links[linkIndex] ?? { label: "", href: "" };

        links[linkIndex] = { ...existingLink, [field]: value };

        return { ...option, links };
      })
    }));
  };

  const updateServicePromise = <K extends keyof HomepageServicePromise>(
    index: number,
    field: K,
    value: HomepageServicePromise[K]
  ) => {
    setSuccess("");
    setError("");
    setServicePromises((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    }));
  };

  const uploadGuideOptionImage = async (option: HomepageDecisionGuideOption, file: File) => {
    if (!supabase) {
      throw new Error("Supabase client is not available.");
    }

    const path = `homepage/routine-advisor/${sanitizePathSegment(option.key || option.label)}/${Date.now()}-${safeFileName(
      file.name
    )}`;
    const { error: uploadError } = await supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false
    });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("Supabase did not return a public image URL.");
    }

    return data.publicUrl;
  };

  const handleGuideOptionImageUpload = async (
    index: number,
    option: HomepageDecisionGuideOption,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setSuccess("");
    setError("");

    if (!acceptedImageTypes.has(file.type)) {
      setError(c.imageTypeError);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(c.imageSizeError);
      return;
    }

    const uploadKey = option.key || String(index);
    setUploadingImageKey(uploadKey);

    try {
      const publicUrl = await uploadGuideOptionImage(option, file);
      updateGuideOption(index, "image", publicUrl);
      setSuccess(c.imageUploaded);
    } catch (uploadError) {
      console.error("Unable to upload homepage routine image", uploadError);
      setError(c.imageUploadError);
    } finally {
      setUploadingImageKey("");
    }
  };

  const saveSettings = async () => {
    if (!supabase) {
      setError(c.loadError);
      return;
    }

    if (!validForSave) {
      setError(c.requiredError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { error: saveError } = await supabase.from("homepage_settings").upsert(
      [
        {
          key: homepageDecisionGuideSettingKey,
          status: "active",
          value: buildHomepageDecisionGuideValue(guide),
          updated_at: new Date().toISOString()
        },
        {
          key: homepageServicePromisesSettingKey,
          status: "active",
          value: buildHomepageServicePromisesValue(servicePromises),
          updated_at: new Date().toISOString()
        },
        {
          key: homepageNewsletterSettingKey,
          status: "active",
          value: buildHomepageNewsletterValue(newsletter),
          updated_at: new Date().toISOString()
        }
      ],
      { onConflict: "key" }
    );

    setSaving(false);

    if (saveError) {
      console.error("Unable to save homepage advanced modules", saveError);
      setError(c.saveError);
      return;
    }

    setSuccess(c.saved);
  };

  if (loading) {
    return (
      <section className="ambient-card p-6 md:p-8">
        <p className="text-sm font-semibold text-on-surface-variant">{c.loading}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">{c.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">{c.description}</p>
          </div>
          <button
            type="button"
            disabled={saving}
            className="inline-flex w-fit rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={saveSettings}
          >
            {saving ? c.saving : c.saveAll}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-md bg-primary-container/15 p-4 text-sm font-semibold text-primary" role="status">
            {success}
          </div>
        )}
      </div>

      <div className="ambient-card p-6 md:p-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-on-surface">{c.routineTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{c.routineDescription}</p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={guide.enabled}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              onChange={(event) => updateGuide("enabled", event.target.checked)}
            />
            {c.enabled}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            {textField(c.eyebrow, guide.eyebrow, (value) => updateGuide("eyebrow", value))}
            {textField(c.sectionTitle, guide.title, (value) => updateGuide("title", value))}
            <div className="md:col-span-2">
              {textField(c.subtitle, guide.subtitle, (value) => updateGuide("subtitle", value), true)}
            </div>
            {textField(c.stepsTitle, guide.stepsTitle, (value) => updateGuide("stepsTitle", value))}
            {textField(c.stepsBadge, guide.stepsBadge, (value) => updateGuide("stepsBadge", value))}
            <div className="md:col-span-2">
              {textField(
                c.routineTags,
                arrayToLines(guide.routineTags),
                (value) => updateGuide("routineTags", linesToArray(value)),
                true
              )}
            </div>
          </div>

          <details className="rounded-md bg-surface-container-low p-4">
            <summary className="cursor-pointer list-none">
              <h4 className="font-heading text-lg font-bold text-on-surface">{c.advancedSteps}</h4>
              <p className="mt-1 text-xs font-semibold text-on-surface-variant">{c.routeSteps}</p>
            </summary>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary-container/15"
                onClick={() =>
                  updateGuide("steps", [
                    ...guide.steps,
                    { number: String(guide.steps.length + 1).padStart(2, "0"), title: "", text: "" }
                  ])
                }
              >
                {c.addStep}
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              {guide.steps.map((step, index) => (
                <div key={`${step.number}-${index}`} className="rounded-md border border-outline-variant bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                    {textField(c.stepNumber, step.number, (value) => updateGuideStep(index, "number", value))}
                    {textField(c.stepTitle, step.title, (value) => updateGuideStep(index, "title", value))}
                    <div className="md:col-span-2">
                      {textField(c.stepText, step.text, (value) => updateGuideStep(index, "text", value), true)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => updateGuide("steps", moveArrayItem(guide.steps, index, "up"))}
                    >
                      {c.moveUp}
                    </button>
                    <button
                      type="button"
                      disabled={index === guide.steps.length - 1}
                      className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => updateGuide("steps", moveArrayItem(guide.steps, index, "down"))}
                    >
                      {c.moveDown}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-error/40 bg-white px-4 py-2 text-xs font-bold text-error transition hover:bg-error/10"
                      onClick={() =>
                        updateGuide(
                          "steps",
                          guide.steps.filter((_, stepIndex) => stepIndex !== index)
                        )
                      }
                    >
                      {c.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <div className="rounded-md bg-surface-container-low p-4">
            <h4 className="font-heading text-lg font-bold text-on-surface">{c.routeOptions}</h4>
            <div className="mt-4 grid gap-4">
              {guide.options.map((option, index) => {
                const firstLink = option.links[0] ?? { label: "", href: "" };
                const secondLink = option.links[1] ?? { label: "", href: "" };

                return (
                  <details
                    key={option.key || index}
                    className="rounded-md border border-outline-variant bg-white p-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <div>
                        <p className="font-heading text-base font-bold text-on-surface">
                          {option.label || `${c.routeOptions} ${index + 1}`}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-on-surface-variant">
                          {option.title || option.eyebrow}
                        </p>
                      </div>
                      <span className="rounded-full border border-outline-variant px-4 py-2 text-xs font-bold text-primary">
                        {c.editNode}
                      </span>
                    </summary>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {textField(c.optionLabel, option.label, (value) => updateGuideOption(index, "label", value))}
                      <label className="grid gap-2 text-sm font-semibold text-on-surface">
                        {c.optionIcon}
                        <select
                          className={inputClass}
                          value={option.icon}
                          onChange={(event) =>
                            updateGuideOption(index, "icon", normalizeHomepageDecisionGuideIconKey(event.target.value))
                          }
                        >
                          {homepageDecisionGuideIconKeys.map((icon) => (
                            <option key={icon} value={icon}>
                              {guideIconLabels[icon][language]}
                            </option>
                          ))}
                        </select>
                      </label>
                      {textField(c.optionEyebrow, option.eyebrow, (value) =>
                        updateGuideOption(index, "eyebrow", value)
                      )}
                      {textField(c.optionTitle, option.title, (value) => updateGuideOption(index, "title", value))}
                      <div className="md:col-span-2">
                        {textField(c.optionDescription, option.description, (value) =>
                          updateGuideOption(index, "description", value),
                          true
                        )}
                      </div>
                      <div className="grid gap-3 rounded-md bg-surface-container-low p-4 md:col-span-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{c.uploadImage}</p>
                            <p className="mt-1 text-xs font-semibold leading-5 text-on-surface-variant">
                              {c.imageUploadHelper}
                            </p>
                          </div>
                          <label className="inline-flex w-fit cursor-pointer rounded-full bg-primary px-5 py-2 text-xs font-bold text-white transition hover:bg-primary/90">
                            {uploadingImageKey === (option.key || String(index)) ? c.uploadingImage : c.uploadImage}
                            <input
                              accept="image/jpeg,image/png,image/webp"
                              className="sr-only"
                              disabled={uploadingImageKey === (option.key || String(index))}
                              type="file"
                              onChange={(event) => handleGuideOptionImageUpload(index, option, event)}
                            />
                          </label>
                        </div>
                        {option.image ? (
                          <div className="grid gap-3 rounded-md bg-white p-3 sm:grid-cols-[120px_1fr] sm:items-center">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-container-lowest">
                              <Image
                                src={option.image}
                                alt={option.imageAlt || option.label || c.currentImage}
                                fill
                                sizes="120px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                {c.currentImage}
                              </p>
                              <p className="mt-1 break-all text-xs leading-5 text-on-surface-variant">{option.image}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {textField(c.optionImageAlt, option.imageAlt, (value) =>
                        updateGuideOption(index, "imageAlt", value)
                      )}
                      <div className="md:col-span-2">
                        {textField(
                          c.optionDetails,
                          arrayToLines(option.details),
                          (value) => updateGuideOption(index, "details", linesToArray(value)),
                          true
                        )}
                      </div>
                      {textField(c.primaryLinkLabel, firstLink.label, (value) =>
                        updateGuideOptionLink(index, 0, "label", value)
                      )}
                      {textField(c.primaryLinkHref, firstLink.href, (value) =>
                        updateGuideOptionLink(index, 0, "href", value)
                      )}
                      {textField(c.secondaryLinkLabel, secondLink.label, (value) =>
                        updateGuideOptionLink(index, 1, "label", value)
                      )}
                      {textField(c.secondaryLinkHref, secondLink.href, (value) =>
                        updateGuideOptionLink(index, 1, "href", value)
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <details className="ambient-card p-6 md:p-8">
        <summary className="cursor-pointer list-none">
          <h3 className="font-heading text-2xl font-bold text-on-surface">{c.serviceTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{c.serviceDescription}</p>
        </summary>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={servicePromises.enabled}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              onChange={(event) => setServicePromises((current) => ({ ...current, enabled: event.target.checked }))}
            />
            {c.enabled}
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            {textField(c.eyebrow, servicePromises.eyebrow, (value) =>
              setServicePromises((current) => ({ ...current, eyebrow: value }))
            )}
            {textField(c.sectionTitle, servicePromises.title, (value) =>
              setServicePromises((current) => ({ ...current, title: value }))
            )}
            <div className="md:col-span-2">
              {textField(
                c.subtitle,
                servicePromises.description,
                (value) => setServicePromises((current) => ({ ...current, description: value })),
                true
              )}
            </div>
          </div>

          <div className="rounded-md bg-surface-container-low p-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-heading text-lg font-bold text-on-surface">{c.serviceItems}</h4>
              <button
                type="button"
                className="rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary-container/15"
                onClick={() =>
                  setServicePromises((current) => ({
                    ...current,
                    items: [
                      ...current.items,
                      {
                        key: `service-promise-${current.items.length + 1}`,
                        icon: "shield",
                        title: "",
                        text: ""
                      }
                    ]
                  }))
                }
              >
                {c.addItem}
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              {servicePromises.items.map((item, index) => (
                <div key={`${item.key}-${index}`} className="rounded-md border border-outline-variant bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                    <label className="grid gap-2 text-sm font-semibold text-on-surface">
                      {c.itemIcon}
                      <select
                        className={inputClass}
                        value={item.icon}
                        onChange={(event) =>
                          updateServicePromise(index, "icon", normalizeHomepageTrustBadgeIconKey(event.target.value))
                        }
                      >
                        {homepageTrustBadgeIconKeys.map((icon) => (
                          <option key={icon} value={icon}>
                            {iconLabels[icon][language]}
                          </option>
                        ))}
                      </select>
                    </label>
                    {textField(c.itemTitle, item.title, (value) => updateServicePromise(index, "title", value))}
                    <div className="md:col-span-2">
                      {textField(c.itemText, item.text, (value) => updateServicePromise(index, "text", value), true)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() =>
                        setServicePromises((current) => ({
                          ...current,
                          items: moveArrayItem(current.items, index, "up")
                        }))
                      }
                    >
                      {c.moveUp}
                    </button>
                    <button
                      type="button"
                      disabled={index === servicePromises.items.length - 1}
                      className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() =>
                        setServicePromises((current) => ({
                          ...current,
                          items: moveArrayItem(current.items, index, "down")
                        }))
                      }
                    >
                      {c.moveDown}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-error/40 bg-white px-4 py-2 text-xs font-bold text-error transition hover:bg-error/10"
                      onClick={() =>
                        setServicePromises((current) => ({
                          ...current,
                          items: current.items.filter((_, itemIndex) => itemIndex !== index)
                        }))
                      }
                    >
                      {c.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>

      <details className="ambient-card p-6 md:p-8">
        <summary className="cursor-pointer list-none">
          <h3 className="font-heading text-2xl font-bold text-on-surface">{c.newsletterTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{c.newsletterDescription}</p>
        </summary>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={newsletter.enabled}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              onChange={(event) => setNewsletter((current) => ({ ...current, enabled: event.target.checked }))}
            />
            {c.enabled}
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            {textField(c.eyebrow, newsletter.eyebrow, (value) =>
              setNewsletter((current) => ({ ...current, eyebrow: value }))
            )}
            {textField(c.sectionTitle, newsletter.title, (value) =>
              setNewsletter((current) => ({ ...current, title: value }))
            )}
            <div className="md:col-span-2">
              {textField(
                c.subtitle,
                newsletter.subtitle,
                (value) => setNewsletter((current) => ({ ...current, subtitle: value })),
                true
              )}
            </div>
            {textField(c.offerText, newsletter.offerText, (value) =>
              setNewsletter((current) => ({ ...current, offerText: value }))
            )}
            {textField(c.successTitle, newsletter.successTitle, (value) =>
              setNewsletter((current) => ({ ...current, successTitle: value }))
            )}
            <div className="md:col-span-2">
              {textField(
                c.successMessage,
                newsletter.successMessage,
                (value) => setNewsletter((current) => ({ ...current, successMessage: value })),
                true
              )}
            </div>
            {textField(c.editButtonText, newsletter.editButtonText, (value) =>
              setNewsletter((current) => ({ ...current, editButtonText: value }))
            )}
            {textField(c.placeholder, newsletter.placeholder, (value) =>
              setNewsletter((current) => ({ ...current, placeholder: value }))
            )}
            {textField(c.buttonText, newsletter.buttonText, (value) =>
              setNewsletter((current) => ({ ...current, buttonText: value }))
            )}
            {textField(c.submittingText, newsletter.submittingText, (value) =>
              setNewsletter((current) => ({ ...current, submittingText: value }))
            )}
            {textField(c.noteText, newsletter.noteText, (value) =>
              setNewsletter((current) => ({ ...current, noteText: value }))
            )}
            {textField(c.duplicateMessage, newsletter.duplicateMessage, (value) =>
              setNewsletter((current) => ({ ...current, duplicateMessage: value }))
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
