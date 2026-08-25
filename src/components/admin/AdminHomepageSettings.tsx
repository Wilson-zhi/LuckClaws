"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AdminGuard, useAdminAuth } from "@/components/admin/AdminGuard";
import { AdminHomepageAdvancedSettings } from "@/components/admin/AdminHomepageAdvancedSettings";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { type AdminLabelKey, useAdminLanguage } from "@/components/admin/admin-language";
import {
  buildHomepageCategorySectionValue,
  buildHomepageHeroValue,
  buildHomepageStorySectionValue,
  buildHomepageTrustBadgesValue,
  defaultHomepageCategorySection,
  defaultHomepageHero,
  defaultHomepageStorySection,
  homepageCategorySectionFromValue,
  homepageCategorySectionSettingKey,
  homepageHeroFromValue,
  homepageHeroSettingKey,
  homepageStoryIconKeys,
  homepageStorySectionFromValue,
  homepageStorySectionSettingKey,
  homepageTrustBadgeIconKeys,
  homepageTrustBadgesFromValue,
  homepageTrustBadgesSettingKey,
  normalizeHomepageTrustBadgeIconKey,
  normalizeHomepageStoryIconKey,
  type HomepageCategorySectionContent,
  type HomepageCategorySectionLayout,
  type HomepageHeroContent,
  type HomepageStoryIconKey,
  type HomepageStoryItem,
  type HomepageStorySectionContent,
  type HomepageTrustBadge,
  type HomepageTrustBadgeIconKey
} from "@/lib/homepage-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { requestStorefrontRevalidation } from "@/lib/storefront-revalidation-client";

type HomepageSettingRow = {
  key: string | null;
  value: unknown;
};

type EditableTrustBadge = HomepageTrustBadge & {
  id: string;
};

type EditableStoryItem = HomepageStoryItem & {
  id: string;
};

type HomepageCategoryRow = {
  name: string | null;
  slug: string | null;
  status: string | null;
  sort_order: number | string | null;
  show_on_home: boolean | null;
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-32 w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const HOMEPAGE_IMAGE_BUCKET = "homepage-images";
const MAX_HOMEPAGE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_HOMEPAGE_VIDEO_SIZE_BYTES = 80 * 1024 * 1024;
const acceptedHomepageImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const acceptedHomepageVideoTypes = new Set(["video/mp4", "video/webm"]);

const iconLabelKeys = {
  truck: "iconTruck",
  shield: "iconShield",
  heart: "iconHeart",
  star: "iconStar",
  sparkles: "iconSparkles",
  leaf: "iconLeaf",
  package: "iconPackage",
  check: "iconCheck",
  rotate: "iconRotate",
  lock: "iconLock"
} as const satisfies Record<HomepageTrustBadgeIconKey, AdminLabelKey>;

const homepageCategorySectionCopy = {
  zh: {
    title: "首页分类模块",
    description: "控制首页分类卡片的标题、布局、数量和显示哪些分类。",
    showSection: "显示该模块",
    sectionTitle: "标题",
    subtitle: "副标题",
    ctaText: "按钮文字",
    ctaHref: "按钮链接",
    layout: "布局",
    grid4: "四列网格",
    carousel: "横向滚动",
    maxItems: "最多显示数量",
    selectCategories: "选择首页显示的分类",
    save: "保存分类模块",
    saved: "分类模块已保存。",
    unableToSave: "无法保存分类模块。",
    unableToLoadCategories: "无法加载分类选项。",
    noActiveCategories: "暂无可选择的启用分类。",
    selectedCount: "已选择",
    categoryCountUnit: "个分类"
  },
  en: {
    title: "Homepage Category Section",
    description: "Control the homepage category card title, layout, count, and selected categories.",
    showSection: "Show this section",
    sectionTitle: "Title",
    subtitle: "Subtitle",
    ctaText: "Button text",
    ctaHref: "Button link",
    layout: "Layout",
    grid4: "4-card grid",
    carousel: "Carousel",
    maxItems: "Max items",
    selectCategories: "Select categories shown on homepage",
    save: "Save category section",
    saved: "Category section saved.",
    unableToSave: "Unable to save category section.",
    unableToLoadCategories: "Unable to load category options.",
    noActiveCategories: "No active categories are available.",
    selectedCount: "Selected",
    categoryCountUnit: "categories"
  }
} as const;

const homepageHeroMediaCopy = {
  zh: {
    mediaMode: "首页媒体模式",
    imageMode: "图片模式",
    videoMode: "视频模式",
    heroVideoUrl: "首页视频链接",
    uploadHeroVideo: "上传首页视频",
    videoUploadHelper: "支持 MP4、WebM，最大 80MB。上传成功后会自动填入视频链接。",
    videoUploaded: "首页视频已上传。",
    unableToUploadVideo: "无法上传首页视频。",
    chooseValidVideo: "请选择 MP4 或 WebM 视频。",
    videoSizeLimit: "视频不能超过 80MB。",
    noHomepageVideo: "暂无首页视频。视频模式下可以上传视频或粘贴视频链接。",
    heroVideoPreview: "首页视频预览",
    mediaModeHelper: "图片模式只显示 Hero 图片；视频模式优先显示视频，并使用 Hero 图片作为封面。"
  },
  en: {
    mediaMode: "Homepage media mode",
    imageMode: "Image mode",
    videoMode: "Video mode",
    heroVideoUrl: "Hero video URL",
    uploadHeroVideo: "Upload hero video",
    videoUploadHelper: "Supports MP4 and WebM up to 80MB. A successful upload automatically fills the video URL.",
    videoUploaded: "Homepage video uploaded.",
    unableToUploadVideo: "Unable to upload homepage video.",
    chooseValidVideo: "Choose an MP4 or WebM video.",
    videoSizeLimit: "Video must be 80MB or smaller.",
    noHomepageVideo: "No homepage video yet. In video mode, upload a video or paste a video URL.",
    heroVideoPreview: "Hero video preview",
    mediaModeHelper: "Image mode shows the Hero image only. Video mode shows the video first and uses the Hero image as its poster."
  }
} as const;

const homepageStorySectionCopy = {
  zh: {
    title: "首页品牌承诺模块",
    description: "编辑首页的品牌说明、购买理由和导购承诺。",
    showSection: "显示该模块",
    eyebrow: "小标题",
    sectionTitle: "标题",
    subtitle: "说明文字",
    ctaLabel: "按钮文字",
    ctaHref: "按钮链接",
    items: "内容卡片",
    itemIcon: "图标",
    itemTitle: "卡片标题",
    itemText: "卡片说明",
    addItem: "添加卡片",
    noItems: "暂无卡片。前台会使用安全备用内容。",
    save: "保存品牌承诺模块",
    saved: "品牌承诺模块已保存。",
    unableToSave: "无法保存品牌承诺模块。"
  },
  en: {
    title: "Homepage Brand Promise",
    description: "Edit the homepage brand story, purchase reasons, and shopping promises.",
    showSection: "Show this section",
    eyebrow: "Eyebrow",
    sectionTitle: "Title",
    subtitle: "Subtitle",
    ctaLabel: "Button text",
    ctaHref: "Button link",
    items: "Content cards",
    itemIcon: "Icon",
    itemTitle: "Card title",
    itemText: "Card text",
    addItem: "Add card",
    noItems: "No cards. The storefront will use safe fallback content.",
    save: "Save brand promise",
    saved: "Brand promise section saved.",
    unableToSave: "Unable to save brand promise section."
  }
} as const;

const storyIconLabels = {
  route: { zh: "路线", en: "Route" },
  search: { zh: "搜索", en: "Search" },
  heart: { zh: "爱心", en: "Heart" },
  shield: { zh: "盾牌", en: "Shield" },
  check: { zh: "确认", en: "Check" },
  sparkles: { zh: "闪光", en: "Sparkles" },
  truck: { zh: "卡车", en: "Truck" },
  package: { zh: "包裹", en: "Package" },
  leaf: { zh: "叶子", en: "Leaf" },
  lock: { zh: "锁", en: "Lock" }
} as const satisfies Record<HomepageStoryIconKey, { zh: string; en: string }>;

function createBadgeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `badge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function editableBadgesFromValue(value: unknown): EditableTrustBadge[] {
  return homepageTrustBadgesFromValue(value).map((badge) => ({
    ...badge,
    id: createBadgeId()
  }));
}

function editableStoryItemsFromValue(value: unknown): EditableStoryItem[] {
  return homepageStorySectionFromValue(value).items.map((item) => ({
    ...item,
    id: createBadgeId()
  }));
}

function settingRowsByKey(rows: HomepageSettingRow[]) {
  return new Map(rows.map((row) => [row.key, row.value]));
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
  return sanitizePathSegment(fileName) || "homepage-image";
}

function HeroField({
  label,
  value,
  textarea = false,
  onChange
}: {
  label: string;
  value: string;
  textarea?: boolean;
  onChange: (value: string) => void;
}) {
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

function AdminHomepageFormContent() {
  const { accessToken } = useAdminAuth();
  const { t, language } = useAdminLanguage();
  const categoryCopy = homepageCategorySectionCopy[language];
  const heroMediaCopy = homepageHeroMediaCopy[language];
  const storyCopy = homepageStorySectionCopy[language];
  const supabase = getSupabaseBrowserClient();
  const [hero, setHero] = useState<HomepageHeroContent>(defaultHomepageHero);
  const [badges, setBadges] = useState<EditableTrustBadge[]>([]);
  const [storySection, setStorySection] = useState<HomepageStorySectionContent>(defaultHomepageStorySection);
  const [storyItems, setStoryItems] = useState<EditableStoryItem[]>(
    defaultHomepageStorySection.items.map((item) => ({ ...item, id: createBadgeId() }))
  );
  const [categorySection, setCategorySection] =
    useState<HomepageCategorySectionContent>(defaultHomepageCategorySection);
  const [activeCategories, setActiveCategories] = useState<HomepageCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCategorySection, setSavingCategorySection] = useState(false);
  const [savingStorySection, setSavingStorySection] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [videoUploadMessage, setVideoUploadMessage] = useState("");
  const [videoUploadError, setVideoUploadError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categoryLoadError, setCategoryLoadError] = useState("");
  const [categorySaveError, setCategorySaveError] = useState("");
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("");
  const [storySaveError, setStorySaveError] = useState("");
  const [storySuccessMessage, setStorySuccessMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError(t("supabaseMissing"));
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadHomepageSettings() {
      try {
        const [settingsResult, categoriesResult] = await Promise.all([
          browserSupabase
            .from("homepage_settings")
            .select("key, value")
            .in("key", [
              homepageHeroSettingKey,
              homepageTrustBadgesSettingKey,
              homepageCategorySectionSettingKey,
              homepageStorySectionSettingKey
            ]),
          browserSupabase
            .from("product_categories")
            .select("name, slug, status, sort_order, show_on_home")
            .eq("status", "active")
            .order("sort_order", { ascending: true, nullsFirst: false })
        ]);

        if (settingsResult.error) {
          throw settingsResult.error;
        }

        if (!active) {
          return;
        }

        const rowsByKey = settingRowsByKey((settingsResult.data ?? []) as HomepageSettingRow[]);

        setHero(homepageHeroFromValue(rowsByKey.get(homepageHeroSettingKey)));
        setBadges(editableBadgesFromValue(rowsByKey.get(homepageTrustBadgesSettingKey)));
        setCategorySection(homepageCategorySectionFromValue(rowsByKey.get(homepageCategorySectionSettingKey)));
        setStorySection(homepageStorySectionFromValue(rowsByKey.get(homepageStorySectionSettingKey)));
        setStoryItems(editableStoryItemsFromValue(rowsByKey.get(homepageStorySectionSettingKey)));

        if (categoriesResult.error) {
          setCategoryLoadError(categoryCopy.unableToLoadCategories);
          setActiveCategories([]);
        } else {
          setCategoryLoadError("");
          setActiveCategories((categoriesResult.data ?? []) as HomepageCategoryRow[]);
        }
      } catch (loadError: unknown) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t("unableToLoadHomepage"));
          setHero(defaultHomepageHero);
          setBadges(editableBadgesFromValue(undefined));
          setCategorySection(defaultHomepageCategorySection);
          setStorySection(defaultHomepageStorySection);
          setStoryItems(defaultHomepageStorySection.items.map((item) => ({ ...item, id: createBadgeId() })));
          setActiveCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHomepageSettings();

    return () => {
      active = false;
    };
  }, [categoryCopy.unableToLoadCategories, supabase, t]);

  const savedBadges = useMemo(
    () =>
      badges
        .map((badge) => ({
          key: badge.key,
          icon: normalizeHomepageTrustBadgeIconKey(badge.icon),
          title: badge.title
        }))
        .filter((badge) => badge.title.trim()),
    [badges]
  );

  const updateHeroField = (field: keyof HomepageHeroContent, value: string) => {
    setHero((currentHero) => ({
      ...currentHero,
      [field]: value
    }));
  };

  const updateHeroMediaMode = (mediaMode: HomepageHeroContent["mediaMode"]) => {
    setHero((currentHero) => ({
      ...currentHero,
      mediaMode
    }));
  };

  const updateCategorySectionField = (
    field: keyof HomepageCategorySectionContent,
    value: string | boolean | number | HomepageCategorySectionLayout
  ) => {
    setCategorySaveError("");
    setCategorySuccessMessage("");
    setCategorySection((currentCategorySection) => ({
      ...currentCategorySection,
      [field]: value
    }));
  };

  const updateStorySectionField = (
    field: keyof Omit<HomepageStorySectionContent, "items">,
    value: string | boolean
  ) => {
    setStorySaveError("");
    setStorySuccessMessage("");
    setStorySection((currentStorySection) => ({
      ...currentStorySection,
      [field]: value
    }));
  };

  const updateStoryItem = (id: string, field: keyof HomepageStoryItem, value: string) => {
    setStorySaveError("");
    setStorySuccessMessage("");
    setStoryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "icon" ? normalizeHomepageStoryIconKey(value) : value
            }
          : item
      )
    );
  };

  const addStoryItem = () => {
    setStoryItems((currentItems) => [
      ...currentItems,
      {
        id: createBadgeId(),
        key: `story-item-${currentItems.length + 1}`,
        icon: "heart",
        title: "",
        text: ""
      }
    ]);
  };

  const removeStoryItem = (id: string) => {
    setStoryItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const moveStoryItem = (id: string, direction: "up" | "down") => {
    setStoryItems((currentItems) => {
      const index = currentItems.findIndex((item) => item.id === id);
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= currentItems.length) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const [movedItem] = nextItems.splice(index, 1);

      nextItems.splice(nextIndex, 0, movedItem);

      return nextItems;
    });
  };

  const toggleSelectedCategorySlug = (slug: string, checked: boolean) => {
    setCategorySaveError("");
    setCategorySuccessMessage("");
    setCategorySection((currentCategorySection) => {
      const currentSlugs = currentCategorySection.selectedCategorySlugs.filter(Boolean);

      return {
        ...currentCategorySection,
        selectedCategorySlugs: checked
          ? Array.from(new Set([...currentSlugs, slug]))
          : currentSlugs.filter((currentSlug) => currentSlug !== slug)
      };
    });
  };

  const updateBadge = (id: string, field: keyof HomepageTrustBadge, value: string) => {
    setBadges((currentBadges) =>
      currentBadges.map((badge) =>
        badge.id === id
          ? {
              ...badge,
              [field]: field === "icon" ? normalizeHomepageTrustBadgeIconKey(value) : value
            }
          : badge
      )
    );
  };

  const addBadge = () => {
    setBadges((currentBadges) => [
      ...currentBadges,
      {
        id: createBadgeId(),
        key: `trust-badge-${currentBadges.length + 1}`,
        icon: "truck",
        title: ""
      }
    ]);
  };

  const removeBadge = (id: string) => {
    setBadges((currentBadges) => currentBadges.filter((badge) => badge.id !== id));
  };

  const moveBadge = (id: string, direction: "up" | "down") => {
    setBadges((currentBadges) => {
      const index = currentBadges.findIndex((badge) => badge.id === id);
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= currentBadges.length) {
        return currentBadges;
      }

      const nextBadges = [...currentBadges];
      const [movedBadge] = nextBadges.splice(index, 1);

      nextBadges.splice(nextIndex, 0, movedBadge);

      return nextBadges;
    });
  };

  const uploadHomepageImage = async (file: File) => {
    if (!supabase) {
      throw new Error(t("uploadConfigMissing"));
    }

    if (!acceptedHomepageImageTypes.has(file.type)) {
      throw new Error(t("chooseValidImage"));
    }

    if (file.size > MAX_HOMEPAGE_IMAGE_SIZE_BYTES) {
      throw new Error(t("imageSizeLimit"));
    }

    const storagePath = `homepage/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadErrorResult } = await supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (uploadErrorResult) {
      throw uploadErrorResult;
    }

    const { data } = supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  };

  const uploadHomepageVideo = async (file: File) => {
    if (!supabase) {
      throw new Error(t("uploadConfigMissing"));
    }

    if (!acceptedHomepageVideoTypes.has(file.type)) {
      throw new Error(heroMediaCopy.chooseValidVideo);
    }

    if (file.size > MAX_HOMEPAGE_VIDEO_SIZE_BYTES) {
      throw new Error(heroMediaCopy.videoSizeLimit);
    }

    const storagePath = `homepage/videos/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadErrorResult } = await supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (uploadErrorResult) {
      throw uploadErrorResult;
    }

    const { data } = supabase.storage.from(HOMEPAGE_IMAGE_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  };

  const handleHeroImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setUploadMessage("");
    setUploadError("");

    if (!file) {
      return;
    }

    setUploadingHeroImage(true);

    try {
      const publicUrl = await uploadHomepageImage(file);

      updateHeroField("imageUrl", publicUrl);
      setUploadMessage(t("homepageImageUploaded"));
    } catch (uploadErrorResult: unknown) {
      setUploadError(
        uploadErrorResult instanceof Error ? uploadErrorResult.message : t("unableToUploadHomepageImage")
      );
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleHeroVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setVideoUploadMessage("");
    setVideoUploadError("");

    if (!file) {
      return;
    }

    setUploadingHeroVideo(true);

    try {
      const publicUrl = await uploadHomepageVideo(file);

      updateHeroField("videoUrl", publicUrl);
      updateHeroMediaMode("video");
      setVideoUploadMessage(heroMediaCopy.videoUploaded);
    } catch (uploadErrorResult: unknown) {
      setVideoUploadError(
        uploadErrorResult instanceof Error ? uploadErrorResult.message : heroMediaCopy.unableToUploadVideo
      );
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError(t("supabaseMissing"));
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    const { error: saveError } = await supabase.from("homepage_settings").upsert(
      [
        {
          key: homepageHeroSettingKey,
          status: "active",
          value: buildHomepageHeroValue(hero)
        },
        {
          key: homepageTrustBadgesSettingKey,
          status: "active",
          value: buildHomepageTrustBadgesValue(savedBadges)
        }
      ],
      { onConflict: "key" }
    );

    if (saveError) {
      setSaving(false);
      setError(saveError.message || t("unableToSaveHomepage"));
      return;
    }

    try {
      await requestStorefrontRevalidation(accessToken, "homepage");
    } catch (revalidationError) {
      setSaving(false);
      setError(
        revalidationError instanceof Error
          ? `Content was saved, but the storefront refresh failed: ${revalidationError.message}`
          : "Content was saved, but the storefront refresh failed."
      );
      return;
    }

    setSaving(false);
    setSuccessMessage(t("homepageSaved"));
  };

  const saveCategorySection = async () => {
    if (!supabase) {
      setCategorySaveError(t("supabaseMissing"));
      return;
    }

    setSavingCategorySection(true);
    setCategorySaveError("");
    setCategorySuccessMessage("");

    const { error: saveError } = await supabase.from("homepage_settings").upsert(
      [
        {
          key: homepageCategorySectionSettingKey,
          status: "active",
          value: buildHomepageCategorySectionValue(categorySection)
        }
      ],
      { onConflict: "key" }
    );

    if (saveError) {
      setSavingCategorySection(false);
      setCategorySaveError(saveError.message || categoryCopy.unableToSave);
      return;
    }

    try {
      await requestStorefrontRevalidation(accessToken, "homepage");
    } catch (revalidationError) {
      setSavingCategorySection(false);
      setCategorySaveError(
        revalidationError instanceof Error
          ? `Content was saved, but the storefront refresh failed: ${revalidationError.message}`
          : "Content was saved, but the storefront refresh failed."
      );
      return;
    }

    setSavingCategorySection(false);
    setCategorySuccessMessage(categoryCopy.saved);
  };

  const saveStorySection = async () => {
    if (!supabase) {
      setStorySaveError(t("supabaseMissing"));
      return;
    }

    setSavingStorySection(true);
    setStorySaveError("");
    setStorySuccessMessage("");

    const storyValue: HomepageStorySectionContent = {
      ...storySection,
      items: storyItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        title: item.title,
        text: item.text
      }))
    };

    const { error: saveError } = await supabase.from("homepage_settings").upsert(
      [
        {
          key: homepageStorySectionSettingKey,
          status: "active",
          value: buildHomepageStorySectionValue(storyValue)
        }
      ],
      { onConflict: "key" }
    );

    if (saveError) {
      setSavingStorySection(false);
      setStorySaveError(saveError.message || storyCopy.unableToSave);
      return;
    }

    try {
      await requestStorefrontRevalidation(accessToken, "homepage");
    } catch (revalidationError) {
      setSavingStorySection(false);
      setStorySaveError(
        revalidationError instanceof Error
          ? `Content was saved, but the storefront refresh failed: ${revalidationError.message}`
          : "Content was saved, but the storefront refresh failed."
      );
      return;
    }

    setSavingStorySection(false);
    setStorySection(storyValue);
    setStorySuccessMessage(storyCopy.saved);
  };

  const handleBadgeIconChange = (id: string) => (event: ChangeEvent<HTMLSelectElement>) => {
    updateBadge(id, "icon", event.target.value);
  };

  const selectedCategorySlugSet = new Set(categorySection.selectedCategorySlugs);

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        {t("loadingHomepage")}
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="ambient-card border border-error/30 p-4 text-sm font-semibold text-error" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="ambient-card border border-primary/20 p-4 text-sm font-semibold text-primary" role="status">
          {successMessage}
        </div>
      )}

      <section className="ambient-card p-6 md:p-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">{t("heroContent")}</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t("homepageContentDescription")}</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <HeroField label={t("heroEyebrow")} value={hero.eyebrow} onChange={(value) => updateHeroField("eyebrow", value)} />
          <HeroField label={t("heroTitle")} value={hero.title} onChange={(value) => updateHeroField("title", value)} />
          <div className="md:col-span-2">
            <HeroField
              textarea
              label={t("heroSubtitle")}
              value={hero.subtitle}
              onChange={(value) => updateHeroField("subtitle", value)}
            />
          </div>
          <HeroField
            label={t("primaryButtonText")}
            value={hero.primaryButtonText}
            onChange={(value) => updateHeroField("primaryButtonText", value)}
          />
          <HeroField
            label={t("primaryButtonLink")}
            value={hero.primaryButtonLink}
            onChange={(value) => updateHeroField("primaryButtonLink", value)}
          />
          <HeroField
            label={t("secondaryButtonText")}
            value={hero.secondaryButtonText}
            onChange={(value) => updateHeroField("secondaryButtonText", value)}
          />
          <HeroField
            label={t("secondaryButtonLink")}
            value={hero.secondaryButtonLink}
            onChange={(value) => updateHeroField("secondaryButtonLink", value)}
          />
          <div className="grid gap-3 rounded-md bg-surface-container-low p-4 md:col-span-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {heroMediaCopy.mediaMode}
              <select
                className={inputClass}
                value={hero.mediaMode}
                onChange={(event) =>
                  updateHeroMediaMode(event.target.value === "video" ? "video" : "image")
                }
              >
                <option value="image">{heroMediaCopy.imageMode}</option>
                <option value="video">{heroMediaCopy.videoMode}</option>
              </select>
            </label>
            <p className="text-xs font-semibold leading-5 text-on-surface-variant">
              {heroMediaCopy.mediaModeHelper}
            </p>
          </div>
          <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-on-surface">
                {t("uploadHomepageImage")}
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-heading file:text-sm file:font-bold file:text-white hover:file:bg-primary/90"
                  disabled={uploadingHeroImage}
                  type="file"
                  onChange={handleHeroImageUpload}
                />
              </label>
              <p className="text-xs font-semibold leading-5 text-on-surface-variant">
                {t("homepageImageUploadHelper")}
              </p>
              {uploadingHeroImage && (
                <p className="text-sm font-semibold text-on-surface-variant">{t("uploadingImage")}</p>
              )}
              {uploadMessage && (
                <p className="text-sm font-semibold text-primary" role="status">
                  {uploadMessage}
                </p>
              )}
              {uploadError && (
                <p className="text-sm font-semibold text-error" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            {hero.imageUrl ? (
              <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-surface-container-lowest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.imageUrl} alt={hero.imageAlt || t("heroImagePreview")} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("heroImageUrl")}</p>
                  <p className="mt-1 break-all text-sm leading-6 text-on-surface-variant">{hero.imageUrl}</p>
                </div>
              </div>
            ) : (
              <p className="rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
                {t("noHomepageImage")}
              </p>
            )}
          </div>
          <div className="grid gap-4 rounded-md bg-surface-container-low p-4 md:col-span-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {heroMediaCopy.heroVideoUrl}
              <input
                className={inputClass}
                value={hero.videoUrl}
                onChange={(event) => updateHeroField("videoUrl", event.target.value)}
              />
            </label>

            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-on-surface">
                {heroMediaCopy.uploadHeroVideo}
                <input
                  accept="video/mp4,video/webm"
                  className="block w-full rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-heading file:text-sm file:font-bold file:text-white hover:file:bg-primary/90"
                  disabled={uploadingHeroVideo}
                  type="file"
                  onChange={handleHeroVideoUpload}
                />
              </label>
              <p className="text-xs font-semibold leading-5 text-on-surface-variant">
                {heroMediaCopy.videoUploadHelper}
              </p>
              {uploadingHeroVideo && (
                <p className="text-sm font-semibold text-on-surface-variant">{t("uploadingImage")}</p>
              )}
              {videoUploadMessage && (
                <p className="text-sm font-semibold text-primary" role="status">
                  {videoUploadMessage}
                </p>
              )}
              {videoUploadError && (
                <p className="text-sm font-semibold text-error" role="alert">
                  {videoUploadError}
                </p>
              )}
            </div>

            {hero.videoUrl ? (
              <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center">
                <div className="aspect-video overflow-hidden rounded-md bg-black">
                  <video
                    src={hero.videoUrl}
                    poster={hero.imageUrl || undefined}
                    className="h-full w-full object-cover"
                    controls
                    muted
                    playsInline
                  >
                    {heroMediaCopy.heroVideoPreview}
                  </video>
                </div>
                <p className="break-all text-sm leading-6 text-on-surface-variant">{hero.videoUrl}</p>
              </div>
            ) : (
              <p className="rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
                {heroMediaCopy.noHomepageVideo}
              </p>
            )}
          </div>
          <HeroField
            label={t("heroImageAltText")}
            value={hero.imageAlt}
            onChange={(value) => updateHeroField("imageAlt", value)}
          />
          <HeroField
            label={t("featuredLabel")}
            value={hero.featuredLabel}
            onChange={(value) => updateHeroField("featuredLabel", value)}
          />
          <HeroField
            label={t("featuredText")}
            value={hero.featuredText}
            onChange={(value) => updateHeroField("featuredText", value)}
          />
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">{t("trustBadges")}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{t("trustBadgesDescription")}</p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit rounded-full bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
            onClick={addBadge}
          >
            {t("addBadge")}
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {badges.length === 0 ? (
            <p className="rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface-variant">
              {t("noTrustBadges")}
            </p>
          ) : (
            badges.map((badge, index) => (
              <div key={badge.id} className="rounded-md border border-outline-variant bg-surface-container-low p-4">
                <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <label className="grid gap-2 text-sm font-semibold text-on-surface">
                    {t("trustBadgeIcon")}
                    <select className={inputClass} value={badge.icon} onChange={handleBadgeIconChange(badge.id)}>
                      {homepageTrustBadgeIconKeys.map((icon) => (
                        <option key={icon} value={icon}>
                          {t(iconLabelKeys[icon])}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-on-surface">
                    {t("trustBadgeTitle")}
                    <input
                      className={inputClass}
                      value={badge.title}
                      onChange={(event) => updateBadge(badge.id, "title", event.target.value)}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={index === 0}
                    onClick={() => moveBadge(badge.id, "up")}
                  >
                    {t("moveUp")}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={index === badges.length - 1}
                    onClick={() => moveBadge(badge.id, "down")}
                  >
                    {t("moveDown")}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-error/40 bg-white px-4 py-2 text-xs font-bold text-error transition hover:bg-error/10"
                    onClick={() => removeBadge(badge.id)}
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">{categoryCopy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{categoryCopy.description}</p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={categorySection.enabled}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              onChange={(event) => updateCategorySectionField("enabled", event.target.checked)}
            />
            {categoryCopy.showSection}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <HeroField
              label={categoryCopy.sectionTitle}
              value={categorySection.title}
              onChange={(value) => updateCategorySectionField("title", value)}
            />
            <HeroField
              label={categoryCopy.subtitle}
              value={categorySection.subtitle}
              onChange={(value) => updateCategorySectionField("subtitle", value)}
            />
            <HeroField
              label={categoryCopy.ctaText}
              value={categorySection.ctaText}
              onChange={(value) => updateCategorySectionField("ctaText", value)}
            />
            <HeroField
              label={categoryCopy.ctaHref}
              value={categorySection.ctaHref}
              onChange={(value) => updateCategorySectionField("ctaHref", value)}
            />
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {categoryCopy.layout}
              <select
                className={inputClass}
                value={categorySection.layout}
                onChange={(event) =>
                  updateCategorySectionField("layout", event.target.value as HomepageCategorySectionLayout)
                }
              >
                <option value="grid_4">{categoryCopy.grid4}</option>
                <option value="carousel">{categoryCopy.carousel}</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              {categoryCopy.maxItems}
              <input
                className={inputClass}
                min={1}
                max={12}
                type="number"
                value={categorySection.maxItems}
                onChange={(event) =>
                  updateCategorySectionField(
                    "maxItems",
                    Number.isFinite(event.target.valueAsNumber) ? event.target.valueAsNumber : 4
                  )
                }
              />
            </label>
          </div>

          <div className="rounded-md bg-surface-container-low p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="font-heading text-lg font-bold text-on-surface">{categoryCopy.selectCategories}</h3>
              <p className="text-sm font-semibold text-on-surface-variant">
                {categoryCopy.selectedCount} {categorySection.selectedCategorySlugs.length}{" "}
                {categoryCopy.categoryCountUnit}
              </p>
            </div>

            {categoryLoadError && (
              <div className="mt-4 rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
                {categoryLoadError}
              </div>
            )}

            {activeCategories.length === 0 ? (
              <p className="mt-4 rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
                {categoryCopy.noActiveCategories}
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeCategories.map((category) => {
                  const slug = category.slug?.trim() ?? "";

                  if (!slug) {
                    return null;
                  }

                  return (
                    <label
                      key={slug}
                      className="flex items-center gap-3 rounded-md border border-outline-variant bg-white p-4 text-sm font-semibold text-on-surface transition hover:border-primary"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategorySlugSet.has(slug)}
                        className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                        onChange={(event) => toggleSelectedCategorySlug(slug, event.target.checked)}
                      />
                      <span>
                        {category.name?.trim() || slug}
                        <span className="ml-2 text-xs font-normal text-on-surface-variant">/{slug}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {categorySaveError && (
            <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
              {categorySaveError}
            </div>
          )}

          {categorySuccessMessage && (
            <div className="rounded-md bg-primary-container/15 p-4 text-sm font-semibold text-primary" role="status">
              {categorySuccessMessage}
            </div>
          )}

          <button
            type="button"
            disabled={savingCategorySection}
            className="inline-flex w-fit rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={saveCategorySection}
          >
            {savingCategorySection ? t("saving") : categoryCopy.save}
          </button>
        </div>
      </section>

      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">{storyCopy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{storyCopy.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit rounded-full bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary/90"
            onClick={addStoryItem}
          >
            {storyCopy.addItem}
          </button>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 rounded-md bg-surface-container-low p-4 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={storySection.enabled}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              onChange={(event) => updateStorySectionField("enabled", event.target.checked)}
            />
            {storyCopy.showSection}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <HeroField
              label={storyCopy.eyebrow}
              value={storySection.eyebrow}
              onChange={(value) => updateStorySectionField("eyebrow", value)}
            />
            <HeroField
              label={storyCopy.sectionTitle}
              value={storySection.title}
              onChange={(value) => updateStorySectionField("title", value)}
            />
            <div className="md:col-span-2">
              <HeroField
                textarea
                label={storyCopy.subtitle}
                value={storySection.subtitle}
                onChange={(value) => updateStorySectionField("subtitle", value)}
              />
            </div>
            <HeroField
              label={storyCopy.ctaLabel}
              value={storySection.ctaLabel}
              onChange={(value) => updateStorySectionField("ctaLabel", value)}
            />
            <HeroField
              label={storyCopy.ctaHref}
              value={storySection.ctaHref}
              onChange={(value) => updateStorySectionField("ctaHref", value)}
            />
          </div>

          <div className="rounded-md bg-surface-container-low p-4">
            <h3 className="font-heading text-lg font-bold text-on-surface">{storyCopy.items}</h3>
            {storyItems.length === 0 ? (
              <p className="mt-4 rounded-md bg-white p-4 text-sm font-semibold text-on-surface-variant">
                {storyCopy.noItems}
              </p>
            ) : (
              <div className="mt-4 grid gap-4">
                {storyItems.map((item, index) => (
                  <div key={item.id} className="rounded-md border border-outline-variant bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                      <label className="grid gap-2 text-sm font-semibold text-on-surface">
                        {storyCopy.itemIcon}
                        <select
                          className={inputClass}
                          value={item.icon}
                          onChange={(event) => updateStoryItem(item.id, "icon", event.target.value)}
                        >
                          {homepageStoryIconKeys.map((icon) => (
                            <option key={icon} value={icon}>
                              {storyIconLabels[icon][language]}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-on-surface">
                        {storyCopy.itemTitle}
                        <input
                          className={inputClass}
                          value={item.title}
                          onChange={(event) => updateStoryItem(item.id, "title", event.target.value)}
                        />
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-on-surface md:col-span-2">
                        {storyCopy.itemText}
                        <textarea
                          className={textareaClass}
                          value={item.text}
                          onChange={(event) => updateStoryItem(item.id, "text", event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={index === 0}
                        onClick={() => moveStoryItem(item.id, "up")}
                      >
                        {t("moveUp")}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={index === storyItems.length - 1}
                        onClick={() => moveStoryItem(item.id, "down")}
                      >
                        {t("moveDown")}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-error/40 bg-white px-4 py-2 text-xs font-bold text-error transition hover:bg-error/10"
                        onClick={() => removeStoryItem(item.id)}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {storySaveError && (
            <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
              {storySaveError}
            </div>
          )}

          {storySuccessMessage && (
            <div className="rounded-md bg-primary-container/15 p-4 text-sm font-semibold text-primary" role="status">
              {storySuccessMessage}
            </div>
          )}

          <button
            type="button"
            disabled={savingStorySection}
            className="inline-flex w-fit rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={saveStorySection}
          >
            {savingStorySection ? t("saving") : storyCopy.save}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-full bg-primary px-7 py-3 font-heading font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t("saving") : t("saveHomepage")}
        </button>
      </div>
    </form>
  );
}

export function AdminHomepageSettings() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame
          title={{ zh: "首页", en: "Homepage" }}
          description={{ zh: "管理首页内容和信任标识。", en: "Manage homepage hero content and trust badges." }}
          backLink
        >
          <div className="space-y-6">
            <AdminHomepageFormContent />
            <AdminHomepageAdvancedSettings />
          </div>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
