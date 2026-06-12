import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { AboutReveal } from "@/components/about/AboutReveal";
import { AboutRoutineTabs } from "@/components/about/AboutRoutineTabs";
import { AboutSupportModule } from "@/components/about/AboutSupportModule";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { getPublicAboutPawContent } from "@/lib/about-paw-settings";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "About LUCK CLAWS | Routine-First Pet Essentials",
    description:
      "Learn how LUCK CLAWS helps pet parents shop practical pet essentials by routine, from play and walks to cozy rest, comfort, and support.",
    path: "/about",
    openGraphTitle: "About LUCK CLAWS | Routine-First Pet Essentials",
    openGraphDescription:
      "LUCK CLAWS helps pet parents shop practical pet essentials by routine, from play and walks to cozy rest and everyday comfort.",
    twitterTitle: "About LUCK CLAWS | Routine-First Pet Essentials",
    twitterDescription:
      "Shop practical pet essentials by routine, from play and walks to cozy rest and everyday comfort."
  })
};

type IconCard = {
  title: string;
  text: string;
  detail: string;
  Icon: LucideIcon;
};

const promiseCards: IconCard[] = [
  {
    title: "Clear product details",
    text: "Product pages focus on practical use, materials, sizing guidance, care details, and what to expect before checkout.",
    detail: "Useful details stay visible before purchase.",
    Icon: ArrowRight
  },
  {
    title: "Easy category paths",
    text: "Collections are organized around everyday routines, so shoppers can start with the need instead of a crowded product list.",
    detail: "Choose the routine first, then narrow the product.",
    Icon: CheckCircle2
  },
  {
    title: "Support for product and order questions",
    text: "Product questions, order help, and damaged or incorrect item issues have a clear email support path.",
    detail: "Support is available when the next step is unclear.",
    Icon: Mail
  },
  {
    title: "Simple checkout",
    text: "Checkout keeps the path direct, familiar, and focused on the information needed to complete an order.",
    detail: "A direct checkout path reduces unnecessary friction.",
    Icon: ShieldCheck
  }
];

const categoryLinks = [
  {
    title: "Dog Toys",
    href: "/collections/dog-toys",
    image: "/images/category-dog-toys.jpg",
    alt: "Dog toys curated by LUCK CLAWS."
  },
  {
    title: "Cat Toys",
    href: "/collections/cat-toys",
    image: "/images/natural-feather-teaser.jpg",
    alt: "Cat toys curated by LUCK CLAWS."
  },
  {
    title: "Pet Apparel",
    href: "/collections/pet-apparel",
    image: "/images/category-pet-apparel.jpg",
    alt: "Pet apparel curated by LUCK CLAWS."
  },
  {
    title: "Walking Essentials",
    href: "/collections/walking-essentials",
    image: "/images/category-walking-essentials.jpg",
    alt: "Walking essentials curated by LUCK CLAWS."
  },
  {
    title: "Beds & Blankets",
    href: "/collections/beds-blankets",
    image: "/images/category-beds-blankets.jpg",
    alt: "Beds and blankets curated by LUCK CLAWS."
  }
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
      {children}
    </span>
  );
}

function RoutineChip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`absolute rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-on-surface shadow-soft backdrop-blur ${className}`}
    >
      {label}
    </span>
  );
}

export default async function AboutPage() {
  const pawPathContent = await getPublicAboutPawContent();

  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <AboutReveal>
            <SectionLabel>About {brandName}</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Pet essentials, mapped around real routines.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {brandName} helps pet parents move from browsing to choosing with clearer paths for
              play, walks, rest, comfort, and everyday support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#paw-path"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-7 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                Shop by Routine
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary px-7 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
              >
                Contact Us
              </Link>
            </div>
          </AboutReveal>

          <AboutReveal className="homepage-enter-delay-1">
            <div className="group/about-hero relative isolate rounded-[32px] bg-surface-container-lowest p-4 shadow-ambient transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
              <div className="pointer-events-none absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full border border-primary/20" />
              <div className="pointer-events-none absolute -bottom-5 left-8 -z-10 h-20 w-20 rounded-full bg-primary-container/20" />
              <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[26px] bg-surface-container [transform:translateZ(0)]">
                <Image
                  src="/images/about-dogs-running.jpg"
                  alt="Pets outside, representing LUCK CLAWS routine-first pet essentials."
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="rounded-[inherit] object-cover transition-transform duration-500 ease-out [backface-visibility:hidden] group-hover/about-hero:scale-[1.02] motion-reduce:group-hover/about-hero:scale-100"
                />
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] ring-1 ring-inset ring-white/30" />
                <div className="absolute left-12 top-16 h-[2px] w-40 rotate-[18deg] bg-white/55" />
                <div className="absolute right-16 top-24 h-[2px] w-28 rotate-[-22deg] bg-white/45" />
                <RoutineChip label="Play" className="left-5 top-5" />
                <RoutineChip label="Walk" className="right-5 top-12" />
                <RoutineChip label="Rest" className="bottom-20 left-6" />
                <RoutineChip label="Comfort" className="bottom-6 right-6" />
              </div>
              <div className="relative mt-4 rounded-[22px] bg-surface-container-low p-5">
                <p className="font-heading text-xl font-bold">Routine Compass</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  A clearer way to shop by play, walk, rest, comfort, and support.
                </p>
              </div>
            </div>
          </AboutReveal>
        </div>
      </section>

      <AboutReveal>
        <section id="paw-path" className="section-shell scroll-mt-24 py-8 md:py-12">
          <AboutRoutineTabs content={pawPathContent} />
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="section-shell py-12 md:py-20">
          <div className="mb-8 max-w-3xl">
            <SectionLabel>Trust clarity</SectionLabel>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              What you can expect from {brandName}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {promiseCards.map(({ title, text, detail, Icon }) => (
              <article
                key={title}
                className="group rounded-[26px] bg-surface-container-lowest p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:rotate-[0.25deg] hover:shadow-lift motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
                <p className="mt-4 min-h-12 rounded-md bg-surface-container-low px-4 py-3 text-sm font-semibold leading-6 text-primary opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-surface-container-low py-12 md:py-20">
          <div className="section-shell">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <SectionLabel>Start with a routine</SectionLabel>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  Start with the routine your pet needs next.
                </h2>
                <p className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">
                  Choose the path that matches what your pet needs next.
                </p>
              </div>
              <Link
                href="/collections"
                className="group inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                View all collections
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categoryLinks.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group relative overflow-hidden rounded-[24px] bg-surface-container-lowest shadow-soft transition duration-300 hover:shadow-lift"
                >
                  <div className="relative aspect-[1.08] bg-surface-container">
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      sizes="(min-width: 1024px) 220px, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.035] motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                      <h3 className="font-heading text-lg font-bold text-white">{category.title}</h3>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-on-surface transition group-hover:translate-x-1 group-hover:bg-primary-container group-hover:text-on-primary-container motion-reduce:group-hover:translate-x-0">
                        <ArrowRight aria-hidden className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <AboutSupportModule />
      </AboutReveal>
    </SiteShell>
  );
}
