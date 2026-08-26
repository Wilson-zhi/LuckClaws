import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, MessagesSquare, PawPrint, Route, ShieldCheck } from "lucide-react";
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

const heroBadges = [
  { label: "Secure checkout", Icon: ShieldCheck },
  { label: "Support when needed", Icon: MessagesSquare },
  { label: "Clear product paths", Icon: Route }
];

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

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,13,6,0.96)_0%,rgba(24,13,6,0.76)_37%,rgba(24,13,6,0.24)_68%,rgba(24,13,6,0.46)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,14,7,0.44)_0%,rgba(25,14,7,0.04)_34%,rgba(25,14,7,0.54)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2C1A0D]/90 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-[1600px] flex-col justify-between px-5 py-5 sm:px-8 md:min-h-[calc(100svh-88px)] md:px-10 md:py-7 lg:px-16 xl:px-20">
          <div className="home-hero-rail flex items-center justify-between gap-5 border-b border-white/20 pb-4">
            <div className="flex min-w-0 items-center gap-3 text-[#FFE0A6]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#FFD894]/45 bg-[#2C1A0D]/55 backdrop-blur-sm">
                <PawPrint aria-hidden className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <span className="truncate text-[11px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
                {eyebrow}
              </span>
            </div>
            <div className="hidden items-center divide-x divide-white/20 md:flex">
              {heroBadges.map(({ label, Icon }) => (
                <span key={label} className="flex items-center gap-2 px-3 text-[11px] font-bold text-white/90 first:pl-0 last:pr-0 lg:px-4">
                  <Icon aria-hidden className="h-4 w-4 text-[#FFD894]" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 pb-8 pt-12 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.43fr)] lg:items-end lg:pb-12 lg:pt-16">
            <div className="max-w-5xl">
              <div className="home-hero-feature mb-5 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 border-y border-[#FFD894]/40 py-2 text-[#FFD894]">
                <Award aria-hidden className="h-4 w-4" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">{featuredLabel}</span>
                <span className="h-1 w-1 rounded-full bg-[#FFD894]/70" aria-hidden />
                <span className="lc-hand-note text-xs leading-none sm:text-base">{featuredText}</span>
                <span className="ml-0.5 flex items-center gap-1" aria-hidden="true">
                  {[0, 1, 2].map((step) => (
                    <PawPrint
                      key={step}
                      className={`home-hero-paw ${step === 0 ? "h-3 w-3" : step === 1 ? "h-3.5 w-3.5" : "h-4 w-4"}`}
                    />
                  ))}
                </span>
              </div>
              <h1 className="home-poster-title max-w-[10.8ch] font-heading text-[clamp(3.35rem,7.4vw,8.4rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-white [text-shadow:0_8px_34px_rgba(0,0,0,0.34)]">
                {title}
              </h1>
              <p className="mt-6 max-w-[42rem] text-base font-semibold leading-7 text-white/95 [text-shadow:0_4px_18px_rgba(0,0,0,0.50)] md:text-lg md:leading-8">
                {subtitle}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
                className="home-hero-picks w-full max-w-[27rem] overflow-hidden rounded-2xl border border-[#FFD894]/35 bg-[#2B190C]/[0.82] text-white shadow-[0_24px_70px_rgba(15,8,3,0.42)] backdrop-blur-md lg:justify-self-end"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-4 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFD894] text-[#38200E] shadow-soft">
                      <PawPrint aria-hidden className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFD894]">Quick picks</p>
                      <p className="mt-1 truncate font-heading text-sm font-extrabold text-white sm:text-base">
                        A shorter route to shop.
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-right text-[#FFE0A6]">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em]">
                      {products.length} {products.length === 1 ? "pick" : "picks"}
                    </span>
                    <span className="lc-hand-note mt-1 block text-xs">ready to explore</span>
                  </span>
                </div>

                <div className="divide-y divide-white/15">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={product.productUrl}
                      className="group grid min-h-[88px] grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-white/[0.09] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#FFD894] sm:gap-4 sm:px-5"
                    >
                      <span className="relative h-[3.75rem] w-[3.75rem] overflow-hidden rounded-full border border-[#FFD894]/35 bg-[#F7EAD8]">
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
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#FFD894] sm:text-[11px]">
                          {product.category}
                        </span>
                        <span className="mt-1 block font-heading text-sm font-extrabold leading-5 text-white sm:text-base">
                          {product.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 pl-1">
                        <span className="font-heading text-sm font-extrabold tabular-nums text-[#FFE0A6]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FFD894] text-[#38200E] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
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
