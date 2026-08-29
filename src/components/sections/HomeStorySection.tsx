"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Heart,
  Leaf,
  Lock,
  Package,
  PawPrint,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon
} from "lucide-react";
import { type HomepageStoryIconKey, type HomepageStorySectionContent } from "@/lib/homepage-content";

const iconMap = {
  route: Route,
  search: SearchCheck,
  heart: Heart,
  shield: ShieldCheck,
  check: CheckCircle2,
  sparkles: Sparkles,
  truck: Truck,
  package: Package,
  leaf: Leaf,
  lock: Lock
} as const satisfies Record<HomepageStoryIconKey, LucideIcon>;

export function HomeStorySection({ story }: { story: HomepageStorySectionContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!story.enabled) return null;

  const activeItem = story.items[activeIndex] ?? story.items[0];
  const ActiveIcon = activeItem ? iconMap[activeItem.icon] ?? Heart : Heart;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = story.items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const normalizedIndex = (nextIndex + story.items.length) % story.items.length;
    setActiveIndex(normalizedIndex);
    tabRefs.current[normalizedIndex]?.focus();
  };

  return (
    <section className="home-editorial-story">
      <div className="home-route-story-bridge" aria-hidden="true">
        <div className="section-shell home-route-story-bridge-inner">
          <span className="home-route-story-ticket">
            <Route />
            <span>
              <small>Route complete</small>
              <strong>One useful path</strong>
            </span>
          </span>
          <span className="home-route-story-line"><i /></span>
          <span className="home-route-story-destination">
            <PawPrint />
            <span>
              <small>Next stop</small>
              <strong>Why LUCK CLAWS</strong>
            </span>
          </span>
        </div>
      </div>

      <div className="section-shell">
        <div className="home-editorial-story-stage">
          <div className="home-editorial-story-poster">
            <div className="home-editorial-story-media">
              <Image
                src="/images/about-dogs-running.jpg"
                alt="Two happy dogs running through a sunlit field."
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-center"
              />
              <div className="home-editorial-story-shade" aria-hidden="true" />
              <span className="home-editorial-story-image-note lc-hand-note">Real days. Real routines.</span>
              <div className="home-editorial-story-status" aria-hidden="true">
                <PawPrint />
                <span>Everyday field note</span>
              </div>
            </div>

            <article className="home-editorial-story-copy">
              <span className="home-editorial-story-seal" aria-hidden="true">
                <PawPrint />
                <small>Made for</small>
                <strong>real life</strong>
              </span>
              <p className="home-editorial-kicker">{story.eyebrow}</p>
              <h2>{story.title}</h2>
              <p>{story.subtitle}</p>
              {story.ctaLabel && story.ctaHref && (
                <Link href={story.ctaHref} className="group">
                  <span>{story.ctaLabel}</span>
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
              )}
              <span className="home-editorial-story-signoff lc-hand-note">less aisle, more everyday</span>
            </article>
          </div>
        </div>

        <div className="home-editorial-story-principles">
          <header className="home-story-principles-heading">
            <span>
              <small>How it holds together</small>
              <strong>Three clear moves, one calmer shop.</strong>
            </span>
            <p>Choose a stop to see how the routine continues beyond the picture.</p>
          </header>

          <div className="home-story-principles-board">
            <div className="home-story-principle-tabs" role="tablist" aria-label="Why shop with LUCK CLAWS">
              {story.items.map((item, index) => {
                const Icon = iconMap[item.icon] ?? Heart;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.key}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    id={`home-story-principle-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="home-story-principle-panel"
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
                    <span><Icon aria-hidden /></span>
                    <strong>{item.title}</strong>
                    <ArrowRight aria-hidden />
                  </button>
                );
              })}
            </div>

            {activeItem && (
              <article
                key={activeItem.key}
                id="home-story-principle-panel"
                className="home-story-principle-panel"
                role="tabpanel"
                aria-labelledby={`home-story-principle-tab-${activeIndex}`}
                aria-live="polite"
                data-index={String(activeIndex + 1).padStart(2, "0")}
              >
                <span className="home-story-principle-mark" aria-hidden="true"><ActiveIcon /></span>
                <div>
                  <p>Stop {String(activeIndex + 1).padStart(2, "0")} of {String(story.items.length).padStart(2, "0")}</p>
                  <h3>{activeItem.title}</h3>
                  <p>{activeItem.text}</p>
                </div>
                <span className="home-story-principle-note lc-hand-note">clear at every step</span>
              </article>
            )}
          </div>
        </div>

        <div className="home-story-promise-handoff" aria-hidden="true">
          <span><Sparkles /></span>
          <div>
            <small>The route keeps going</small>
            <strong>Next: the promises behind the shop.</strong>
          </div>
          <i />
          <span className="home-story-promise-arrow"><ArrowDown /></span>
        </div>
      </div>
    </section>
  );
}
