"use client";

import { ArrowLeft, ArrowRight, PawPrint } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { type Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductRecommendationRailProps = {
  products: Product[];
  itemListName?: string;
};

export function ProductRecommendationRail({ products, itemListName }: ProductRecommendationRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canMoveBack, setCanMoveBack] = useState(false);
  const [canMoveForward, setCanMoveForward] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateRailState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-recommendation-slide]"));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const nearestIndex = slides.reduce((closestIndex, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      const closestSlide = slides[closestIndex];
      const closestDistance = closestSlide
        ? Math.abs(closestSlide.offsetLeft - track.offsetLeft - track.scrollLeft)
        : Number.POSITIVE_INFINITY;

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nearestIndex);
    setCanMoveBack(track.scrollLeft > 4);
    setCanMoveForward(track.scrollLeft < maxScroll - 4);
    setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const frame = window.requestAnimationFrame(updateRailState);
    const resizeObserver = new ResizeObserver(updateRailState);
    resizeObserver.observe(track);
    track.addEventListener("scroll", updateRailState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateRailState);
    };
  }, [products.length, updateRailState]);

  if (!products.length) {
    return null;
  }

  const moveTo = (direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-recommendation-slide]"));
    const targetIndex = Math.min(Math.max(activeIndex + direction, 0), slides.length - 1);
    const target = slides[targetIndex];

    if (!target) {
      return;
    }

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  const progressOffset = progress * 316;
  const activeProduct = products[Math.min(activeIndex, products.length - 1)];

  return (
    <section
      id="product-recommendations"
      className="section-shell scroll-mt-20 pb-28 pt-6 md:scroll-mt-[156px] md:pb-20 md:pt-10 xl:scroll-mt-[166px]"
      aria-labelledby="recommendation-rail-title"
    >
      <div className="grid gap-8 border-y border-[#DFC9A7] py-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12 lg:py-14">
        <div className="flex flex-col lg:min-h-[520px] lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#9A650B]">Next useful picks</p>
            <h2
              id="recommendation-rail-title"
              className="mt-4 max-w-md font-heading text-4xl font-extrabold leading-[1.02] text-[#2C1A0D] sm:text-5xl"
            >
              Continue the routine.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#715B45] sm:text-base">
              A shorter edit of related products, ready when you want to compare the next useful step.
            </p>
            <p className="lc-hand-note mt-6 flex items-center gap-2 text-lg text-[#8E5700]">
              <PawPrint aria-hidden className="h-5 w-5 shrink-0" />
              follow the next helpful clue
            </p>
          </div>

          <div className="mt-8 lg:mt-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A7A52]">Current pick</p>
            <p className="mt-2 min-h-12 font-heading text-lg font-extrabold leading-6 text-[#2C1A0D]" aria-live="polite">
              {activeProduct.name}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#CFAF7C] bg-white text-[#6F4300] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#FFF1D4] disabled:cursor-not-allowed disabled:opacity-35 motion-reduce:hover:translate-y-0"
                onClick={() => moveTo(-1)}
                disabled={!canMoveBack}
                aria-label="Show previous recommended product"
                title="Previous product"
              >
                <ArrowLeft aria-hidden className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#CFAF7C] bg-[#2C1A0D] text-[#FFD78D] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#432817] disabled:cursor-not-allowed disabled:opacity-35 motion-reduce:hover:translate-y-0"
                onClick={() => moveTo(1)}
                disabled={!canMoveForward}
                aria-label="Show next recommended product"
                title="Next product"
              >
                <ArrowRight aria-hidden className="h-5 w-5" />
              </button>
              <span className="ml-1 text-xs font-bold tabular-nums text-[#806746]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div
            ref={trackRef}
            className="product-recommendation-track hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 sm:gap-5"
            tabIndex={0}
            aria-label="Recommended products"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                data-recommendation-slide
                className={cn("product-recommendation-slide snap-start", activeIndex === index && "is-current")}
              >
                <ProductCard product={product} compact itemListName={itemListName} />
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#E9DCC8]" aria-hidden>
              <span
                className="product-recommendation-progress block h-full w-[24%] rounded-full bg-[#B97808]"
                style={{ transform: `translateX(${progressOffset}%)` }}
              />
            </div>
            <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A704F]">
              Swipe or use arrows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
