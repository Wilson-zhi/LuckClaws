export const categoryStatuses = ["active", "draft", "archived"] as const;
export const defaultCategorySortOrder = 9999;

type CategoryStatus = (typeof categoryStatuses)[number];

export type AdminCategoryMutationPayload = {
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: CategoryStatus;
  sort_order: number | null;
  show_in_nav: boolean;
  show_on_home: boolean;
  seo_title: string | null;
  seo_description: string | null;
  google_product_category: string | null;
};

type ValidationResult =
  | {
      ok: true;
      payload: AdminCategoryMutationPayload;
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const existingCategorySlugByName: Record<string, string> = {
  "Beds & Blankets": "beds-blankets",
  "Cat Toys": "cat-toys",
  "Dog Toys": "dog-toys",
  "Pet Apparel": "pet-apparel",
  "Walking Essentials": "walking-essentials"
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown) {
  const cleaned = cleanString(value);

  return cleaned || null;
}

function numberValue(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function booleanValue(value: unknown) {
  return value === true || value === "true";
}

function isCategoryStatus(value: string): value is CategoryStatus {
  return categoryStatuses.includes(value as CategoryStatus);
}

export function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function categorySlugFromName(value: string) {
  const cleaned = cleanString(value);

  return existingCategorySlugByName[cleaned] ?? slugifyCategoryName(cleaned);
}

export function validateAdminCategoryPayload(input: unknown): ValidationResult {
  const record = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};
  const name = cleanString(record.name);
  const slug = cleanString(record.slug) || slugifyCategoryName(name);
  const status = cleanString(record.status) || "draft";
  const sortOrder = numberValue(record.sort_order);

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!slug) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(slug)) {
    errors.slug = "Slug must be URL-safe and use lowercase letters, numbers, and hyphens.";
  }

  if (!isCategoryStatus(status)) {
    errors.status = "Status must be active, draft, or archived.";
  }

  if (record.sort_order !== "" && record.sort_order !== null && record.sort_order !== undefined) {
    if (sortOrder === null || !Number.isInteger(sortOrder) || sortOrder <= 0) {
      errors.sort_order = "Sort order must be a positive whole number, or leave it blank.";
    }
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
      name,
      slug,
      description: nullableString(record.description),
      image_url: nullableString(record.image_url),
      status: status as CategoryStatus,
      sort_order: sortOrder,
      show_in_nav: booleanValue(record.show_in_nav),
      show_on_home: booleanValue(record.show_on_home),
      seo_title: nullableString(record.seo_title),
      seo_description: nullableString(record.seo_description),
      google_product_category: nullableString(record.google_product_category)
    }
  };
}
