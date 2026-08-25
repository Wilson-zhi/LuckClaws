import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, PawPrint } from "lucide-react";
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
    <section className="home-hero relative isolate overflow-hidden bg-[#2C1A0D]">
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
            <span className="inline-flex rounded-full border border-white/25 bg-white/[0.14] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD894] backdrop-blur">
              {eyebrow}
            </span>
            <div className="hidden flex-wrap gap-2 md:flex">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/30 bg-[#2C1A0D]/[0.62] px-3 py-2 text-xs font-bold text-white shadow-soft backdrop-blur"
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
              <div className="home-hero-art-note mt-4 flex w-fit items-center gap-3 text-[#FFD894]">
                <p className="lc-hand-note text-lg leading-none md:text-xl">{featuredText}</p>
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((step) => (
                    <PawPrint
                      key={step}
                      className={`home-hero-paw ${step === 0 ? "h-3.5 w-3.5" : step === 1 ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]"}`}
                    />
                  ))}
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryButtonLink}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-extrabold text-on-primary-container transition hover:-translate-y-0.5 hover:bg-[#C87500] hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                >
                  <span className="lc-ink-underline">{primaryButtonText}</span>
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
                <Link
                  href={secondaryButtonLink}
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/[0.14] px-6 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2C1A0D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
                >
                  {secondaryButtonText}
                </Link>
              </div>
            </div>

            {products.length > 0 && (
              <aside
                aria-label="Quick product picks"
                className="w-full max-w-xl overflow-hidden rounded-2xl bg-[#FFF8ED] text-[#24170E] shadow-[0_22px_60px_rgba(20,11,5,0.34)] ring-1 ring-[#F2D9AE] lg:justify-self-end"
              >
                <div className="flex items-end justify-between gap-4 border-b border-[#E8D4B4] px-4 py-3.5 sm:px-5">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94600A]">Quick picks</p>
                    <p className="mt-1 font-heading text-sm font-extrabold text-[#24170E] sm:text-base">
                      A shorter route to shop.
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="block rounded-full bg-[#F6E2BC] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6E4300]">
                      {products.length} {products.length === 1 ? "pick" : "picks"}
                    </span>
                    <span className="lc-hand-note mt-1.5 block text-xs text-[#8E5700]">sniff out a favorite</span>
                  </span>
                </div>

                <div className="divide-y divide-[#E8D4B4]">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={product.productUrl}
                      className="group grid min-h-[88px] grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-[#F8E7C9] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#8E5700] sm:gap-4 sm:px-5"
                    >
                      <span className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#F7EAD8]">
                        <Image
                          src={fallbackProductImage(product)}
                          alt={product.alt}
                          fill
                          loading="eager"
                          sizes="64px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8E5700] sm:text-[11px]">
                          {product.category}
                        </span>
                        <span className="mt-1 block font-heading text-sm font-extrabold leading-5 text-[#24170E] sm:text-base">
                          {product.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 pl-1">
                        <span className="font-heading text-sm font-extrabold tabular-nums text-[#7B4A00]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2C1A0D] text-[#FFD894] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                          <ArrowRight aria-hidden className="h-4 w-4" />
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
