"use client";

import { ArrowLeft, ArrowRight, Camera, Maximize2, PawPrint, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const active = media[activeIndex] ?? media[0];
  const lightboxMedia = media[lightboxIndex] ?? media[0];
  const activeNote =
    active?.type === "video"
      ? "watch it move through the routine"
      : activeIndex === 0
        ? "meet the everyday pick"
        : "look closer - compare the details";

  const updateLens = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (active?.type !== "image") {
      return;
    }

    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      delete event.currentTarget.dataset.lensActive;
      return;
    }

    const frame = event.currentTarget;
    const rect = frame.getBoundingClientRect();
    const lensRadius = 80;
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const lensX = Math.min(Math.max(pointerX, lensRadius), Math.max(lensRadius, rect.width - lensRadius));
    const lensY = Math.min(Math.max(pointerY, lensRadius), Math.max(lensRadius, rect.height - lensRadius));
    const imageX = Math.min(100, Math.max(0, (pointerX / rect.width) * 100));
    const imageY = Math.min(100, Math.max(0, (pointerY / rect.height) * 100));

    frame.style.setProperty("--product-lens-left", `${lensX}px`);
    frame.style.setProperty("--product-lens-top", `${lensY}px`);
    frame.style.setProperty("--product-lens-image-x", `${imageX}%`);
    frame.style.setProperty("--product-lens-image-y", `${imageY}%`);
    frame.dataset.lensActive = "true";
  };

  const hideLens = (event: ReactPointerEvent<HTMLButtonElement>) => {
    delete event.currentTarget.dataset.lensActive;
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const moveLightbox = useCallback(
    (direction: -1 | 1) => {
      setLightboxIndex((currentIndex) => (currentIndex + direction + media.length) % media.length);
    },
    [media.length]
  );

  const openLightbox = (index: number) => {
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLightboxIndex(index);
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    if (isLightboxOpen) {
      setActiveIndex(lightboxIndex);
    }
  }, [isLightboxOpen, lightboxIndex]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const galleryElement = galleryRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft" && media.length > 1) {
        event.preventDefault();
        moveLightbox(-1);
        return;
      }

      if (event.key === "ArrowRight" && media.length > 1) {
        event.preventDefault();
        moveLightbox(1);
        return;
      }

      if (event.key !== "Tab" || !lightboxRef.current) {
        return;
      }

      const focusable = Array.from(
        lightboxRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), video[controls], [href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (lastFocusedRef.current?.isConnected) {
        lastFocusedRef.current.focus();
      } else {
        galleryElement?.querySelector<HTMLElement>("[data-media-opener]")?.focus();
      }
    };
  }, [closeLightbox, isLightboxOpen, media.length, moveLightbox]);

  return (
    <div ref={galleryRef} className="product-gallery group">
      <div className="relative aspect-[1.2] overflow-hidden rounded-lg bg-surface-container shadow-soft">
        {product.badge && (
          <span className="pointer-events-none absolute left-6 top-5 z-10 rounded-full bg-white px-5 py-2 text-xs font-semibold text-primary shadow-soft">
            {product.badge}
          </span>
        )}
        {active?.type === "video" ? (
          <div key={active.src} className="product-media-enter absolute inset-0">
            <video
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
            <span className="pointer-events-none absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Product video
            </span>
            <button
              data-media-opener
              type="button"
              className="absolute bottom-5 right-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-[#2C1A0D]/80 text-[#FFD78D] shadow-lift backdrop-blur transition hover:scale-105 hover:bg-[#2C1A0D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:scale-100"
              onClick={() => openLightbox(activeIndex)}
              aria-label={`Open ${product.name} video in media viewer`}
              title="Open media viewer"
            >
              <Maximize2 aria-hidden className="h-5 w-5" />
            </button>
          </div>
        ) : active ? (
          <button
            key={active.src}
            data-media-opener
            type="button"
            className="product-media-enter product-media-frame group/media absolute inset-0 block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            onClick={() => openLightbox(activeIndex)}
            onPointerEnter={updateLens}
            onPointerMove={updateLens}
            onPointerLeave={hideLens}
            onPointerCancel={hideLens}
            aria-label={`Open ${active.alt} in media viewer`}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover transition-transform duration-700 group-hover/media:scale-[1.018] motion-reduce:transition-none motion-reduce:group-hover/media:scale-100"
            />
            <span className="product-media-art-word" aria-hidden="true">
              LOOK
            </span>
            <span
              className="product-media-lens"
              style={{ backgroundImage: `url(${JSON.stringify(active.src)})` }}
              aria-hidden="true"
            >
              <span className="product-media-lens-label">DETAIL</span>
            </span>
            <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/50 bg-[#2C1A0D]/82 px-4 py-2.5 text-xs font-bold text-[#FFD78D] shadow-lift backdrop-blur">
              <Maximize2 aria-hidden className="h-4 w-4" />
              Open full view
            </span>
          </button>
        ) : null}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4 px-1">
        <p className="lc-hand-note flex items-center gap-2 text-base text-[#8E5700] sm:text-lg">
          <PawPrint aria-hidden className="h-4 w-4" />
          {activeNote}
        </p>
        <p className="shrink-0 text-xs font-bold tabular-nums text-on-surface-variant" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
        </p>
      </div>
      <div className="product-media-track mt-3 grid grid-cols-4 gap-3">
        {media.map((item, index) => (
          <button
            key={`${item.type}-${item.src}`}
            type="button"
            className={cn(
              "product-media-thumb relative aspect-square overflow-hidden rounded-md border bg-surface-container transition-[border-color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
              activeIndex === index
                ? "border-primary shadow-soft ring-2 ring-primary-container"
                : "border-transparent hover:-translate-y-1 hover:border-primary/45 motion-reduce:hover:translate-y-0"
            )}
            onClick={() => setActiveIndex(index)}
            aria-current={activeIndex === index ? "true" : undefined}
            aria-label={item.type === "video" ? `View ${product.name} product video` : `View ${product.name} image ${index + 1}`}
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
            {item.type === "image" && activeIndex === index ? (
              <span className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-[#2C1A0D] text-[#FFD894] shadow-soft">
                <Camera aria-hidden className="h-3.5 w-3.5" />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {isLightboxOpen && lightboxMedia ? (
        <div
          ref={lightboxRef}
          className="product-lightbox fixed inset-0 z-[100] flex flex-col px-4 py-4 text-white backdrop-blur-md sm:px-6 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} media viewer`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFD78D]">Closer look</p>
              <p className="mt-1 max-w-[65vw] truncate font-heading text-base font-bold sm:text-lg">{product.name}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:rotate-6 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD78D] motion-reduce:hover:rotate-0"
              onClick={closeLightbox}
              aria-label="Close media viewer"
              title="Close"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative mx-auto mt-4 flex min-h-0 w-full max-w-6xl flex-1 touch-pan-y items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-black/30"
            onPointerDown={(event) => {
              if (event.isPrimary) {
                pointerStartX.current = event.clientX;
              }
            }}
            onPointerUp={(event) => {
              const startX = pointerStartX.current;
              pointerStartX.current = null;

              if (startX === null || media.length < 2) {
                return;
              }

              const distance = startX - event.clientX;

              if (Math.abs(distance) >= 48) {
                moveLightbox(distance > 0 ? 1 : -1);
              }
            }}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
          >
            {lightboxMedia.type === "video" ? (
              <video
                key={lightboxMedia.src}
                className="product-lightbox-media h-full max-h-full w-full object-contain"
                controls
                muted
                playsInline
                poster={lightboxMedia.poster}
                preload="metadata"
                aria-label={lightboxMedia.alt}
              >
                <source src={lightboxMedia.src} type={videoMimeType(lightboxMedia.src)} />
                Your browser does not support the product video.
              </video>
            ) : (
              <div key={lightboxMedia.src} className="product-lightbox-media relative h-full w-full">
                <Image src={lightboxMedia.src} alt={lightboxMedia.alt} fill sizes="100vw" className="object-contain" />
              </div>
            )}

            {media.length > 1 ? (
              <>
                <button
                  type="button"
                  className="product-lightbox-nav absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-[#FFD78D] shadow-lift backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD78D] sm:left-5"
                  onClick={() => moveLightbox(-1)}
                  aria-label="Show previous media"
                  title="Previous media"
                >
                  <ArrowLeft aria-hidden className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="product-lightbox-nav absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-[#FFD78D] shadow-lift backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD78D] sm:right-5"
                  onClick={() => moveLightbox(1)}
                  aria-label="Show next media"
                  title="Next media"
                >
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-6xl items-center gap-3">
            <div className="hide-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {media.map((item, index) => (
                <button
                  key={`lightbox-${item.type}-${item.src}`}
                  type="button"
                  className={cn(
                    "relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD78D] sm:h-14 sm:w-14",
                    index === lightboxIndex ? "border-[#FFD78D] opacity-100" : "border-white/20 opacity-55 hover:opacity-100"
                  )}
                  onClick={() => setLightboxIndex(index)}
                  aria-current={index === lightboxIndex ? "true" : undefined}
                  aria-label={`Show media ${index + 1}`}
                >
                  <Image src={item.type === "video" ? item.poster : item.src} alt="" fill sizes="56px" className="object-cover" />
                  {item.type === "video" ? (
                    <span className="absolute inset-0 grid place-items-center bg-black/25">
                      <PlayCircle aria-hidden className="h-5 w-5" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold tabular-nums text-[#FFD78D]">
                {String(lightboxIndex + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
              </p>
              <p className="lc-hand-note mt-1 hidden text-sm text-[#E7C890] sm:block">swipe - arrows - escape</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
