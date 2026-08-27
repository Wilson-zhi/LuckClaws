"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType } from "react";
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
} as const satisfies Record<
  HomepageDecisionGuideIconKey,
  ComponentType<{ className?: string; "aria-hidden"?: boolean }>
>;

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

  useEffect(() => {
    const handleMotionStep = (event: Event) => {
      const nextIndex = (event as CustomEvent<number>).detail;
      const nextOption = guideOptions[nextIndex];
      if (nextOption) setActiveKey(nextOption.key);
    };

    window.addEventListener("home-guide-motion-step", handleMotionStep);
    return () => window.removeEventListener("home-guide-motion-step", handleMotionStep);
  }, [guideOptions]);

  if (!guide.enabled || !activeOption) {
    return null;
  }

  const activeIndex = Math.max(
    0,
    guideOptions.findIndex((option) => option.key === activeOption.key)
  );

  return (
    <section id="shop-by-routine" className="home-editorial-guide scroll-mt-24">
      <div className="section-shell">
        <header className="home-editorial-guide-heading home-editorial-motion-reveal">
          <div>
            <p className="home-editorial-kicker">{guide.eyebrow}</p>
            <h2>{guide.title}</h2>
          </div>
          <div>
            <p>{guide.subtitle}</p>
            <span className="lc-hand-note">Start with today&apos;s moment.</span>
          </div>
        </header>

        <div className="home-editorial-guide-layout" data-guide-count={guideOptions.length}>
          <div className="home-editorial-guide-media" aria-live="polite">
            <Image
              key={activeOption.image}
              src={activeOption.image}
              alt={activeOption.imageAlt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="advisor-recommendation-enter object-cover"
            />
            <div className="home-editorial-guide-media-shade" aria-hidden="true" />
            <p className="home-editorial-guide-media-label">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span>{activeOption.eyebrow}</span>
            </p>
            <p className="home-editorial-guide-media-note lc-hand-note">A shorter route to shop.</p>
          </div>

          <div className="home-editorial-guide-panel">
            <div className="home-editorial-guide-tabs" role="tablist" aria-label="Shopping routine advisor">
              {guideOptions.map(({ key, label, icon }, index) => {
                const isActive = key === activeOption.key;
                const Icon = guideIcon(icon);

                return (
                  <button
                    key={key}
                    id={`routine-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="routine-guide-panel"
                    className="group"
                    data-active={isActive}
                    onClick={() => setActiveKey(key)}
                    onFocus={() => setActiveKey(key)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setActiveKey(key);
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden className="h-5 w-5" />
                    <strong>{label}</strong>
                    <ArrowRight aria-hidden className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </button>
                );
              })}
            </div>

            <article
              id="routine-guide-panel"
              role="tabpanel"
              aria-labelledby={`routine-tab-${activeOption.key}`}
              className="home-editorial-guide-result advisor-recommendation-enter"
            >
              <h3>{activeOption.title}</h3>
              <p>{activeOption.description}</p>
              <ul>
                {activeOption.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div>
                {activeOption.links.map((link, index) => (
                  <Link key={link.href} href={link.href} data-primary={index === 0} className="group">
                    <span>{link.label}</span>
                    <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                ))}
              </div>
            </article>
          </div>

          <div className="home-editorial-guide-progress" aria-hidden="true">
            <span />
          </div>
        </div>

        <div
          className="home-editorial-guide-steps home-editorial-motion-reveal"
          aria-label={guide.stepsTitle}
        >
          <p>
            <span>{guide.stepsBadge}</span>
            <strong>{guide.stepsTitle}</strong>
          </p>
          <ol>
            {guide.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.text}</small>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
