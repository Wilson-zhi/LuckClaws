"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Heart,
  Leaf,
  Lock,
  Package,
  PawPrint,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import { type ProductHighlight } from "@/data/products";
import { normalizeProductHighlightIconKey, type ProductHighlightIconKey } from "@/lib/product-highlight-icons";
import { cn } from "@/lib/utils";

const fallbackIcons = [Sparkles, Search, ShieldCheck, RotateCcw];

const productHighlightIconMap = {
  paw: PawPrint,
  shield: ShieldCheck,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  truck: Truck,
  package: Package,
  check: CheckCircle2,
  rotate: RotateCcw,
  lock: Lock
} satisfies Record<ProductHighlightIconKey, typeof Sparkles>;

function getHighlightIcon(icon: string | undefined, fallbackIndex: number) {
  const iconKey = normalizeProductHighlightIconKey(icon);

  return iconKey ? productHighlightIconMap[iconKey] : (fallbackIcons[fallbackIndex] ?? Sparkles);
}

export function ProductHighlightsBand({ highlights }: { highlights: ProductHighlight[] }) {
  const items = highlights.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, items.length - 1);

  return (
    <section className="section-shell" aria-labelledby="product-highlights-title">
      <div className="overflow-hidden rounded-lg bg-[#FFF3DF] shadow-[0_18px_55px_rgba(92,60,30,0.11)]">
        <div className="grid md:grid-cols-[0.78fr_1.22fr]">
          <div className="relative flex min-h-[340px] flex-col overflow-hidden bg-[#FFD894] p-6 text-[#2C1A0D] sm:p-8 md:min-h-[410px]">
            <PawPrint
              aria-hidden
              className="absolute -bottom-8 -right-8 h-36 w-36 rotate-12 text-[#8E5700]/10"
              strokeWidth={1.2}
            />
            <h2 id="product-highlights-title" className="relative font-heading text-3xl font-extrabold text-balance">
              Details that earn their place.
            </h2>

            <div className="relative mt-auto grid pt-10" aria-live="polite">
              {items.map((highlight, index) => {
                const StageIcon = getHighlightIcon(highlight.icon, index);
                const isActive = safeActiveIndex === index;

                return (
                  <div
                    key={`stage-${highlight.title}`}
                    className={cn(
                      "product-highlight-stage col-start-1 row-start-1",
                      isActive && "is-active"
                    )}
                    aria-hidden={!isActive}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2C1A0D] text-[#FFD894] shadow-soft">
                      <StageIcon aria-hidden className="h-5 w-5" />
                    </span>
                    <p className="mt-5 max-w-[13ch] font-heading text-3xl font-extrabold leading-[1.04] text-balance sm:text-4xl">
                      {highlight.title}
                    </p>
                    <p className="mt-4 max-w-[34rem] text-sm leading-6 text-[#66401A]">{highlight.text}</p>
                  </div>
                );
              })}
            </div>

            <p className="lc-hand-note relative mt-7 text-base text-[#8E5700]">
              hover, focus, or tap a detail
            </p>
          </div>

          <div className="grid sm:grid-cols-2">
            {items.map((highlight, index) => {
              const Icon = getHighlightIcon(highlight.icon, index);
              const isActive = safeActiveIndex === index;

              return (
                <button
                  key={highlight.title}
                  type="button"
                  className={cn(
                    "product-highlight-item group relative flex min-h-[170px] gap-4 border-[#E2BF8D] p-5 text-left transition-shadow duration-200 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#8E5700] motion-reduce:transition-none sm:p-6",
                    isActive ? "bg-[#2C1A0D] text-[#FFF8EA]" : "bg-transparent text-[#2C1A0D] hover:bg-white/70"
                  )}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      setActiveIndex(index);
                    }
                  }}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100",
                      isActive ? "bg-[#FFD894] text-[#2C1A0D]" : "bg-white/80 text-[#8E5700]"
                    )}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className={cn("font-heading text-base font-extrabold leading-6", isActive && "text-[#FFF8EA]")}>
                      {highlight.title}
                    </span>
                    <p className={cn("mt-2 text-sm leading-6", isActive ? "text-[#D9C6AE]" : "text-[#6B5540]")}>
                      {highlight.text}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className={cn(
                      "absolute bottom-5 right-5 h-4 w-4 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
