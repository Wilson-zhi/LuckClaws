import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandHeart, PackageCheck, Sparkles, Users } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `About Us | ${brandName}`,
    description:
      "Learn about LUCK CLAWS, a pet supplies brand focused on thoughtful design, everyday comfort, and playful essentials.",
    path: "/about"
  })
};

const standards = [
  {
    title: "Thoughtfully Selected Materials",
    text: "We choose products with everyday comfort, durability, and clear care guidance in mind.",
    icon: PackageCheck,
    image: "/images/about-selected-materials.jpg"
  },
  {
    title: "Pet-Conscious Design",
    text: "Every product is selected to support comfort, play, and daily routines for dogs and cats.",
    icon: HandHeart
  },
  {
    title: "Designed for Everyday Comfort",
    text: "Soft textures, ergonomic shapes, and practical details help make playtime, walks, and rest more enjoyable.",
    icon: Sparkles
  },
  {
    title: "Carefully Chosen Partners",
    text: "We work with suppliers and production partners who align with our expectations for consistency, quality, and responsible production.",
    icon: Users,
    image: "/images/about-partners.jpg"
  }
];

const practiceCards = [
  {
    title: "Product Selection",
    text: "We focus on useful essentials for enrichment, walks, apparel, rest, and everyday care.",
    image: "/images/team-sarah.jpg"
  },
  {
    title: "Pet-First Review",
    text: "Product details are checked for comfort, material notes, care guidance, and appropriate use.",
    image: "/images/team-barnaby.jpg"
  },
  {
    title: "Clear Information",
    text: "Pages are written to help shoppers compare categories, understand policies, and contact support.",
    image: "/images/team-marcus.jpg"
  },
  {
    title: "Launch Readiness",
    text: "We keep routes, forms, cart behavior, and checkout information simple and transparent for the MVP.",
    image: "/images/team-luna.jpg"
  }
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="grid overflow-hidden rounded-lg bg-surface-container-lowest shadow-ambient md:grid-cols-2">
          <div className="p-8 md:p-16">
            <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              Our Story
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              For Pets, <span className="text-primary">By Pet Parents.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-on-surface-variant">
              {brandName} is an online pet essentials shop focused on practical enrichment,
              comfort, and everyday pet care. Our categories include enrichment toys, cat toys,
              pet apparel, walking essentials, beds, blankets, and useful pet accessories for
              modern homes.
            </p>
            <a
              href="#values"
              className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Explore Our Values
            </a>
          </div>
          <div className="relative min-h-[320px] md:min-h-[520px]">
            <Image
              src="/images/about-dogs-running.jpg"
              alt="Dogs enjoying open space, representing the LUCK CLAWS pet-first story."
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="values" className="section-shell py-12 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">The {brandName} Standard</h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Our approach is practical, warm, and transparent: select useful products, describe them
            clearly, and keep support easy to reach.
          </p>
        </div>
        <div className="grid auto-rows-[260px] gap-6 md:grid-cols-12">
          {standards.map((standard, index) => (
            <article
              key={standard.title}
              className={
                index === 0
                  ? "ambient-card grid gap-6 p-6 md:col-span-8 md:grid-cols-[1fr_260px]"
                  : index === 3
                    ? "ambient-card grid gap-6 p-6 md:col-span-8 md:grid-cols-[260px_1fr]"
                    : "ambient-card p-6 md:col-span-4"
              }
            >
              {standard.image && index === 3 && (
                <div className="relative hidden overflow-hidden rounded-md bg-surface-container md:block">
                  <Image src={standard.image} alt={`${standard.title} at ${brandName}`} fill sizes="260px" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <standard.icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-bold">{standard.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{standard.text}</p>
              </div>
              {standard.image && index === 0 && (
                <div className="relative hidden overflow-hidden rounded-md bg-surface-container md:block">
                  <Image src={standard.image} alt={`${standard.title} at ${brandName}`} fill sizes="260px" className="object-cover" />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold">How We Work</h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            Practical review points that keep the {brandName} shopping experience clear.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {practiceCards.map((card) => (
            <article key={card.title} className="text-center">
              <div className="relative mx-auto aspect-square max-w-44 overflow-hidden rounded-md border-8 border-white bg-surface-container shadow-soft">
                <Image
                  src={card.image}
                  alt={`${card.title} at ${brandName}`}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-heading font-bold">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-lg bg-surface-container-lowest p-10 text-center shadow-ambient md:p-20">
          <h2 className="font-heading text-3xl font-extrabold md:text-5xl">
            Ready to find something your pet will love?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
            Explore thoughtfully designed toys, apparel, and everyday essentials for dogs and cats.
          </p>
          <Link
            href="/products/interactive-snuffle-mat"
            className="mt-8 inline-flex rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          >
            Shop Best Sellers
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
