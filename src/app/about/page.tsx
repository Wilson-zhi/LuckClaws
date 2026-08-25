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
import { getPublicHeaderNavigationItems } from "@/lib/public-product-data";
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

const storyPoints = [
  {
    title: "Routine-first shopping",
    text: "Start with what your pet is doing today, then move into a shorter shopping path.",
    Icon: PawPrint
  },
  {
    title: "Clearer product paths",
    text: "Product categories connect to real moments: toys, walks, rest, comfort, and support.",
    Icon: MapPinned
  },
  {
    title: "Support stays visible",
    text: "Questions, order help, and damaged item support stay part of the customer journey.",
    Icon: Compass
  }
];

function isLogoLikeMedia(url: string) {
  return /logo|luck[-_\s]?claw|pet[-_\s]?suppl/i.test(url);
}

function isVideoMedia(url: string) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
        dark
          ? "border border-white/20 bg-white/10 text-[#ffe0a3] backdrop-blur"
          : "bg-[#ffe7b7] text-[#8a5a00]"
      }`}
    >
      {children}
    </span>
  );
}

export default async function AboutPage() {
  const [aboutContent, navigationItems] = await Promise.all([
    getPublicAboutContent(),
    getPublicHeaderNavigationItems()
  ]);
  const { hero, pawPath, collectionSection, collectionCards } = aboutContent;
  const aboutContentSource = aboutContent.diagnostics.source;
  const heroPosterImage = isLogoLikeMedia(hero.heroImageUrl)
    ? "/images/about-dogs-running.jpg"
    : hero.heroImageUrl;
  const heroUsesVideo = isVideoMedia(heroPosterImage);

  return (
    <SiteShell navigationItems={navigationItems}>
      <div
        aria-hidden="true"
        hidden
        dangerouslySetInnerHTML={{
          __html: `<!-- about-content-source: ${aboutContentSource} -->`
        }}
      />

      <section className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden bg-[#241407] text-white">
        <div className="absolute inset-0">
          {heroUsesVideo ? (
            <video
              aria-label={hero.heroImageAlt}
              className="about-poster-media h-full w-full object-cover"
              src={heroPosterImage}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={heroPosterImage}
              alt={hero.heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="about-poster-media object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(90deg,rgba(24,12,5,0.9)_0%,rgba(24,12,5,0.74)_38%,rgba(24,12,5,0.34)_70%,rgba(24,12,5,0.5)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(180deg,rgba(36,20,7,0)_0%,rgba(36,20,7,0.58)_44%,rgba(251,242,227,0.96)_92%,#fbf2e3_100%)]" />
          <div className="absolute inset-x-0 -bottom-12 h-28 bg-[#fbf2e3] opacity-95 blur-2xl" />
        </div>

        <div className="section-shell relative flex min-h-[calc(100svh-76px)] items-center py-12 md:py-16">
          <div className="max-w-6xl">
            <SectionLabel dark>{hero.eyebrow}</SectionLabel>
            <h1 className="mt-7 max-w-6xl font-heading text-[clamp(3.1rem,9vw,8.8rem)] font-extrabold leading-[0.9]">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-white/[0.82] md:text-lg">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={hero.primaryCtaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#f4a300] px-7 py-3 font-heading text-sm font-bold text-[#241407] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#ffb32b] motion-reduce:hover:translate-y-0"
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
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 bg-transparent pb-10 pt-0 md:-mt-20">
        <div className="section-shell">
          <div className="grid gap-3 rounded-[34px] border border-[#ead3b1] bg-[#fffaf1]/86 p-3 shadow-ambient backdrop-blur-xl md:grid-cols-3">
            {storyPoints.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-[24px] bg-[#fff6e9]/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <Icon aria-hidden className="h-5 w-5 text-[#a06a00]" />
                <p className="mt-3 font-heading text-lg font-bold text-[#241407]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6f5a43]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutReveal>
        <section id="paw-path" className="scroll-mt-24 bg-[linear-gradient(180deg,#fffaf1_0%,#fff6ea_100%)] py-12 md:py-20">
          <div className="section-shell">
            <AboutRoutineTabs content={pawPath} />
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-[linear-gradient(180deg,#fff6ea_0%,#fffaf1_46%,#f6ead8_100%)] py-12 md:py-20">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <SectionLabel>Trust clarity</SectionLabel>
                <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.02] text-[#241407] md:text-6xl">
                  What you can expect from {brandName}
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#6f5a43] md:text-base">
                  Practical guidance, cleaner paths, and visible support make the store easier to trust before
                  checkout.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {promiseCards.map(({ title, text, detail, Icon }) => (
                  <article
                    key={title}
                    className="group relative min-h-[300px] overflow-hidden rounded-[30px] border border-[#e4caa5] bg-[#fffdf8] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
                  >
                    <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffe3aa]" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-full bg-[#ffe4ad] text-[#8a5a00] transition group-hover:bg-[#241407] group-hover:text-[#ffd98d]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <h3 className="relative mt-7 font-heading text-2xl font-extrabold leading-tight text-[#241407]">
                      {title}
                    </h3>
                    <p className="relative mt-4 text-sm leading-7 text-[#6f5a43]">{text}</p>
                    <p className="relative mt-6 rounded-[18px] bg-[#fff8ed] px-4 py-3 text-sm font-bold leading-6 text-[#8a5a00]">
                      {detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AboutReveal>

      <AboutReveal>
        <section className="bg-[linear-gradient(180deg,#fffaf1_0%,#f2dfc5_100%)] py-12 md:py-20">
          <div className="section-shell">
            <div className="grid gap-6 lg:grid-cols-[370px_minmax(0,1fr)] lg:items-start">
              <div className="rounded-[32px] border border-[#e4caa5] bg-[#fffaf1] p-6 shadow-soft md:p-8 lg:sticky lg:top-28">
                <SectionLabel>{collectionSection.eyebrow}</SectionLabel>
                <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.04] text-[#241407] md:text-5xl">
                  {collectionSection.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#6f5a43] md:text-base">{collectionSection.subtitle}</p>
                <Link
                  href={collectionSection.viewAllHref}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#241407] px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#3a220f] motion-reduce:hover:translate-y-0"
                >
                  {collectionSection.viewAllLabel}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {collectionCards.map((category, index) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className={`group overflow-hidden rounded-[30px] border border-[#e4caa5] bg-[#fffaf1] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 ${
                      index === 0 ? "xl:col-span-2" : ""
                    }`}
                  >
                    <div className={`relative bg-[#e4d1b7] ${index === 0 ? "aspect-[1.9]" : "aspect-[1.08]"}`}>
                      <Image
                        src={category.imageUrl}
                        alt={category.imageAlt}
                        fill
                        sizes={index === 0 ? "(min-width: 1280px) 560px, 100vw" : "(min-width: 1280px) 280px, 50vw"}
                        className="object-cover transition duration-500 group-hover:scale-[1.035] motion-reduce:group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-transparent to-transparent" />
                    </div>
                    <div className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a06a00]">Routine path</p>
                        <h3 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-[#241407]">
                          {category.title}
                        </h3>
                      </div>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffe4ad] text-[#8a5a00] transition group-hover:translate-x-1 group-hover:bg-[#241407] group-hover:text-[#ffd98d] motion-reduce:group-hover:translate-x-0">
                        <ArrowRight aria-hidden className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
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
