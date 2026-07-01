"use client";

import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { type Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductMediaItem =
  | {
      type: "video";
      src: string;
      poster: string;
      alt: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    };

function videoMimeType(src: string) {
  const normalized = src.split("?")[0]?.toLowerCase() ?? "";

  if (normalized.endsWith(".webm")) {
    return "video/webm";
  }

  return "video/mp4";
}

export function ProductGallery({ product }: { product: Product }) {
  const images = product.gallery?.length ? product.gallery : [product.image];
  const media: ProductMediaItem[] = [
    ...(product.videoUrl
      ? [
          {
            type: "video" as const,
            src: product.videoUrl,
            poster: product.image,
            alt: `${product.name} product video`
          }
        ]
      : []),
    ...images.map((image, index) => ({
      type: "image" as const,
      src: image,
      alt: index === 0 ? product.alt : `${product.name} image ${index + 1}`
    }))
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex] ?? media[0];

  return (
    <div>
      <div className="relative aspect-[1.2] overflow-hidden rounded-lg bg-surface-container shadow-soft">
        {product.badge && (
          <span className="absolute left-6 top-5 z-10 rounded-full bg-white px-5 py-2 text-xs font-semibold text-primary shadow-soft">
            {product.badge}
          </span>
        )}
        {active?.type === "video" ? (
          <>
            <video
              key={active.src}
              className="h-full w-full object-cover"
              controls
              muted
              playsInline
              poster={active.poster}
              preload="metadata"
              aria-label={active.alt}
            >
              <source src={active.src} type={videoMimeType(active.src)} />
              Your browser does not support the product video.
            </video>
            <span className="absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Product video
            </span>
          </>
        ) : active ? (
          <Image
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {media.map((item, index) => (
          <button
            key={`${item.type}-${item.src}`}
            type="button"
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border bg-surface-container",
              activeIndex === index ? "border-primary ring-2 ring-primary-container" : "border-transparent"
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={
              item.type === "video"
                ? `View ${product.name} product video`
                : `View ${product.name} image ${index + 1}`
            }
          >
            <Image
              src={item.type === "video" ? item.poster : item.src}
              alt={item.type === "video" ? `${product.name} video thumbnail` : `${product.name} thumbnail ${index + 1}`}
              fill
              sizes="140px"
              className="object-cover"
            />
            {item.type === "video" ? (
              <span className="absolute inset-0 grid place-items-center bg-black/20 text-white">
                <PlayCircle className="h-8 w-8 drop-shadow" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
