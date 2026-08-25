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
    <section className="-mt-px hidden bg-[linear-gradient(180deg,#2C1A0D_0%,#2C1A0D_62%,#3B2616_100%)] pb-7 pt-5 text-white md:block">
      <div className="section-shell">
        <div className="grid gap-4 rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-3 shadow-lift backdrop-blur md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
          <div className="px-2 md:px-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFD894]">
              Routine route
            </p>
            <p className="lc-hand-note mt-1 text-xl text-white">
              Choose where to start
            </p>
          </div>

          <div className="overflow-x-auto hide-scrollbar">
            <nav className="flex min-w-max gap-2" aria-label="Routine shortcuts">
              {routineItems.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex min-w-[154px] items-center justify-between gap-4 rounded-[1rem] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-extrabold text-white/88 transition hover:-translate-y-0.5 hover:border-[#FFD894]/55 hover:bg-[#FFD894] hover:text-[#2C1A0D] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD894] motion-reduce:hover:translate-y-0"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFD894]/15 text-[#FFD894] transition group-hover:bg-[#2C1A0D]/10 group-hover:text-[#2C1A0D]">
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
        </div>
      </div>
    </section>
  );
}
