import {
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
  if (!section.enabled) return null;

  return (
    <section className="home-editorial-promises">
      <div className="section-shell">
        <header className="home-editorial-motion-reveal">
          <p className="home-editorial-kicker">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </header>

        <div className="home-editorial-promise-list home-editorial-motion-reveal">
          {section.items.map((badge, index) => {
            const Icon = promiseIcon(badge.icon);

            return (
              <article key={badge.key}>
                <p>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden className="h-5 w-5" />
                </p>
                <h3>{badge.title}</h3>
                <p>{badge.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
