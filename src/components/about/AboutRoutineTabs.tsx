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

function noteTransform(note: AboutPawNoteContent, index: number) {
  const transforms: Record<string, string> = {
    useful: "lg:-rotate-[0.8deg]",
    comfort: "lg:rotate-[0.7deg] lg:translate-y-2",
    "clear-details": "lg:-rotate-[0.5deg] lg:translate-y-1",
    support: "lg:rotate-[0.8deg]"
  };

  return transforms[note.noteKey] ?? ["lg:-rotate-[0.8deg]", "lg:rotate-[0.7deg]", "lg:-rotate-[0.5deg]", "lg:rotate-[0.8deg]"][index] ?? "";
}

export function AboutRoutineTabs({ content = fallbackAboutPawContent }: { content?: AboutPawContent }) {
  const routines = useMemo(() => displayRoutinesFromContent(content), [content]);
  const guideNotes = content.notes.length > 0 ? content.notes : fallbackAboutPawContent.notes;
  const [activeRoutineKey, setActiveRoutineKey] = useState(routines[0]?.routeKey ?? "play");
  const activeRoutine = routines.find((routine) => routine.routeKey === activeRoutineKey) ?? routines[0];
  const ActiveIcon = activeRoutine.Icon;

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#e4caa5] bg-[#f8ead4] p-4 shadow-ambient md:p-6 lg:p-8">
      <div className="pointer-events-none absolute left-0 top-0 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd98d]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-white/70 blur-3xl" />

      <div className="relative grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[32px] border border-[#dfc39b] bg-[#fffaf1] p-5 md:p-7">
          <span className="inline-flex rounded-full bg-[#ffe4ad] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a5a00]">
            {content.header.sectionLabel}
          </span>
          <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.02] text-[#241407] md:text-5xl">
            {content.header.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6f5a43] md:text-base">{content.header.subtitle}</p>
          <p className="mt-4 text-sm font-bold leading-6 text-[#8a5a00]">{content.header.supportingLine}</p>

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
                  className={`group flex min-h-[72px] items-center gap-3 rounded-[22px] border p-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                    selected
                      ? "border-[#241407] bg-[#241407] text-white shadow-lift"
                      : "border-[#e4caa5] bg-white/72 text-[#241407] hover:-translate-y-0.5 hover:border-[#b68742] hover:bg-white motion-reduce:hover:translate-y-0"
                  }`}
                  onClick={() => setActiveRoutineKey(routine.routeKey)}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                      selected ? "bg-[#ffd98d] text-[#241407]" : "bg-[#ffe4ad] text-[#8a5a00]"
                    }`}
                  >
                    <RoutineIcon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] opacity-70">
                      Stop {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-lg font-extrabold leading-6">{routine.label}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
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
          className="homepage-enter h-full overflow-hidden rounded-[32px] border border-[#dfc39b] bg-[#fffaf1] shadow-lift"
        >
          <div className="grid h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
            <div className="relative min-h-[340px] overflow-hidden bg-[#d8c4a9] lg:min-h-full">
              <Image
                src={activeRoutine.media.image}
                alt={activeRoutine.media.alt}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover transition duration-500 hover:scale-[1.025] motion-reduce:hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/8 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/30 bg-white/18 p-5 text-white shadow-soft backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd98d]">
                  {activeRoutine.media.tone}
                </p>
                <p className="mt-2 max-w-lg font-heading text-2xl font-extrabold leading-tight">
                  {activeRoutine.noteText}
                </p>
              </div>
            </div>

            <div className="flex min-h-[520px] flex-col bg-[#2b160b] p-6 text-white md:p-7 lg:min-h-full">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ffd98d] text-[#241407] shadow-soft">
                  <ActiveIcon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd98d]">Guided choice</p>
                  <p className="font-heading text-lg font-bold">{activeRoutine.label}</p>
                </div>
              </div>

              <h3 className="mt-6 max-w-[13ch] font-heading text-[clamp(2.35rem,4.2vw,4.15rem)] font-extrabold leading-[0.98]">
                {activeRoutine.recommendationTitle}
              </h3>
              <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-white/78 md:text-base">
                {activeRoutine.recommendationDescription}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {guideNotes.slice(0, 3).map((note) => {
                  const Icon = iconForKey(note.iconKey);

                  return (
                    <div key={note.noteKey} className="min-h-[92px] rounded-[18px] border border-white/18 bg-white/[0.06] p-3">
                      <Icon aria-hidden className="h-4 w-4 text-[#ffd98d]" />
                      <p className="mt-2 text-sm font-bold leading-5">{note.keyword}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-white/[0.62]">{note.secondaryText}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {activeRoutine.links.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${
                      index === 0
                        ? "bg-[#ffd98d] text-[#241407] hover:bg-[#f7c868]"
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
      </div>

      <div className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {guideNotes.map((note, index) => {
          const Icon = iconForKey(note.iconKey);

          return (
            <div
              key={note.noteKey}
              className={`relative overflow-hidden rounded-[22px] border border-[#dfc39b] bg-[#fffaf1] p-4 text-[#241407] shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-white motion-reduce:hover:translate-y-0 ${noteTransform(note, index)}`}
            >
              <span className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#ffe4ad]" />
              <span className="relative flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ffe4ad] text-[#8a5a00]">
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-heading text-lg font-extrabold text-[#8a5a00]">{note.keyword}</span>
                  <span className="block text-sm font-semibold leading-6 text-[#6f5a43]">{note.secondaryText}</span>
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
