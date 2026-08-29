"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Compass, PawPrint } from "lucide-react";
import { type PublicCategoryCard } from "@/lib/public-product-data";

function categoryPathLabel(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "Play together";
  if (normalized.includes("cat")) return "Follow curiosity";
  if (normalized.includes("walking")) return "Step outside";
  if (normalized.includes("apparel")) return "Dress for the day";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "Make room for rest";
  return "Find the right routine";
}

function categoryBenefit(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "Turn everyday energy into play with a purpose.";
  if (normalized.includes("cat")) return "Give curious paws a better place to pounce and explore.";
  if (normalized.includes("walking")) return "Keep the useful things for getting out the door close at hand.";
  if (normalized.includes("apparel")) return "Add soft layers that move comfortably through the day.";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "Build a warmer corner for slower, softer moments.";
  return "Find a clearer path through everyday pet essentials.";
}

function categoryCue(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "When the energy has somewhere useful to go.";
  if (normalized.includes("cat")) return "When curiosity is ready for a new target.";
  if (normalized.includes("walking")) return "When the door is open and the day is moving.";
  if (normalized.includes("apparel")) return "When comfort needs to keep up with motion.";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "When the pace is ready to soften.";
  return "When one useful next step is enough.";
}

function fallbackImageForCategory(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "/images/category-dog-toys.jpg";
  if (normalized.includes("cat")) return "/images/organic-catnip-mouse.jpg";
  if (normalized.includes("walking")) return "/images/category-walking-essentials.jpg";
  if (normalized.includes("apparel")) return "/images/category-pet-apparel.jpg";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "/images/category-beds-blankets.jpg";
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
  const visibleCategories = categories.slice(0, 4);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (visibleCategories.length === 0) return null;

  const activeCategory = visibleCategories[activeIndex] ?? visibleCategories[0];
  const activeNumber = String(activeIndex + 1).padStart(2, "0");

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = visibleCategories.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const normalizedIndex = (nextIndex + visibleCategories.length) % visibleCategories.length;
    setActiveIndex(normalizedIndex);
    tabRefs.current[normalizedIndex]?.focus();
  };

  return (
    <section id="routine-lookbook" className="home-editorial-collections scroll-mt-24">
      <div className="section-shell home-route-deck">
        <header className="home-route-deck-heading">
          <div className="home-route-deck-title-art">
            <p className="home-editorial-kicker">Routine lookbook</p>
            <h2 aria-label="Pick a path for the day">
              <span data-route-title-piece="lead">Pick a path</span>
              <em data-route-title-piece="accent">for the day.</em>
            </h2>
            <span className="home-route-deck-stamp" data-route-title-piece="stamp" aria-hidden="true">
              <PawPrint />
              <span>
                <strong>{visibleCategories.length} routes</strong>
                <small>one good next step</small>
              </span>
            </span>
          </div>
          <div className="home-route-deck-intro">
            <span aria-hidden="true">
              <Compass />
            </span>
            <div>
              <small>Choose today&apos;s direction</small>
              <strong>Where is their day headed?</strong>
              <p>Play, explore, layer up, or slow down. Start with the moment and open the route that fits.</p>
            </div>
          </div>
        </header>

        <div className="home-route-deck-stage">
          <div key={`image-${activeCategory.href}`} className="home-route-deck-visual">
            <Image
              src={categoryImage(activeCategory)}
              alt={activeCategory.alt || activeCategory.name}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <span className="home-route-deck-image-index">
              <small>Route</small>
              <strong>{activeNumber}</strong>
            </span>
            <span className="home-route-deck-image-note lc-hand-note">
              {categoryPathLabel(activeCategory)}
            </span>
          </div>

          <article
            key={`copy-${activeCategory.href}`}
            id="routine-lookbook-panel"
            role="tabpanel"
            aria-labelledby={`routine-lookbook-tab-${activeIndex}`}
            className="home-route-deck-copy"
          >
            <span className="home-route-deck-copy-route">
              <PawPrint aria-hidden />
              Everyday route {activeNumber}
            </span>
            <p className="lc-hand-note">{categoryPathLabel(activeCategory)}</p>
            <h3>{activeCategory.name}</h3>
            <p>{categoryBenefit(activeCategory)}</p>
            <blockquote>{categoryCue(activeCategory)}</blockquote>
            <Link href={activeCategory.href} className="group">
              <span>Shop this route</span>
              <ArrowRight aria-hidden className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </article>
        </div>

        <div className="home-route-deck-tabs" role="tablist" aria-label="Everyday shopping routes">
          {visibleCategories.map((category, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={category.href}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`routine-lookbook-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="routine-lookbook-panel"
                tabIndex={isActive ? 0 : -1}
                data-active={isActive}
                className="home-route-deck-tab"
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActiveIndex(index);
                }}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>
                  <em>{categoryPathLabel(category)}</em>
                  <strong>{category.name}</strong>
                </span>
                <ArrowRight aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
