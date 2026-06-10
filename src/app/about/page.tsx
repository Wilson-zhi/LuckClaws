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
  Truck
} from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "About LUCK CLAWS | Practical Pet Essentials for Everyday Routines",
    description:
      "Learn about LUCK CLAWS, a pet lifestyle store curating practical toys, apparel, walking essentials, beds, blankets, and everyday pet supplies.",
    path: "/about",
    openGraphTitle: "About LUCK CLAWS | Practical Pet Essentials",
    openGraphDescription:
      "Learn how LUCK CLAWS curates practical pet essentials for playtime, walks, rest, and everyday routines.",
    twitterTitle: "About LUCK CLAWS | Practical Pet Essentials",
    twitterDescription:
      "LUCK CLAWS curates practical pet essentials for playtime, walks, rest, and everyday routines."
  })
};

const audienceCards = [
  {
    title: "Daily play",
    text: "For enrichment toys, chase sessions, tug games, and simple ways to keep curious pets engaged.",
    Icon: Sparkles
  },
  {
    title: "Cozy rest",
    text: "For beds, blankets, and soft essentials that help pets settle into calmer home routines.",
    Icon: Heart
  },
  {
    title: "Walks and outings",
    text: "For practical walking gear and apparel made for everyday movement, comfort, and easy planning.",
    Icon: Truck
  }
];

const curationCards = [
  {
    title: "Practical for daily use",
    text: "We focus on products that fit familiar pet routines instead of novelty for novelty's sake.",
    Icon: CheckCircle2
  },
  {
    title: "Comfortable for pets",
    text: "Product details prioritize fit, texture, materials, and routine use where that information is available.",
    Icon: Heart
  },
  {
    title: "Easy to understand",
    text: "Pages are structured to make category, price, use case, and checkout information easier to scan.",
    Icon: PackageCheck
  },
  {
    title: "Support-focused shopping",
    text: "Customers can contact support for product questions, order help, and damaged or incorrect item issues.",
    Icon: Mail
  }
];

const promiseCards = [
  {
    title: "Clear product paths",
    text: "Browse by category, use case, or collection without relying on guesswork.",
    Icon: ArrowRight
  },
  {
    title: "Secure checkout",
    text: "Checkout is designed to be direct, familiar, and focused on the information needed to complete an order.",
    Icon: ShieldCheck
  },
  {
    title: "Support when you need it",
    text: "Reach us at support@luckclaws.com for order and product questions.",
    Icon: Mail
  },
  {
    title: "Pet-first comfort",
    text: "Our store is organized around play, walks, rest, and the everyday details that matter at home.",
    Icon: Heart
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

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">{text}</p>}
    </div>
  );
}

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              About {brandName}
            </span>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Built for pets, chosen for everyday routines.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {brandName} curates practical pet essentials for playtime, walks, rest, and the
              small daily moments that make life with pets better.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-full bg-primary-container px-7 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                Shop Best Sellers <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex rounded-full border border-primary px-7 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-surface-container-lowest p-4 shadow-ambient">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-container">
              <Image
                src="/images/about-dogs-running.jpg"
                alt="Pets enjoying outdoor play, representing LUCK CLAWS everyday pet routines."
                fill
                priority
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {["Play", "Walk", "Rest", "Cozy routines"].map((label) => (
                <div key={label} className="rounded-md bg-surface-container-low px-4 py-3 text-sm font-bold">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-lg bg-surface-container-lowest p-6 shadow-soft md:p-8">
            <SectionHeading
              eyebrow="Our approach"
              title="Pet essentials without the guesswork."
              text={`${brandName} is built around a simple idea: shopping for pets should feel clear, useful, and enjoyable. We focus on products that fit real daily routines, from enrichment toys and cozy beds to walking gear and apparel made for comfort.`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Useful categories",
              "Clear product details",
              "Comfort-minded choices",
              "Support that is easy to reach"
            ].map((item) => (
              <div key={item} className="rounded-md bg-surface-container-lowest p-5 shadow-soft">
                <CheckCircle2 aria-hidden className="h-5 w-5 text-primary" />
                <p className="mt-4 font-heading font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-12 md:py-20">
        <div className="section-shell">
          <SectionHeading
            align="center"
            eyebrow="Who we serve"
            title="For modern pet parents"
            text="For people who want practical everyday pet products, clear information, and shopping paths built around comfort, usefulness, and support."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {audienceCards.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg bg-surface-container-lowest p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <SectionHeading
            eyebrow="Curation"
            title="How we choose products"
            text="Every product page is designed to help shoppers understand what the item is best for, how it fits into a pet's routine, and what to expect before checkout."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {curationCards.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg bg-surface-container-lowest p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 md:pb-20">
        <div className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-10">
          <SectionHeading
            align="center"
            eyebrow="Trust"
            title="What shoppers can expect"
            text="A practical shopping experience with clear paths, secure checkout, and support available when order or product questions come up."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {promiseCards.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-md bg-surface-container-low p-5">
                <Icon aria-hidden className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-heading font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-center text-sm leading-6 text-on-surface-variant">
            Need help? Email{" "}
            <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
              support@luckclaws.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-surface-container-low py-12 md:py-20">
        <div className="section-shell">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Shop by routine"
              title="Explore the essentials"
              text="Start with the category that matches the next routine you are shopping for."
            />
            <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View all collections <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categoryLinks.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft transition hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[1.2] bg-surface-container">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 1024px) 220px, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <h3 className="font-heading font-bold">{category.title}</h3>
                  <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <div className="rounded-lg bg-surface-container-lowest p-8 text-center shadow-ambient md:p-16">
          <h2 className="font-heading text-3xl font-extrabold md:text-5xl">
            Ready to find something your pet will love?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
            Explore toys, apparel, walking essentials, beds, blankets, and everyday favorites for
            happier routines at home and outside.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/collections"
              className="inline-flex rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              Explore Collections
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-primary px-8 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
