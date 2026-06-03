"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { type Product } from "@/data/products";
import { trackSelectItem } from "@/lib/ga4-ecommerce";
import { getProductPath } from "@/lib/product-links";
import { formatPrice } from "@/lib/utils";

type HomeFeaturedProductProps = {
  product: Product;
};

const itemListName = "Homepage Featured Product";

export function HomeFeaturedProduct({ product }: HomeFeaturedProductProps) {
  const href = getProductPath(product);
  const handleSelect = () => trackSelectItem(product, itemListName);

  return (
    <section className="section-shell py-12 md:py-16">
      <div className="grid gap-8 rounded-lg bg-surface-container-lowest p-5 shadow-ambient md:grid-cols-[0.92fr_1.08fr] md:p-8 lg:p-10">
        <Link
          href={href}
          className="group relative aspect-[1.05] overflow-hidden rounded-lg bg-surface-container"
          onClick={handleSelect}
        >
          {product.badge && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
              {product.badge}
            </span>
          )}
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Featured Best Seller</p>
          <Link href={href} onClick={handleSelect} className="mt-3 block hover:text-primary">
            <h2 className="font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              {product.name}
            </h2>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <Star aria-hidden className="h-4 w-4 fill-primary-container text-primary-container" />
              {product.rating}
            </span>
            <span>{product.reviewCount} reviews</span>
            <span aria-hidden>&bull;</span>
            <span>{product.selectedColor}</span>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
            Encourage natural foraging, support mental stimulation, and help slow down mealtime with our
            best-selling enrichment mat.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="font-heading text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            {product.regularPrice && (
              <p className="pb-1 text-sm text-on-surface-variant line-through">
                {formatPrice(product.regularPrice)}
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href}
              onClick={handleSelect}
              className="inline-flex items-center justify-center rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              Shop Interactive Snuffle Mat
            </Link>
            <AddToCartButton product={product} className="sm:min-w-40">
              <ShoppingCart aria-hidden className="h-4 w-4" />
              Add to Cart
            </AddToCartButton>
          </div>
        </div>
      </div>
    </section>
  );
}
