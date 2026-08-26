"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Heart,
  Leaf,
  Lock,
  Mail,
  MapPinned,
  PackageCheck,
  PawPrint,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon
} from "lucide-react";
import { brandName } from "@/data/products";
import {
  fallbackAboutPawContent,
  type AboutCollectionCardContent,
  type AboutCollectionSectionContent,
  type AboutHeroContent,
  type AboutPawContent,
  type AboutPawRouteContent
} from "@/lib/about-paw-content";

type AboutJourneyExperienceProps = {
  hero: AboutHeroContent;
  pawPath: AboutPawContent;
  collectionSection: AboutCollectionSectionContent;
  collectionCards: AboutCollectionCardContent[];
  heroPosterImage: string;
  heroUsesVideo: boolean;
};

type JourneyStepKey = "welcome" | "compass" | "routine" | "standards" | "next";

type JourneyStep = {
  key: JourneyStepKey;
  label: string;
  shortLabel: string;
};

type StoryPoint = {
  title: string;
  text: string;
  proof: string;
  Icon: LucideIcon;
};

type PromisePoint = {
  title: string;
  text: string;
  detail: string;
  Icon: LucideIcon;
};

type RouteMedia = {
  image: string;
  alt: string;
  tone: string;
};

const journeySteps: JourneyStep[] = [
  { key: "welcome", label: "Meet LUCK CLAWS", shortLabel: "Hello" },
  { key: "compass", label: "Why routines", shortLabel: "Why" },
  { key: "routine", label: "Choose a moment", shortLabel: "Choose" },
  { key: "standards", label: "What to expect", shortLabel: "Trust" },
  { key: "next", label: "Find your next step", shortLabel: "Next" }
];

const storyPoints: StoryPoint[] = [
  {
    title: "Start with the moment",
    text: "A pet's day makes more sense than a crowded aisle. Begin with play, a walk, a quiet corner, comfort, or a question.",
    proof: "The need comes first. The category follows.",
    Icon: PawPrint
  },
  {
    title: "Shorten the route",
    text: "Each routine points toward a smaller, more relevant set of products instead of asking you to compare everything at once.",
    proof: "Fewer detours between curiosity and checkout.",
    Icon: MapPinned
  },
  {
    title: "Keep help in view",
    text: "Product questions and order support belong inside the shopping path, not on a page that is difficult to find later.",
    proof: "When the route is unclear, support is the next stop.",
    Icon: Compass
  }
];

const promisePoints: PromisePoint[] = [
  {
    title: "Clear product details",
    text: "Product pages focus on practical use, materials, sizing guidance, care details, and what to expect before checkout.",
    detail: "Useful details stay visible before purchase.",
    Icon: CheckCircle2
  },
  {
    title: "Easy category paths",
    text: "Collections are organized around everyday routines, so shoppers can start with the need instead of a crowded product list.",
    detail: "Choose the routine first, then narrow the product.",
    Icon: MapPinned
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

const iconMap: Record<string, LucideIcon> = {
  paw: PawPrint,
  shield: ShieldCheck,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  truck: Truck,
  package: PackageCheck,
  check: Check,
  rotate: RotateCcw,
  lock: Lock,
  mail: Mail,
  arrow: ArrowRight
};

const fallbackRouteMedia: Record<string, RouteMedia> = {
  play: {
    image: "/images/natural-cotton-tug-rope.jpg",
    alt: "Natural cotton rope and play textures for pet enrichment.",
    tone: "Play path"
  },
  walk: {
    image: "/images/category-walking-essentials.jpg",
    alt: "Walking essentials arranged as a warm pet routine.",
    tone: "Walk path"
  },
  rest: {
    image: "/images/category-beds-blankets.jpg",
    alt: "Soft bedding and blankets for calm pet routines.",
    tone: "Rest path"
  },
  comfort: {
    image: "/images/category-pet-apparel.jpg",
    alt: "Pet apparel shown in a warm everyday setting.",
    tone: "Comfort path"
  },
  support: {
    image: "/images/about-partners.jpg",
    alt: "LUCK CLAWS support and pet care materials.",
    tone: "Support path"
  }
};

const routeCollectionKeys: Record<string, string[]> = {
  play: ["dog_toys", "cat_toys"],
  walk: ["walking_essentials"],
  rest: ["beds_blankets", "beds_and_blankets"],
  comfort: ["pet_apparel"]
};

function iconForKey(iconKey: string) {
  return iconMap[iconKey] ?? PawPrint;
}

function normalizeKey(value: string) {
  return value.toLowerCase().replaceAll("-", "_");
}

function routeLinks(route: AboutPawRouteContent) {
  const links = [{ label: route.ctaLabel, href: route.ctaHref }];

  if (route.secondaryCtaLabel && route.secondaryCtaHref) {
    links.push({ label: route.secondaryCtaLabel, href: route.secondaryCtaHref });
  }

  return links;
}

function mediaForRoute(route: AboutPawRouteContent, cards: AboutCollectionCardContent[]): RouteMedia {
  const routeKey = normalizeKey(route.routeKey);
  const collectionKeys = routeCollectionKeys[routeKey] ?? [];
  const matchingCard = cards.find((card) => collectionKeys.includes(normalizeKey(card.cardKey)));
  const fallback = fallbackRouteMedia[routeKey] ?? {
    image: "/images/about-dogs-running.jpg",
    alt: "Pets moving through an everyday routine.",
    tone: "Routine path"
  };

  return matchingCard
    ? {
        image: matchingCard.imageUrl,
        alt: matchingCard.imageAlt,
        tone: fallback.tone
      }
    : fallback;
}

function HeroMedia({ hero, source, video }: { hero: AboutHeroContent; source: string; video: boolean }) {
  if (video) {
    return (
      <video
        aria-label={hero.heroImageAlt}
        className="about-journey-hero-media"
        src={source}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      src={source}
      alt={hero.heroImageAlt}
      fill
      priority
      sizes="100vw"
      className="about-journey-hero-media object-cover"
    />
  );
}

export function AboutJourneyExperience({
  hero,
  pawPath,
  collectionSection,
  collectionCards,
  heroPosterImage,
  heroUsesVideo
}: AboutJourneyExperienceProps) {
  const routines = pawPath.routes.length > 0 ? pawPath.routes : fallbackAboutPawContent.routes;
  const notes = pawPath.notes.length > 0 ? pawPath.notes : fallbackAboutPawContent.notes;
  const availableCollections = collectionCards.filter((card) => card.enabled);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeRoutineKey, setActiveRoutineKey] = useState(routines[0]?.routeKey ?? "play");
  const [activePromiseIndex, setActivePromiseIndex] = useState(0);
  const [activeCollectionKey, setActiveCollectionKey] = useState(availableCollections[0]?.cardKey ?? "");
  const touchStartX = useRef<number | null>(null);
  const touchCanChangeChapter = useRef(true);

  const activeStep = journeySteps[activeStepIndex];
  const activeStory = storyPoints[activeStoryIndex] ?? storyPoints[0];
  const activeRoutine = routines.find((route) => route.routeKey === activeRoutineKey) ?? routines[0];
  const activePromise = promisePoints[activePromiseIndex] ?? promisePoints[0];
  const activeCollection =
    availableCollections.find((card) => card.cardKey === activeCollectionKey) ?? availableCollections[0];
  const activeRouteMedia = useMemo(
    () => mediaForRoute(activeRoutine, availableCollections),
    [activeRoutine, availableCollections]
  );
  const ActiveStoryIcon = activeStory.Icon;
  const ActiveRouteIcon = iconForKey(activeRoutine.iconKey);
  const ActivePromiseIcon = activePromise.Icon;
  const progress = ((activeStepIndex + 1) / journeySteps.length) * 100;

  function moveToStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(journeySteps.length - 1, nextIndex));
    setActiveStepIndex(boundedIndex);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#about-${journeySteps[boundedIndex].key}`);
    }
  }

  useEffect(() => {
    const requestedStep = window.location.hash.replace("#about-", "") as JourneyStepKey;
    const requestedIndex = journeySteps.findIndex((step) => step.key === requestedStep);

    if (requestedIndex >= 0) {
      setActiveStepIndex(requestedIndex);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        moveToStep(activeStepIndex + 1);
      }

      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        moveToStep(activeStepIndex - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveToStep(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        moveToStep(journeySteps.length - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStepIndex]);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchCanChangeChapter.current = !(event.target as HTMLElement).closest("[data-about-horizontal-scroll]");
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (!touchCanChangeChapter.current || Math.abs(distance) < 56) {
      return;
    }

    moveToStep(activeStepIndex + (distance < 0 ? 1 : -1));
  }

  return (
    <section
      className="about-journey"
      aria-label="About LUCK CLAWS interactive story"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <nav className="about-journey-nav" aria-label="About story chapters">
        <div className="about-journey-nav-meta">
          <span>{String(activeStepIndex + 1).padStart(2, "0")}</span>
          <span aria-hidden="true">/</span>
          <span>{String(journeySteps.length).padStart(2, "0")}</span>
          <strong>{activeStep.label}</strong>
        </div>
        <div className="about-journey-nav-track">
          {journeySteps.map((step, index) => (
            <button
              key={step.key}
              type="button"
              className="about-journey-nav-stop"
              data-active={index === activeStepIndex}
              data-complete={index < activeStepIndex}
              aria-current={index === activeStepIndex ? "step" : undefined}
              aria-label={`Open chapter ${index + 1}: ${step.label}`}
              onClick={() => moveToStep(index)}
            >
              <span className="about-journey-nav-dot" />
              <span className="about-journey-nav-label">{step.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      <div
        key={activeStep.key}
        className={`about-journey-scene about-journey-scene-${activeStep.key}`}
        role="region"
        aria-labelledby={`about-journey-title-${activeStep.key}`}
        aria-live="polite"
      >
        {activeStep.key === "welcome" && (
          <div className="about-journey-welcome">
            <div className="about-journey-welcome-media">
              <HeroMedia hero={hero} source={heroPosterImage} video={heroUsesVideo} />
              <div className="about-journey-welcome-wash" />
            </div>
            <div className="about-journey-welcome-content">
              <div className="about-journey-stamp">
                <PawPrint aria-hidden className="h-5 w-5" />
                <span>{hero.eyebrow}</span>
              </div>
              <h1 id="about-journey-title-welcome" className="about-journey-display">
                {hero.title}
              </h1>
              <p className="about-journey-lead">{hero.description}</p>
              <div className="about-journey-actions">
                <button
                  type="button"
                  className="about-journey-action about-journey-action-primary"
                  onClick={() => moveToStep(1)}
                >
                  {hero.primaryCtaLabel}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </button>
                <Link className="about-journey-action about-journey-action-secondary" href={hero.secondaryCtaHref}>
                  {hero.secondaryCtaLabel}
                </Link>
              </div>
            </div>
            <div className="about-journey-welcome-note" aria-hidden="true">
              <span>Play</span>
              <span>Walk</span>
              <span>Rest</span>
              <span>Comfort</span>
              <span>Support</span>
            </div>
          </div>
        )}

        {activeStep.key === "compass" && (
          <div className="about-journey-compass">
            <div className="about-journey-compass-copy">
              <p className="about-journey-kicker">Our point of view</p>
              <h2 id="about-journey-title-compass" className="about-journey-section-title">
                {hero.compassTitle}
              </h2>
              <p className="about-journey-section-copy">{hero.compassDescription}</p>
              <div className="about-compass-orbit" aria-hidden="true">
                <span className="about-compass-orbit-ring about-compass-orbit-ring-one" />
                <span className="about-compass-orbit-ring about-compass-orbit-ring-two" />
                <span className="about-compass-hand" style={{ transform: `rotate(${activeStoryIndex * 120 + 25}deg)` }} />
                <span className="about-compass-center">
                  <PawPrint className="h-8 w-8" />
                </span>
              </div>
            </div>

            <div className="about-principle-stage">
              <div className="about-principle-tabs" role="tablist" aria-label="LUCK CLAWS shopping principles">
                {storyPoints.map(({ title, Icon }, index) => (
                  <button
                    key={title}
                    type="button"
                    role="tab"
                    aria-selected={index === activeStoryIndex}
                    aria-controls="about-principle-panel"
                    className="about-principle-tab"
                    data-active={index === activeStoryIndex}
                    onClick={() => setActiveStoryIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden className="h-5 w-5" />
                    <strong>{title}</strong>
                  </button>
                ))}
              </div>
              <div key={activeStory.title} id="about-principle-panel" role="tabpanel" className="about-principle-panel">
                <span className="about-principle-icon">
                  <ActiveStoryIcon aria-hidden className="h-7 w-7" />
                </span>
                <h3>{activeStory.title}</h3>
                <p>{activeStory.text}</p>
                <strong>{activeStory.proof}</strong>
              </div>
            </div>
          </div>
        )}

        {activeStep.key === "routine" && activeRoutine && (
          <div className="about-journey-routine" id="paw-path">
            <div className="about-routine-media">
              <Image
                key={activeRouteMedia.image}
                src={activeRouteMedia.image}
                alt={activeRouteMedia.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="about-routine-media-image object-cover"
              />
              <div className="about-routine-media-wash" />
              <div className="about-routine-route-word" aria-hidden="true">
                {activeRoutine.label}
              </div>
              <div className="about-routine-note">
                <span>{activeRouteMedia.tone}</span>
                <strong>{activeRoutine.noteText}</strong>
              </div>
            </div>

            <div className="about-routine-copy">
              <p className="about-journey-kicker">{pawPath.header.sectionLabel}</p>
              <h2 id="about-journey-title-routine" className="about-journey-section-title">
                {pawPath.header.title}
              </h2>
              <p className="about-journey-section-copy">{pawPath.header.subtitle}</p>
              <p className="about-routine-supporting-line">{pawPath.header.supportingLine}</p>

              <div key={activeRoutine.routeKey} className="about-routine-recommendation">
                <span className="about-routine-recommendation-icon">
                  <ActiveRouteIcon aria-hidden className="h-6 w-6" />
                </span>
                <div>
                  <p>Selected route</p>
                  <h3>{activeRoutine.recommendationTitle}</h3>
                  <span>{activeRoutine.recommendationDescription}</span>
                </div>
              </div>

              <div className="about-routine-links">
                {routeLinks(activeRoutine).map((link, index) => (
                  <Link
                    key={`${activeRoutine.routeKey}-${link.href}`}
                    href={link.href}
                    className={index === 0 ? "about-routine-link-primary" : "about-routine-link-secondary"}
                  >
                    {link.label}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="about-routine-selector"
              role="tablist"
              aria-label="Choose a pet routine"
              data-about-horizontal-scroll
            >
              {routines.map((route) => {
                const Icon = iconForKey(route.iconKey);
                const selected = route.routeKey === activeRoutine.routeKey;

                return (
                  <button
                    key={route.routeKey}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className="about-routine-selector-button"
                    data-active={selected}
                    onClick={() => setActiveRoutineKey(route.routeKey)}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                    <span>{route.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="about-routine-notes" aria-label="Paw Path guiding notes">
              {notes.slice(0, 4).map((note) => {
                const Icon = iconForKey(note.iconKey);

                return (
                  <span key={note.noteKey}>
                    <Icon aria-hidden className="h-4 w-4" />
                    <strong>{note.keyword}</strong> {note.secondaryText}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {activeStep.key === "standards" && (
          <div className="about-journey-standards">
            <div className="about-standards-intro">
              <p className="about-journey-kicker">A practical promise</p>
              <h2 id="about-journey-title-standards" className="about-journey-section-title">
                What you can expect from {brandName}
              </h2>
              <p className="about-journey-section-copy">
                Trust is easier to build when the useful details stay visible. Open each promise to see what it means in the store.
              </p>
              <div className="about-standards-word" aria-hidden="true">EXPECT</div>
            </div>

            <div className="about-standards-list">
              {promisePoints.map(({ title, Icon }, index) => {
                const selected = index === activePromiseIndex;

                return (
                  <button
                    key={title}
                    type="button"
                    className="about-standard-row"
                    data-active={selected}
                    aria-expanded={selected}
                    onClick={() => setActivePromiseIndex(index)}
                  >
                    <span className="about-standard-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="about-standard-icon">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <strong>{title}</strong>
                    <ArrowRight aria-hidden className="about-standard-arrow h-5 w-5" />
                  </button>
                );
              })}
              <div key={activePromise.title} className="about-standard-detail" aria-live="polite">
                <span className="about-standard-detail-icon">
                  <ActivePromiseIcon aria-hidden className="h-6 w-6" />
                </span>
                <div>
                  <h3>{activePromise.title}</h3>
                  <p>{activePromise.text}</p>
                  <strong>{activePromise.detail}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep.key === "next" && activeCollection && (
          <div className="about-journey-next">
            <div className="about-next-media">
              <Image
                key={activeCollection.imageUrl}
                src={activeCollection.imageUrl}
                alt={activeCollection.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="about-next-media-image object-cover"
              />
              <div className="about-next-media-wash" />
              <div className="about-next-collection-name">
                <span>Selected collection</span>
                <strong>{activeCollection.title}</strong>
              </div>
            </div>

            <div className="about-next-copy">
              <p className="about-journey-kicker">{collectionSection.eyebrow}</p>
              <h2 id="about-journey-title-next" className="about-journey-section-title">
                {collectionSection.title}
              </h2>
              <p className="about-journey-section-copy">{collectionSection.subtitle}</p>
              <div className="about-next-actions">
                <Link href={activeCollection.href} className="about-journey-action about-journey-action-primary">
                  Explore {activeCollection.title}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </Link>
                <Link href={collectionSection.viewAllHref} className="about-journey-action about-journey-action-secondary">
                  {collectionSection.viewAllLabel}
                </Link>
              </div>

              <div className="about-next-support">
                <Mail aria-hidden className="h-5 w-5" />
                <div>
                  <strong>Need a clearer next step?</strong>
                  <p>
                    Email: <a href="mailto:support@luckclaws.com">support@luckclaws.com</a>
                  </p>
                </div>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>

            <div className="about-next-selector" aria-label="Choose a collection" data-about-horizontal-scroll>
              {availableCollections.map((collection) => (
                <button
                  key={collection.cardKey}
                  type="button"
                  className="about-next-selector-button"
                  data-active={collection.cardKey === activeCollection.cardKey}
                  onClick={() => setActiveCollectionKey(collection.cardKey)}
                >
                  <span>{collection.title}</span>
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="about-journey-controls">
        <button
          type="button"
          className="about-journey-control-button"
          onClick={() => moveToStep(activeStepIndex - 1)}
          disabled={activeStepIndex === 0}
          aria-label="Previous About chapter"
        >
          <ArrowLeft aria-hidden className="h-5 w-5" />
          <span>Previous</span>
        </button>
        <div className="about-journey-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          className="about-journey-control-button about-journey-control-button-next"
          onClick={() => moveToStep(activeStepIndex === journeySteps.length - 1 ? 0 : activeStepIndex + 1)}
          aria-label={activeStepIndex === journeySteps.length - 1 ? "Restart About story" : "Next About chapter"}
        >
          <span>{activeStepIndex === journeySteps.length - 1 ? "Restart" : "Next"}</span>
          {activeStepIndex === journeySteps.length - 1 ? (
            <RotateCcw aria-hidden className="h-5 w-5" />
          ) : (
            <ArrowRight aria-hidden className="h-5 w-5" />
          )}
        </button>
      </div>
    </section>
  );
}
