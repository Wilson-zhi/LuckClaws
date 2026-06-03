import { type Product } from "@/data/products";

const collectionHrefBySlug: Record<string, string> = {
  all: "/collections",
  "beds-blankets": "/collections/beds-blankets",
  "cat-toys": "/collections/cat-toys",
  "dog-toys": "/collections/dog-toys",
  "pet-apparel": "/collections/pet-apparel",
  "walking-essentials": "/collections/walking-essentials"
};

export function getProductPath(product: Product) {
  return product.productUrl;
}

export function getProductPathBySlug(slug: string) {
  return `/products/${slug}`;
}

export function getCollectionPath(product: Product) {
  return collectionHrefBySlug[product.collectionSlug] ?? "/collections";
}
