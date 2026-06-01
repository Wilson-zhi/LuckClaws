"use client";

import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { type Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.selectedColor ?? product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <span className="flex text-primary-container" aria-label={`${product.rating} star rating`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} aria-hidden className="h-4 w-4 fill-current" />
          ))}
        </span>
        <span className="font-semibold">{product.rating}</span>
        <a href="#reviews" className="text-on-surface-variant underline underline-offset-4">
          ({product.reviewCount} Reviews)
        </a>
      </div>

      <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-3 text-base leading-7 text-on-surface-variant">{product.description}</p>

      <div className="mt-6 rounded-md bg-surface-container-lowest p-5 shadow-soft">
        {product.regularPrice && (
          <p className="text-sm text-on-surface-variant line-through">{formatPrice(product.regularPrice)}</p>
        )}
        <div className="flex items-center gap-3">
          <p className="font-heading text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
          {product.regularPrice && (
            <span className="rounded-full bg-error/10 px-3 py-1 text-xs font-bold text-error">Save 25%</span>
          )}
        </div>
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
                    "h-10 w-10 rounded-full border-2 border-white shadow-soft ring-offset-2",
                    selectedColor === color ? "ring-2 ring-primary" : "ring-1 ring-outline-variant",
                    swatches[index]
                  )}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color}`}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <QuantitySelector quantity={quantity} onChange={setQuantity} label={product.name} />
        <span className="text-sm font-semibold text-on-surface-variant">In stock, ready to ship.</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={{ ...product, selectedColor }} quantity={quantity} className="w-full">
          <ShoppingCart aria-hidden className="h-4 w-4" />
          Add to Cart
        </AddToCartButton>
        <button
          type="button"
          className="rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary-container/10"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

