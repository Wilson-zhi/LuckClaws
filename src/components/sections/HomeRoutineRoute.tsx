import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type PublicCategoryCard } from "@/lib/public-product-data";

const routineSignals = ["Play", "Walk", "Rest", "Comfort", "Support"];

function categoryPathLabel(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) {
    return "Dog play path";
  }

  if (normalized.includes("cat")) {
    return "Cat play path";
  }

  if (normalized.includes("walking")) {
    return "Walk path";
  }

  if (normalized.includes("apparel")) {
    return "Comfort path";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "Rest path";
  }

  return "Routine path";
}

function categoryBenefit(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) {
    return "For chewing, chasing, sniffing, and daily enrichment.";
  }

  if (normalized.includes("cat")) {
    return "For pouncing, batting, catnip play, and curious indoor energy.";
  }

  if (normalized.includes("walking")) {
    return "For daily walks, quick errands, and out-the-door routines.";
  }

  if (normalized.includes("apparel")) {
    return "For fit, warmth, comfort, and easy everyday wear.";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "For softer corners, calmer downtime, and comfortable rest.";
  }

  return "For practical daily routines and easier product decisions.";
}

function fallbackImageForCategory(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) {
    return "/images/category-dog-toys.jpg";
  }

  if (normalized.includes("cat")) {
    return "/images/organic-catnip-mouse.jpg";
  }

  if (normalized.includes("walking")) {
    return "/images/category-walking-essentials.jpg";
  }

  if (normalized.includes("apparel")) {
    return "/images/category-pet-apparel.jpg";
  }

  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "/images/category-beds-blankets.jpg";
  }

  return "/images/hero-dog-running.jpg";
}

function categoryImage(category: PublicCategoryCard) {
  const image = category.image.trim();
  const normalized = image.toLowerCase();
  const categoryScope = `${category.name} ${category.href}`.toLowerCase();

  if (
    !image ||
    normalized.includes("icon") ||
    normalized.includes("logo") ||
    (categoryScope.includes("cat") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("apparel") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("walking") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("bed") && normalized.includes("dog-toys"))
  ) {
    return fallbackImageForCategory(category);
  }

  return image;
}

export function HomeRoutineRoute({ categories }: { categories: PublicCategoryCard[] }) {
  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = categories.slice(0, 4);

  return (
    <section
      id="routine-lookbook"
      className="bg-[linear-gradient(180deg,#F3E5D2_0%,#FFF9EF_18%,#FFF6EA_76%,#F7EAD8_100%)] py-12 md:py-16"
    >
      <div className="section-shell">
        <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Routine lookbook</p>
            <h2 className="mt-2 max-w-4xl font-heading text-3xl font-extrabold leading-[0.98] tracking-tight md:text-4xl xl:text-5xl">
              Browse the edited routine paths.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B5540]">
              Move from the guide into clear collection paths for play, walks, rest, comfort, and support.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6B4A2F] lg:justify-end">
              {routineSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-[#E0C39C] bg-[#FFF8ED]/82 px-3 py-1.5">
                  {signal}
                </span>
              ))}
            </div>
            <Link
              href="/collections"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#2C1A0D] px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
            >
              Explore all collections
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
              />
            </Link>
          </div>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex min-h-[440px] overflow-hidden rounded-[1.75rem] border border-[#E5C9A4] bg-[#FFF8ED] shadow-[0_22px_60px_rgba(92,60,30,0.10)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              aria-label={`Shop ${category.name}`}
            >
              <article className="flex w-full flex-col">
                <div className="relative m-3 mb-0 aspect-[1.08] overflow-hidden rounded-[1.25rem] bg-[#EAD8BF]">
                  <Image
                    src={categoryImage(category)}
                    alt={category.alt}
                    fill
                    loading={index < 4 ? "eager" : "lazy"}
                    sizes="(min-width: 1280px) 330px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,237,0.02)_0%,rgba(44,26,13,0.12)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/55 bg-white/78 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary shadow-soft backdrop-blur">
                    {String(index + 1).padStart(2, "0")} / Path
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                    {categoryPathLabel(category)}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-[#2C1A0D]">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#6B5540]">
                    {categoryBenefit(category)}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#6B4A2F]">
                      Shop routine
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2C1A0D] text-white transition group-hover:translate-x-0.5 group-hover:bg-primary motion-reduce:group-hover:translate-x-0">
                      <ArrowRight aria-hidden className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
