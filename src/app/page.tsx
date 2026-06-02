import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Sparkles, Truck } from "lucide-react";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { SiteShell } from "@/components/layout/SiteShell";
import { bestSellers, brandName, categories, newArrivals } from "@/data/products";
import { absoluteUrl, createSeoMetadata, iconPath } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `${brandName} | Premium Pet Toys, Apparel & Everyday Essentials`,
    description:
      "Shop thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
    path: "/",
    openGraphTitle: `${brandName} | Premium Pet Essentials`,
    openGraphDescription:
      "Thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
    twitterTitle: `${brandName} | Premium Pet Essentials`,
    twitterDescription: "Thoughtfully designed pet essentials for playful pets and modern pet parents."
  })
};

export default function HomePage() {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(iconPath),
    sameAs: []
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <section className="section-shell grid min-h-[620px] items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            Premium Care
          </span>
          <h1 className="mt-5 max-w-xl font-heading text-4xl font-extrabold leading-tight md:text-6xl">
            Premium Pet Essentials for Happier Everyday Care.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-on-surface-variant">
            Shop thoughtfully designed toys, apparel, walking essentials, and cozy home goods for dogs and cats.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products/interactive-snuffle-mat"
              className="rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              Shop Best Sellers
            </Link>
            <Link
              href="/collections/dog-toys"
              className="rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold text-on-surface transition hover:border-primary hover:text-primary"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-xl bg-[#F9E7D0]" />
          <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-lift">
            <Image
              src="/images/hero-dog-running.jpg"
              alt="A happy dog running through grass, representing LUCK CLAWS pet essentials."
              width={720}
              height={760}
              priority
              className="h-[420px] w-full object-cover md:h-[560px]"
            />
          </div>
          <div className="absolute bottom-8 left-0 flex -translate-x-4 items-center gap-3 rounded-md bg-white px-4 py-3 shadow-ambient">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF1FF] text-tertiary">
              <Award aria-hidden className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold">Top Rated</p>
              <p className="text-on-surface-variant">by Pet Parents</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10 md:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Curated For Every Pet</h2>
          <Link href="/collections/dog-toys" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            View All Categories <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="section-shell">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold">Our Best Sellers</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Favorites loved by pets and their humans alike. Crafted for durability and style.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">New Arrivals</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Discover the latest premium additions to our collection.
            </p>
          </div>
          <a href="#" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            Shop All New <ArrowRight aria-hidden className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <TrustBadges />

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold">Loved by the Pack</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Hear what our community of pet parents has to say.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <ReviewCard
            quote="My dog usually loses interest in toys quickly, but the snuffle mat keeps him busy every morning."
            name="Sarah Buster"
            pet="Buster"
            image="/images/interactive-snuffle-mat-forest-green-cream.jpg"
          />
          <ReviewCard
            quote="The sweater is soft, easy to put on, and actually fits my Frenchie well."
            name="Michael Luna"
            pet="Luna"
            image="/images/chunky-knit-sweater.jpg"
          />
          <ReviewCard
            quote="The leash feels sturdy without being heavy. Great for daily walks."
            name="Emily Max"
            pet="Max"
            image="/images/heritage-leather-leash.jpg"
          />
        </div>
      </section>

      <NewsletterSignup />

      <section className="section-shell pt-14 md:pt-20">
        <div className="grid gap-4 rounded-lg bg-surface-container-lowest p-6 shadow-soft md:grid-cols-3 md:p-8">
          <div className="flex items-center gap-4">
            <Sparkles aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">Thoughtful everyday enrichment</p>
          </div>
          <div className="flex items-center gap-4">
            <Truck aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">Free shipping over $50</p>
          </div>
          <div className="flex items-center gap-4">
            <Award aria-hidden className="h-8 w-8 text-primary" />
            <p className="font-heading font-bold">Premium feel, pet-first comfort</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
