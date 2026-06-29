"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bed,
  Heart,
  HelpCircle,
  PawPrint,
  Route,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoutineKey = "play" | "walk" | "rest" | "comfort" | "support";

type RoutineLink = {
  label: string;
  href: string;
};

type RoutineRoute = {
  key: RoutineKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  links: RoutineLink[];
  Icon: LucideIcon;
};

const routineRoutes: RoutineRoute[] = [
  {
    key: "play",
    label: "Play",
    eyebrow: "Energy and enrichment",
    title: "Choose activity before choosing another toy.",
    description: "Start with chewing, chasing, sniffing, or enrichment so the product path feels clearer.",
    note: "Best for curious pets who need daily texture, motion, and mental stimulation.",
    links: [
      { label: "Dog Toys", href: "/collections/dog-toys" },
      { label: "Cat Toys", href: "/collections/cat-toys" }
    ],
    Icon: PawPrint
  },
  {
    key: "walk",
    label: "Walk",
    eyebrow: "Out-the-door routine",
    title: "Build a simple walking setup for daily movement.",
    description: "Compare walking essentials and practical layers for quick errands or longer strolls.",
    note: "Best when fit, control, visibility, and comfort matter before checkout.",
    links: [
      { label: "Walking Essentials", href: "/collections/walking-essentials" },
      { label: "Pet Apparel", href: "/collections/pet-apparel" }
    ],
    Icon: Route
  },
  {
    key: "rest",
    label: "Rest",
    eyebrow: "Slower home moments",
    title: "Make quiet corners easier to settle into.",
    description: "Find soft bedding and calm routine pieces for rest, recovery, warmth, and downtime.",
    note: "Best when your pet needs a softer place to land after play or walks.",
    links: [{ label: "Beds & Blankets", href: "/collections/beds-and-blankets" }],
    Icon: Bed
  },
  {
    key: "comfort",
    label: "Comfort",
    eyebrow: "Everyday use",
    title: "Shop comfort without overthinking every option.",
    description: "Use the routine first, then compare apparel and practical favorites with clearer intent.",
    note: "Best when fit, easy wear, and home-friendly essentials matter most.",
    links: [
      { label: "Pet Apparel", href: "/collections/pet-apparel" },
      { label: "Explore Collections", href: "/collections" }
    ],
    Icon: Heart
  },
  {
    key: "support",
    label: "Support",
    eyebrow: "Questions and order help",
    title: "Support is part of the shopping route.",
    description: "Ask us about a product, sizing, or order issue before guessing your way through checkout.",
    note: "Best when you need product clarity or help with a damaged, defective, or incorrect item.",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Explore Collections", href: "/collections" }
    ],
    Icon: HelpCircle
  }
];

export function HomeRoutineRoute() {
  const [activeKey, setActiveKey] = useState<RoutineKey>("play");
  const activeRoute = routineRoutes.find((route) => route.key === activeKey) ?? routineRoutes[0];
  const ActiveIcon = activeRoute.Icon;

  return (
    <section className="section-shell py-12 md:py-16">
      <div className="overflow-hidden rounded-lg border border-[#EAD4B8] bg-[#FFFDF8] shadow-ambient">
        <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Sparkles aria-hidden className="h-4 w-4" />
              Routine-first shopping
            </span>
            <h2 className="mt-5 max-w-2xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">
              Start with the pet moment. Then follow the product path.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
              Pick the routine you are shopping for and use it as a cleaner route into the right collection.
            </p>

            <div className="relative mt-8">
              <div className="absolute left-7 right-7 top-9 hidden h-px bg-gradient-to-r from-transparent via-[#D8A455] to-transparent md:block" />
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                {routineRoutes.map((route) => {
                  const selected = route.key === activeRoute.key;
                  const Icon = route.Icon;

                  return (
                    <button
                      key={route.key}
                      type="button"
                      className={cn(
                        "group relative rounded-md border bg-white px-4 py-4 text-left shadow-soft transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        selected
                          ? "border-primary bg-[#FFF4DB] shadow-ambient"
                          : "border-outline-variant hover:-translate-y-1 hover:border-primary hover:shadow-ambient motion-reduce:hover:translate-y-0"
                      )}
                      aria-pressed={selected}
                      onClick={() => setActiveKey(route.key)}
                    >
                      <span
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-full border transition duration-200",
                          selected
                            ? "border-primary bg-primary-container text-on-primary-container"
                            : "border-outline-variant bg-[#FFF8EF] text-primary group-hover:bg-primary-container/20"
                        )}
                      >
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="mt-4 block font-heading text-base font-bold text-on-surface">
                        {route.label}
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-on-surface-variant">
                        {route.eyebrow}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#442B14] p-5 text-white shadow-lift md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container text-on-primary-container">
                <ActiveIcon aria-hidden className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#FFD894]">{activeRoute.label}</p>
                <p className="text-sm text-white/70">{activeRoute.eyebrow}</p>
              </div>
            </div>
            <div key={activeRoute.key} className="homepage-enter mt-6">
              <h3 className="font-heading text-2xl font-bold leading-tight md:text-3xl">{activeRoute.title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/78">{activeRoute.description}</p>
              <p className="mt-4 rounded-md border border-white/15 bg-white/8 p-4 text-sm leading-6 text-white/80">
                {activeRoute.note}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {activeRoute.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#442B14] transition hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                  >
                    {link.label}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
