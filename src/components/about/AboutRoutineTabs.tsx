"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  Lock,
  Mail,
  PawPrint,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon
} from "lucide-react";
import {
  fallbackAboutPawContent,
  type AboutPawContent,
  type AboutPawNoteContent,
  type AboutPawRouteContent
} from "@/lib/about-paw-content";

type Routine = AboutPawRouteContent & {
  Icon: LucideIcon;
  media: {
    image: string;
    alt: string;
    tone: string;
  };
  links: Array<{
    label: string;
    href: string;
  }>;
};

const iconMap: Record<string, LucideIcon> = {
  paw: PawPrint,
  shield: ShieldCheck,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  truck: Truck,
  package: PackageCheck,
  check: Check,
  rotate: RotateCcw,
  lock: Lock,
  mail: Mail,
  arrow: ArrowRight
};

const routeMediaByKey: Record<string, Routine["media"]> = {
  play: {
    image: "/images/natural-cotton-tug-rope.jpg",
    alt: "Natural cotton rope and play textures for pet enrichment.",
    tone: "Play path"
  },
  walk: {
    image: "/images/category-walking-essentials.jpg",
    alt: "Walking essentials arranged as a warm pet routine.",
    tone: "Walk path"
  },
  rest: {
    image: "/images/category-beds-blankets.jpg",
    alt: "Soft bedding and blankets for calm pet routines.",
    tone: "Rest path"
  },
  comfort: {
    image: "/images/category-pet-apparel.jpg",
    alt: "Pet apparel shown in a warm everyday setting.",
    tone: "Comfort path"
  },
  support: {
    image: "/images/about-partners.jpg",
    alt: "LUCK CLAWS support and pet care materials.",
    tone: "Support path"
  }
};

const fallbackMedia: Routine["media"] = {
  image: "/images/about-dogs-running.jpg",
  alt: "Pets moving through an everyday routine.",
  tone: "Routine path"
};

const noteClassesByKey: Record<string, string> = {
  useful: "lg:-rotate-[1.2deg]",
  comfort: "lg:rotate-[0.8deg] lg:translate-y-2",
  "clear-details": "lg:-rotate-[0.7deg] lg:translate-y-1",
  support: "lg:rotate-[1deg]"
};

const fallbackNoteClasses = [
  "lg:-rotate-[1.2deg]",
  "lg:rotate-[0.8deg] lg:translate-y-2",
  "lg:-rotate-[0.7deg] lg:translate-y-1",
  "lg:rotate-[1deg]"
];

function iconForKey(iconKey: string) {
  return iconMap[iconKey] ?? PawPrint;
}

function routeLinksFromContent(route: AboutPawRouteContent) {
  const links = [{ label: route.ctaLabel, href: route.ctaHref }];

  if (route.secondaryCtaLabel && route.secondaryCtaHref) {
    links.push({
      label: route.secondaryCtaLabel,
      href: route.secondaryCtaHref
    });
  }

  return links;
}

function displayRoutinesFromContent(content: AboutPawContent): Routine[] {
  const routes = content.routes.length > 0 ? content.routes : fallbackAboutPawContent.routes;

  return routes.map((route) => ({
    ...route,
    Icon: iconForKey(route.iconKey),
    media: routeMediaByKey[route.routeKey] ?? fallbackMedia,
    links: routeLinksFromContent(route)
  }));
}

function noteClassName(note: AboutPawNoteContent, index: number) {
  return noteClassesByKey[note.noteKey] ?? fallbackNoteClasses[index] ?? "";
}

export function AboutRoutineTabs({ content = fallbackAboutPawContent }: { content?: AboutPawContent }) {
  const routines = useMemo(() => displayRoutinesFromContent(content), [content]);
  const guideNotes = content.notes.length > 0 ? content.notes : fallbackAboutPawContent.notes;
  const [activeRoutineKey, setActiveRoutineKey] = useState(routines[0]?.routeKey ?? "play");
  const activeRoutine = routines.find((routine) => routine.routeKey === activeRoutineKey) ?? routines[0];
  const ActiveIcon = activeRoutine.Icon;

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-primary/10 bg-[#24170e] p-4 text-white shadow-ambient md:p-6 lg:p-7">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="flex min-h-[540px] flex-col rounded-[30px] border border-white/12 bg-white/[0.06] p-5 backdrop-blur md:p-7">
          <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#ffd98d]">
            {content.header.sectionLabel}
          </span>
          <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.02] md:text-5xl">
            {content.header.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">{content.header.subtitle}</p>
          <p className="mt-4 text-sm font-bold leading-6 text-[#ffd98d]">{content.header.supportingLine}</p>

          <div className="mt-7 grid gap-3" role="tablist" aria-label="Paw Path Finder routines">
            {routines.map((routine, index) => {
              const selected = routine.routeKey === activeRoutineKey;
              const RoutineIcon = routine.Icon;

              return (
                <button
                  key={routine.routeKey}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="about-routine-panel"
                  id={`about-routine-tab-${routine.routeKey}`}
                  className={`group flex min-h-[74px] items-center gap-3 rounded-[22px] border p-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                    selected
                      ? "border-[#ffd98d]/70 bg-[#ffd98d] text-[#24170e] shadow-lift"
                      : "border-white/12 bg-white/[0.06] text-white hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.1] motion-reduce:hover:translate-y-0"
                  }`}
                  onClick={() => setActiveRoutineKey(routine.routeKey)}
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition ${
                      selected ? "bg-[#24170e] text-[#ffd98d]" : "bg-white/10 text-[#ffd98d]"
                    }`}
                  >
                    <RoutineIcon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wide opacity-70">
                      Stop {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-lg font-extrabold leading-6">{routine.label}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={`h-4 w-4 shrink-0 transition ${
                      selected ? "translate-x-0.5" : "group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={activeRoutine.routeKey}
          id="about-routine-panel"
          role="tabpanel"
          aria-labelledby={`about-routine-tab-${activeRoutine.routeKey}`}
          className="homepage-enter grid min-h-[540px] overflow-hidden rounded-[30px] border border-white/12 bg-[#fff8ed] text-on-surface shadow-lift lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)]"
        >
          <div className="relative min-h-[330px] overflow-hidden bg-[#d8c4a9] lg:min-h-full">
            <Image
              src={activeRoutine.media.image}
              alt={activeRoutine.media.alt}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover transition duration-500 hover:scale-[1.025] motion-reduce:hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/28 bg-black/24 p-5 text-white backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-[#ffd98d]">
                {activeRoutine.media.tone}
              </p>
              <p className="mt-2 font-heading text-2xl font-extrabold leading-tight">{activeRoutine.noteText}</p>
            </div>
          </div>

          <div className="flex flex-col bg-[#2b160b] p-5 text-white md:p-7 lg:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ffd98d] text-[#24170e] shadow-soft">
                <ActiveIcon aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#ffd98d]">Guided choice</p>
                <p className="font-heading text-lg font-bold">{activeRoutine.label}</p>
              </div>
            </div>

            <h3 className="mt-7 max-w-[12ch] font-heading text-[clamp(2.5rem,5.2vw,4.9rem)] font-extrabold leading-[0.98]">
              {activeRoutine.recommendationTitle}
            </h3>
            <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-white/78 md:text-base">
              {activeRoutine.recommendationDescription}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {guideNotes.slice(0, 3).map((note) => {
                const Icon = iconForKey(note.iconKey);

                return (
                  <div key={note.noteKey} className="rounded-[18px] border border-white/18 bg-white/[0.05] p-3">
                    <Icon aria-hidden className="h-4 w-4 text-[#ffd98d]" />
                    <p className="mt-2 text-sm font-bold leading-5">{note.keyword}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/[0.58]">{note.secondaryText}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              {activeRoutine.links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${
                    index === 0
                      ? "bg-[#ffd98d] text-[#24170e] hover:bg-[#f7c868]"
                      : "border border-white/25 bg-white/[0.08] text-white hover:bg-white/[0.14]"
                  }`}
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

      <div className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {guideNotes.map((note, index) => {
          const Icon = iconForKey(note.iconKey);

          return (
            <div
              key={note.noteKey}
              className={`relative overflow-hidden rounded-[22px] border border-white/12 bg-white/[0.08] p-4 text-white shadow-soft backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.12] motion-reduce:hover:translate-y-0 ${noteClassName(note, index)}`}
            >
              <span className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#ffd98d]/15" />
              <span className="relative flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ffd98d] text-[#24170e]">
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-heading text-lg font-extrabold text-[#ffd98d]">{note.keyword}</span>
                  <span className="block text-sm font-semibold leading-6 text-white/70">{note.secondaryText}</span>
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
