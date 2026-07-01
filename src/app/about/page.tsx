import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Mail,
  MapPinned,
  PawPrint,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { AboutReveal } from "@/components/about/AboutReveal";
import { AboutRoutineTabs } from "@/components/about/AboutRoutineTabs";
import { AboutSupportModule } from "@/components/about/AboutSupportModule";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { getPublicAboutContent } from "@/lib/about-paw-settings";
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

const posterPrinciples = [
  "Useful before novelty",
  "Comfort before complication",
  "Clear details before checkout"
];

function isLogoLikeMedia(url: string) {
  return /logo|luck[-_\s]?claw|pet[-_\s]?suppl/i.test(url);
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
        dark
          ? "border border-white/20 bg-white/10 text-[#ffe2a6] backdrop-blur"
          : "bg-primary-container/20 text-primary"
      }`}
    >
      {children}
    </span>
  );
}

export default async function AboutPage() {
  const aboutContent = await getPublicAboutContent();
  const { hero, pawPath, collectionSection, collectionCards } = aboutContent;
  const aboutContentSource = aboutContent.diagnostics.source;
  const heroPosterImage = isLogoLikeMedia(hero.heroImageUrl)
    ? "/images/about-dogs-running.jpg"
    : hero.heroImageUrl;

  return (
    <SiteShell>
      <div
        aria-hidden="true"
        hidden
        dangerouslySetInnerHTML={{
          __html: `<!-- about-content-source: ${aboutContentSource} -->`
        }}
      />

      <section className="relative isolate overflow-hidden bg-[#24170e] text-white">
        <div className="absolute inset-0">
          <Image
            src={heroPosterImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="about-poster-media object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(245,158,11,0.24),transparent_32%),linear-gradient(90deg,rgba(20,10,4,0.94)_0%,rgba(20,10,4,0.72)_42%,rgba(20,10,4,0.42)_72%,rgba(20,10,4,0.72)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#24170e] to-transparent" />
        </div>

        <div className="section-shell relative grid min-h-[720px] items-end py-10 md:min-h-[780px] md:py-16 lg:min-h-[calc(100svh-76px)]">
          <AboutReveal className="max-w-5xl pb-28 md:pb-24">
            <SectionLabel dark>{hero.eyebrow}</SectionLabel>
            <h1 className="mt-6 max-w-5xl font-heading text-[clamp(3.5rem,9.5vw,9.25rem)] font-extrabold leading-[0.92]">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-white/[0.82] md:text-lg">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={hero.primaryCtaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-7 py-3 font-heading text-sm font-bold text-on-primary-container shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f4b340] motion-reduce:hover:translate-y-0"
              >
                {hero.primaryCtaLabel}
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              <Link
                href={hero.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 font-heading text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 motion-reduce:hover:translate-y-0"
              >
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </AboutReveal>

          <AboutReveal className="homepage-enter-delay-2 absolute bottom-8 right-4 hidden w-[430px] max-w-[34vw] lg:block">
            <div className="rounded-[30px] border border-white/20 bg-[#fff8ed]/92 p-4 text-on-surface shadow-ambient backdrop-blur">
              <div className="relative aspect-[1.35] overflow-hidden rounded-[24px] bg-[#e9d9c3]">
                <Image
                  src="/images/about-selected-materials.jpg"
                  alt="Selected pet essentials arranged with warm materials."
                  fill
                  sizes="430px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-[18px] border border-white/25 bg-black/30 p-4 text-white backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#ffd98d]">
                    {hero.compassTitle}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6">{hero.compassDescription}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {posterPrinciples.map((principle) => (
                  <div
                    key={principle}
                    className="rounded-[16px] border border-primary/10 bg-white/80 px-3 py-3 text-xs font-bold leading-5 text-on-surface-variant"
                  >
                    {principle}
                  </div>
                ))}
              </div>
            </div>
          </AboutReveal>
        </div>
      </section>

      <section className="bg-[#24170e] pb-10">
        <div className="section-shell">
          <div className="grid gap-3 rounded-[28px] border border-white/15 bg-white/[0.08] p-3 text-white shadow-ambient backdrop-blur md:grid-cols-3">
            <div className="rounded-[22px] bg-white/10 p-5">
              <PawPrint aria-hidden className="h-5 w-5 text-[#ffd98d]" />
              <p className="mt-3 font-heading text-lg font-bold">Routine-first shopping</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Start with the moment your pet is in.</p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-5">
              <MapPinned aria-hidden className="h-5 w-5 text-[#ffd98d]" />
              <p className="mt-3 font-heading text-lg font-bold">Clearer product paths</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Move from need to category without guessing.</p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-5">
              <Compass aria-hidden className="h-5 w-5 text-[#ffd98d]" />
              <p className="mt-3 font-heading text-lg font-bold">Support stays visible</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Questions and order help stay part of the route.</p>
            </div>
          </div>
        </div>
      </section>

      <AboutReveal>
        <section id="paw-path" className="scroll-mt-24 bg-[#fff8ed] py-12 md:py-20">
          <div className="section-shell">
            <AboutRoutineTabs content={pawPath} />
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-[#fff8ed] py-12 md:py-20">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <SectionLabel>Trust clarity</SectionLabel>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  What you can expect from {brandName}
                </h2>
              </div>
              <p className="text-sm leading-7 text-on-surface-variant md:text-base">
                The store is designed to make everyday decisions easier: compare the practical details, follow the
                right category path, and keep support visible when a purchase needs context.
              </p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {promiseCards.map(({ title, text, detail, Icon }, index) => (
                <article
                  key={title}
                  className={`group relative overflow-hidden rounded-[28px] border border-primary/10 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 ${
                    index % 2 === 1 ? "xl:translate-y-8 motion-reduce:xl:translate-y-0" : ""
                  }`}
                >
                  <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-container/25 transition group-hover:scale-110" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-full bg-primary-container/25 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-6 font-heading text-xl font-bold">{title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
                  <p className="relative mt-5 rounded-[16px] bg-[#fff8ed] px-4 py-3 text-sm font-semibold leading-6 text-primary">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-[linear-gradient(180deg,#fff8ed_0%,#f3e5d2_100%)] py-12 md:py-20">
          <div className="section-shell">
            <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <SectionLabel>{collectionSection.eyebrow}</SectionLabel>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                  {collectionSection.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
                  {collectionSection.subtitle}
                </p>
              </div>
              <Link
                href={collectionSection.viewAllHref}
                className="group inline-flex items-center gap-2 justify-self-start rounded-full border border-primary/20 bg-white/70 px-5 py-3 text-sm font-bold text-primary shadow-soft transition hover:-translate-y-0.5 hover:bg-white motion-reduce:hover:translate-y-0 lg:justify-self-end"
              >
                {collectionSection.viewAllLabel}
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
              {collectionCards.map((category, index) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className={`group relative min-h-[260px] overflow-hidden rounded-[30px] bg-[#2f1c10] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 ${
                    index === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[520px]" : ""
                  }`}
                >
                  <Image
                    src={category.imageUrl}
                    alt={category.imageAlt}
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, 100vw"}
                    className="object-cover transition duration-500 group-hover:scale-[1.035] motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#ffd98d]">Routine path</p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3
                        className={`font-heading font-extrabold leading-tight text-white ${
                          index === 0 ? "text-4xl md:text-5xl" : "text-2xl"
                        }`}
                      >
                        {category.title}
                      </h3>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/16 text-white backdrop-blur transition group-hover:translate-x-1 group-hover:bg-primary-container group-hover:text-on-primary-container motion-reduce:group-hover:translate-x-0">
                        <ArrowRight aria-hidden className="h-5 w-5" />
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
