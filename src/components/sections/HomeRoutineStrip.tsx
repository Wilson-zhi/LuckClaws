import Link from "next/link";
import { ArrowRight, Bed, Heart, HelpCircle, PawPrint, Route, type LucideIcon } from "lucide-react";

type RoutineStripItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const routineItems: RoutineStripItem[] = [
  { label: "Play", href: "/collections/dog-toys", Icon: PawPrint },
  { label: "Walk", href: "/collections/walking-essentials", Icon: Route },
  { label: "Rest", href: "/collections/beds-and-blankets", Icon: Bed },
  { label: "Comfort", href: "/collections/pet-apparel", Icon: Heart },
  { label: "Support", href: "/contact", Icon: HelpCircle }
];

export function HomeRoutineStrip() {
  return (
    <section className="section-shell relative z-20 -mt-9">
      <div className="overflow-x-auto rounded-[1.4rem] border border-[#E6C99E] bg-[#FFF9EF]/94 p-2 shadow-lift backdrop-blur hide-scrollbar">
        <nav className="flex min-w-max gap-2" aria-label="Routine shortcuts">
          {routineItems.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex min-w-[150px] items-center justify-between gap-4 rounded-[1rem] px-4 py-3 text-sm font-extrabold text-[#4B2E17] transition hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                {label}
              </span>
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
