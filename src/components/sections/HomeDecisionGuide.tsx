"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { ArrowRight, Bed, HelpCircle, PawPrint, Route, SearchCheck } from "lucide-react";
import type {
  HomepageDecisionGuideContent,
  HomepageDecisionGuideIconKey
} from "@/lib/homepage-content";

const decisionGuideIconMap = {
  paw: PawPrint,
  route: Route,
  bed: Bed,
  help: HelpCircle,
  search: SearchCheck,
  heart: PawPrint
} as const satisfies Record<HomepageDecisionGuideIconKey, ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

function guideIcon(icon: HomepageDecisionGuideIconKey) {
  return decisionGuideIconMap[icon] ?? PawPrint;
}

export function HomeDecisionGuide({ guide }: { guide: HomepageDecisionGuideContent }) {
  const guideOptions = guide.options;
  const [activeKey, setActiveKey] = useState(guideOptions[0]?.key ?? "");
  const activeOption = useMemo(
    () => guideOptions.find((option) => option.key === activeKey) ?? guideOptions[0],
    [activeKey, guideOptions]
  );

  if (!guide.enabled || !activeOption) {
    return null;
  }

  return (
    <section
      id="shop-by-routine"
      className="scroll-mt-24 bg-[linear-gradient(180deg,#F3E5D2_0%,#FFF9EF_16%,#FFF9EF_84%,#F7EAD8_100%)] py-6 md:py-7 xl:py-8"
    >
      <div className="section-shell">
        <div className="grid gap-7 lg:h-[min(640px,calc(100svh-132px))] lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
          <div className="flex max-w-xl flex-col lg:h-full lg:max-w-none lg:rounded-[2rem] lg:border lg:border-[#E5C9A4] lg:bg-white/36 lg:p-5 lg:shadow-[0_24px_70px_rgba(92,60,30,0.09)] lg:backdrop-blur">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{guide.eyebrow}</p>
              <h2 className="mt-3 max-w-xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight md:text-5xl xl:text-[3.32rem] 2xl:text-[3.75rem]">
                {guide.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#6B5540] 2xl:text-base 2xl:leading-7">
                {guide.subtitle}
              </p>
            </div>

            <div className="mt-4 flex max-w-xl flex-col rounded-[1.35rem] border border-[#E5C9A4] bg-white/68 p-3.5 shadow-soft backdrop-blur lg:flex-1">
              <div className="flex items-center justify-between gap-4 border-b border-[#E5C9A4] pb-2.5">
                <p className="font-heading text-base font-extrabold text-[#2C1A0D] 2xl:text-lg">{guide.stepsTitle}</p>
                <span className="rounded-full bg-primary-container/20 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                  {guide.stepsBadge}
                </span>
              </div>
              <ol className="mt-3 grid gap-2 lg:flex-1 lg:content-center 2xl:gap-2.5">
                {guide.steps.map((step) => (
                  <li key={step.number} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#E0C39C] bg-[#FFF8ED] font-heading text-[11px] font-extrabold text-primary 2xl:h-9 2xl:w-9 2xl:text-xs">
                      {step.number}
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-extrabold text-[#2C1A0D] xl:text-base">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium leading-5 text-[#6B5540] xl:text-sm xl:leading-6">
                        {step.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-3 flex max-w-xl flex-wrap gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6B4A2F]">
              {guide.routineTags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#E5C9A4] bg-[#FFF8ED]/78 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid rounded-[2rem] border border-[#E5C9A4] bg-white/42 p-3 shadow-[0_28px_80px_rgba(92,60,30,0.12)] backdrop-blur lg:h-full lg:grid-rows-[auto_minmax(0,1fr)]">
            <div
              className="grid grid-cols-[repeat(4,minmax(150px,1fr))] gap-2 overflow-x-auto pb-1 hide-scrollbar"
              role="tablist"
              aria-label="Shopping routine advisor"
            >
              {guideOptions.map(({ key, label, icon }) => {
                const isActive = key === activeOption.key;
                const Icon = guideIcon(icon);

                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`group flex min-h-[58px] items-center gap-2.5 overflow-hidden rounded-[1.15rem] border px-3 text-left shadow-soft transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                      isActive
                        ? "border-primary bg-[#2C1A0D] text-white"
                        : "border-[#E5C9A4] bg-white/82 text-[#4E3928] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:shadow-lift motion-reduce:hover:translate-y-0"
                    }`}
                    onClick={() => setActiveKey(key)}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
                          isActive
                            ? "bg-[#FFD894] text-[#2C1A0D]"
                            : "bg-primary-container/20 text-primary group-hover:bg-primary-container"
                        }`}
                      >
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span
                        className="min-w-0 overflow-hidden font-heading text-[13px] font-extrabold leading-tight xl:text-sm"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2
                        }}
                      >
                        {label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <article
              className="mt-2 grid min-h-[560px] overflow-hidden rounded-[1.6rem] border border-[#E4C8A3] bg-[#2C1A0D] text-white shadow-lift md:grid-cols-[0.94fr_1.06fr] lg:mt-3 lg:min-h-0"
              aria-live="polite"
            >
              <div className="relative min-h-[260px] overflow-hidden md:h-full md:min-h-0">
                <Image
                  key={activeOption.image}
                  src={activeOption.image}
                  alt={activeOption.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-cover transition duration-500 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(36,23,14,0.62)_0%,rgba(36,23,14,0.12)_58%,rgba(36,23,14,0.05)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 rounded-[1rem] border border-white/16 bg-[#2C1A0D]/58 p-3 backdrop-blur xl:p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894]">
                    {activeOption.eyebrow}
                  </p>
                  <p className="mt-1 font-heading text-lg font-extrabold xl:text-xl">A shorter route to shop.</p>
                </div>
              </div>

              <div className="flex min-h-0 flex-col justify-between gap-3 p-5 xl:p-5 2xl:p-6">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#FFD894]/28 bg-[#FFD894]/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894]">
                    <SearchCheck aria-hidden className="h-4 w-4" />
                    Guided choice
                  </p>
                  <h3 className="mt-3 max-w-xl font-heading text-[2rem] font-extrabold leading-[1.03] md:text-[2.05rem] xl:text-[2.02rem] 2xl:text-[2.22rem]">
                    {activeOption.title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-sm font-medium leading-6 text-white/76 2xl:text-base 2xl:leading-7">
                    {activeOption.description}
                  </p>
                </div>

                <div className="grid gap-3">
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {activeOption.details.map((detail) => (
                      <li
                        key={detail}
                        className="rounded-[0.85rem] border border-white/12 bg-white/[0.07] px-3 py-2 text-xs font-bold leading-5 text-white/82 2xl:px-4 2xl:py-3 2xl:text-sm"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    {activeOption.links.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD894] 2xl:px-5 2xl:py-3 ${
                          index === 0
                            ? "bg-[#FFD894] text-[#2C1A0D] hover:bg-primary-container hover:shadow-soft"
                            : "border border-white/24 bg-white/10 text-white hover:bg-white hover:text-[#2C1A0D]"
                        }`}
                      >
                        {link.label}
                        <ArrowRight
                          aria-hidden
                          className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
