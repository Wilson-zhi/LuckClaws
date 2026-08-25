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
  if (!section.enabled) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,#2C1A0D_0%,#2C1A0D_78%,#FFF9EF_100%)] pb-24 pt-14 text-white md:pb-28 md:pt-20">
      <div className="section-shell">
        <div className="grid gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD894]">{section.eyebrow}</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                {section.title}
              </h2>
            </div>
            <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/72 md:mt-0 md:text-base">
              {section.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {section.items.map((badge, index) => {
              const Icon = promiseIcon(badge.icon);
              const isLastOddItem = section.items.length % 2 === 1 && index === section.items.length - 1;

              return (
              <article
                key={badge.key}
                className={`min-h-[220px] rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-4 shadow-soft transition hover:-translate-y-1 hover:bg-white/[0.10] motion-reduce:hover:translate-y-0 sm:p-5 lg:min-h-[220px] ${
                  isLastOddItem ? "col-span-2 min-h-[180px] lg:col-span-1 lg:min-h-[220px]" : ""
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFD894]/12 text-[#FFD894]">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-white">{badge.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/68">{badge.text}</p>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
