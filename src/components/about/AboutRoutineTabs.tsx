"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, PackageCheck, Sparkles, Truck, type LucideIcon } from "lucide-react";

type RoutineKey = "play" | "walk" | "rest" | "comfort";

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
    title: "Play that keeps curious paws busy",
    description: "Start with toys that make daily enrichment easier to choose.",
    note: "Good first step when your pet needs more activity, texture, or treat-based engagement.",
    Icon: Sparkles,
    links: [
      { label: "Dog Toys", href: "/collections/dog-toys" },
      { label: "Cat Toys", href: "/collections/cat-toys" }
    ]
  },
  {
    key: "walk",
    label: "Walk",
    title: "Walks with fewer loose ends",
    description: "Find essentials for short errands, longer strolls, and everyday movement.",
    note: "Useful when you are comparing fit, control, layering, or outing basics.",
    Icon: Truck,
    links: [
      { label: "Walking Essentials", href: "/collections/walking-essentials" },
      { label: "Pet Apparel", href: "/collections/pet-apparel" }
    ]
  },
  {
    key: "rest",
    label: "Rest",
    title: "Cozy corners for slower moments",
    description: "Choose soft beds and blankets for rest, recovery, and calm routines.",
    note: "Start here when comfort, softness, and a stable rest space matter most.",
    Icon: Heart,
    links: [{ label: "Beds & Blankets", href: "/collections/beds-blankets" }]
  },
  {
    key: "comfort",
    label: "Comfort",
    title: "Everyday comfort made easier to compare",
    description: "Shop apparel and practical essentials with clearer product details.",
    note: "A helpful path for fit, simple care, and everyday pieces that need to feel easy.",
    Icon: PackageCheck,
    links: [
      { label: "Pet Apparel", href: "/collections/pet-apparel" },
      { label: "Explore Collections", href: "/collections" }
    ]
  }
];

export function AboutRoutineTabs() {
  const [activeRoutineKey, setActiveRoutineKey] = useState<RoutineKey>("play");
  const activeRoutine = routines.find((routine) => routine.key === activeRoutineKey) ?? routines[0];
  const ActiveIcon = activeRoutine.Icon;

  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-4 shadow-ambient md:p-6 lg:p-8">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="Paw Path routines">
        {routines.map((routine) => {
          const selected = routine.key === activeRoutineKey;

          return (
            <button
              key={routine.key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="about-routine-panel"
              id={`about-routine-tab-${routine.key}`}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selected
                  ? "bg-primary text-white shadow-soft"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
              onClick={() => setActiveRoutineKey(routine.key)}
            >
              {routine.label}
            </button>
          );
        })}
      </div>

      <div
        key={activeRoutine.key}
        id="about-routine-panel"
        role="tabpanel"
        aria-labelledby={`about-routine-tab-${activeRoutine.key}`}
        className="homepage-enter mt-6 grid gap-6 rounded-[22px] bg-surface-container-low p-5 md:grid-cols-[220px_minmax(0,1fr)] md:p-7"
      >
        <div className="relative min-h-40 overflow-hidden rounded-[18px] bg-primary-container/20 p-5 text-primary">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-primary/20" />
          <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full bg-white/45" />
          <div className="absolute left-8 top-20 h-[2px] w-24 rotate-[-18deg] bg-primary/25" />
          <ActiveIcon aria-hidden className="relative h-12 w-12" />
          <p className="relative mt-8 font-heading text-3xl font-extrabold">{activeRoutine.label}</p>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-heading text-2xl font-bold">{activeRoutine.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
            {activeRoutine.description}
          </p>
          <p className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-semibold leading-6 text-on-surface-variant">
            {activeRoutine.note}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
