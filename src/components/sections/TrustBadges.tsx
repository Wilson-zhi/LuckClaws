"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Leaf,
  Lock,
  Package as PackageIcon,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon
} from "lucide-react";
import type { HomepageServicePromisesContent, HomepageTrustBadgeIconKey } from "@/lib/homepage-content";

const promiseIconMap = {
  truck: Truck,
  shield: ShieldCheck,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  package: PackageIcon,
  check: CheckCircle2,
  rotate: RotateCcw,
  lock: Lock
} as const satisfies Record<HomepageTrustBadgeIconKey, LucideIcon>;

function promiseIcon(icon: HomepageTrustBadgeIconKey) {
  return promiseIconMap[icon] ?? SearchCheck;
}

export function TrustBadges({ section }: { section: HomepageServicePromisesContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!section.enabled) return null;

  const activePromise = section.items[activeIndex] ?? section.items[0];
  const ActiveIcon = activePromise ? promiseIcon(activePromise.icon) : SearchCheck;
  const progress = section.items.length > 0 ? (activeIndex + 1) / section.items.length : 0;
  const [titleLead, ...titleRest] = section.title.split(",");
  const titleAccent = titleRest.join(",").trim();

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = section.items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const normalizedIndex = (nextIndex + section.items.length) % section.items.length;
    setActiveIndex(normalizedIndex);
    tabRefs.current[normalizedIndex]?.focus();
  };

  return (
    <section className="home-editorial-promises">
      <div className="section-shell">
        <header>
          <div className="home-editorial-promise-intro">
            <p className="home-editorial-kicker">{section.eyebrow}</p>
            <h2>
              <span data-promise-title-piece="lead">{titleLead.trim()}{titleAccent ? "," : ""}</span>
              {titleAccent && <em data-promise-title-piece="accent">{titleAccent}</em>}
            </h2>
            <p>{section.description}</p>
            <span className="lc-hand-note">nothing hidden in the small print</span>
          </div>
          <div className="home-promise-header-note" aria-hidden="true">
            <span>{String(section.items.length).padStart(2, "0")}</span>
            <p><small>Store promises</small><strong>Choose one. Read it clearly.</strong></p>
            <ArrowRight />
          </div>
        </header>

        <div className="home-promise-board">
          <div className="home-editorial-promise-list" role="tablist" aria-label="Store promises">
            {section.items.map((badge, index) => {
              const Icon = promiseIcon(badge.icon);
              const isActive = activeIndex === index;

              return (
                <button
                  key={badge.key}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`home-promise-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="home-promise-panel"
                  tabIndex={isActive ? 0 : -1}
                  data-active={isActive}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActiveIndex(index);
                  }}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="home-editorial-promise-icon"><Icon aria-hidden /></span>
                  <strong>{badge.title}</strong>
                  <ArrowRight aria-hidden />
                </button>
              );
            })}
          </div>

          {activePromise && (
            <article
              key={activePromise.key}
              id="home-promise-panel"
              className="home-editorial-promise-showcase"
              role="tabpanel"
              aria-labelledby={`home-promise-tab-${activeIndex}`}
              aria-live="polite"
              data-number={String(activeIndex + 1).padStart(2, "0")}
            >
              <div className="home-editorial-promise-burst" aria-hidden="true">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <ActiveIcon />
              </div>
              <div className="home-promise-active-copy">
                <p>Promise {String(activeIndex + 1).padStart(2, "0")} / {String(section.items.length).padStart(2, "0")}</p>
                <h3>{activePromise.title}</h3>
                <p>{activePromise.text}</p>
                <span className="lc-hand-note">plain words, useful details</span>
              </div>
              <div className="home-promise-progress" aria-hidden="true">
                <i style={{ transform: `scaleX(${progress})` }} />
                <span>{Math.round(progress * 100)}%</span>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
