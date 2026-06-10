import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { AboutReveal } from "@/components/about/AboutReveal";
import { AboutRoutineTabs } from "@/components/about/AboutRoutineTabs";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "About LUCK CLAWS | Routine-First Pet Essentials",
    description:
      "Learn how LUCK CLAWS helps pet parents shop practical pet essentials by routine, from play and walks to cozy rest and everyday comfort.",
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
  Icon: LucideIcon;
};

const promiseCards: IconCard[] = [
  {
    title: "Clear choices",
    text: "Collections are organized around what pets do every day, so shoppers can start from the routine instead of the product maze.",
    Icon: ArrowRight
  },
  {
    title: "Routine-first details",
    text: "Product pages focus on use cases, fit, materials, care guidance, and what to expect before checkout.",
    Icon: CheckCircle2
  },
  {
    title: "Secure checkout",
    text: "Checkout keeps the path direct, familiar, and focused on the information needed to complete an order.",
    Icon: ShieldCheck
  },
  {
    title: "Real support",
    text: "Product questions, order help, and damaged or incorrect item issues have a clear support path.",
    Icon: Mail
  }
];

const checklistItems = [
  "Useful before novelty",
  "Comfort before complication",
  "Clear details before checkout",
  "Support after purchase"
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

const supportDetails: IconCard[] = [
  {
    title: "Product questions",
    text: "Tell us what you are shopping for and what your pet needs next.",
    Icon: Sparkles
  },
  {
    title: "Order help",
    text: "Include your order number so support can review the right details.",
    Icon: PackageCheck
  },
  {
    title: "Item support",
    text: "For damaged or incorrect items, send the order number and photos.",
    Icon: Heart
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

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <AboutReveal>
            <SectionLabel>About {brandName}</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Pet essentials, chosen around real routines.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              From playful mornings to quiet evenings, {brandName} curates practical pet products
              that fit the way pets and their people actually live.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/collections"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-7 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                Explore Collections
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary px-7 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
              >
                Get Support
              </Link>
            </div>
          </AboutReveal>

          <AboutReveal className="homepage-enter-delay-1">
            <div className="group relative rounded-xl bg-surface-container-lowest p-4 shadow-ambient transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-primary/20" />
              <div className="absolute -bottom-5 left-8 h-20 w-20 rounded-full bg-primary-container/20" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container">
                <Image
                  src="/images/about-dogs-running.jpg"
                  alt="Pets outside, representing LUCK CLAWS routine-first pet essentials."
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <RoutineChip label="Play" className="left-5 top-5" />
                <RoutineChip label="Walk" className="right-5 top-12" />
                <RoutineChip label="Rest" className="bottom-20 left-6" />
                <RoutineChip label="Comfort" className="bottom-6 right-6" />
              </div>
              <div className="relative mt-4 rounded-lg bg-surface-container-low p-5">
                <p className="font-heading text-xl font-bold">Routine-first pet supplies</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  A clearer way to shop for play, walks, rest, and everyday comfort.
                </p>
              </div>
            </div>
          </AboutReveal>
        </div>
      </section>

      <AboutReveal>
        <section className="section-shell py-10 md:py-16">
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
              <div>
                <SectionLabel>Shopping philosophy</SectionLabel>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  Shop by the moments that matter
                </h2>
                <p className="mt-5 text-sm leading-7 text-on-surface-variant md:text-base">
                  Pets do not shop by SKU. Their routines are simpler: play, walk, rest, and feel
                  comfortable. That is the path we use to organize the store.
                </p>
              </div>
              <AboutRoutineTabs />
            </div>
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-surface-container-low py-12 md:py-20">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
              <div>
                <SectionLabel>Curation</SectionLabel>
                <h2 className="mt-5 max-w-3xl font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  Not more noise. Better paths.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
                  Pet shopping can feel crowded. We organize products around practical use cases,
                  clear categories, and everyday comfort so shoppers can move from browsing to
                  choosing with less guesswork.
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-5 shadow-soft">
                <div className="rounded-lg bg-primary-container/20 p-5">
                  <p className="font-heading text-2xl font-bold text-primary">Selection filter</p>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    The page should answer the question before checkout: what is this useful for?
                  </p>
                </div>
                <div className="mt-4 grid gap-3">
                  {checklistItems.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-md bg-white p-4">
                      <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="section-shell py-12 md:py-20">
          <div className="mb-8 max-w-3xl">
            <SectionLabel>The {brandName} way</SectionLabel>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Useful, clear, and built for real shopping decisions.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {promiseCards.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="group rounded-xl bg-surface-container-lowest p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:rotate-[0.35deg] hover:shadow-lift motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
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
                  Choose the path that matches what your pet needs next.
                </h2>
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
                  className="group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-[1.08] bg-surface-container">
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      sizes="(min-width: 1024px) 220px, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
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
        <section className="section-shell py-12 md:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-ambient md:p-10 lg:p-14">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/35" />
            <div className="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-white/20" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <SectionLabel>Support</SectionLabel>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  Need help choosing?
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 md:text-base">
                  Tell us what you are shopping for, what your pet needs, or what happened with an
                  order. We will help you find the right next step.
                </p>
                <p className="mt-4 text-sm leading-7">
                  Email{" "}
                  <a href="mailto:support@luckclaws.com" className="font-bold underline underline-offset-4">
                    support@luckclaws.com
                  </a>
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-heading font-bold text-white transition hover:bg-primary/90"
                  >
                    Contact Us
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                    />
                  </Link>
                  <Link
                    href="/collections"
                    className="inline-flex items-center justify-center rounded-full border border-primary/35 bg-white/70 px-8 py-3 font-heading font-bold text-on-surface transition hover:bg-white"
                  >
                    Explore Collections
                  </Link>
                </div>
              </div>
              <div className="grid gap-3">
                {supportDetails.map(({ title, text, Icon }) => (
                  <article key={title} className="rounded-lg bg-white/70 p-5 text-on-surface shadow-soft backdrop-blur">
                    <Icon aria-hidden className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-heading font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AboutReveal>
    </SiteShell>
  );
}
