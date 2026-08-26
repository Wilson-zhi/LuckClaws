"use client";

import { Check, PawPrint, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BuyNowButton } from "@/components/product/BuyNowButton";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { type Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.selectedColor ?? product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const productForCart = { ...product, selectedColor };
  const purchaseDisabled =
    product.availability === "out_of_stock" ||
    (product.availability !== "preorder" && product.stockQuantity === 0);
  const maxQuantity =
    !purchaseDisabled && product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity > 0
      ? Math.floor(product.stockQuantity)
      : undefined;
  const choiceTotal = product.price * quantity;
  const choiceSavings = product.regularPrice ? (product.regularPrice - product.price) * quantity : 0;
  const choiceWord = purchaseDisabled ? "WAIT" : "READY";
  const inventoryLabel =
    purchaseDisabled
      ? "Currently out of stock."
      : product.availability === "preorder"
        ? "Available for preorder."
        : "In stock, ready to ship.";
  const discountPercent = product.regularPrice
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : null;
  const routineLabel =
    product.category === "Dog Toys" || product.category === "Cat Toys"
      ? "a practical pick for play and enrichment"
      : product.category === "Walking Essentials"
        ? "a practical pick for out-the-door routines"
        : product.category === "Beds & Blankets"
          ? "a practical pick for slower, cozier moments"
          : product.category === "Pet Apparel"
            ? "a practical pick for everyday comfort"
            : "a practical pick for the everyday routine";

  return (
    <div className="product-purchase-enter">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          {product.category}
        </span>
        {product.rating && product.reviewCount && (
          <>
            <span className="flex text-primary-container" aria-label={`${product.rating} star rating`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} aria-hidden className="h-4 w-4 fill-current" />
              ))}
            </span>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-on-surface-variant">({product.reviewCount} Reviews)</span>
          </>
        )}
      </div>

      <h1 className="mt-3 max-w-[13ch] font-heading text-4xl font-extrabold leading-tight text-balance md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-3 text-base leading-7 text-on-surface-variant">{product.shortDescription}</p>
      <p className="lc-hand-note mt-4 flex items-center gap-2 text-lg text-[#8E5700]">
        <PawPrint aria-hidden className="h-4 w-4" />
        {routineLabel}
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-md bg-surface-container-lowest p-5 shadow-soft">
        <div>
        {product.regularPrice && (
          <p className="text-sm text-on-surface-variant line-through">{formatPrice(product.regularPrice)}</p>
        )}
        <div className="flex items-center gap-3">
          <p className="font-heading text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
          {discountPercent && (
            <span className="rounded-full bg-error/10 px-3 py-1 text-xs font-bold text-error">
              Save {discountPercent}%
            </span>
          )}
        </div>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-[#536B4B]">
          <Check aria-hidden className="h-4 w-4" />
          {inventoryLabel}
        </p>
      </div>

      {product.colors && (
        <div className="mt-6">
          <p className="text-sm font-semibold">
            Selected Color: <span className="font-normal text-on-surface-variant">{selectedColor}</span>
          </p>
          <div className="mt-3 flex gap-3">
            {product.colors.map((color, index) => {
              const swatches = ["bg-[#536B4B]", "bg-[#E7D7B7]", "bg-[#D38C33]"];
              return (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "h-10 w-10 rounded-full border-2 border-white shadow-soft ring-offset-2 transition-[box-shadow,transform] duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:scale-100",
                    selectedColor === color ? "ring-2 ring-primary" : "ring-1 ring-outline-variant",
                    swatches[index]
                  )}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color}`}
                  aria-pressed={selectedColor === color}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="product-choice-ticket relative mt-6 isolate min-h-[132px] overflow-hidden rounded-md bg-[#2F493D] p-4 text-white shadow-soft sm:p-5">
        <span className="product-choice-word" aria-hidden="true">{choiceWord}</span>
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFD78D]">Current choice</p>
            <p key={`${selectedColor}-${quantity}`} className="product-choice-update mt-2 truncate text-sm font-bold text-white">
              {quantity} {quantity === 1 ? "item" : "items"}{selectedColor ? ` · ${selectedColor}` : ""}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">Item total</p>
            <p key={`total-${quantity}`} className="product-choice-update mt-1 font-heading text-2xl font-extrabold text-[#FFD78D]" aria-live="polite">
              {formatPrice(choiceTotal)}
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-t border-white/15 pt-4">
          <QuantitySelector
            quantity={quantity}
            onChange={setQuantity}
            max={maxQuantity}
            disabled={purchaseDisabled}
            label={product.name}
          />
          <div className="min-w-0 text-xs font-semibold leading-5">
            <p className="text-white/72">
              {choiceSavings > 0 ? `You save ${formatPrice(choiceSavings)} on this choice.` : inventoryLabel}
            </p>
            {choiceSavings > 0 ? <p className="mt-1 text-[#FFD78D]">{inventoryLabel}</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={productForCart} quantity={quantity} className="w-full" disabled={purchaseDisabled}>
          <ShoppingCart aria-hidden className="h-4 w-4" />
          Add to Cart
        </AddToCartButton>
        <BuyNowButton product={productForCart} quantity={quantity} className="w-full" disabled={purchaseDisabled} />
      </div>
      <WishlistButton
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
        className="mt-3 w-full"
        showLabel
      />
      <p className="lc-hand-note mt-4 text-center text-sm text-[#8E5700]">
        compare the details · save it for later · choose when ready
      </p>
    </div>
  );
}
