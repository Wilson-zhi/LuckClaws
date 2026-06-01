"use client";

import Image from "next/image";
import { useState } from "react";
import { type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.gallery ?? [product.image];
  const [active, setActive] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-[1.2] overflow-hidden rounded-lg bg-surface-container shadow-soft">
        {product.badge && (
          <span className="absolute left-6 top-5 z-10 rounded-full bg-white px-5 py-2 text-xs font-semibold text-primary shadow-soft">
            {product.badge}
          </span>
        )}
        <Image
          src={active}
          alt={product.alt}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border bg-surface-container",
              active === image ? "border-primary ring-2 ring-primary-container" : "border-transparent"
            )}
            onClick={() => setActive(image)}
            aria-label={`View ${product.name} image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              sizes="140px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

