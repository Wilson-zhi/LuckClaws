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
    title: "For curious paws and daily enrichment",
    description: "Toys and textures that help make everyday play easier to choose.",
    Icon: Sparkles,
    links: [
      { label: "Dog Toys", href: "/collections/dog-toys" },
      { label: "Cat Toys", href: "/collections/cat-toys" }
    ]
  },
  {
    key: "walk",
    label: "Walk",
    title: "For quick errands and longer strolls",
    description: "Walking gear and easy layers for daily movement, weather shifts, and simple outings.",
    Icon: Truck,
    links: [
      { label: "Walking Essentials", href: "/collections/walking-essentials" },
      { label: "Pet Apparel", href: "/collections/pet-apparel" }
    ]
  },
  {
    key: "rest",
    label: "Rest",
    title: "For calmer corners and cozy breaks",
    description: "Soft places and comfort-first pieces for naps, crate time, sofa time, and evening routines.",
    Icon: Heart,
    links: [{ label: "Beds & Blankets", href: "/collections/beds-blankets" }]
  },
  {
    key: "comfort",
    label: "Comfort",
    title: "For everyday wear and simple care",
    description: "Practical apparel and broad collection paths for the pieces that make daily life smoother.",
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
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient md:p-6 lg:p-8">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="Pet routines">
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
        id="about-routine-panel"
        role="tabpanel"
        aria-labelledby={`about-routine-tab-${activeRoutine.key}`}
        className="mt-6 grid gap-6 rounded-lg bg-surface-container-low p-5 md:grid-cols-[220px_minmax(0,1fr)] md:p-7"
      >
        <div className="relative min-h-40 overflow-hidden rounded-lg bg-primary-container/20 p-5 text-primary">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-primary/20" />
          <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full bg-white/45" />
          <ActiveIcon aria-hidden className="relative h-12 w-12" />
          <p className="relative mt-8 font-heading text-3xl font-extrabold">{activeRoutine.label}</p>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-heading text-2xl font-bold">{activeRoutine.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
            {activeRoutine.description}
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
