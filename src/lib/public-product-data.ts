import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  bestSellers as staticBestSellers,
  brandName,
  categories as staticCategories,
  getProductBySlug,
  mainProduct as staticMainProduct,
  newArrivals as staticNewArrivals,
  products as staticProducts,
  type ProductAccordionSection,
  type ProductDetailRow,
  type ProductFaq,
  type ProductHighlight,
  type Product
} from "@/data/products";
import { collectionConfigs, type CollectionConfig } from "@/data/collections";
import { topLevelNavigation, type NavigationItem } from "@/data/navigation";
import { categorySlugFromName } from "@/lib/admin-categories";
import { normalizeProductHighlightIconKey } from "@/lib/product-highlight-icons";
import { DEFAULT_SHIPPING_RATE, standardShippingSentence } from "@/lib/shipping";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type PublicInventoryStatus = Product["availability"];
type PublicHomepageSection = NonNullable<Product["homepageSection"]>;

type SupabaseProductRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  category_slug: string | null;
  description: string | null;
  price: number | string | null;
  compare_at_price: number | string | null;
  currency: string | null;
  image_url: string | null;
  image_alt?: string | null;
  images?: unknown;
  variants?: unknown;
  status: string | null;
  inventory_status: string | null;
  stock_quantity: number | string | null;
  is_featured: boolean | null;
  is_sale: boolean | null;
  sort_order: number | string | null;
  homepage_section: string | null;
  badge: string | null;
  published_at: string | null;
  short_description: string | null;
  product_highlights?: unknown;
  detail_rows?: unknown;
  best_for?: unknown;
  care_instructions?: unknown;
  product_faqs?: unknown;
  accordion_sections?: unknown;
  related_product_slugs?: unknown;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type SupabaseProductImageRow = {
  product_id: string | null;
  url: string | null;
  alt_text: string | null;
  position: number | string | null;
};

type ProductImageEntry = {
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
};

type ProductLookupResult = {
  product: Product | null;
  resolved: boolean;
  inactive: boolean;
};

type SupabaseCategoryMetadataRow = {
  id?: string | null;
  name: string | null;
  slug: string | null;
  description?: string | null;
  image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  google_product_category: string | null;
  status?: string | null;
  sort_order?: number | string | null;
  show_in_nav?: boolean | null;
  show_on_home?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CategoryMetadata = {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  googleProductCategory: string | null;
  status: string | null;
  sortOrder: number | null;
  showInNav: boolean;
  showOnHome: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PublicCategoryCard = {
  name: string;
  href: string;
  image: string;
  alt: string;
};

const productSelectWithOptionalJson =
  "id, title, slug, category, category_slug, description, price, compare_at_price, currency, image_url, image_alt, images, variants, status, inventory_status, stock_quantity, is_featured, is_sale, sort_order, homepage_section, badge, published_at, short_description, product_highlights, detail_rows, best_for, care_instructions, product_faqs, accordion_sections, related_product_slugs, seo_title, seo_description, google_product_category, created_at, updated_at";

const productSelectBase =
  "id, title, slug, category, category_slug, description, price, compare_at_price, currency, image_url, status, inventory_status, stock_quantity, is_featured, is_sale, sort_order, homepage_section, badge, published_at, seo_title, seo_description, google_product_category, created_at, updated_at";

const categoryMetadataSelect =
  "id, name, slug, description, image_url, seo_title, seo_description, google_product_category, status, sort_order, show_in_nav, show_on_home, created_at, updated_at";

const optionalJsonColumns = [
    "images",
    "image_alt",
  "variants",
  "short_description",
  "product_highlights",
  "detail_rows",
  "best_for",
  "care_instructions",
  "product_faqs",
  "accordion_sections",
  "related_product_slugs"
];

const collectionSlugByCategory: Record<string, string> = {
  "Beds & Blankets": "beds-blankets",
  "Cat Toys": "cat-toys",
  "Dog Toys": "dog-toys",
  "Dog Treats": "all",
  Dining: "all",
  "Pet Apparel": "pet-apparel",
  Storage: "all",
  "Walking Essentials": "walking-essentials"
};

const staticIndexBySlug = new Map(staticProducts.map((product, index) => [product.slug, index]));
const staticCategoryBySlug = new Map(
  staticCategories.map((category) => [
    category.href.replace("/collections/", ""),
    category
  ])
);
const DEFAULT_SORT_ORDER = 9999;
let publicCategoryClient: SupabaseClient | null = null;

function getSupabasePublicCategoryClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!publicCategoryClient) {
    publicCategoryClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return publicCategoryClient;
}

function getCategoryReadClient() {
  return getSupabasePublicCategoryClient() ?? getSupabaseAdminClient();
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown) {
  const cleaned = cleanString(value);

  return cleaned || null;
}

function numberFromValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isOptionalJsonColumnError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    optionalJsonColumns.some((column) => normalizedMessage.includes(column)) ||
    normalizedMessage.includes("schema cache")
  );
}

function normalizeCategory(value: unknown, fallback = "Pet Essentials") {
  const cleaned = cleanString(value);

  if (!cleaned) {
    return fallback;
  }

  const normalized = cleaned
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  switch (normalized) {
    case "beds-and-blankets":
    case "beds-blankets":
      return "Beds & Blankets";
    case "cat-toys":
    case "cat-enrichment":
      return "Cat Toys";
    case "dog-toys":
    case "dog-enrichment":
      return "Dog Toys";
    case "pet-apparel":
    case "apparel":
      return "Pet Apparel";
    case "walking":
    case "walking-essentials":
      return "Walking Essentials";
    default:
      return cleaned;
  }
}

function normalizeInventoryStatus(value: unknown): PublicInventoryStatus {
  switch (cleanString(value)) {
    case "out_of_stock":
      return "out_of_stock";
    case "preorder":
      return "preorder";
    default:
      return "in_stock";
  }
}

function normalizeHomepageSection(value: unknown): PublicHomepageSection | null {
  const section = cleanString(value);

  return section === "featured" || section === "best_seller" || section === "new_arrivals"
    ? section
    : null;
}

function timeFromValue(value: unknown) {
  const dateValue = nullableString(value);

  if (!dateValue) {
    return 0;
  }

  const time = new Date(dateValue).getTime();

  return Number.isFinite(time) ? time : 0;
}

function sortOrderFromProduct(product: Product) {
  if (typeof product.sortOrder !== "number" || product.sortOrder <= 0) {
    return DEFAULT_SORT_ORDER;
  }

  return product.sortOrder;
}

function sortOrderFromCategory(category: CategoryMetadata) {
  if (typeof category.sortOrder !== "number" || category.sortOrder <= 0) {
    return DEFAULT_SORT_ORDER;
  }

  return category.sortOrder;
}

function recordFromUnknown(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function arrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function stringArrayFromUnknown(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => cleanString(item)).filter(Boolean)
    : undefined;
}

function valueFromVariants(variants: Record<string, unknown> | null, key: string) {
  return variants ? nullableString(variants[key]) : null;
}

function arrayFromVariants(variants: Record<string, unknown> | null, key: string) {
  return variants ? stringArrayFromUnknown(variants[key]) : undefined;
}

function productHighlightsFromJson(value: unknown): ProductHighlight[] | undefined {
  const highlights = arrayFromUnknown(value)
    .map((item): ProductHighlight | null => {
      const record = recordFromUnknown(item);
      const title = nullableString(record?.title);
      const text = nullableString(record?.text);
      const icon = normalizeProductHighlightIconKey(record?.icon);

      return title && text
        ? {
            title,
            text,
            ...(icon ? { icon } : {})
          }
        : null;
    })
    .filter((item): item is ProductHighlight => Boolean(item));

  return highlights.length > 0 ? highlights : undefined;
}

function detailRowsFromJson(value: unknown): ProductDetailRow[] | undefined {
  const rows = arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const label = nullableString(record?.label);
      const rowValue = nullableString(record?.value);

      return label && rowValue ? { label, value: rowValue } : null;
    })
    .filter((item): item is ProductDetailRow => Boolean(item));

  return rows.length > 0 ? rows : undefined;
}

function textItemsFromJson(value: unknown): string[] | undefined {
  const items = arrayFromUnknown(value)
    .map((item) => (typeof item === "string" ? nullableString(item) : nullableString(recordFromUnknown(item)?.text)))
    .filter((item): item is string => Boolean(item));

  return items.length > 0 ? items : undefined;
}

function productFaqsFromJson(value: unknown): ProductFaq[] | undefined {
  const faqs = arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const title = nullableString(record?.question) ?? nullableString(record?.title);
      const content = nullableString(record?.answer) ?? nullableString(record?.content);

      return title && content ? { title, content } : null;
    })
    .filter((item): item is ProductFaq => Boolean(item));

  return faqs.length > 0 ? faqs : undefined;
}

function accordionSectionsFromJson(value: unknown): ProductAccordionSection[] | undefined {
  const sections = arrayFromUnknown(value)
    .map((item) => {
      const record = recordFromUnknown(item);
      const title = nullableString(record?.title);
      const content = nullableString(record?.content);

      return title && content ? { title, content } : null;
    })
    .filter((item): item is ProductAccordionSection => Boolean(item));

  return sections.length > 0 ? sections : undefined;
}

function imageEntryFromUnknown(value: unknown, index: number): ProductImageEntry | null {
  if (typeof value === "string") {
    const url = cleanString(value);

    return url ? { url, position: index + 1, isPrimary: false } : null;
  }

  const record = recordFromUnknown(value);
  const url = nullableString(record?.url);

  if (!record || !url) {
    return null;
  }

  const position = numberFromValue(record.position);
  const altText =
    nullableString(record.alt) ??
    nullableString(record.alt_text) ??
    nullableString(record.altText) ??
    undefined;

  return {
    url,
    altText,
    position: position ?? index + 1,
    isPrimary: record.is_primary === true || record.isPrimary === true
  };
}

function imageEntriesFromJson(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => imageEntryFromUnknown(item, index))
    .filter((item): item is ProductImageEntry => Boolean(item))
    .sort((first, second) => {
      if (first.isPrimary !== second.isPrimary) {
        return first.isPrimary ? -1 : 1;
      }

      return first.position - second.position;
    });
}

function imageEntriesFromRows(rows: SupabaseProductImageRow[]) {
  const entries: ProductImageEntry[] = [];

  rows.forEach((row, index) => {
    const url = nullableString(row.url);

    if (!url) {
      return;
    }

    entries.push({
      url,
      altText: nullableString(row.alt_text) ?? undefined,
      position: numberFromValue(row.position) ?? index + 1,
      isPrimary: false
    });
  });

  return entries.sort((first, second) => first.position - second.position);
}

function uniqueImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean)));
}

function defaultProductType(category: string, subcategory?: string) {
  if (subcategory) {
    return subcategory;
  }

  switch (category) {
    case "Cat Toys":
      return "Cat enrichment toy";
    case "Dog Toys":
      return "Dog play and enrichment toy";
    case "Pet Apparel":
      return "Pet apparel";
    case "Walking Essentials":
      return "Walking essential";
    case "Beds & Blankets":
      return "Rest and comfort essential";
    default:
      return "Pet essential";
  }
}

function defaultCareGuidance(category: string) {
  switch (category) {
    case "Beds & Blankets":
    case "Pet Apparel":
      return "Follow the product care label where available; machine wash cold or use gentle care when appropriate.";
    case "Cat Toys":
    case "Dog Toys":
      return "Wipe clean or spot clean as needed, and let the item dry fully before reuse.";
    case "Walking Essentials":
      return "Wipe clean after outdoor use and check hardware before each walk.";
    default:
      return "Clean regularly and inspect before use.";
  }
}

function defaultSafetyNotice(category: string) {
  switch (category) {
    case "Cat Toys":
      return "Supervise pets during play and remove the item if loose parts or damage appear.";
    case "Dog Toys":
      return "Supervise pets during play and remove the toy if damaged.";
    case "Pet Apparel":
      return "Check fit before use and remove if your pet shows discomfort.";
    case "Walking Essentials":
      return "Check fit and hardware before each walk.";
    default:
      return "Inspect regularly and remove from use if damaged.";
  }
}

function mapSupabaseProduct(
  row: SupabaseProductRow,
  imageRows: SupabaseProductImageRow[],
  categoryMetadata: Map<string, CategoryMetadata> = new Map()
): Product | null {
  const slug = nullableString(row.slug);

  if (!slug) {
    return null;
  }

  const staticProduct = getProductBySlug(slug);
  const variants = recordFromUnknown(row.variants);
  const imageEntries = [
    ...imageEntriesFromRows(imageRows),
    ...imageEntriesFromJson(row.images)
  ];
  const title = nullableString(row.title) ?? staticProduct?.name ?? titleFromSlug(slug);
  const canonicalCategory = normalizeCategory(row.category, staticProduct?.category);
  const categorySlug =
    nullableString(row.category_slug) ??
    collectionSlugByCategory[canonicalCategory] ??
    staticProduct?.collectionSlug ??
    categorySlugFromName(canonicalCategory);
  const categoryMetadataBySlug = categoryMetadata.get(categorySlug);
  const categoryMetadataByName = categoryMetadata.get(canonicalCategory.toLowerCase());
  const category = categoryMetadataBySlug?.name ?? categoryMetadataByName?.name ?? canonicalCategory;
  const googleProductCategory =
    nullableString(row.google_product_category) ??
    categoryMetadataBySlug?.googleProductCategory ??
    categoryMetadataByName?.googleProductCategory;
  const subcategory = valueFromVariants(variants, "subcategory") ?? staticProduct?.subcategory;
  const description =
    nullableString(row.description) ?? staticProduct?.description ?? `${title} from ${brandName}.`;
  const price = numberFromValue(row.price) ?? staticProduct?.price ?? 0;
  const compareAtPrice = numberFromValue(row.compare_at_price);
  const activeCompareAtPrice =
    compareAtPrice !== null && compareAtPrice > price ? compareAtPrice : undefined;
  const primaryImageEntry = imageEntries.find((image) => image.isPrimary) ?? imageEntries[0];
  const primaryImage =
    primaryImageEntry?.url ?? nullableString(row.image_url) ?? staticProduct?.image ?? "/images/hero-dog-running.jpg";
  const gallery = uniqueImages([
    primaryImage,
    ...imageEntries.map((image) => image.url),
    ...(staticProduct?.gallery ?? [])
  ]);
  const alt =
    primaryImageEntry?.altText ??
    nullableString(row.image_alt) ??
    imageEntries.find((image) => image.url === primaryImage)?.altText ??
    staticProduct?.alt ??
    `${brandName} ${title}.`;
  const selectedColor = valueFromVariants(variants, "selectedColor") ?? staticProduct?.selectedColor;
  const colors = arrayFromVariants(variants, "colors") ?? staticProduct?.colors;
  const size = valueFromVariants(variants, "size") ?? staticProduct?.size;
  const material = valueFromVariants(variants, "material") ?? staticProduct?.material;
  const materialTags = arrayFromVariants(variants, "materialTags") ?? staticProduct?.materialTags;
  const benefits = arrayFromVariants(variants, "benefits") ?? staticProduct?.benefits;
  const shippingRate = numberFromValue(variants?.shippingRate) ?? staticProduct?.shippingRate ?? DEFAULT_SHIPPING_RATE;
  const shippingClass = valueFromVariants(variants, "shippingClass") ?? staticProduct?.shippingClass ?? "standard";
  const shippingDescription =
    valueFromVariants(variants, "shippingDescription") ??
    staticProduct?.shippingDescription ??
    standardShippingSentence;
  const productType =
    valueFromVariants(variants, "productType") ??
    staticProduct?.productType ??
    defaultProductType(canonicalCategory, subcategory);
  const careGuidance =
    valueFromVariants(variants, "careGuidance") ??
    staticProduct?.careGuidance ??
    defaultCareGuidance(canonicalCategory);
  const safetyNotice =
    valueFromVariants(variants, "safetyNotice") ??
    staticProduct?.safetyNotice ??
    defaultSafetyNotice(canonicalCategory);
  const seoDescription = nullableString(row.seo_description);
  const shortDescription =
    nullableString(row.short_description) ?? seoDescription ?? staticProduct?.shortDescription ?? description;
  const isSale = Boolean(row.is_sale);
  const hasSalePricing = Boolean(activeCompareAtPrice);
  const badge = nullableString(row.badge) ?? (isSale || hasSalePricing ? "Sale" : staticProduct?.badge);
  const homepageSection = normalizeHomepageSection(row.homepage_section);
  const sortOrder = numberFromValue(row.sort_order);
  const productHighlights = productHighlightsFromJson(row.product_highlights);
  const detailRows = detailRowsFromJson(row.detail_rows);
  const bestFor = textItemsFromJson(row.best_for);
  const careInstructions = textItemsFromJson(row.care_instructions);
  const productFaqs = productFaqsFromJson(row.product_faqs);
  const accordionSections = accordionSectionsFromJson(row.accordion_sections);
  const relatedProductSlugs = stringArrayFromUnknown(row.related_product_slugs);

  return {
    id: slug,
    slug,
    name: title,
    title,
    category,
    ...(subcategory ? { subcategory } : {}),
    price,
    ...(activeCompareAtPrice ? { regularPrice: activeCompareAtPrice, compareAtPrice: activeCompareAtPrice } : {}),
    ...(badge ? { badge } : {}),
    ...(staticProduct?.rating ? { rating: staticProduct.rating } : {}),
    ...(staticProduct?.reviewCount ? { reviewCount: staticProduct.reviewCount } : {}),
    ...(selectedColor ? { selectedColor } : {}),
    ...(colors ? { colors } : {}),
    ...(size ? { size } : {}),
    ...(material ? { material } : {}),
    ...(benefits ? { benefits } : {}),
    description,
    image: primaryImage,
    gallery,
    alt,
    ...(materialTags ? { materialTags } : {}),
    shippingRate,
    shippingClass,
    shippingDescription,
    ...(staticProduct?.isNew ? { isNew: staticProduct.isNew } : {}),
    isFeatured: Boolean(row.is_featured),
    isSale,
    brand: brandName,
    currency: cleanString(row.currency) === "USD" ? "USD" : "USD",
    availability: normalizeInventoryStatus(row.inventory_status),
    condition: "new",
    imageAlt: alt,
    productUrl: `/products/${slug}`,
    collectionSlug: categorySlug || "all",
    shortDescription,
    productType,
    careGuidance,
    safetyNotice,
    ...(nullableString(row.seo_title) ? { seoTitle: nullableString(row.seo_title)! } : {}),
    ...(seoDescription ? { seoDescription } : {}),
    ...(googleProductCategory ? { googleProductCategory } : {}),
    stockQuantity: numberFromValue(row.stock_quantity),
    sortOrder,
    homepageSection,
    publishedAt: nullableString(row.published_at),
    createdAt: nullableString(row.created_at),
    updatedAt: nullableString(row.updated_at),
    ...(productHighlights ? { productHighlights } : {}),
    ...(detailRows ? { detailRows } : {}),
    ...(bestFor ? { bestFor } : {}),
    ...(careInstructions ? { careInstructions } : {}),
    ...(productFaqs ? { productFaqs } : {}),
    ...(accordionSections ? { accordionSections } : {}),
    ...(relatedProductSlugs ? { relatedProductSlugs } : {})
  };
}

async function selectProductRows(selectColumns: string, slug?: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { rows: null, error: null };
  }

  let query = supabase.from("products").select(selectColumns);

  if (slug) {
    query = query.eq("slug", slug);
  } else {
    query = query
      .eq("status", "active")
      .order("created_at", { ascending: false });
  }

  const result = slug ? await query.limit(1) : await query;

  return {
    rows: (result.data ?? null) as SupabaseProductRow[] | null,
    error: result.error
  };
}

async function fetchProductRows(slug?: string) {
  const withOptional = await selectProductRows(productSelectWithOptionalJson, slug);

  if (!withOptional.error) {
    return withOptional.rows;
  }

  if (!isOptionalJsonColumnError(withOptional.error.message)) {
    return null;
  }

  const base = await selectProductRows(productSelectBase, slug);

  if (base.error) {
    return null;
  }

  return base.rows;
}

async function fetchImageRowsByProductId(productIds: string[]) {
  const supabase = getSupabaseAdminClient();

  if (!supabase || productIds.length === 0) {
    return new Map<string, SupabaseProductImageRow[]>();
  }

  const { data, error } = await supabase
    .from("product_images")
    .select("product_id, url, alt_text, position")
    .in("product_id", productIds)
    .order("position", { ascending: true });

  if (error) {
    return new Map<string, SupabaseProductImageRow[]>();
  }

  return (data ?? []).reduce((imageMap, image) => {
    const row = image as SupabaseProductImageRow;
    const productId = nullableString(row.product_id);

    if (!productId) {
      return imageMap;
    }

    imageMap.set(productId, [...(imageMap.get(productId) ?? []), row]);

    return imageMap;
  }, new Map<string, SupabaseProductImageRow[]>());
}

function categoryMetadataFromRow(row: SupabaseCategoryMetadataRow): CategoryMetadata | null {
  const name = nullableString(row.name);
  const slug = nullableString(row.slug);

  if (!name || !slug) {
    return null;
  }

  return {
    name,
    slug,
    description: nullableString(row.description),
    imageUrl: nullableString(row.image_url),
    seoTitle: nullableString(row.seo_title),
    seoDescription: nullableString(row.seo_description),
    googleProductCategory: nullableString(row.google_product_category),
    status: nullableString(row.status),
    sortOrder: numberFromValue(row.sort_order),
    showInNav: row.show_in_nav === true,
    showOnHome: row.show_on_home === true,
    createdAt: nullableString(row.created_at),
    updatedAt: nullableString(row.updated_at)
  };
}

async function fetchCategoryMetadata() {
  const supabase = getCategoryReadClient();

  if (!supabase) {
    return new Map<string, CategoryMetadata>();
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select(categoryMetadataSelect)
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (error) {
    return new Map<string, CategoryMetadata>();
  }

  return (data ?? []).reduce((categoryMap, category) => {
    const row = category as SupabaseCategoryMetadataRow;
    const metadata = categoryMetadataFromRow(row);

    if (!metadata) {
      return categoryMap;
    }

    categoryMap.set(metadata.slug, metadata);
    categoryMap.set(metadata.name.toLowerCase(), metadata);

    return categoryMap;
  }, new Map<string, CategoryMetadata>());
}

async function fetchActiveCategoryMetadataBySlug(slug: string) {
  const supabase = getCategoryReadClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select(categoryMetadataSelect)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return categoryMetadataFromRow(data as SupabaseCategoryMetadataRow);
}

async function fetchActiveCategoryMetadata() {
  const categoryMap = await fetchCategoryMetadata();

  return activeCategoriesFromMap(categoryMap);
}

function activeCategoriesFromMap(categoryMap: Map<string, CategoryMetadata>) {
  const uniqueCategories = new Map(Array.from(categoryMap.values()).map((category) => [category.slug, category]));

  return Array.from(uniqueCategories.values())
    .filter((category) => category.status === "active")
    .sort((first, second) => {
      const sortDifference = sortOrderFromCategory(first) - sortOrderFromCategory(second);

      if (sortDifference !== 0) {
        return sortDifference;
      }

      return first.name.localeCompare(second.name);
    });
}

function fallbackExploreLinks() {
  return [
    ...Object.values(collectionConfigs)
      .filter((config) => config.slug !== "all" && config.slug !== "sale")
      .map((config) => ({
        label: config.title,
        href: config.href
      })),
    { label: collectionConfigs.sale.title, href: collectionConfigs.sale.href }
  ];
}

function exploreLinksFromCategories(categories: CategoryMetadata[]) {
  if (categories.length === 0) {
    return fallbackExploreLinks();
  }

  return [
    ...categories.map((category) => ({
      label: category.name,
      href: `/collections/${category.slug}`
    })),
    { label: "Sale", href: "/sale" }
  ];
}

function categoryFilterOptionsFromCategories(categories: CategoryMetadata[], allLabel: string) {
  if (categories.length === 0) {
    return undefined;
  }

  return [
    { label: allLabel, value: "__all__" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug
    }))
  ];
}

function headerNavigationFromCategories(categories: CategoryMetadata[]): NavigationItem[] {
  const categoryItems = categories
    .filter((category) => category.showInNav)
    .map((category) => ({
      label: category.name,
      href: `/collections/${category.slug}`
    }));

  return categoryItems.length > 0
    ? [
        { label: "Shop All", href: "/collections" },
        ...categoryItems,
        { label: "About Us", href: "/about" },
        { label: "Sale", href: "/sale", sale: true }
      ]
    : topLevelNavigation;
}

export async function getPublicHeaderNavigationItems() {
  return headerNavigationFromCategories(await fetchActiveCategoryMetadata());
}

function collectionCategoryFilterOptions(
  config: CollectionConfig,
  activeCategories: CategoryMetadata[]
): CollectionConfig["categoryFilterOptions"] {
  if (config.slug === "all") {
    return categoryFilterOptionsFromCategories(activeCategories, "All Products");
  }

  if (config.slug === "sale") {
    return categoryFilterOptionsFromCategories(activeCategories, "All Sale");
  }

  return undefined;
}

function collectionMobileFilters(config: CollectionConfig, category: CategoryMetadata | null) {
  if (config.slug === "all" || config.slug === "sale") {
    return config.mobileFilters;
  }

  return [category ? `All ${category.name}` : (config.parentFilterLabel ?? `All ${config.title}`), ...config.mobileFilters.slice(1)];
}

function productsWithCategoryLabels(products: Product[], categories: CategoryMetadata[]) {
  if (categories.length === 0) {
    return products;
  }

  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  return products.map((product) => {
    const category = categoryBySlug.get(product.collectionSlug);

    return category && product.category !== category.name
      ? {
          ...product,
          category: category.name
        }
      : product;
  });
}

function sortProductsForStorefront(products: Product[]) {
  return [...products].sort((first, second) => {
    const sortDifference = sortOrderFromProduct(first) - sortOrderFromProduct(second);

    if (sortDifference !== 0) {
      return sortDifference;
    }

    const publishedDateDifference = timeFromValue(second.publishedAt) - timeFromValue(first.publishedAt);

    if (publishedDateDifference !== 0) {
      return publishedDateDifference;
    }

    const createdDateDifference = timeFromValue(second.createdAt) - timeFromValue(first.createdAt);

    if (createdDateDifference !== 0) {
      return createdDateDifference;
    }

    const firstIndex = staticIndexBySlug.get(first.slug) ?? Number.MAX_SAFE_INTEGER;
    const secondIndex = staticIndexBySlug.get(second.slug) ?? Number.MAX_SAFE_INTEGER;

    if (firstIndex !== secondIndex) {
      return firstIndex - secondIndex;
    }

    return first.name.localeCompare(second.name);
  });
}

async function fetchSupabaseActiveProducts() {
  const rows = await fetchProductRows();

  if (!rows || rows.length === 0) {
    return null;
  }

  const imageRowsByProductId = await fetchImageRowsByProductId(rows.map((row) => row.id));
  const categoryMetadata = await fetchCategoryMetadata();
  const products = rows
    .filter((row) => row.status === "active")
    .map((row) => mapSupabaseProduct(row, imageRowsByProductId.get(row.id) ?? [], categoryMetadata))
    .filter((product): product is Product => Boolean(product));

  return products.length > 0 ? sortProductsForStorefront(products) : null;
}

async function fetchSupabaseProductBySlug(slug: string): Promise<ProductLookupResult> {
  const rows = await fetchProductRows(slug);

  if (!rows) {
    return {
      product: null,
      resolved: false,
      inactive: false
    };
  }

  const row = rows[0];

  if (!row) {
    return {
      product: null,
      resolved: true,
      inactive: false
    };
  }

  if (row.status !== "active") {
    return {
      product: null,
      resolved: true,
      inactive: true
    };
  }

  const imageRowsByProductId = await fetchImageRowsByProductId([row.id]);
  const categoryMetadata = await fetchCategoryMetadata();

  return {
    product: mapSupabaseProduct(row, imageRowsByProductId.get(row.id) ?? [], categoryMetadata),
    resolved: true,
    inactive: false
  };
}

function isSaleProduct(product: Product) {
  return Boolean(product.isSale);
}

function productMatchesCollectionSlug(product: Product, slug: string) {
  return product.collectionSlug === slug || categorySlugFromName(product.category) === slug;
}

function productsForCollection(slug: string, products: Product[]) {
  switch (slug) {
    case "all":
      return products;
    case "sale":
      return products.filter(isSaleProduct);
    default:
      return products.filter((product) => productMatchesCollectionSlug(product, slug));
  }
}

function productCountLabel(products: Product[], collectionSlug: string) {
  if (collectionSlug === "sale") {
    return `${products.length} ${products.length === 1 ? "offer" : "offers"}`;
  }

  return `${products.length} ${products.length === 1 ? "product" : "products"}`;
}

function fallbackCategoryCard(slug: string) {
  return staticCategoryBySlug.get(slug);
}

function categoryCardFromMetadata(category: CategoryMetadata): PublicCategoryCard {
  const fallback = fallbackCategoryCard(category.slug);

  return {
    name: category.name,
    href: `/collections/${category.slug}`,
    image: category.imageUrl ?? fallback?.image ?? "/images/category-dog-toys.jpg",
    alt: fallback?.alt ?? `${brandName} ${category.name} category.`
  };
}

function collectionConfigBySlug(slug: string) {
  return Object.values(collectionConfigs).find((config) => config.slug === slug);
}

function collectionConfigWithCategory(
  config: CollectionConfig,
  category: CategoryMetadata | null,
  products: Product[],
  activeCategories: CategoryMetadata[] = []
): CollectionConfig {
  const categoryFilterOptions = collectionCategoryFilterOptions(config, activeCategories);
  const exploreLinks = exploreLinksFromCategories(activeCategories);
  const headerNavigationItems = headerNavigationFromCategories(activeCategories);
  const labeledProducts = productsWithCategoryLabels(products, activeCategories);

  if (!category) {
    return {
      ...config,
      mobileFilters: collectionMobileFilters(config, null),
      ...(categoryFilterOptions ? { categoryFilterOptions } : {}),
      exploreLinks,
      headerNavigationItems,
      productCountLabel: productCountLabel(labeledProducts, config.slug),
      products: labeledProducts
    };
  }

  const description = category.description ?? config.description;

  return {
    ...config,
    slug: category.slug,
    href: `/collections/${category.slug}`,
    title: category.name,
    description,
    seoTitle: category.seoTitle ?? `${category.name} | ${brandName}`,
    seoDescription: category.seoDescription ?? description,
    parentFilterLabel: `All ${category.name}`,
    mobileFilters: collectionMobileFilters(config, category),
    ...(categoryFilterOptions ? { categoryFilterOptions } : {}),
    exploreLinks,
    headerNavigationItems,
    productCountLabel: productCountLabel(labeledProducts, category.slug),
    products: labeledProducts
  };
}

function fillSelection(selectedProducts: Product[], catalogProducts: Product[], limit: number) {
  const selectedSlugs = new Set(selectedProducts.map((product) => product.slug));
  const fillProducts = catalogProducts.filter((product) => !selectedSlugs.has(product.slug));

  return [...selectedProducts, ...fillProducts].slice(0, limit);
}

function homepageSectionProducts(sectionProducts: Product[], fallbackProducts: Product[], limit: number) {
  return (sectionProducts.length > 0 ? sectionProducts : fallbackProducts).slice(0, limit);
}

export async function getPublicProducts() {
  const supabaseProducts = await fetchSupabaseActiveProducts();

  return supabaseProducts ?? staticProducts;
}

export async function getPublicProductBySlug(slug: string) {
  const lookup = await fetchSupabaseProductBySlug(slug);

  if (lookup.product) {
    return lookup.product;
  }

  if (lookup.inactive) {
    return null;
  }

  return getProductBySlug(slug) ?? null;
}

export async function getPublicProductByIdOrSlug(idOrSlug: string) {
  const products = await getPublicProducts();

  return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;
}

export async function getPublicCollectionConfig(
  key: keyof typeof collectionConfigs
): Promise<CollectionConfig> {
  const config = collectionConfigs[key];
  const categoryMap = await fetchCategoryMetadata();
  const category = categoryMap.get(config.slug) ?? null;
  const activeCategories = activeCategoriesFromMap(categoryMap);
  const collectionSlug = category?.status === "active" ? category.slug : config.slug;
  const products = productsForCollection(collectionSlug, await getPublicProducts());

  return collectionConfigWithCategory(
    config,
    category?.status === "active" ? category : null,
    products,
    activeCategories
  );
}

export async function getPublicCollectionConfigBySlug(slug: string) {
  const [category, categoryMap] = await Promise.all([
    fetchActiveCategoryMetadataBySlug(slug),
    fetchCategoryMetadata()
  ]);
  const activeCategories = activeCategoriesFromMap(categoryMap);

  if (!category) {
    return null;
  }

  const baseConfig = collectionConfigBySlug(slug) ?? {
    slug,
    href: `/collections/${slug}`,
    title: category.name,
    description: category.description ?? `Shop ${category.name} from ${brandName}.`,
    seoTitle: category.seoTitle ?? `${category.name} | ${brandName}`,
    seoDescription: category.seoDescription ?? category.description ?? `Shop ${category.name} from ${brandName}.`,
    mobileFilters: [`All ${category.name}`],
    products: []
  };
  const products = productsForCollection(category.slug, await getPublicProducts());

  return collectionConfigWithCategory(baseConfig, category, products, activeCategories);
}

export async function getPublicCollectionConfigForSlug(
  slug: string,
  fallbackKey: keyof typeof collectionConfigs
): Promise<CollectionConfig> {
  return (await getPublicCollectionConfigBySlug(slug)) ?? getPublicCollectionConfig(fallbackKey);
}

export async function getPublicHomepageCategories(): Promise<PublicCategoryCard[]> {
  const categories = (await fetchActiveCategoryMetadata())
    .filter((category) => category.showOnHome)
    .map(categoryCardFromMetadata);

  return categories.length > 0 ? categories : staticCategories;
}

export async function getPublicCategoryCollectionRoutes() {
  const categories = (await fetchActiveCategoryMetadata()).filter(
    (category) => category.showInNav || category.showOnHome
  );

  return categories.length > 0
    ? categories.map((category) => `/collections/${category.slug}`)
    : staticCategories.map((category) => category.href);
}

export function pickPublicProductsByStaticProducts(
  staticSelection: Product[],
  catalogProducts: Product[],
  limit = staticSelection.length
) {
  const catalogBySlug = new Map(catalogProducts.map((product) => [product.slug, product]));
  const selectedProducts = staticSelection
    .map((staticProduct) => catalogBySlug.get(staticProduct.slug))
    .filter((product): product is Product => Boolean(product));

  return fillSelection(selectedProducts, catalogProducts, limit);
}

export async function getPublicHomepageProducts() {
  const catalogProducts = await getPublicProducts();
  const featuredProducts = catalogProducts.filter(
    (product) => product.homepageSection === "featured" || product.isFeatured
  );
  const bestSellerProducts = catalogProducts.filter((product) => product.homepageSection === "best_seller");
  const newArrivalProducts = catalogProducts.filter((product) => product.homepageSection === "new_arrivals");
  const featuredSectionProducts = homepageSectionProducts(featuredProducts, catalogProducts, staticBestSellers.length);
  const featuredProduct =
    featuredSectionProducts[0] ??
    catalogProducts.find((product) => product.slug === staticMainProduct.slug) ??
    (await getPublicProductBySlug(staticMainProduct.slug)) ??
    catalogProducts[0] ??
    staticMainProduct;

  return {
    featuredProduct,
    featuredProducts: featuredSectionProducts,
    bestSellers: homepageSectionProducts(bestSellerProducts, catalogProducts, staticBestSellers.length),
    newArrivals: homepageSectionProducts(newArrivalProducts, catalogProducts, staticNewArrivals.length)
  };
}

export async function getPublicRelatedProducts(product: Product, limit = 4) {
  const catalogProducts = await getPublicProducts();
  const selectedRelatedProducts = product.relatedProductSlugs?.length
    ? product.relatedProductSlugs
        .map((slug) => catalogProducts.find((relatedProduct) => relatedProduct.slug === slug))
        .filter(
          (relatedProduct): relatedProduct is Product =>
            relatedProduct !== undefined && relatedProduct.slug !== product.slug
        )
    : [];
  const sameCategory = catalogProducts.filter(
    (relatedProduct) =>
      relatedProduct.slug !== product.slug &&
      relatedProduct.category === product.category &&
      !selectedRelatedProducts.some((selectedProduct) => selectedProduct.slug === relatedProduct.slug)
  );
  const fallback = catalogProducts.filter(
    (relatedProduct) =>
      relatedProduct.slug !== product.slug &&
      !selectedRelatedProducts.some((selectedProduct) => selectedProduct.slug === relatedProduct.slug) &&
      !sameCategory.some((sameCategoryProduct) => sameCategoryProduct.slug === relatedProduct.slug)
  );

  return [...selectedRelatedProducts, ...sameCategory, ...fallback].slice(0, limit);
}
