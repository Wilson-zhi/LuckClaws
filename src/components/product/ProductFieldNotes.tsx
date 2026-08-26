"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Check, ClipboardCheck, HeartHandshake, PawPrint, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldNoteKey = "details" | "fit" | "care";

type ProductFieldNotesProps = {
  productName: string;
  details: ReadonlyArray<readonly string[]>;
  bestFor: string[];
  careInstructions: string[];
  cautionItems?: string[];
};

const fieldTabs: Array<{
  key: FieldNoteKey;
  label: string;
  word: string;
  Icon: typeof ClipboardCheck;
}> = [
  { key: "details", label: "Know the details", word: "KNOW", Icon: ClipboardCheck },
  { key: "fit", label: "Check the fit", word: "FIT", Icon: PawPrint },
  { key: "care", label: "Plan the care", word: "CARE", Icon: RefreshCcw }
];

const panelCopy: Record<FieldNoteKey, { title: string; description: string }> = {
  details: {
    title: "The useful specifics, together.",
    description: "Scan the product facts before you compare or add it to a routine."
  },
  fit: {
    title: "Where this pick makes the most sense.",
    description: "Match the product to the pet, activity, and level of supervision."
  },
  care: {
    title: "What helps it stay ready for use.",
    description: "Keep the practical care notes close after the product arrives."
  }
};

export function ProductFieldNotes({
  productName,
  details,
  bestFor,
  careInstructions,
  cautionItems = []
}: ProductFieldNotesProps) {
  const [activeKey, setActiveKey] = useState<FieldNoteKey>("details");
  const id = useId();
  const activeIndex = fieldTabs.findIndex((tab) => tab.key === activeKey);
  const activeTab = fieldTabs[activeIndex];

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % fieldTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + fieldTabs.length) % fieldTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = fieldTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextKey = fieldTabs[nextIndex].key;
    setActiveKey(nextKey);
    document.getElementById(`${id}-tab-${nextKey}`)?.focus();
  };

  return (
    <section
      id="product-details"
      className="section-shell scroll-mt-20 py-14 md:scroll-mt-[156px] md:py-20 xl:scroll-mt-[166px]"
      aria-labelledby={`${id}-title`}
    >
      <div className="product-field-notes overflow-hidden rounded-lg bg-[#2A190F] text-[#FFF7E9] shadow-lift">
        <div className="grid lg:grid-cols-[0.36fr_0.64fr]">
          <div className="relative flex min-h-[390px] flex-col overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[520px] lg:px-10 lg:py-12">
            <div className="relative z-10">
              <h2 id={`${id}-title`} className="max-w-[12ch] font-heading text-3xl font-extrabold leading-[1.04] text-balance sm:text-4xl">
                Read the product before it joins the routine.
              </h2>
              <p className="mt-5 max-w-[34rem] text-sm leading-6 text-[#DFC9AD]">
                Switch between the facts, the fit, and the care notes for {productName}.
              </p>
            </div>

            <p key={activeTab.word} className="product-field-word mt-auto select-none pt-10" aria-hidden="true">
              {activeTab.word}
            </p>

            <p className="lc-hand-note relative z-10 mt-5 text-lg text-[#FFD78D]">
              one clear note at a time
            </p>
          </div>

          <div className="bg-[#FFF8EA] p-4 text-[#2C1A0D] sm:p-6 lg:p-8">
            <div
              className="grid grid-cols-3 gap-2"
              role="tablist"
              aria-label={`${productName} field notes`}
            >
              {fieldTabs.map(({ key, label, Icon }, index) => {
                const isActive = activeKey === key;

                return (
                  <button
                    key={key}
                    id={`${id}-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${id}-panel-${key}`}
                    tabIndex={isActive ? 0 : -1}
                    className={cn(
                      "product-field-tab flex min-h-20 flex-col items-start justify-between gap-2 rounded-sm border px-3 py-3 text-left transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B5B10] motion-reduce:transition-none sm:min-h-16 sm:flex-row sm:items-center sm:px-4",
                      isActive
                        ? "border-[#6D775B] bg-[#E8ECD9] text-[#27301F] shadow-soft"
                        : "border-[#E2CBA8] bg-white/55 text-[#6C543A] hover:-translate-y-0.5 hover:border-[#B88A43] hover:bg-white motion-reduce:hover:translate-y-0"
                    )}
                    onClick={() => setActiveKey(key)}
                    onKeyDown={(event) => moveTab(event, index)}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-extrabold leading-4 sm:text-sm">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid sm:mt-8">
              {fieldTabs.map(({ key }) => {
                const isActive = activeKey === key;
                const copy = panelCopy[key];

                return (
                  <div
                    key={key}
                    id={`${id}-panel-${key}`}
                    role="tabpanel"
                    aria-labelledby={`${id}-tab-${key}`}
                    aria-hidden={!isActive}
                    className={cn(
                      "product-field-panel col-start-1 row-start-1 min-h-[360px] flex-col rounded-sm border border-[#DEC7A2] bg-white/70 p-5 sm:p-7 lg:min-h-[410px] lg:justify-center lg:p-8",
                      isActive && "is-active"
                    )}
                  >
                    <div className="flex items-start justify-between gap-5 border-b border-[#E5D5BC] pb-5">
                      <div>
                        <h3 className="max-w-[20ch] font-heading text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
                          {copy.title}
                        </h3>
                        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[#735D46]">{copy.description}</p>
                      </div>
                      <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8ECD9] text-[#536047] sm:grid">
                        {key === "care" ? (
                          <HeartHandshake aria-hidden="true" className="h-5 w-5" />
                        ) : key === "fit" ? (
                          <PawPrint aria-hidden="true" className="h-5 w-5" />
                        ) : (
                          <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
                        )}
                      </span>
                    </div>

                    {key === "details" ? (
                      <dl className="mt-2 grid grid-cols-2 gap-x-5">
                        {details.map(([label, value], index) => (
                          <div key={`${label}-${index}`} className="border-b border-[#E8DCC8] py-4">
                            <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8D6A33]">{label}</dt>
                            <dd className="mt-2 text-sm font-semibold leading-5 text-[#3B2A1E]">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {key === "fit" ? (
                      <div className={cn("mt-6 grid gap-7", cautionItems.length > 0 && "sm:grid-cols-2")}>
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#58704E]">
                            A good match for
                          </p>
                          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#4F4031] sm:grid-cols-2">
                            {bestFor.map((item) => (
                              <li key={item} className="flex gap-2.5">
                                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#607855]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {cautionItems.length > 0 ? (
                          <div className="border-t border-[#E2CBA8] pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A650B]">
                              Choose another option when
                            </p>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#4F4031]">
                              {cautionItems.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B7791F]" aria-hidden="true" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {key === "care" ? (
                      <ul className="mt-6 grid gap-x-7 gap-y-4 text-sm leading-6 text-[#4F4031] sm:grid-cols-2">
                        {careInstructions.map((item) => (
                          <li key={item} className="flex gap-3 border-b border-[#E8DCC8] pb-4">
                            <RefreshCcw aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#607855]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
