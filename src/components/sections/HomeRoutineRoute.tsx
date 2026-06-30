import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type PublicCategoryCard } from "@/lib/public-product-data";
import { cn } from "@/lib/utils";

const routineSignals = ["Play", "Walk", "Rest", "Comfort", "Support"];

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

function tileClass(index: number, count: number) {
  if (count === 4) {
    return index < 2 ? "min-h-[390px] lg:col-span-3" : "min-h-[260px] lg:col-span-3";
  }

  if (index === 0) {
    return "min-h-[430px] lg:col-span-3 lg:row-span-2";
  }

  if (count >= 5 && (index === 1 || index === 2)) {
    return "min-h-[260px] lg:col-span-3";
  }

  if (count >= 5) {
    return "min-h-[240px] lg:col-span-3";
  }

  return "min-h-[230px] lg:col-span-2";
}

export function HomeRoutineRoute({ categories }: { categories: PublicCategoryCard[] }) {
  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = categories.slice(0, 5);

  return (
    <section
      id="routine-lookbook"
      className="bg-[linear-gradient(180deg,#F3E5D2_0%,#FFF9EF_16%,#FFF9EF_84%,#F7EAD8_100%)] py-16 md:py-24"
    >
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Routine lookbook</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
              Browse the edited routine paths.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B5540]">
              Move from the guide into clear collection paths for play, walks, rest, comfort, and support.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#6B4A2F]">
              {routineSignals.map((signal, index) => (
                <span key={signal} className="inline-flex items-center gap-2">
                  <span className="rounded-full border border-[#E0C39C] bg-[#FFF8ED] px-3 py-1.5">
                    {signal}
                  </span>
                  {index < routineSignals.length - 1 && <span className="text-primary/70">/</span>}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-x-0"
          >
            Explore all collections
            <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="grid auto-rows-[minmax(220px,auto)] gap-4 lg:grid-cols-6">
          {visibleCategories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className={cn(
                "group relative overflow-hidden rounded-[1.75rem] bg-[#2C1A0D] shadow-ambient transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0",
                tileClass(index, visibleCategories.length)
              )}
              aria-label={`Shop ${category.name}`}
            >
              <Image
                src={categoryImage(category)}
                alt={category.alt}
                fill
                loading={index < 4 ? "eager" : "lazy"}
                sizes={index === 0 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 420px, 100vw"}
                className="object-cover object-center opacity-100 transition duration-500 group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(36,23,14,0.78)_0%,rgba(36,23,14,0.28)_42%,rgba(36,23,14,0.04)_100%)]" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894] [text-shadow:0_2px_10px_rgba(0,0,0,0.38)]">
                  Routine path
                </p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <h3
                      className={cn(
                        "font-heading font-extrabold leading-tight text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.42)]",
                        index === 0 ? "text-4xl md:text-5xl" : "text-2xl"
                      )}
                    >
                      {category.name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm font-medium leading-6 text-white/92 [text-shadow:0_3px_14px_rgba(0,0,0,0.44)]">
                      {categoryBenefit(category)}
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/92 text-[#2C1A0D] transition group-hover:translate-x-0.5 group-hover:bg-primary-container group-hover:text-on-primary-container motion-reduce:group-hover:translate-x-0">
                    <ArrowRight aria-hidden className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
