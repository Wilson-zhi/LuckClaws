"use client";

import { PawPrint } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ProductChapterNavProps = {
  pairTargetId?: "product-pairings" | "product-recommendations";
};

export function ProductChapterNav({ pairTargetId = "product-recommendations" }: ProductChapterNavProps) {
  const chapters = useMemo(
    () => [
      { word: "MEET", label: "Overview", targetId: "product-overview" },
      { word: "FIT", label: "Routine", targetId: "product-fit" },
      { word: "KNOW", label: "Details", targetId: "product-details" },
      { word: "SHIP", label: "Delivery", targetId: "product-delivery" },
      { word: "PAIR", label: "Next picks", targetId: pairTargetId }
    ],
    [pairTargetId]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateActiveChapter = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const probeY = window.scrollY + Math.min(240, window.innerHeight * 0.28);
        let nextIndex = 0;

        chapters.forEach((chapter, index) => {
          const section = document.getElementById(chapter.targetId);

          if (section && section.getBoundingClientRect().top + window.scrollY <= probeY) {
            nextIndex = index;
          }
        });

        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
          nextIndex = chapters.length - 1;
        }

        setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
      });
    };

    updateActiveChapter();
    window.addEventListener("scroll", updateActiveChapter, { passive: true });
    window.addEventListener("resize", updateActiveChapter);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveChapter);
      window.removeEventListener("resize", updateActiveChapter);
    };
  }, [chapters]);

  const moveToChapter = (event: MouseEvent<HTMLAnchorElement>, index: number, targetId: string) => {
    const section = document.getElementById(targetId);

    if (!section) {
      return;
    }

    event.preventDefault();
    setActiveIndex(index);
    section.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <nav
      className="product-chapter-nav relative z-30 border-y border-[#5B402E] bg-[#2C1A0D] text-[#FFF7E9] md:sticky md:top-16 xl:top-[74px]"
      aria-label="Product page chapters"
    >
      <div className="section-shell">
        <div className="relative grid grid-cols-5">
          {chapters.map((chapter, index) => {
            const isActive = activeIndex === index;

            return (
              <a
                key={chapter.targetId}
                href={`#${chapter.targetId}`}
                className={cn(
                  "product-chapter-link relative flex min-h-[74px] min-w-0 flex-col justify-center border-l border-white/10 px-2 py-2 text-center transition-[background-color,color] duration-200 first:border-l-0 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#FFD78D] motion-reduce:transition-none sm:min-h-20 sm:px-3",
                  isActive
                    ? "bg-[#F1B945] text-[#2C1A0D]"
                    : "text-[#F5E3C6] hover:bg-white/[0.08] hover:text-white"
                )}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => moveToChapter(event, index, chapter.targetId)}
              >
                <span className="mx-auto flex min-h-5 items-center gap-1 text-[10px] font-extrabold tabular-nums opacity-75 sm:text-[11px]">
                  {isActive ? <PawPrint aria-hidden className="h-3.5 w-3.5" /> : null}
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="product-chapter-word mt-1 truncate font-heading text-sm font-extrabold sm:text-base">
                  {chapter.word}
                </span>
                <span className="mt-0.5 hidden truncate text-[10px] font-semibold opacity-75 sm:block">
                  {chapter.label}
                </span>
              </a>
            );
          })}

          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10" aria-hidden="true">
            <span
              className="product-chapter-progress block h-full origin-left bg-[#FFF1CF]"
              style={{ transform: `scaleX(${(activeIndex + 1) / chapters.length})` }}
            />
          </span>
        </div>
      </div>
    </nav>
  );
}
