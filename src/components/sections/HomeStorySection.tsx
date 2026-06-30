import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Leaf,
  Lock,
  Package,
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

function StoryIcon({ icon }: { icon: HomepageStoryIconKey }) {
  const Icon = iconMap[icon] ?? Heart;

  return <Icon aria-hidden className="h-5 w-5" />;
}

export function HomeStorySection({ story }: { story: HomepageStorySectionContent }) {
  if (!story.enabled) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,#F7EAD8_0%,#FFF9EF_18%,#FFF9EF_78%,#F3E5D2_100%)] py-16 md:py-24">
      <div className="section-shell">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#E5C9A4] bg-[#2C1A0D] shadow-lift lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative isolate min-h-[420px] overflow-hidden p-6 text-white md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,216,148,0.22),transparent_30%),radial-gradient(circle_at_80%_78%,rgba(255,249,239,0.14),transparent_28%)]" />
            <div className="absolute inset-x-8 bottom-8 h-px bg-white/10" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD894]">{story.eyebrow}</p>
                <h2 className="mt-4 max-w-xl font-heading text-4xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
                  {story.title}
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/75 md:text-lg">
                  {story.subtitle}
                </p>
              </div>

              {story.ctaLabel && story.ctaHref && (
                <Link
                  href={story.ctaHref}
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#FFD894] px-6 py-3 text-sm font-extrabold text-[#2C1A0D] transition hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD894] motion-reduce:hover:translate-y-0"
                >
                  {story.ctaLabel}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-3 bg-[#F5E2C8] p-4 md:p-6">
            {story.items.map((item, index) => (
              <article
                key={item.key}
                className="group grid gap-5 rounded-[1.4rem] border border-[#E2C39B] bg-[#FFF9EF] p-5 shadow-soft transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-lift motion-reduce:hover:translate-y-0 md:grid-cols-[auto_minmax(0,1fr)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary transition group-hover:bg-primary-container group-hover:text-on-primary-container">
                  <StoryIcon icon={item.icon} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-[#24170E]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#6B5540] md:text-base">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
