"use client";

import { BookOpenCheck, Check, HeartHandshake, PawPrint, RefreshCcw } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type UseRitualKey = "read" | "match" | "use" | "keep";

type UseRitualStage = {
  key: UseRitualKey;
  number: string;
  word: string;
  label: string;
  title: string;
  description: string;
  items: string[];
  Icon: typeof BookOpenCheck;
};

type ProductUseRitualProps = {
  productName: string;
  productType: string;
  bestFor: string[];
  careInstructions: string[];
  safetyNotice: string;
};

function usefulItems(items: string[], fallback: string) {
  const filteredItems = items.map((item) => item.trim()).filter(Boolean).slice(0, 2);

  return filteredItems.length > 0 ? filteredItems : [fallback];
}

export function ProductUseRitual({
  productName,
  productType,
  bestFor,
  careInstructions,
  safetyNotice
}: ProductUseRitualProps) {
  const [activeKey, setActiveKey] = useState<UseRitualKey>("read");
  const id = useId();
  const stages: UseRitualStage[] = [
    {
      key: "read",
      number: "01",
      word: "READ",
      label: "Read the item",
      title: "Know the product before the first use.",
      description: `Start with what ${productName} is intended to do, then check the useful details already gathered on this page.`,
      items: [`Product type: ${productType}`, "Review the listed size, materials, and product notes."],
      Icon: BookOpenCheck
    },
    {
      key: "match",
      number: "02",
      word: "MATCH",
      label: "Match the moment",
      title: "Make sure the moment fits.",
      description: "Compare the product with the pet, activity, and everyday situation before making it part of the routine.",
      items: usefulItems(bestFor, "Check the intended use before choosing."),
      Icon: PawPrint
    },
    {
      key: "use",
      number: "03",
      word: "USE",
      label: "Use with care",
      title: "Keep the safety note in view.",
      description: "Use the product guidance during the moment, and pause if the item or your pet needs a closer check.",
      items: usefulItems([safetyNotice], "Inspect the product before and during use."),
      Icon: HeartHandshake
    },
    {
      key: "keep",
      number: "04",
      word: "KEEP",
      label: "Ready it again",
      title: "Reset it for the next routine.",
      description: "A small care step after use helps keep the product ready for the next everyday moment.",
      items: usefulItems(careInstructions, "Follow the product care guidance after use."),
      Icon: RefreshCcw
    }
  ];
  const activeIndex = Math.max(
    0,
    stages.findIndex((stage) => stage.key === activeKey)
  );
  const activeStage = stages[activeIndex];
  const ActiveIcon = activeStage.Icon;

  const selectStage = (key: UseRitualKey) => {
    setActiveKey(key);
  };

  const moveStage = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % stages.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + stages.length) % stages.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = stages.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextStage = stages[nextIndex];
    selectStage(nextStage.key);
    document.getElementById(`${id}-tab-${nextStage.key}`)?.focus();
  };

  return (
    <section className="section-shell py-10 md:py-16" aria-labelledby={`${id}-title`}>
      <div className="product-use-ritual overflow-hidden rounded-lg border border-[#D8BC8C] bg-[#FFF8EA] shadow-lift">
        <div className="grid md:grid-cols-[0.43fr_0.57fr]">
          <div className="border-b border-[#DEC79F] px-5 py-7 sm:px-8 sm:py-9 md:border-b-0 md:border-r md:px-6 md:py-8 lg:px-10 lg:py-11">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#93610B]">First-use ritual</p>
            <h2
              id={`${id}-title`}
              className="mt-3 max-w-[13ch] font-heading text-3xl font-extrabold leading-[1.04] text-[#2C1A0D] text-balance sm:text-4xl md:text-3xl lg:text-4xl"
            >
              Four beats before it becomes routine.
            </h2>
            <p className="lc-hand-note mt-4 text-lg text-[#A26909] sm:text-xl">read · match · use · keep</p>
            <p className="mt-5 max-w-lg text-sm leading-6 text-[#725C45]">
              Move through the first-use sequence for {productName}. Each note uses the product information already on this page.
            </p>

            <div
              className="mt-7 grid grid-cols-2 gap-2 sm:gap-3 md:mt-5 lg:grid-cols-1"
              role="tablist"
              aria-label={`${productName} first-use ritual`}
            >
              {stages.map(({ key, number, label, Icon }, index) => {
                const active = key === activeKey;

                return (
                  <button
                    key={key}
                    id={`${id}-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`${id}-panel`}
                    tabIndex={active ? 0 : -1}
                    data-active={active}
                    className={cn(
                      "product-use-tab group flex min-h-[74px] min-w-0 items-center gap-3 rounded-sm border px-3 py-3 text-left transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A4B05] motion-reduce:transition-none sm:px-4",
                      active
                        ? "border-[#2F493D] bg-[#2F493D] text-white shadow-soft"
                        : "border-[#DEC79F] bg-white/55 text-[#4B3827] hover:-translate-y-0.5 hover:border-[#B8822D] hover:bg-white motion-reduce:hover:translate-y-0"
                    )}
                    onClick={() => selectStage(key)}
                    onFocus={() => selectStage(key)}
                    onMouseEnter={() => selectStage(key)}
                    onKeyDown={(event) => moveStage(event, index)}
                  >
                    <span
                      className={cn(
                        "product-use-tab-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 motion-reduce:transition-none",
                        active
                          ? "border-[#FFD78D] bg-[#FFD78D] text-[#2C1A0D]"
                          : "border-[#E4C58E] bg-[#FFF0D0] text-[#8E5700]"
                      )}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[10px] font-extrabold", active ? "text-[#FFD78D]" : "text-[#9A6C1C]")}>{number}</span>
                      <span className="mt-1 block text-xs font-extrabold leading-4 sm:text-sm">{label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="product-use-stage relative isolate flex min-h-[500px] overflow-hidden bg-[#2F493D] px-5 py-8 text-white sm:px-8 sm:py-10 md:min-h-[610px] md:px-7 md:py-9 lg:px-10 lg:py-12">
            <span className="product-use-ring product-use-ring-one" aria-hidden="true" />
            <span className="product-use-ring product-use-ring-two" aria-hidden="true" />

            <div
              key={activeStage.key}
              id={`${id}-panel`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${activeStage.key}`}
              className="product-use-panel relative z-10 flex w-full flex-col"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FFD78D]">
                  {activeStage.number} / 04
                </p>
                <ActiveIcon aria-hidden="true" className="h-6 w-6 text-[#FFD78D]" />
              </div>

              <p className="product-use-word mt-8 select-none" aria-hidden="true">
                {activeStage.word}
              </p>

              <div className="mt-auto pt-10">
                <h3 className="max-w-[18ch] font-heading text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
                  {activeStage.title}
                </h3>
                <p className="mt-3 max-w-[58ch] text-sm leading-6 text-white/72">{activeStage.description}</p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {activeStage.items.map((item) => (
                    <li key={item} className="flex min-h-[72px] gap-3 border-t border-[#FFD78D]/35 pt-3 text-sm leading-5 text-white/88">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD78D]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 h-px overflow-hidden bg-white/18" aria-hidden="true">
                <span
                  className="product-use-progress block h-full w-full bg-[#FFD78D]"
                  style={{ transform: `scaleX(${(activeIndex + 1) / stages.length})` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
