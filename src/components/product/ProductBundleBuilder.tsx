"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, LockKeyhole, PawPrint, Plus } from "lucide-react";
import { useState } from "react";
import { AddBundleButton } from "@/components/cart/AddBundleButton";
import { type Product } from "@/data/products";
import { getProductPath } from "@/lib/product-links";
import { cn, formatPrice } from "@/lib/utils";

type ProductBundleBuilderProps = {
  products: Product[];
};

export function ProductBundleBuilder({ products }: ProductBundleBuilderProps) {
  const [selectedIds, setSelectedIds] = useState(() => products.map((product) => product.id));
  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
  const selectedTotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const routeWord = selectedProducts.length >= 3 ? "READY" : selectedProducts.length === 2 ? "PAIR" : "START";
  const routeMessage =
    selectedProducts.length >= 3
      ? "Main item and two useful add-ons"
      : selectedProducts.length === 2
        ? "Main item and one useful add-on"
        : "Main item only";

  if (!products.length) {
    return null;
  }

  const toggleProduct = (productId: string) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((currentId) => currentId !== productId)
        : [...currentIds, productId]
    );
  };

  return (
    <section
      id="product-pairings"
      className="section-shell scroll-mt-20 py-14 md:scroll-mt-[156px] md:py-20 xl:scroll-mt-[166px]"
      aria-labelledby="bundle-builder-title"
    >
      <div
        className="bundle-builder overflow-hidden rounded-lg border border-[#DEC39A] bg-[#FFF9EF] shadow-ambient"
        data-selected-count={selectedProducts.length}
      >
        <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="relative overflow-hidden bg-[#2C1A0D] px-6 py-8 text-white sm:px-8 lg:min-h-[440px] lg:px-10 lg:py-10">
            <PawPrint aria-hidden className="absolute -right-8 top-8 h-32 w-32 rotate-12 text-[#FFD78D]/10" />
            <span key={routeWord} className="bundle-art-word" aria-hidden="true">
              {routeWord}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFD78D]">Routine pairings</p>
            <h2 id="bundle-builder-title" className="mt-4 max-w-md font-heading text-4xl font-extrabold leading-[1.02] sm:text-5xl">
              Build a small routine.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#F4E8D7] sm:text-base">
              Keep the main item, then remove any extra that does not fit your pet&apos;s day.
            </p>
            <p className="lc-hand-note mt-7 max-w-sm text-xl text-[#FFD78D]">
              start with one - add only what helps
            </p>

            <div className="mt-8 border-t border-white/15 pt-6 lg:absolute lg:bottom-10 lg:left-10 lg:right-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DDBB83]">Selected route</p>
                  <p key={`summary-${selectedProducts.length}`} className="bundle-summary-update mt-1 text-sm text-[#F4E8D7]" aria-live="polite">
                    {routeMessage}
                  </p>
                </div>
                <p key={`total-${selectedTotal}`} className="bundle-summary-update font-heading text-3xl font-extrabold tabular-nums text-[#FFD78D]" aria-live="polite">
                  {formatPrice(selectedTotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {products.map((product, index) => {
                const isCurrentProduct = index === 0;
                const isSelected = selectedIds.includes(product.id);
                const selectionLabel = isSelected ? `Remove ${product.name} from bundle` : `Add ${product.name} to bundle`;

                return (
                  <article
                    key={product.id}
                    className={cn(
                      "bundle-product-option grid min-h-[286px] grid-rows-[auto_1fr_auto] overflow-hidden rounded-sm border bg-white",
                      isSelected ? "is-selected border-[#D49A2A] shadow-soft" : "border-[#E8D9C2] opacity-70"
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F1E7D6]">
                      <span className="bundle-route-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Link
                        href={getProductPath(product)}
                        className="absolute inset-0"
                        aria-label={`View ${product.name}`}
                      >
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 100vw"
                          className="object-cover transition-transform duration-500 hover:scale-[1.025] motion-reduce:transition-none motion-reduce:hover:scale-100"
                        />
                      </Link>
                      {isCurrentProduct ? (
                        <span className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E3B75E] bg-[#2C1A0D] text-[#FFD78D] shadow-soft" title="Current item stays selected">
                          <LockKeyhole aria-hidden className="h-4 w-4" />
                          <span className="sr-only">Current item stays selected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={cn(
                            "bundle-product-toggle absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                            isSelected
                              ? "border-[#E3B75E] bg-[#2C1A0D] text-[#FFD78D]"
                              : "border-[#D6BE97] bg-white text-[#855300]"
                          )}
                          onClick={() => toggleProduct(product.id)}
                          aria-pressed={isSelected}
                          aria-label={selectionLabel}
                          title={selectionLabel}
                        >
                          {isSelected ? <Check aria-hidden className="h-5 w-5" /> : <Plus aria-hidden className="h-5 w-5" />}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col px-4 pb-3 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A650B]">
                        {isCurrentProduct ? "Your main item" : "Optional add-on"}
                      </p>
                      <Link
                        href={getProductPath(product)}
                        className="mt-2 line-clamp-2 min-h-12 font-heading text-base font-extrabold leading-6 text-[#2C1A0D] hover:text-primary"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#EFE2CE] px-4 py-3">
                      <span className="font-heading text-lg font-extrabold tabular-nums text-[#2C1A0D]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs font-semibold text-[#795F42]">
                        {isCurrentProduct ? "Included" : isSelected ? "Selected" : "Skipped"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-[#E5CDA8] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-[#6E5842]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FFE5B3] text-[#855300]">
                  <Check aria-hidden className="h-4 w-4" />
                </span>
                <span>Choose only the pairings you want.</span>
              </div>
              <AddBundleButton products={selectedProducts} className="min-h-12 w-full sm:w-auto sm:min-w-[230px]">
                Add {selectedProducts.length} {selectedProducts.length === 1 ? "item" : "items"} to cart
              </AddBundleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
