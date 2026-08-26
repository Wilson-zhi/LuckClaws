"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type AccordionItem = {
  title: string;
  content: string;
};

type ProductAccordionProps = {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
  note?: string;
};

export function ProductAccordion({ items, defaultOpenIndex = null, note }: ProductAccordionProps) {
  const instanceId = useId().replace(/:/g, "");
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    defaultOpenIndex !== null && defaultOpenIndex >= 0 && defaultOpenIndex < items.length ? defaultOpenIndex : null
  );

  return (
    <div className="product-accordion border-y border-outline-variant/70">
      {note && (
        <p className="lc-hand-note flex items-center gap-2 border-b border-outline-variant/70 py-3 text-sm text-[#8E5700]">
          <Sparkles aria-hidden className="h-4 w-4 shrink-0" />
          {note}
        </p>
      )}

      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${instanceId}-trigger-${index}`;
        const panelId = `${instanceId}-panel-${index}`;

        return (
          <div key={`${item.title}-${index}`} className={cn("product-accordion-item", isOpen && "is-open")}>
            <button
              id={triggerId}
              type="button"
              className="product-accordion-trigger group flex min-h-14 w-full items-center gap-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setOpenIndex((currentIndex) => (currentIndex === index ? null : index))}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="product-accordion-index inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DFC18E] text-[10px] font-extrabold tracking-[0.08em] text-[#8E5700]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-sm font-bold text-on-surface sm:text-[15px]">{item.title}</span>
              <span className="product-accordion-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/80 bg-white text-primary shadow-soft">
                <ChevronDown aria-hidden className="h-4 w-4" />
              </span>
            </button>

            <div
              id={panelId}
              className="product-accordion-panel grid"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pl-11 pr-3 text-sm leading-7 text-on-surface-variant sm:pl-12">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
