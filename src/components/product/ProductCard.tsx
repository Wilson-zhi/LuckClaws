"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Star } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { type Product } from "@/data/products";
import { trackSelectItem } from "@/lib/ga4-ecommerce";
import { getProductPath } from "@/lib/product-links";
import { cn, formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  featured?: boolean;
  compact?: boolean;
  itemListName?: string;
  badgeLabel?: string;
};

function fallbackProductImage(product: Product) {
  const normalized = `${product.name} ${product.slug} ${product.category}`.toLowerCase();

  if (normalized.includes("puzzle")) {
    return "/images/premium-puzzle-feeder.jpg";
  }

  if (normalized.includes("snuffle")) {
    return "/images/interactive-snuffle-mat-lifestyle.jpg";
  }

  if (normalized.includes("cat")) {
    return "/images/organic-catnip-mouse.jpg";
  }

  if (normalized.includes("walk") || normalized.includes("leash") || normalized.includes("harness")) {
    return "/images/category-walking-essentials.jpg";
  }

  if (normalized.includes("apparel") || normalized.includes("sweater") || normalized.includes("tee")) {
    return "/images/category-pet-apparel.jpg";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "/images/category-beds-blankets.jpg";
  }

  return "/images/category-dog-toys.jpg";
}

function productCardImage(product: Product) {
  const image = product.image.trim();
  const normalized = image.toLowerCase();

  if (!image || normalized.includes("icon") || normalized.includes("logo")) {
    return fallbackProductImage(product);
  }

  return image;
}

export function ProductCard({
  product,
  featured = false,
  compact = false,
  itemListName,
  badgeLabel
}: ProductCardProps) {
  const href = getProductPath(product);
  const displayBadge = badgeLabel ?? product.badge;
  const imageSrc = productCardImage(product);

  if (featured) {
    return (
      <article className="group overflow-hidden rounded-lg bg-surface-container-lowest shadow-ambient transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:shadow-lift motion-reduce:hover:translate-y-0">
        <div className="relative">
          <Link
            href={href}
            className="relative block aspect-[1.35] overflow-hidden bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => trackSelectItem(product, itemListName)}
          >
            {displayBadge && (
              <span className="absolute left-6 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-soft">
                {displayBadge}
              </span>
            )}
            <Image
              src={imageSrc}
              alt={product.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.06]"
            />
          </Link>
          <WishlistButton
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            className="absolute right-5 top-5 z-20 !h-12 !w-12 !p-0"
          />
        </div>
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {product.subcategory?.replace(" Toys", "") ?? product.category}
              </p>
              <Link
                href={href}
                className="mt-2 block font-heading text-2xl font-bold transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => trackSelectItem(product, itemListName)}
              >
                {product.name}
              </Link>
              {product.rating && (
                <p className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
                  <Star aria-hidden className="h-4 w-4 fill-primary-container text-primary-container" />
                  {product.rating} ({product.reviewCount} reviews)
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-heading text-3xl font-bold text-error">{formatPrice(product.price)}</p>
              {product.regularPrice && (
                <p className="text-sm text-on-surface-variant line-through">
                  {formatPrice(product.regularPrice)}
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-on-surface-variant">{product.description}</p>
          <AddToCartButton product={product} className="mt-6 w-full" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient transition duration-300 hover:-translate-y-1.5 hover:border-primary/45 hover:shadow-[0_22px_58px_rgba(25,28,30,0.12)] focus-within:shadow-lift motion-reduce:hover:translate-y-0",
        compact && "rounded-md"
      )}
    >
      <div className="relative">
        <Link
          href={href}
          className={cn(
            "relative block aspect-square overflow-hidden bg-[#F7EAD8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            compact && "aspect-[1.12]"
          )}
          onClick={() => trackSelectItem(product, itemListName)}
        >
          {(product.badge || product.isNew) && (
            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary shadow-soft">
              {product.badge ?? "New"}
            </span>
          )}
          <Image
            src={imageSrc}
            alt={product.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 280px, 45vw"
            className="object-cover transition duration-500 group-hover:scale-[1.055]"
          />
        </Link>
        <WishlistButton
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          className="absolute right-3 top-3 z-20 !h-9 !w-9 !p-0"
        />
      </div>
      <div className={cn("flex flex-1 flex-col p-4 md:p-5", compact && "md:p-4")}>
        <div
          className={cn(
            "grid grid-rows-[1rem_3rem_1.25rem] content-start gap-y-1 md:grid-rows-[1rem_3.5rem_1.25rem]",
            compact && "md:grid-rows-[1rem_3rem_1.25rem]"
          )}
        >
          <p className="truncate text-[11px] font-bold uppercase tracking-widest text-primary/90">
            {product.category}
          </p>
          <Link
            href={href}
            className={cn(
              "line-clamp-2 self-start font-heading text-base font-bold leading-6 transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:text-lg md:leading-7",
              compact && "md:text-base"
            )}
            onClick={() => trackSelectItem(product, itemListName)}
          >
            {product.name}
          </Link>
          <div className="flex min-h-5 items-center">
            {product.rating ? (
              <p className="flex items-center gap-1 text-xs text-on-surface-variant">
                <Star aria-hidden className="h-3.5 w-3.5 fill-primary-container text-primary-container" />
                {product.rating}
                {product.reviewCount ? ` (${product.reviewCount})` : ""}
              </p>
            ) : (
              <span aria-hidden className="block h-5" />
            )}
          </div>
        </div>
        <div
          className={cn(
            "mt-auto flex min-h-11 items-center justify-between gap-3 pt-4",
            compact && "pt-3"
          )}
        >
          <div className="flex min-w-0 items-baseline gap-2 overflow-hidden tabular-nums">
            <p className="whitespace-nowrap font-semibold text-on-surface">{formatPrice(product.price)}</p>
            {product.regularPrice && (
              <p className="truncate whitespace-nowrap text-sm text-on-surface-variant line-through">
                {formatPrice(product.regularPrice)}
              </p>
            )}
          </div>
          <AddToCartButton product={product} variant="icon">
            <Plus aria-hidden className="h-5 w-5" />
          </AddToCartButton>
        </div>
        <Link
          href={href}
          className={cn(
            "mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary transition hover:translate-x-0.5 hover:text-[#5B3300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-x-0",
            compact && "mt-3"
          )}
          onClick={() => trackSelectItem(product, itemListName)}
        >
          View details
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
