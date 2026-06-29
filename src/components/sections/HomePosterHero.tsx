import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { type Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

type HomePosterHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  featuredLabel: string;
  featuredText: string;
  hasVideo: boolean;
  products: Product[];
};

const heroBadges = ["Secure checkout", "Support when needed", "Clear product paths"];

function fallbackProductImage(product: Product) {
  const normalized = `${product.name} ${product.slug} ${product.category}`.toLowerCase();

  if (normalized.includes("snuffle")) {
    return "/images/interactive-snuffle-mat-lifestyle.jpg";
  }

  if (normalized.includes("puzzle")) {
    return "/images/premium-puzzle-feeder.jpg";
  }

  if (normalized.includes("cat")) {
    return "/images/organic-catnip-mouse.jpg";
  }

  if (normalized.includes("walk") || normalized.includes("leash") || normalized.includes("harness")) {
    return "/images/category-walking-essentials.jpg";
  }

  if (normalized.includes("apparel") || normalized.includes("sweater") || normalized.includes("tee")) {
    return "/images/category-pet-apparel.jpg";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "/images/category-beds-blankets.jpg";
  }

  return "/images/category-dog-toys.jpg";
}

export function HomePosterHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  videoUrl,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  featuredLabel,
  featuredText,
  hasVideo,
  products
}: HomePosterHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#2C1A0D]">
      <div className="homepage-enter relative min-h-[calc(100svh-72px)] overflow-hidden bg-[#2C1A0D] shadow-lift md:min-h-[calc(100svh-88px)]">
        {hasVideo ? (
          <video
            className="homepage-poster-media absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster={imageUrl}
            aria-hidden="true"
          >
            <source src={videoUrl} type={videoUrl.toLowerCase().includes(".webm") ? "video/webm" : "video/mp4"} />
          </video>
        ) : (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="homepage-poster-media object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,13,6,0.96)_0%,rgba(24,13,6,0.78)_36%,rgba(24,13,6,0.30)_66%,rgba(24,13,6,0.54)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(245,158,11,0.23),transparent_30%),radial-gradient(circle_at_18%_86%,rgba(255,249,239,0.18),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2C1A0D]/90 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-[1600px] flex-col justify-between px-5 py-6 sm:px-8 md:min-h-[calc(100svh-88px)] md:px-10 md:py-8 lg:px-16 xl:px-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-white/25 bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD894] backdrop-blur">
              {eyebrow}
            </span>
            <div className="hidden flex-wrap gap-2 md:flex">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/30 bg-[#2C1A0D]/62 px-3 py-2 text-xs font-bold text-white shadow-soft backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 pb-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(330px,0.42fr)] lg:items-end lg:pb-16">
            <div className="max-w-5xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-on-primary-container shadow-soft">
                <Award aria-hidden className="h-4 w-4" />
                {featuredLabel}
              </p>
              <h1 className="max-w-5xl font-heading text-[clamp(3.35rem,8.6vw,9.6rem)] font-extrabold leading-[0.86] tracking-[-0.045em] text-white [text-shadow:0_8px_34px_rgba(0,0,0,0.34)]">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.50)] md:text-xl md:leading-8">
                {subtitle}
              </p>
              <p className="mt-4 max-w-xl text-sm font-semibold text-[#FFD894]">{featuredText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryButtonLink}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-extrabold text-on-primary-container transition hover:-translate-y-0.5 hover:bg-[#C87500] hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                >
                  {primaryButtonText}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
                <Link
                  href={secondaryButtonLink}
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/14 px-6 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2C1A0D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                >
                  {secondaryButtonText}
                </Link>
              </div>
            </div>

            {products.length > 0 && (
              <div className="grid gap-3 rounded-[1.5rem] border border-white/18 bg-[#2C1A0D]/30 p-3 shadow-lift backdrop-blur-md">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={product.productUrl}
                    className="group flex items-center gap-3 rounded-[1.1rem] bg-white/92 p-3 shadow-soft transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F7EAD8]">
                      <Image
                        src={fallbackProductImage(product)}
                        alt={product.alt}
                        fill
                        loading="eager"
                        sizes="64px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-extrabold uppercase tracking-wide text-primary">
                        {product.category}
                      </span>
                      <span className="mt-1 block truncate font-heading text-sm font-bold text-[#24170E]">
                        {product.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-heading text-sm font-extrabold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
