"use client";

import { useState } from "react";
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

  if (!section.enabled) return null;

  const activePromise = section.items[activeIndex] ?? section.items[0];
  const ActiveIcon = activePromise ? promiseIcon(activePromise.icon) : SearchCheck;

  return (
    <section className="home-editorial-promises">
      <div className="section-shell">
        <header className="home-editorial-motion-reveal">
          <div className="home-editorial-promise-intro">
            <p className="home-editorial-kicker">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <span className="lc-hand-note">good things, plainly promised</span>
          </div>

          {activePromise && (
            <div
              id="home-promise-panel"
              className="home-editorial-promise-showcase"
              role="tabpanel"
              aria-live="polite"
            >
              <div className="home-editorial-promise-burst" aria-hidden="true">
                <span />
                <ActiveIcon />
              </div>
              <div>
                <p>Promise {String(activeIndex + 1).padStart(2, "0")}</p>
                <h3>{activePromise.title}</h3>
                <p>{activePromise.text}</p>
              </div>
            </div>
          )}
        </header>

        <div
          className="home-editorial-promise-list home-editorial-motion-reveal"
          role="tablist"
          aria-label="Store promises"
        >
          {section.items.map((badge, index) => {
            const Icon = promiseIcon(badge.icon);

            return (
              <button
                key={badge.key}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls="home-promise-panel"
                data-active={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="home-editorial-promise-icon"><Icon aria-hidden /></span>
                <strong>{badge.title}</strong>
                <ArrowRight aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
