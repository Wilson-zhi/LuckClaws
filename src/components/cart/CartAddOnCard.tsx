"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { type Product } from "@/data/products";
import { trackSelectItem } from "@/lib/ga4-ecommerce";
import { cn, formatPrice } from "@/lib/utils";

type CartAddOnCardProps = {
  product: Product;
  itemListName: string;
  compact?: boolean;
};

const collectionRouteByCategory: Record<string, string> = {
  "Beds & Blankets": "/collections/beds-blankets",
  "Cat Toys": "/collections/cat-toys",
  "Dog Toys": "/collections/dog-toys",
  "Pet Apparel": "/collections/pet-apparel",
  "Walking Essentials": "/collections/walking-essentials"
};

function getProductHref(product: Product) {
  return product.id === "interactive-snuffle-mat"
    ? "/products/interactive-snuffle-mat"
    : collectionRouteByCategory[product.category] ?? "/collections";
}

export function CartAddOnCard({ product, itemListName, compact = false }: CartAddOnCardProps) {
  const href = getProductHref(product);
  const handleSelect = () => trackSelectItem(product, itemListName);

  return (
    <article
      className={cn(
        "flex items-center gap-4 rounded-md bg-surface-container-lowest p-4 shadow-soft",
        compact && "bg-surface-container-low p-3"
      )}
    >
      <Link
        href={href}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-container"
        onClick={handleSelect}
        aria-label={`View ${product.name}`}
      >
        <Image src={product.image} alt={product.alt} fill sizes="80px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="line-clamp-2 font-heading font-bold hover:text-primary"
          onClick={handleSelect}
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>
      <AddToCartButton product={product} variant={compact ? "outline" : "icon"} className={compact ? "px-4 py-2" : ""}>
        Quick Add
      </AddToCartButton>
    </article>
  );
}
