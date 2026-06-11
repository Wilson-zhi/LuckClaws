"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Mail,
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
    links: [{ label: "Beds & Blankets", href: "/collections/beds-blankets" }]
  },
  {
    key: "comfort",
    label: "Comfort",
    title: "Everyday comfort without overthinking",
    description: "For practical apparel and products that are easier to compare before checkout.",
    note: "Start here when comfort, fit, and everyday use matter most.",
    Icon: PackageCheck,
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
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Explore Collections", href: "/collections" }
    ]
  }
];

const guideBadges = [
  "Useful before novelty",
  "Comfort before complication",
  "Clear details before checkout",
  "Support after purchase"
];

export function AboutRoutineTabs() {
  const [activeRoutineKey, setActiveRoutineKey] = useState<RoutineKey>("play");
  const activeRoutine = routines.find((routine) => routine.key === activeRoutineKey) ?? routines[0];
  const ActiveIcon = activeRoutine.Icon;
  const activeIndex = routines.findIndex((routine) => routine.key === activeRoutine.key);

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-surface-container-lowest p-5 shadow-ambient md:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary-container/20" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-52 w-52 rounded-full border border-primary/15" />
      <div className="relative grid gap-6 lg:grid-cols-[0.85fr_1.05fr_1fr] lg:items-stretch">
        <div className="rounded-[26px] bg-surface-container-low p-5 md:p-6">
          <span className="inline-flex rounded-full bg-primary-container/25 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            Paw Path
          </span>
          <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            The Paw Path Finder
          </h2>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">
            Choose the moment you are shopping for, then follow a clearer path to the right
            products.
          </p>
          <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm font-semibold leading-6 text-primary">
            Less scrolling. More certainty. Start with the routine before checkout.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {guideBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-bold text-on-surface-variant"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative rounded-[26px] bg-primary-container/15 p-4 md:p-5">
          <div className="pointer-events-none absolute left-[33px] top-10 h-[calc(100%-5rem)] w-px bg-primary/25 md:left-[37px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[18px] top-8 h-8 w-8 rounded-full bg-primary/20 ring-8 ring-primary-container/20 transition-transform duration-300 ease-out md:left-[22px]"
            style={{ transform: `translateY(${activeIndex * 80}px)` }}
          />
          <div
            className="relative grid gap-3"
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
                  className={`group grid min-h-[68px] grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[20px] border px-3 py-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                    selected
                      ? "border-primary bg-white shadow-soft"
                      : "border-transparent bg-white/55 hover:border-primary/30 hover:bg-white"
                  }`}
                  onClick={() => setActiveRoutineKey(routine.key)}
                >
                  <span
                    className={`relative z-10 grid h-11 w-11 place-items-center rounded-full transition ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-primary-container/35 text-primary group-hover:bg-primary-container/55"
                    }`}
                  >
                    <RoutineIcon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-base font-bold text-on-surface">
                      {routine.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {selected ? "Selected stop" : "Choose this stop"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={activeRoutine.key}
          id="about-routine-panel"
          role="tabpanel"
          aria-labelledby={`about-routine-tab-${activeRoutine.key}`}
          className="homepage-enter flex min-h-[360px] flex-col rounded-[26px] bg-white p-5 shadow-soft md:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
              <ActiveIcon aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Recommended path</p>
              <p className="font-heading text-lg font-bold">{activeRoutine.label}</p>
            </div>
          </div>
          <h3 className="mt-6 font-heading text-2xl font-extrabold leading-tight">
            {activeRoutine.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant md:text-base">
            {activeRoutine.description}
          </p>
          <p className="mt-5 rounded-[18px] bg-surface-container-low px-4 py-3 text-sm font-semibold leading-6 text-on-surface-variant">
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
    </section>
  );
}
