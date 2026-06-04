export const productStatuses = ["active", "draft", "archived"] as const;
export const inventoryStatuses = ["in_stock", "out_of_stock", "preorder"] as const;

type ProductStatus = (typeof productStatuses)[number];
type InventoryStatus = (typeof inventoryStatuses)[number];

export type AdminProductMutationPayload = {
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  status: ProductStatus;
  inventory_status: InventoryStatus;
  stock_quantity: number | null;
  is_featured: boolean;
  is_sale: boolean;
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

export function validateAdminProductPayload(input: unknown): ValidationResult {
  const record = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};

  const title = cleanString(record.title);
  const slug = cleanString(record.slug);
  const price = numberValue(record.price);
  const compareAtPrice = numberValue(record.compare_at_price);
  const stockQuantity = numberValue(record.stock_quantity);
  const currency = cleanString(record.currency) || "USD";
  const status = cleanString(record.status) || "draft";
  const inventoryStatus = cleanString(record.inventory_status) || "in_stock";

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

  if (!isProductStatus(status)) {
    errors.status = "Status must be active, draft, or archived.";
  }

  if (!isInventoryStatus(inventoryStatus)) {
    errors.inventory_status = "Inventory status must be in stock, out of stock, or preorder.";
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
      status: status as ProductStatus,
      inventory_status: inventoryStatus as InventoryStatus,
      stock_quantity: stockQuantity,
      is_featured: Boolean(record.is_featured),
      is_sale: Boolean(record.is_sale),
      seo_title: nullableString(record.seo_title),
      seo_description: nullableString(record.seo_description),
      google_product_category: nullableString(record.google_product_category)
    }
  };
}
