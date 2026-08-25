import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

export const storefrontCacheSeconds = 60;

export const storefrontCacheTags = {
  about: "storefront-about",
  categories: "storefront-categories",
  homepage: "storefront-homepage",
  products: "storefront-products"
} as const;

export type StorefrontCacheScope = keyof typeof storefrontCacheTags;

function revalidateCollectionPaths() {
  revalidatePath("/collections");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/sale");
  revalidatePath("/search");
}

export function revalidateStorefrontScope(scope: StorefrontCacheScope) {
  revalidateTag(storefrontCacheTags[scope]);

  if (scope === "about") {
    revalidatePath("/about");
    return;
  }

  if (scope === "homepage") {
    revalidatePath("/");
    return;
  }

  if (scope === "products") {
    revalidateTag(storefrontCacheTags.homepage);
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    revalidateCollectionPaths();
    return;
  }

  revalidateTag(storefrontCacheTags.products);
  revalidateTag(storefrontCacheTags.homepage);
  revalidatePath("/");
  revalidatePath("/products/[slug]", "page");
  revalidateCollectionPaths();
}
