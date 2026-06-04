import "server-only";

import {
  bestSellers as staticBestSellers,
  brandName,
  getProductBySlug,
  mainProduct as staticMainProduct,
  newArrivals as staticNewArrivals,
  products as staticProducts,
  type Product
} from "@/data/products";
import { collectionConfigs, type CollectionConfig } from "@/data/collections";
import { DEFAULT_SHIPPING_RATE, standardShippingSentence } from "@/lib/shipping";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type PublicInventoryStatus = Product["availability"];

type SupabaseProductRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  description: string | null;
  price: number | string | null;
  compare_at_price: number | string | null;
  currency: string | null;
  image_url: string | null;
  images?: unknown;
  variants?: unknown;
  status: string | null;
  inventory_status: string | null;
  stock_quantity: number | string | null;
  is_featured: boolean | null;
  is_sale: boolean | null;
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
};

type ProductLookupResult = {
  product: Product | null;
  resolved: boolean;
  inactive: boolean;
};

const productSelectWithOptionalJson =
  "id, title, slug, category, description, price, compare_at_price, currency, image_url, images, variants, status, inventory_status, stock_quantity, is_featured, is_sale, seo_title, seo_description, google_product_category, created_at, updated_at";

const productSelectBase =
  "id, title, slug, category, description, price, compare_at_price, currency, image_url, status, inventory_status, stock_quantity, is_featured, is_sale, seo_title, seo_description, google_product_category, created_at, updated_at";

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
    normalizedMessage.includes("images") ||
    normalizedMessage.includes("variants") ||
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

function recordFromUnknown(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
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

function imageEntryFromUnknown(value: unknown, index: number): ProductImageEntry | null {
  if (typeof value === "string") {
    const url = cleanString(value);

    return url ? { url, position: index + 1 } : null;
  }

  const record = recordFromUnknown(value);
  const url = nullableString(record?.url);

  if (!record || !url) {
    return null;
  }

  const position = numberFromValue(record.position);
  const altText = nullableString(record.alt_text) ?? nullableString(record.altText) ?? undefined;

  return {
    url,
    altText,
    position: position ?? index + 1
  };
}

function imageEntriesFromJson(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => imageEntryFromUnknown(item, index))
    .filter((item): item is ProductImageEntry => Boolean(item));
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
      position: numberFromValue(row.position) ?? index + 1
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
  imageRows: SupabaseProductImageRow[]
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
  const category = normalizeCategory(row.category, staticProduct?.category);
  const subcategory = valueFromVariants(variants, "subcategory") ?? staticProduct?.subcategory;
  const description =
    nullableString(row.description) ?? staticProduct?.description ?? `${title} from ${brandName}.`;
  const price = numberFromValue(row.price) ?? staticProduct?.price ?? 0;
  const compareAtPrice = numberFromValue(row.compare_at_price);
  const activeCompareAtPrice =
    compareAtPrice !== null && compareAtPrice > price ? compareAtPrice : undefined;
  const primaryImage =
    nullableString(row.image_url) ?? imageEntries[0]?.url ?? staticProduct?.image ?? "/images/hero-dog-running.jpg";
  const gallery = uniqueImages([
    primaryImage,
    ...imageEntries.map((image) => image.url),
    ...(staticProduct?.gallery ?? [])
  ]);
  const alt =
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
    defaultProductType(category, subcategory);
  const careGuidance =
    valueFromVariants(variants, "careGuidance") ??
    staticProduct?.careGuidance ??
    defaultCareGuidance(category);
  const safetyNotice =
    valueFromVariants(variants, "safetyNotice") ??
    staticProduct?.safetyNotice ??
    defaultSafetyNotice(category);
  const seoDescription = nullableString(row.seo_description);
  const shortDescription = seoDescription ?? staticProduct?.shortDescription ?? description;
  const isSale = Boolean(row.is_sale) || Boolean(activeCompareAtPrice);

  return {
    id: slug,
    slug,
    name: title,
    title,
    category,
    ...(subcategory ? { subcategory } : {}),
    price,
    ...(activeCompareAtPrice ? { regularPrice: activeCompareAtPrice, compareAtPrice: activeCompareAtPrice } : {}),
    ...(isSale ? { badge: "Sale" } : staticProduct?.badge ? { badge: staticProduct.badge } : {}),
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
    brand: brandName,
    currency: cleanString(row.currency) === "USD" ? "USD" : "USD",
    availability: normalizeInventoryStatus(row.inventory_status),
    condition: "new",
    imageAlt: alt,
    productUrl: `/products/${slug}`,
    collectionSlug: collectionSlugByCategory[category] ?? staticProduct?.collectionSlug ?? "all",
    shortDescription,
    productType,
    careGuidance,
    safetyNotice,
    ...(nullableString(row.seo_title) ? { seoTitle: nullableString(row.seo_title)! } : {}),
    ...(seoDescription ? { seoDescription } : {}),
    ...(nullableString(row.google_product_category)
      ? { googleProductCategory: nullableString(row.google_product_category)! }
      : {}),
    stockQuantity: numberFromValue(row.stock_quantity)
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
    query = query.eq("status", "active").order("created_at", { ascending: true }).limit(250);
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

function sortProductsForStorefront(products: Product[]) {
  return [...products].sort((first, second) => {
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
  const products = rows
    .filter((row) => row.status === "active")
    .map((row) => mapSupabaseProduct(row, imageRowsByProductId.get(row.id) ?? []))
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

  return {
    product: mapSupabaseProduct(row, imageRowsByProductId.get(row.id) ?? []),
    resolved: true,
    inactive: false
  };
}

function isSaleProduct(product: Product) {
  return Boolean(product.compareAtPrice && product.compareAtPrice > product.price) || product.badge === "Sale";
}

function productsForCollection(slug: string, products: Product[]) {
  switch (slug) {
    case "all":
      return products;
    case "beds-blankets":
      return products.filter((product) => product.category === "Beds & Blankets");
    case "cat-toys":
      return products.filter((product) => product.category === "Cat Toys");
    case "dog-toys":
      return products.filter((product) => product.category === "Dog Toys");
    case "pet-apparel":
      return products.filter((product) => product.category === "Pet Apparel");
    case "walking-essentials":
      return products.filter((product) => product.category === "Walking Essentials");
    case "sale":
      return products.filter(isSaleProduct);
    default:
      return products.filter((product) => product.collectionSlug === slug);
  }
}

function productCountLabel(products: Product[], collectionSlug: string) {
  if (collectionSlug === "sale") {
    return `${products.length} ${products.length === 1 ? "offer" : "offers"}`;
  }

  return `${products.length} ${products.length === 1 ? "product" : "products"}`;
}

function fillSelection(selectedProducts: Product[], catalogProducts: Product[], limit: number) {
  const selectedSlugs = new Set(selectedProducts.map((product) => product.slug));
  const fillProducts = catalogProducts.filter((product) => !selectedSlugs.has(product.slug));

  return [...selectedProducts, ...fillProducts].slice(0, limit);
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
  const products = productsForCollection(config.slug, await getPublicProducts());

  return {
    ...config,
    productCountLabel: productCountLabel(products, config.slug),
    products
  };
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
  const featuredProduct =
    catalogProducts.find((product) => product.slug === staticMainProduct.slug) ??
    (await getPublicProductBySlug(staticMainProduct.slug)) ??
    catalogProducts[0] ??
    staticMainProduct;

  return {
    featuredProduct,
    bestSellers: pickPublicProductsByStaticProducts(staticBestSellers, catalogProducts, staticBestSellers.length),
    newArrivals: pickPublicProductsByStaticProducts(staticNewArrivals, catalogProducts, staticNewArrivals.length)
  };
}

export async function getPublicRelatedProducts(product: Product, limit = 4) {
  const catalogProducts = await getPublicProducts();
  const sameCategory = catalogProducts.filter(
    (relatedProduct) => relatedProduct.slug !== product.slug && relatedProduct.category === product.category
  );
  const fallback = catalogProducts.filter(
    (relatedProduct) =>
      relatedProduct.slug !== product.slug &&
      !sameCategory.some((sameCategoryProduct) => sameCategoryProduct.slug === relatedProduct.slug)
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
