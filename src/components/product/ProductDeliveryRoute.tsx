"use client";

import {
  CheckCircle2,
  CircleHelp,
  CreditCard,
  Mail,
  PackageCheck,
  Truck
} from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { cn } from "@/lib/utils";

type ProductQuestion = {
  title: string;
  content: string;
};

type ProductDeliveryRouteProps = {
  shippingItems: string[];
  faqItems: ProductQuestion[];
};

const stageContent = [
  {
    key: "checkout",
    label: "Checkout",
    word: "CHECK",
    title: "See the delivery picture before you order.",
    Icon: CreditCard,
    getItems: (items: string[]) => items.slice(0, 3)
  },
  {
    key: "processing",
    label: "Processing",
    word: "PACK",
    title: "Know what happens before the parcel moves.",
    Icon: PackageCheck,
    getItems: (items: string[]) => items.slice(3, 4)
  },
  {
    key: "transit",
    label: "On the way",
    word: "MOVE",
    title: "Keep the expected delivery window in view.",
    Icon: Truck,
    getItems: (items: string[]) => items.slice(4, 5)
  },
  {
    key: "arrival",
    label: "After delivery",
    word: "HELP",
    title: "The support route continues after arrival.",
    Icon: CircleHelp,
    getItems: (items: string[]) => items.slice(5)
  }
] as const;

export function ProductDeliveryRoute({ shippingItems, faqItems }: ProductDeliveryRouteProps) {
  const instanceId = useId().replace(/:/g, "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const stages = stageContent
    .map((stage) => ({ ...stage, items: stage.getItems(shippingItems) }))
    .filter((stage) => stage.items.length > 0);
  const progress = stages.length > 1 ? (activeIndex / (stages.length - 1)) * 100 : 0;

  const selectStage = (index: number, moveFocus = false) => {
    setActiveIndex(index);
    if (moveFocus) {
      tabRefs.current[index]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % stages.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + stages.length) % stages.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = stages.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      selectStage(nextIndex, true);
    }
  };

  return (
    <section
      id="product-delivery"
      className="section-shell scroll-mt-20 pb-14 md:scroll-mt-[156px] md:pb-20 xl:scroll-mt-[166px]"
      aria-labelledby={`${instanceId}-title`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="product-delivery-route flex flex-col overflow-hidden rounded-lg border border-[#D8B779] bg-[#F7ECD8] shadow-lift">
          <div className="border-b border-[#D8B779] px-5 py-6 sm:px-7 sm:py-7">
            <p className="text-xs font-extrabold uppercase text-[#8E5700]">Order route</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <h2 id={`${instanceId}-title`} className="max-w-lg font-heading text-3xl font-extrabold text-[#2C1A0D] sm:text-4xl">
                From checkout to doorstep.
              </h2>
              <p className="max-w-xs text-sm leading-6 text-[#6F5A47]">
                Choose a stage to see the timing and policy details that apply.
              </p>
            </div>
          </div>

          {stages.length > 0 && (
            <>
              <div className="relative px-4 py-4 sm:px-6" role="tablist" aria-label="Order delivery stages">
                <div className="product-delivery-track" aria-hidden="true">
                  <span
                    className="product-delivery-track-fill"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-1">
                  {stages.map((stage, index) => {
                    const isActive = activeIndex === index;
                    const tabId = `${instanceId}-tab-${stage.key}`;
                    const panelId = `${instanceId}-panel-${stage.key}`;

                    return (
                      <button
                        key={stage.key}
                        ref={(element) => {
                          tabRefs.current[index] = element;
                        }}
                        id={tabId}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={panelId}
                        tabIndex={isActive ? 0 : -1}
                        className={cn(
                          "product-delivery-tab group relative z-10 flex min-h-16 items-center gap-3 rounded-sm border px-3 py-3 text-left transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E5700] motion-reduce:transition-none md:min-h-24 md:flex-col md:justify-start md:border-transparent md:bg-transparent md:px-2 md:text-center",
                          isActive
                            ? "border-[#B8780C] bg-[#2C1A0D] text-[#FFF7E9] shadow-soft md:border-transparent md:bg-transparent md:text-[#2C1A0D] md:shadow-none"
                            : "border-[#E0C89D] bg-white/45 text-[#6B4A27] hover:border-[#B8780C] hover:bg-white/75"
                        )}
                        onClick={() => selectStage(index)}
                        onFocus={() => selectStage(index)}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") {
                            selectStage(index);
                          }
                        }}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                      >
                        <span
                          className={cn(
                            "product-delivery-marker inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 motion-reduce:transition-none",
                            isActive
                              ? "border-[#F1B945] bg-[#F1B945] text-[#2C1A0D] md:scale-110"
                              : "border-[#D7BA83] bg-[#FFF8EA] text-[#8E5700] group-hover:border-[#B8780C]"
                          )}
                        >
                          <stage.Icon aria-hidden className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-extrabold sm:text-sm">{stage.label}</span>
                        {isActive && <span className="sr-only">Selected stage</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid min-h-[330px] flex-1 md:grid-cols-[0.34fr_0.66fr]">
                <div className="relative flex min-h-44 flex-col overflow-hidden bg-[#294035] px-6 py-6 text-[#FFF7E9] sm:px-8 sm:py-8 md:min-h-full">
                  <p className="text-xs font-extrabold uppercase text-[#F1CE82]">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                  </p>
                  <p key={stages[activeIndex]?.word} className="product-delivery-word mt-auto" aria-hidden="true">
                    {stages[activeIndex]?.word}
                  </p>
                  <p className="mt-4 text-xs font-extrabold uppercase text-[#F1CE82]">
                    {stages[activeIndex]?.label}
                  </p>
                </div>

                <div className="flex flex-col bg-[#2C1A0D] px-6 py-7 text-[#FFF7E9] sm:px-8 sm:py-8">
                  <div className="grid flex-1">
                    {stages.map((stage, index) => {
                      const isActive = activeIndex === index;

                      return (
                        <div
                          key={stage.key}
                          id={`${instanceId}-panel-${stage.key}`}
                          role="tabpanel"
                          aria-labelledby={`${instanceId}-tab-${stage.key}`}
                          aria-hidden={!isActive}
                          tabIndex={isActive ? 0 : -1}
                          className={cn(
                            "product-delivery-panel col-start-1 row-start-1 flex flex-col justify-center",
                            isActive && "is-active"
                          )}
                        >
                          <p className="text-xs font-extrabold uppercase text-[#F1CE82]">
                            {stage.label}
                          </p>
                          <h3 className="mt-3 max-w-md font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                            {stage.title}
                          </h3>
                          <ul className="mt-6 space-y-3 text-sm leading-6 text-[#F8EBD4]">
                            {stage.items.map((item) => (
                              <li key={item} className="flex gap-3">
                                <CheckCircle2 aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#F1B945]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-7 flex gap-3 border-t border-white/15 pt-5 text-sm leading-6 text-[#EAD8BC]">
                    <Mail aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#F1B945]" />
                    <span>
                      Order question? Email{" "}
                      <a
                        href="mailto:support@luckclaws.com"
                        className="font-bold text-[#FFD98D] underline decoration-[#FFD98D]/50 underline-offset-4 hover:text-white"
                      >
                        support@luckclaws.com
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="rounded-lg border border-[#DEC7A2] bg-white/75 p-6 shadow-soft sm:p-8" aria-labelledby={`${instanceId}-questions-title`}>
          <p className="text-xs font-extrabold uppercase text-[#8E5700]">Before you choose</p>
          <h2 id={`${instanceId}-questions-title`} className="mt-3 font-heading text-3xl font-extrabold text-[#2C1A0D]">
            Product questions
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#6F5A47]">
            Open the answer you need, then continue shopping without leaving the product page.
          </p>
          <div className="mt-6">
            <ProductAccordion items={faqItems} note="quick answers before you choose" />
          </div>
        </aside>
      </div>
    </section>
  );
}
