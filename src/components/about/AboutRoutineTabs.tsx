"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Mail,
  PawPrint,
  PackageCheck,
  Sparkles,
  Truck,
  type LucideIcon
} from "lucide-react";

type RoutineKey = "play" | "walk" | "rest" | "comfort" | "support";

type Routine = {
  key: RoutineKey;
  label: string;
  title: string;
  description: string;
  note: string;
  Icon: LucideIcon;
  desktopPosition: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

const routines: Routine[] = [
  {
    key: "play",
    label: "Play",
    title: "Playful energy, easier choices",
    description: "For curious pets who need toys, textures, and daily enrichment.",
    note: "Start here when your pet needs activity, chewing, chasing, or enrichment.",
    Icon: Sparkles,
    desktopPosition: "lg:left-4 lg:top-14",
    links: [
      { label: "Dog Toys", href: "/collections/dog-toys" },
      { label: "Cat Toys", href: "/collections/cat-toys" }
    ]
  },
  {
    key: "walk",
    label: "Walk",
    title: "Out-the-door essentials",
    description: "For everyday walks, quick errands, and longer strolls.",
    note: "Start here when you need movement, comfort, and simple walking gear.",
    Icon: Truck,
    desktopPosition: "lg:left-[24%] lg:top-[48%]",
    links: [
      { label: "Walking Essentials", href: "/collections/walking-essentials" },
      { label: "Pet Apparel", href: "/collections/pet-apparel" }
    ]
  },
  {
    key: "rest",
    label: "Rest",
    title: "Cozy corners and slower moments",
    description: "For rest, recovery, warmth, and calmer routines.",
    note: "Start here when your pet needs a softer place to settle.",
    Icon: Heart,
    desktopPosition: "lg:left-[46%] lg:top-12",
    links: [{ label: "Beds & Blankets", href: "/collections/beds-and-blankets" }]
  },
  {
    key: "comfort",
    label: "Comfort",
    title: "Everyday comfort without overthinking",
    description: "For practical apparel and products that are easier to compare before checkout.",
    note: "Start here when comfort, fit, and everyday use matter most.",
    Icon: PackageCheck,
    desktopPosition: "lg:left-[64%] lg:top-[54%]",
    links: [
      { label: "Pet Apparel", href: "/collections/pet-apparel" },
      { label: "Explore Collections", href: "/collections" }
    ]
  },
  {
    key: "support",
    label: "Support",
    title: "Not sure where to start?",
    description: "Tell us what you are shopping for or what happened with an order.",
    note: "Support is part of the path, not an afterthought.",
    Icon: Mail,
    desktopPosition: "lg:right-4 lg:top-20",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Explore Collections", href: "/collections" }
    ]
  }
];

const guideNotes: Array<{
  label: string;
  emphasis: string;
  rest: string;
  Icon: LucideIcon;
  className: string;
}> = [
  {
    label: "Useful before novelty",
    emphasis: "Useful",
    rest: "before novelty",
    Icon: PawPrint,
    className: "lg:-rotate-[1.4deg] lg:translate-y-1"
  },
  {
    label: "Comfort before complication",
    emphasis: "Comfort",
    rest: "before complication",
    Icon: Heart,
    className: "lg:rotate-[0.9deg]"
  },
  {
    label: "Clear details before checkout",
    emphasis: "Clear details",
    rest: "before checkout",
    Icon: Sparkles,
    className: "lg:-rotate-[0.8deg] lg:translate-y-2"
  },
  {
    label: "Support after purchase",
    emphasis: "Support",
    rest: "after purchase",
    Icon: ArrowRight,
    className: "lg:rotate-[1.2deg] lg:translate-y-0.5"
  }
];

export function AboutRoutineTabs() {
  const [activeRoutineKey, setActiveRoutineKey] = useState<RoutineKey>("play");
  const activeRoutine = routines.find((routine) => routine.key === activeRoutineKey) ?? routines[0];
  const ActiveIcon = activeRoutine.Icon;

  return (
    <section className="relative overflow-hidden rounded-[34px] bg-[#fff8ed] p-5 shadow-ambient ring-1 ring-primary/10 md:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary-container/25" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-64 w-64 rounded-full border border-primary/15" />

      <div className="relative">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
            Routine Route
          </span>
          <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
            The Paw Path Finder
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
            Choose your pet&apos;s next moment, then follow a clearer route to the right products.
          </p>
          <p className="mt-3 text-sm font-bold leading-6 text-primary">
            Less scrolling. More certainty. Start with the routine before checkout.
          </p>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_420px] xl:items-stretch">
          <div className="relative overflow-hidden rounded-[30px] bg-white/72 p-4 shadow-soft md:p-6 lg:min-h-[430px]">
            <div className="pointer-events-none absolute inset-x-8 top-20 hidden h-64 lg:block">
              <svg
                aria-hidden="true"
                className="h-full w-full overflow-visible"
                viewBox="0 0 760 260"
                preserveAspectRatio="none"
              >
                <path
                  d="M32 60 C150 10 200 210 318 150 C430 90 420 18 540 70 C638 112 630 210 732 120"
                  fill="none"
                  stroke="#d6a245"
                  strokeLinecap="round"
                  strokeWidth="10"
                  opacity="0.18"
                />
                <path
                  d="M32 60 C150 10 200 210 318 150 C430 90 420 18 540 70 C638 112 630 210 732 120"
                  fill="none"
                  stroke="#8a5a2b"
                  strokeDasharray="4 26"
                  strokeLinecap="round"
                  strokeWidth="6"
                  opacity="0.36"
                />
              </svg>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden" role="tablist" aria-label="Paw Path Finder routines">
              {routines.map((routine) => {
                const selected = routine.key === activeRoutineKey;
                const RoutineIcon = routine.Icon;

                return (
                  <button
                    key={routine.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="about-routine-panel"
                    className={`min-h-14 shrink-0 rounded-full border px-4 py-3 text-left transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                      selected
                        ? "border-primary bg-primary text-white shadow-lift"
                        : "border-primary/15 bg-white text-primary hover:border-primary/35"
                    }`}
                    onClick={() => setActiveRoutineKey(routine.key)}
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <RoutineIcon aria-hidden className="h-4 w-4" />
                      {routine.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="relative hidden min-h-[360px] lg:block"
              role="tablist"
              aria-label="Paw Path Finder routines"
            >
              {routines.map((routine) => {
                const selected = routine.key === activeRoutineKey;
                const RoutineIcon = routine.Icon;

                return (
                  <button
                    key={routine.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="about-routine-panel"
                    id={`about-routine-tab-${routine.key}`}
                    className={`group absolute w-[168px] rounded-[24px] border px-3 py-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${routine.desktopPosition} ${
                      selected
                        ? "z-20 -translate-y-1 border-primary bg-white shadow-lift"
                        : "z-10 border-primary/10 bg-white/80 shadow-soft hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white"
                    }`}
                    onClick={() => setActiveRoutineKey(routine.key)}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition ${
                        selected
                          ? "bg-primary text-white ring-8 ring-primary-container/30"
                          : "bg-primary-container/35 text-primary group-hover:bg-primary-container/55"
                      }`}
                      >
                        {selected && (
                          <PawPrint
                            aria-hidden
                            className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white p-0.5 text-primary shadow-soft"
                          />
                        )}
                        <RoutineIcon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-heading text-base font-bold text-on-surface">
                          {routine.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                          {selected ? "Active stop" : "Route stop"}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:absolute lg:bottom-4 lg:left-4 lg:right-4 lg:mt-0 lg:grid-cols-4 lg:items-end">
              {guideNotes.map(({ label, emphasis, rest, Icon, className }) => (
                <div
                  key={label}
                  aria-label={label}
                  className={`relative overflow-hidden rounded-[18px] border border-primary/15 bg-[#fffaf3]/90 px-3.5 py-3 text-left shadow-soft backdrop-blur transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
                >
                  <span className="pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full bg-primary-container/25" />
                  <span className="relative flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-container/35 text-primary">
                      <Icon aria-hidden className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-sm font-extrabold leading-5 text-primary">
                        {emphasis}
                      </span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                        {rest}
                      </span>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            key={activeRoutine.key}
            id="about-routine-panel"
            role="tabpanel"
            aria-label={`${activeRoutine.label} recommendations`}
            className="homepage-enter flex min-h-[320px] flex-col rounded-[30px] bg-white p-5 shadow-lift md:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-soft">
                <ActiveIcon aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Selected route</p>
                <p className="font-heading text-lg font-bold">{activeRoutine.label}</p>
              </div>
            </div>
            <h3 className="mt-6 font-heading text-2xl font-extrabold leading-tight">
              {activeRoutine.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant md:text-base">
              {activeRoutine.description}
            </p>
            <p className="mt-5 rounded-[20px] bg-[#fff8ed] px-4 py-3 text-sm font-semibold leading-6 text-on-surface-variant">
              {activeRoutine.note}
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              {activeRoutine.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary-container/10"
                >
                  {link.label}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
