"use client";

import { CheckCircle2, PawPrint, Sparkles, WashingMachine } from "lucide-react";
import { useState } from "react";

type RoutineGuideKey = "fit" | "match" | "care";

type RoutineGuideGroup = {
  key: RoutineGuideKey;
  label: string;
  title: string;
  description: string;
  items: string[];
  Icon: typeof Sparkles;
};

function usefulItems(items: string[], fallback: string) {
  const filteredItems = items.map((item) => item.trim()).filter(Boolean).slice(0, 3);

  return filteredItems.length > 0 ? filteredItems : [fallback];
}

export function ProductRoutineGuide({
  productName,
  benefits,
  bestFor,
  careInstructions
}: {
  productName: string;
  benefits: string[];
  bestFor: string[];
  careInstructions: string[];
}) {
  const [activeKey, setActiveKey] = useState<RoutineGuideKey>("fit");
  const groups: RoutineGuideGroup[] = [
    {
      key: "fit",
      label: "Why it fits",
      title: "Start with the everyday need.",
      description: `See how ${productName} could fit into the routine before comparing the smaller details.`,
      items: usefulItems(benefits, "Review the product details before choosing."),
      Icon: Sparkles
    },
    {
      key: "match",
      label: "Best for",
      title: "Make sure the moment matches.",
      description: "A useful product starts with the right pet, activity, and level of supervision.",
      items: usefulItems(bestFor, "Check the intended use and safety guidance."),
      Icon: PawPrint
    },
    {
      key: "care",
      label: "Care check",
      title: "Know the upkeep before checkout.",
      description: "A quick care check makes it easier to choose something that suits the everyday routine.",
      items: usefulItems(careInstructions, "Follow the product care guidance."),
      Icon: WashingMachine
    }
  ];
  const activeGroup = groups.find((group) => group.key === activeKey) ?? groups[0];

  return (
    <section
      id="product-fit"
      className="section-shell scroll-mt-20 py-10 md:scroll-mt-[156px] md:py-14 xl:scroll-mt-[166px]"
      aria-labelledby="product-routine-guide-title"
    >
      <div className="overflow-hidden rounded-[1.5rem] bg-[#2C1A0D] text-white shadow-[0_24px_70px_rgba(44,26,13,0.18)]">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <PawPrint
              aria-hidden
              className="absolute -bottom-10 -right-8 h-40 w-40 rotate-[-12deg] text-[#FFD894]/[0.08]"
              strokeWidth={1.2}
            />
            <h2 id="product-routine-guide-title" className="relative font-heading text-3xl font-extrabold text-balance md:text-4xl">
              One quick routine check.
            </h2>
            <p className="lc-hand-note relative mt-4 text-xl text-[#FFD894]">
              useful first · extras later
            </p>
            <p className="relative mt-5 max-w-md text-sm leading-7 text-white/72">
              Move through three practical notes, then continue with a clearer idea of how this product fits.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Product routine checks">
              {groups.map((group) => {
                const Icon = group.Icon;
                const active = group.key === activeKey;

                return (
                  <button
                    key={group.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="product-routine-guide-panel"
                    className={`product-routine-tab group flex min-h-[76px] flex-col items-start justify-between gap-2 rounded-[0.9rem] border px-3 py-3 text-left transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD894] motion-reduce:transition-none sm:min-h-[68px] sm:flex-row sm:items-center sm:px-4 ${
                      active
                        ? "border-[#FFD894] bg-[#FFD894] text-[#2C1A0D] shadow-soft"
                        : "border-white/15 bg-white/[0.06] text-white hover:-translate-y-0.5 hover:border-[#FFD894]/55 hover:bg-white/[0.1] motion-reduce:hover:translate-y-0"
                    }`}
                    data-active={active}
                    onClick={() => setActiveKey(group.key)}
                  >
                    <Icon aria-hidden className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-extrabold leading-4 sm:text-sm">{group.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              key={activeGroup.key}
              id="product-routine-guide-panel"
              role="tabpanel"
              className="product-routine-panel mt-4 border-t border-white/12 pt-5 sm:mt-6 sm:pt-6"
              aria-live="polite"
            >
              <h3 className="max-w-2xl font-heading text-2xl font-extrabold text-balance sm:text-3xl">
                {activeGroup.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">{activeGroup.description}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {activeGroup.items.map((item) => (
                  <li key={item} className="flex gap-2.5 border-t border-[#FFD894]/28 pt-3 text-sm leading-5 text-white/88">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD894]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
