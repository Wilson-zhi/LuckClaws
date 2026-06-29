"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { type Product } from "@/data/products";
import { trackSelectItem } from "@/lib/ga4-ecommerce";
import { getProductPath } from "@/lib/product-links";
import { formatPrice } from "@/lib/utils";

type HomeFeaturedStoryProps = {
  product: Product;
};

const itemListName = "Homepage Featured Product Story";

export function HomeFeaturedStory({ product }: HomeFeaturedStoryProps) {
  const href = getProductPath(product);
  const benefits = product.benefits?.length
    ? product.benefits.slice(0, 3)
    : ["Useful for everyday routines", "Easy to compare before checkout", "Selected for practical pet households"];

  return (
    <section className="bg-[#F3E5D2] py-12 md:py-16">
      <div className="section-shell">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#E3C9A8] bg-[#FFF9EF] shadow-lift lg:grid-cols-[1.05fr_0.95fr]">
          <Link
            href={href}
            onClick={() => trackSelectItem(product, itemListName)}
            className="group relative min-h-[360px] overflow-hidden bg-[#F7EAD8] md:min-h-[520px]"
          >
            {product.badge && (
              <span className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
                {product.badge}
              </span>
            )}
            <Image
              src={product.image}
              alt={product.alt}
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
            />
          </Link>

          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured pick</p>
            <Link
              href={href}
              onClick={() => trackSelectItem(product, itemListName)}
              className="mt-3 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#24170E] md:text-5xl">
                {product.name}
              </h2>
            </Link>
            <p className="mt-5 text-base leading-7 text-[#6B5540]">
              {product.shortDescription || product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <p className="font-heading text-3xl font-extrabold text-primary">{formatPrice(product.price)}</p>
              {product.regularPrice && (
                <p className="pb-1 text-sm text-on-surface-variant line-through">
                  {formatPrice(product.regularPrice)}
                </p>
              )}
            </div>

            <ul className="mt-7 grid gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm font-semibold leading-6 text-[#4E3928]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={href}
                onClick={() => trackSelectItem(product, itemListName)}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#B8976D] bg-white px-6 py-3 text-sm font-bold text-[#3A2514] transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              >
                View Product
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              <AddToCartButton product={product} className="sm:min-w-40">
                <ShoppingCart aria-hidden className="h-4 w-4" />
                Add to Cart
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
