export const productStatuses = ["active", "draft", "archived"] as const;
export const inventoryStatuses = ["in_stock", "out_of_stock", "preorder"] as const;
export const homepageSections = ["featured", "best_seller", "new_arrivals"] as const;
export const defaultProductSortOrder = 9999;

type ProductStatus = (typeof productStatuses)[number];
type InventoryStatus = (typeof inventoryStatuses)[number];
type HomepageSection = (typeof homepageSections)[number];
type JsonObject = Record<string, unknown>;

type ProductGalleryImage = {
  url: string;
  alt?: string;
  position: number;
  is_primary: boolean;
};

export type AdminProductMutationPayload = {
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  image_alt: string | null;
  images: JsonObject[];
  status: ProductStatus;
  inventory_status: InventoryStatus;
  stock_quantity: number | null;
  is_featured: boolean;
  is_sale: boolean;
  sort_order: number | null;
  homepage_section: HomepageSection | null;
  badge: string | null;
  published_at: string | null;
  short_description: string | null;
  product_highlights: JsonObject[];
  detail_rows: JsonObject[];
  best_for: JsonObject[];
  care_instructions: JsonObject[];
  product_faqs: JsonObject[];
  accordion_sections: JsonObject[];
  related_product_slugs: string[];
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
};

type ValidationResult =
  | {
      ok: true;
      payload: AdminProductMutationPayload;
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown) {
  const cleaned = cleanString(value);

  return cleaned || null;
}

function recordFromUnknown(value: unknown): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : null;
}

function numberValue(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function isProductStatus(value: string): value is ProductStatus {
  return productStatuses.includes(value as ProductStatus);
}

function isInventoryStatus(value: string): value is InventoryStatus {
  return inventoryStatuses.includes(value as InventoryStatus);
}

function isHomepageSection(value: string): value is HomepageSection {
  return homepageSections.includes(value as HomepageSection);
}

function jsonArrayValue(record: Record<string, unknown>, key: string, label: string, errors: Record<string, string>) {
  const value = record[key];

  if (value === "" || value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      errors[key] = `${label} must be valid JSON.`;
      return [];
    }

    errors[key] = `${label} must be a JSON array.`;
    return [];
  }

  if (!Array.isArray(value)) {
    errors[key] = `${label} must be a JSON array.`;
    return [];
  }

  return value;
}

function productHighlightsValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "product_highlights", "Product highlights", errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item) => {
    const itemRecord = recordFromUnknown(item);
    const title = nullableString(itemRecord?.title);
    const text = nullableString(itemRecord?.text);
    const icon = nullableString(itemRecord?.icon);

    if (!itemRecord || (!title && !text && !icon)) {
      return itemRecord ? undefined : null;
    }

    return itemRecord && title && text
      ? {
          title,
          text,
          ...(icon ? { icon } : {})
        }
      : null;
  });

  if (items.some((item) => item === null)) {
    errors.product_highlights = "Each product highlight must include title and text.";
    return [];
  }

  return items.filter(Boolean) as JsonObject[];
}

function detailRowsValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "detail_rows", "Details at a Glance", errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item) => {
    const itemRecord = recordFromUnknown(item);
    const label = nullableString(itemRecord?.label);
    const rowValue = nullableString(itemRecord?.value);

    if (!itemRecord || (!label && !rowValue)) {
      return itemRecord ? undefined : null;
    }

    return itemRecord && label && rowValue ? { label, value: rowValue } : null;
  });

  if (items.some((item) => item === null)) {
    errors.detail_rows = "Each detail row must include label and value.";
    return [];
  }

  return items.filter(Boolean) as JsonObject[];
}

function textItemsValue(record: Record<string, unknown>, key: string, label: string, errors: Record<string, string>) {
  const value = jsonArrayValue(record, key, label, errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item) => {
    if (typeof item === "string") {
      const text = nullableString(item);

      return text ? { text } : undefined;
    }

    const itemRecord = recordFromUnknown(item);
    const text = nullableString(itemRecord?.text);

    if (!itemRecord || !text) {
      return itemRecord ? undefined : null;
    }

    return itemRecord && text ? { text } : null;
  });

  if (items.some((item) => item === null)) {
    errors[key] = `Each ${label.toLowerCase()} item must include text.`;
    return [];
  }

  return items.filter(Boolean) as JsonObject[];
}

function productFaqsValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "product_faqs", "Product FAQs", errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item) => {
    const itemRecord = recordFromUnknown(item);
    const question = nullableString(itemRecord?.question) ?? nullableString(itemRecord?.title);
    const answer = nullableString(itemRecord?.answer) ?? nullableString(itemRecord?.content);

    if (!itemRecord || (!question && !answer)) {
      return itemRecord ? undefined : null;
    }

    return itemRecord && question && answer ? { question, answer } : null;
  });

  if (items.some((item) => item === null)) {
    errors.product_faqs = "Each product FAQ must include question and answer.";
    return [];
  }

  return items.filter(Boolean) as JsonObject[];
}

function accordionSectionsValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "accordion_sections", "Accordion sections", errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item) => {
    const itemRecord = recordFromUnknown(item);
    const title = nullableString(itemRecord?.title);
    const content = nullableString(itemRecord?.content);

    if (!itemRecord || (!title && !content)) {
      return itemRecord ? undefined : null;
    }

    return itemRecord && title && content ? { title, content } : null;
  });

  if (items.some((item) => item === null)) {
    errors.accordion_sections = "Each accordion section must include title and content.";
    return [];
  }

  return items.filter(Boolean) as JsonObject[];
}

function relatedProductSlugsValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "related_product_slugs", "Related product slugs", errors);

  if (value.length === 0) {
    return [];
  }

  const hasInvalidItem = value.some((item) => typeof item !== "string");
  const slugs = value.map((item) => cleanString(item)).filter(Boolean);

  if (hasInvalidItem) {
    errors.related_product_slugs = "Related product slugs must be an array of strings.";
    return [];
  }

  return Array.from(new Set(slugs));
}

function booleanValue(value: unknown) {
  return value === true || value === "true";
}

function productImagesValue(record: Record<string, unknown>, errors: Record<string, string>) {
  const value = jsonArrayValue(record, "images", "Product images", errors);

  if (value.length === 0) {
    return [];
  }

  const items = value.map((item, index) => {
    if (typeof item === "string") {
      const url = nullableString(item);

      return url
        ? {
            url,
            position: index + 1,
            is_primary: false
          }
        : undefined;
    }

    const itemRecord = recordFromUnknown(item);
    const url = nullableString(itemRecord?.url);
    const alt = nullableString(itemRecord?.alt) ?? nullableString(itemRecord?.alt_text) ?? nullableString(itemRecord?.altText);
    const position = numberValue(itemRecord?.position);

    if (!itemRecord || (!url && !alt)) {
      return itemRecord ? undefined : null;
    }

    return url
      ? {
          url,
          ...(alt ? { alt } : {}),
          position: position && Number.isInteger(position) && position > 0 ? position : index + 1,
          is_primary: booleanValue(itemRecord?.is_primary) || booleanValue(itemRecord?.isPrimary)
        }
      : null;
  });

  if (items.some((item) => item === null)) {
    errors.images = "Each gallery image must include a URL.";
    return [];
  }

  const cleanedItems = (items.filter(Boolean) as ProductGalleryImage[]).sort(
    (first, second) => first.position - second.position
  );

  if (cleanedItems.length === 0) {
    return [];
  }

  const primaryIndex = cleanedItems.findIndex((item) => item.is_primary);
  const normalizedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return cleanedItems.map((item, index) => ({
    url: item.url,
    ...(item.alt ? { alt: item.alt } : {}),
    position: index + 1,
    is_primary: index === normalizedPrimaryIndex
  }));
}

export function validateAdminProductPayload(input: unknown): ValidationResult {
  const record = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};

  const title = cleanString(record.title);
  const slug = cleanString(record.slug);
  const price = numberValue(record.price);
  const compareAtPrice = numberValue(record.compare_at_price);
  const stockQuantity = numberValue(record.stock_quantity);
  const sortOrder = numberValue(record.sort_order);
  const currency = cleanString(record.currency) || "USD";
  const status = cleanString(record.status) || "draft";
  const inventoryStatus = cleanString(record.inventory_status) || "in_stock";
  const homepageSection = cleanString(record.homepage_section);
  const publishedAt = nullableString(record.published_at);
  const productHighlights = productHighlightsValue(record, errors);
  const detailRows = detailRowsValue(record, errors);
  const bestFor = textItemsValue(record, "best_for", "Best For", errors);
  const careInstructions = textItemsValue(record, "care_instructions", "Care Instructions", errors);
  const productFaqs = productFaqsValue(record, errors);
  const accordionSections = accordionSectionsValue(record, errors);
  const relatedProductSlugs = relatedProductSlugsValue(record, errors);
  const images = productImagesValue(record, errors);

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!slug) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(slug)) {
    errors.slug = "Slug must be URL-safe and use lowercase letters, numbers, and hyphens.";
  }

  if (price === null) {
    errors.price = "Price is required.";
  } else if (price < 0) {
    errors.price = "Price must be greater than or equal to 0.";
  }

  if (compareAtPrice !== null && compareAtPrice < 0) {
    errors.compare_at_price = "Compare at price must be greater than or equal to 0.";
  }

  if (stockQuantity !== null && stockQuantity < 0) {
    errors.stock_quantity = "Stock quantity must be greater than or equal to 0.";
  }

  if (record.sort_order !== "" && record.sort_order !== null && record.sort_order !== undefined) {
    if (sortOrder === null || !Number.isInteger(sortOrder) || sortOrder <= 0) {
      errors.sort_order = "Sort order must be a positive whole number, or leave it blank.";
    }
  }

  if (!isProductStatus(status)) {
    errors.status = "Status must be active, draft, or archived.";
  }

  if (!isInventoryStatus(inventoryStatus)) {
    errors.inventory_status = "Inventory status must be in stock, out of stock, or preorder.";
  }

  if (homepageSection && !isHomepageSection(homepageSection)) {
    errors.homepage_section = "Homepage section must be featured, best_seller, new_arrivals, or blank.";
  }

  if (publishedAt && Number.isNaN(new Date(publishedAt).getTime())) {
    errors.published_at = "Published date must be a valid date.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    payload: {
      title,
      slug,
      category: nullableString(record.category),
      description: nullableString(record.description),
      price: price ?? 0,
      compare_at_price: compareAtPrice,
      currency,
      image_url: nullableString(record.image_url),
      image_alt: nullableString(record.image_alt),
      images,
      status: status as ProductStatus,
      inventory_status: inventoryStatus as InventoryStatus,
      stock_quantity: stockQuantity,
      is_featured: Boolean(record.is_featured),
      is_sale: Boolean(record.is_sale),
      sort_order: sortOrder,
      homepage_section: homepageSection ? (homepageSection as HomepageSection) : null,
      badge: nullableString(record.badge),
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      short_description: nullableString(record.short_description),
      product_highlights: productHighlights,
      detail_rows: detailRows,
      best_for: bestFor,
      care_instructions: careInstructions,
      product_faqs: productFaqs,
      accordion_sections: accordionSections,
      related_product_slugs: relatedProductSlugs,
      seo_title: nullableString(record.seo_title),
      seo_description: nullableString(record.seo_description),
      google_product_category: nullableString(record.google_product_category)
    }
  };
}
