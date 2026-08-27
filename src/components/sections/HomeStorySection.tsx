import Image from "next/image";
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

export function HomeStorySection({ story }: { story: HomepageStorySectionContent }) {
  if (!story.enabled) return null;

  return (
    <section className="home-editorial-story">
      <div className="section-shell">
        <div className="home-editorial-story-poster">
          <Image
            src="/images/about-dogs-running.jpg"
            alt="Two happy dogs running through a sunlit field."
            fill
            sizes="(min-width: 768px) 88vw, 100vw"
            className="object-cover object-center"
          />
          <div aria-hidden="true" />
          <div className="home-editorial-story-copy">
            <p className="home-editorial-kicker">{story.eyebrow}</p>
            <h2>{story.title}</h2>
            <p>{story.subtitle}</p>
            {story.ctaLabel && story.ctaHref && (
              <Link href={story.ctaHref} className="group">
                <span>{story.ctaLabel}</span>
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
            )}
          </div>
        </div>

        <div className="home-editorial-story-principles home-editorial-motion-reveal">
          {story.items.map((item, index) => {
            const Icon = iconMap[item.icon] ?? Heart;

            return (
              <article key={item.key}>
                <p>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden className="h-5 w-5" />
                </p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
