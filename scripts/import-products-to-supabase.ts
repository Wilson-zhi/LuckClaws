import { loadEnvConfig } from "@next/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { bestSellers, brandName, products, type Product } from "../src/data/products";

type ProductImageInput = {
  url: string;
  alt_text: string | null;
  position: number;
};

type ProductWriteResult = {
  id: string;
  action: "inserted" | "updated";
};

type ProductPayload = {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: "USD";
  image_url: string | null;
  images?: ProductImageInput[];
  variants?: Record<string, unknown> | null;
  status: "active";
  inventory_status: "in_stock";
  stock_quantity: number | null;
  is_featured: boolean;
  is_sale: boolean;
  seo_title: string;
  seo_description: string;
  google_product_category: string | null;
};

type ProductImageInsert = {
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
};

type ProductsTableRow = ProductPayload & {
  id: string;
  created_at: string | null;
  updated_at: string | null;
};

type ProductImagesTableRow = ProductImageInsert & {
  id: string;
};

type ImportDatabase = {
  public: {
    Tables: {
      products: {
        Row: ProductsTableRow;
        Insert: ProductPayload;
        Update: Partial<ProductPayload>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImagesTableRow;
        Insert: ProductImageInsert;
        Update: Partial<ProductImageInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type ImportSupabaseClient = SupabaseClient<ImportDatabase>;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const featuredSlugs = new Set(bestSellers.map((product) => product.slug));

function assertEnvironment() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required.");
  }

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is required.");
  }
}

function googleProductCategory(product: Product) {
  switch (product.category) {
    case "Beds & Blankets":
      return "Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds";
    case "Cat Toys":
      return "Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Toys";
    case "Dog Toys":
      return "Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Toys";
    case "Dog Treats":
      return "Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats";
    case "Dining":
      return "Animals & Pet Supplies > Pet Supplies > Pet Bowls, Feeders & Waterers";
    case "Pet Apparel":
      return "Animals & Pet Supplies > Pet Supplies > Pet Clothing";
    case "Storage":
      return "Animals & Pet Supplies > Pet Supplies > Pet Food Storage Containers";
    case "Walking Essentials":
      return "Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Leashes";
    default:
      return null;
  }
}

function uniqueProductImages(product: Product): ProductImageInput[] {
  const urls = [product.image, ...(product.gallery ?? [])].filter(Boolean);
  const uniqueUrls = Array.from(new Set(urls));

  return uniqueUrls.map((url, index) => ({
    url,
    alt_text: product.imageAlt ?? product.alt ?? `${brandName} ${product.title}`,
    position: index + 1
  }));
}

function variantsFromProduct(product: Product) {
  const variants = {
    selectedColor: product.selectedColor ?? null,
    colors: product.colors ?? null,
    size: product.size ?? null,
    material: product.material ?? null,
    materialTags: product.materialTags ?? null,
    benefits: product.benefits ?? null,
    productType: product.productType ?? null,
    careGuidance: product.careGuidance ?? null,
    shippingClass: product.shippingClass ?? null,
    shippingRate: product.shippingRate ?? null,
    shippingDescription: product.shippingDescription ?? null
  };

  return Object.values(variants).some((value) => value !== null) ? variants : null;
}

function productPayload(product: Product): ProductPayload {
  const isSale = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  return {
    title: product.title,
    slug: product.slug,
    category: product.category,
    description: product.description,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    currency: "USD",
    image_url: product.image ?? null,
    images: uniqueProductImages(product),
    variants: variantsFromProduct(product),
    status: "active",
    inventory_status: "in_stock",
    stock_quantity: null,
    is_featured: featuredSlugs.has(product.slug),
    is_sale: isSale,
    seo_title: `${product.title} | ${brandName}`,
    seo_description: product.shortDescription ?? product.description,
    google_product_category: googleProductCategory(product)
  };
}

function stripOptionalJsonColumns(payload: ProductPayload) {
  const safePayload = { ...payload };

  delete safePayload.images;
  delete safePayload.variants;

  return safePayload;
}

function isMissingOptionalJsonColumnError(message: string) {
  return message.includes("'images' column") || message.includes("'variants' column") || message.includes("schema cache");
}

async function writeProduct(
  supabase: ImportSupabaseClient,
  payload: ProductPayload
): Promise<ProductWriteResult> {
  const { data: existingRows, error: existingError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", payload.slug)
    .limit(1);

  if (existingError) {
    throw new Error(`Unable to check existing product ${payload.slug}: ${existingError.message}`);
  }

  const existingId = (existingRows?.[0] as { id: string } | undefined)?.id;

  if (existingId) {
    const updateResult = await supabase
      .from("products")
      .update(payload)
      .eq("id", existingId)
      .select("id")
      .single();

    if (updateResult.error && isMissingOptionalJsonColumnError(updateResult.error.message)) {
      const retryResult = await supabase
        .from("products")
        .update(stripOptionalJsonColumns(payload))
        .eq("id", existingId)
        .select("id")
        .single();

      if (retryResult.error) {
        throw new Error(`Unable to update product ${payload.slug}: ${retryResult.error.message}`);
      }

      return {
        id: (retryResult.data as { id: string }).id,
        action: "updated"
      };
    }

    if (updateResult.error) {
      throw new Error(`Unable to update product ${payload.slug}: ${updateResult.error.message}`);
    }

    return {
      id: (updateResult.data as { id: string }).id,
      action: "updated"
    };
  }

  const insertResult = await supabase.from("products").insert(payload).select("id").single();

  if (insertResult.error && isMissingOptionalJsonColumnError(insertResult.error.message)) {
    const retryResult = await supabase
      .from("products")
      .insert(stripOptionalJsonColumns(payload))
      .select("id")
      .single();

    if (retryResult.error) {
      throw new Error(`Unable to insert product ${payload.slug}: ${retryResult.error.message}`);
    }

    return {
      id: (retryResult.data as { id: string }).id,
      action: "inserted"
    };
  }

  if (insertResult.error) {
    throw new Error(`Unable to insert product ${payload.slug}: ${insertResult.error.message}`);
  }

  return {
    id: (insertResult.data as { id: string }).id,
    action: "inserted"
  };
}

async function replaceProductImages(
  supabase: ImportSupabaseClient,
  productId: string,
  images: ProductImageInput[]
) {
  const { error: deleteError } = await supabase.from("product_images").delete().eq("product_id", productId);

  if (deleteError) {
    throw new Error(`Unable to clear product images for ${productId}: ${deleteError.message}`);
  }

  if (images.length === 0) {
    return;
  }

  const imageRows: ProductImageInsert[] = images.map((image) => ({
    product_id: productId,
    url: image.url,
    alt_text: image.alt_text,
    position: image.position
  }));

  const { error: insertError } = await supabase.from("product_images").insert(imageRows);

  if (insertError) {
    throw new Error(`Unable to insert product images for ${productId}: ${insertError.message}`);
  }
}

async function main() {
  assertEnvironment();

  const supabase = createClient<ImportDatabase>(supabaseUrl!, serviceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  let inserted = 0;
  let updated = 0;
  let imageRows = 0;

  for (const product of products) {
    const payload = productPayload(product);
    const result = await writeProduct(supabase, payload);

    if (result.action === "inserted") {
      inserted += 1;
    } else {
      updated += 1;
    }

    await replaceProductImages(supabase, result.id, payload.images ?? []);
    imageRows += payload.images?.length ?? 0;
  }

  console.log(`Imported ${products.length} products into Supabase products.`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Product image rows written: ${imageRows}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
