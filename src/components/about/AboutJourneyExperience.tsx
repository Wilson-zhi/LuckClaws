"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const compassBadges = [
  { label: "Moment", note: "Start here", Icon: PawPrint, tone: "moment" },
  { label: "Short route", note: "Fewer detours", Icon: MapPinned, tone: "route" },
  { label: "Help nearby", note: "Never hidden", Icon: Heart, tone: "help" }
] as const;

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
        className="about-scroll-hero-media"
        src={source}
        poster="/images/about-dogs-running.jpg"
        preload="metadata"
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
      className="about-scroll-hero-media object-cover"
    />
  );
}

function journeyIndexForHref(href: string) {
  if (href === "#paw-path") {
    return journeySteps.findIndex((step) => step.key === "routine");
  }

  if (!href.startsWith("#about-")) {
    return -1;
  }

  const key = href.replace("#about-", "") as JourneyStepKey;
  return journeySteps.findIndex((step) => step.key === key);
}

function handleTabKey(
  event: ReactKeyboardEvent<HTMLButtonElement>,
  currentIndex: number,
  total: number,
  selectIndex: (index: number) => void
) {
  let nextIndex = currentIndex;

  if (["ArrowRight", "ArrowDown"].includes(event.key)) {
    nextIndex = (currentIndex + 1) % total;
  } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
    nextIndex = (currentIndex - 1 + total) % total;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = total - 1;
  } else {
    return;
  }

  event.preventDefault();
  selectIndex(nextIndex);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
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
  const journeyRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const storyScrollTriggerRef = useRef<ScrollTrigger | null>(null);

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
  const heroPrimaryStepIndex = journeyIndexForHref(hero.primaryCtaHref);
  const progressStyle = {
    "--about-scroll-progress": activeStepIndex / (journeySteps.length - 1)
  } as CSSProperties;

  useGSAP(
    () => {
      const mediaQuery = gsap.matchMedia();

      mediaQuery.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-about-panel]");
        const stage = journeyRef.current?.querySelector<HTMLElement>(".about-scroll-stage");

        if (!journeyRef.current || !stage || panels.length !== journeySteps.length) {
          return;
        }

        gsap.set(panels, {
          autoAlpha: 0,
          pointerEvents: "none",
          yPercent: 8
        });
        gsap.set(panels[0], {
          autoAlpha: 1,
          pointerEvents: "auto",
          yPercent: 0
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top top+=84",
            end: () => `+=${Math.max(window.innerHeight * 5.2, 4200)}`,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                journeySteps.length - 1,
                Math.round(self.progress * (journeySteps.length - 1))
              );

              if (nextIndex !== activeIndexRef.current) {
                activeIndexRef.current = nextIndex;
                setActiveStepIndex(nextIndex);
                window.history.replaceState(null, "", `#about-${journeySteps[nextIndex].key}`);
              }
            }
          }
        });

        storyScrollTriggerRef.current = timeline.scrollTrigger ?? null;

        journeySteps.forEach((step, index) => timeline.addLabel(step.key, index));

        for (let index = 1; index < panels.length; index += 1) {
          timeline
            .to(
              panels[index - 1],
              {
                autoAlpha: 0,
                pointerEvents: "none",
                yPercent: -7,
                duration: 0.3
              },
              index - 0.5
            )
            .fromTo(
              panels[index],
              {
                autoAlpha: 0,
                pointerEvents: "none",
                yPercent: 8
              },
              {
                autoAlpha: 1,
                pointerEvents: "auto",
                yPercent: 0,
                duration: 0.36
              },
              index - 0.36
            );
        }

        timeline
          .to(".about-scroll-hero-media", { scale: 1.1, xPercent: -1.5, duration: 1 }, 0)
          .fromTo(
            ".about-scroll-compass-map",
            { scale: 0.82, rotation: -4 },
            { scale: 1, rotation: 0, duration: 0.5, ease: "power3.out" },
            0.62
          )
          .fromTo(
            ".about-scroll-principle-line",
            { xPercent: 8 },
            { xPercent: 0, stagger: 0.06, duration: 0.34 },
            0.7
          )
          .fromTo(
            ".about-scroll-route-visual",
            { clipPath: "inset(0 0 0 100%)", xPercent: 6 },
            { clipPath: "inset(0 0 0 0%)", xPercent: 0, duration: 0.38 },
            1.08
          )
          .fromTo(
            ".about-scroll-standard-row",
            { xPercent: 6 },
            { xPercent: 0, stagger: 0.05, duration: 0.35 },
            2.62
          )
          .fromTo(
            ".about-scroll-collection-frame",
            { yPercent: 12, rotation: 2 },
            { yPercent: 0, rotation: 0, duration: 0.48 },
            3.52
          );

        timeline.call(() => undefined, [], journeySteps.length - 1);

        const requestedStepIndex = journeyIndexForHref(window.location.hash);
        const deepLinkTimer = window.setTimeout(() => {
          const trigger = timeline.scrollTrigger;

          if (!trigger || requestedStepIndex < 0) {
            return;
          }

          const destination =
            trigger.start + (trigger.end - trigger.start) * (requestedStepIndex / (journeySteps.length - 1));
          activeIndexRef.current = requestedStepIndex;
          setActiveStepIndex(requestedStepIndex);
          window.scrollTo({ top: destination, behavior: "auto" });
          ScrollTrigger.update();
        }, 80);

        return () => {
          window.clearTimeout(deepLinkTimer);
          storyScrollTriggerRef.current = null;
        };
      });

      mediaQuery.add("(max-width: 860px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-about-panel]");
        const scrollPanelIntoView = (panel: HTMLElement) => {
          const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
          const railHeight =
            journeyRef.current?.querySelector<HTMLElement>(".about-scroll-rail")?.getBoundingClientRect().height ??
            64;
          const destination = window.scrollY + panel.getBoundingClientRect().top - headerHeight - railHeight;

          window.scrollTo({ top: Math.max(0, destination), behavior: "auto" });
        };
        const activateStep = (index: number) => {
          activeIndexRef.current = index;
          setActiveStepIndex(index);

          const nextHash = `#about-${journeySteps[index].key}`;
          if (window.location.hash !== nextHash) {
            window.history.replaceState(null, "", nextHash);
          }
        };
        const observers = panels.map((panel, index) =>
          ScrollTrigger.create({
            trigger: panel,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => activateStep(index),
            onEnterBack: () => activateStep(index)
          })
        );

        const requestedStepIndex = journeyIndexForHref(window.location.hash);
        const deepLinkTimer = window.setTimeout(() => {
          const requestedPanel = panels[requestedStepIndex];

          if (!requestedPanel) {
            return;
          }

          scrollPanelIntoView(requestedPanel);
          activateStep(requestedStepIndex);
          ScrollTrigger.update();
        }, 120);

        return () => {
          window.clearTimeout(deepLinkTimer);
          observers.forEach((observer) => observer.kill());
        };
      });

      mediaQuery.add("(min-width: 861px) and (prefers-reduced-motion: reduce)", () => {
        const requestedStepIndex = journeyIndexForHref(window.location.hash);
        const requestedPanel = document.getElementById(
          `about-${journeySteps[requestedStepIndex]?.key ?? ""}`
        );
        const deepLinkTimer = window.setTimeout(() => {
          if (!requestedPanel) {
            return;
          }

          const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 84;
          const destination = window.scrollY + requestedPanel.getBoundingClientRect().top - headerHeight;

          activeIndexRef.current = requestedStepIndex;
          setActiveStepIndex(requestedStepIndex);
          window.scrollTo({ top: Math.max(0, destination), behavior: "auto" });
        }, 120);

        return () => window.clearTimeout(deepLinkTimer);
      });

      return () => mediaQuery.revert();
    },
    { scope: journeyRef }
  );

  function moveToStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(journeySteps.length - 1, nextIndex));
    const trigger = storyScrollTriggerRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";

    if (trigger) {
      const destination = trigger.start + (trigger.end - trigger.start) * (boundedIndex / (journeySteps.length - 1));
      window.scrollTo({ top: destination, behavior });
      return;
    }

    const panel = document.getElementById(`about-${journeySteps[boundedIndex].key}`);

    if (!panel) {
      return;
    }

    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
    const railHeight =
      journeyRef.current?.querySelector<HTMLElement>(".about-scroll-rail")?.getBoundingClientRect().height ?? 64;
    const destination = window.scrollY + panel.getBoundingClientRect().top - headerHeight - railHeight;

    window.scrollTo({ top: Math.max(0, destination), behavior });
  }

  return (
    <section ref={journeyRef} className="about-scroll-story" aria-label="About LUCK CLAWS scroll story">
      <div className="about-scroll-stage">
        <div
          className="about-scroll-rail"
          data-step={journeySteps[activeStepIndex].key}
          aria-label="About story chapters"
        >
          <span className="about-scroll-rail-current" aria-live="polite">
            {String(activeStepIndex + 1).padStart(2, "0")}
            <span aria-hidden="true"> / {String(journeySteps.length).padStart(2, "0")}</span>
          </span>
          <div className="about-scroll-rail-line" aria-hidden="true">
            <span style={progressStyle} />
          </div>
          {journeySteps.map((step, index) => (
            <button
              key={step.key}
              type="button"
              className="about-scroll-rail-stop"
              data-active={index === activeStepIndex}
              data-complete={index < activeStepIndex}
              aria-current={index === activeStepIndex ? "step" : undefined}
              aria-label={`Go to ${step.label}`}
              onClick={() => moveToStep(index)}
            >
              <span className="about-scroll-rail-dot" />
              <span className="about-scroll-rail-label">{step.shortLabel}</span>
            </button>
          ))}
        </div>

        <article
          id="about-welcome"
          data-about-panel
          className="about-scroll-panel about-scroll-panel-welcome"
        >
          <div className="about-scroll-welcome-media">
            <HeroMedia hero={hero} source={heroPosterImage} video={heroUsesVideo} />
            <div className="about-scroll-welcome-wash" />
          </div>
          <div className="about-scroll-welcome-copy">
            <p className="about-scroll-signature">
              <PawPrint aria-hidden className="h-5 w-5" />
              {hero.eyebrow}
            </p>
            <h1>{hero.title}</h1>
            <p className="about-scroll-lead">{hero.description}</p>
            <div className="about-scroll-actions">
              {heroPrimaryStepIndex >= 0 ? (
                <button
                  type="button"
                  className="about-scroll-action about-scroll-action-primary"
                  onClick={() => moveToStep(heroPrimaryStepIndex)}
                >
                  {hero.primaryCtaLabel}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </button>
              ) : (
                <Link className="about-scroll-action about-scroll-action-primary" href={hero.primaryCtaHref}>
                  {hero.primaryCtaLabel}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </Link>
              )}
              <Link className="about-scroll-action about-scroll-action-quiet" href={hero.secondaryCtaHref}>
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>
          <div className="about-scroll-routine-marquee" aria-hidden="true">
            Play · Walk · Rest · Comfort · Support
          </div>
        </article>

        <article
          id="about-compass"
          data-about-panel
          className="about-scroll-panel about-scroll-panel-compass"
        >
          <div className="about-scroll-compass-copy">
            <h2>{hero.compassTitle}</h2>
            <p>{hero.compassDescription}</p>
            <div
              className="about-scroll-compass-map"
              data-selection={activeStoryIndex}
              aria-hidden="true"
            >
              <span className="about-scroll-compass-path about-scroll-compass-path-moment" />
              <span className="about-scroll-compass-path about-scroll-compass-path-route" />
              <span className="about-scroll-compass-path about-scroll-compass-path-help" />

              {compassBadges.map(({ label, note, Icon, tone }, index) => (
                <span
                  key={label}
                  className={`about-scroll-compass-sticker about-scroll-compass-sticker-${tone}`}
                  data-active={index === activeStoryIndex}
                >
                  <span className="about-scroll-compass-sticker-icon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <small>{note}</small>
                    <strong>{label}</strong>
                  </span>
                </span>
              ))}

              <span className="about-scroll-compass-core">
                <PawPrint className="h-8 w-8" />
                <small>Today&apos;s need</small>
              </span>
              <Sparkles className="about-scroll-compass-spark about-scroll-compass-spark-one" />
              <Sparkles className="about-scroll-compass-spark about-scroll-compass-spark-two" />
            </div>
          </div>

          <div className="about-scroll-principles" role="tablist" aria-label="LUCK CLAWS shopping principles">
            {storyPoints.map(({ title, Icon }, index) => (
              <button
                key={title}
                type="button"
                role="tab"
                aria-selected={index === activeStoryIndex}
                aria-controls="about-principle-detail"
                id={`about-principle-tab-${index}`}
                className="about-scroll-principle-line"
                data-active={index === activeStoryIndex}
                onClick={() => setActiveStoryIndex(index)}
                onKeyDown={(event) => handleTabKey(event, index, storyPoints.length, setActiveStoryIndex)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden className="h-6 w-6" />
                <strong>{title}</strong>
                <ArrowRight aria-hidden className="h-5 w-5" />
              </button>
            ))}
            <div
              key={activeStory.title}
              id="about-principle-detail"
              className="about-scroll-principle-detail"
              role="tabpanel"
              aria-labelledby={`about-principle-tab-${activeStoryIndex}`}
            >
              <ActiveStoryIcon aria-hidden className="h-7 w-7" />
              <p>{activeStory.text}</p>
              <strong>{activeStory.proof}</strong>
            </div>
          </div>
        </article>

        {activeRoutine && (
          <article
            id="about-routine"
            data-about-panel
            className="about-scroll-panel about-scroll-panel-routine"
          >
            <div className="about-scroll-route-copy" id="paw-path">
              <h2>{pawPath.header.title}</h2>
              <p>{pawPath.header.subtitle}</p>
              <p className="about-scroll-route-supporting">{pawPath.header.supportingLine}</p>

              <div className="about-scroll-route-selector" role="tablist" aria-label="Choose a pet routine">
                {routines.map((route) => {
                  const Icon = iconForKey(route.iconKey);
                  const selected = route.routeKey === activeRoutine.routeKey;

                  return (
                    <button
                      key={route.routeKey}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="about-routine-detail"
                      id={`about-routine-tab-${normalizeKey(route.routeKey)}`}
                      className="about-scroll-route-button"
                      data-active={selected}
                      onClick={() => setActiveRoutineKey(route.routeKey)}
                      onKeyDown={(event) =>
                        handleTabKey(event, routines.indexOf(route), routines.length, (nextIndex) =>
                          setActiveRoutineKey(routines[nextIndex].routeKey)
                        )
                      }
                    >
                      <Icon aria-hidden className="h-5 w-5" />
                      <span>{route.label}</span>
                    </button>
                  );
                })}
              </div>

              <div
                key={activeRoutine.routeKey}
                id="about-routine-detail"
                className="about-scroll-route-result"
                role="tabpanel"
                aria-labelledby={`about-routine-tab-${normalizeKey(activeRoutine.routeKey)}`}
              >
                <span className="about-scroll-route-result-icon">
                  <ActiveRouteIcon aria-hidden className="h-6 w-6" />
                </span>
                <div>
                  <h3>{activeRoutine.recommendationTitle}</h3>
                  <p>{activeRoutine.recommendationDescription}</p>
                </div>
              </div>

              <div className="about-scroll-route-links">
                {routeLinks(activeRoutine).map((link, index) => (
                  <Link key={`${activeRoutine.routeKey}-${link.href}`} href={link.href} data-primary={index === 0}>
                    {link.label}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="about-scroll-route-visual">
              <Image
                key={activeRouteMedia.image}
                src={activeRouteMedia.image}
                alt={activeRouteMedia.alt}
                fill
                sizes="(min-width: 861px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="about-scroll-route-wash" />
              <span className="about-scroll-route-word" aria-hidden="true">{activeRoutine.label}</span>
              <div className="about-scroll-route-caption">
                <span>{activeRouteMedia.tone}</span>
                <strong>{activeRoutine.noteText}</strong>
              </div>
              <div className="about-scroll-route-notes">
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
          </article>
        )}

        <article
          id="about-standards"
          data-about-panel
          className="about-scroll-panel about-scroll-panel-standards"
        >
          <div className="about-scroll-standards-copy">
            <h2>What you can expect from {brandName}</h2>
            <p>Useful details should stay visible before checkout, and support should never feel hidden.</p>
            <div className="about-scroll-expect-word" aria-hidden="true">EXPECT</div>
          </div>

          <div className="about-scroll-standards-list">
            {promisePoints.map(({ title, Icon }, index) => (
              <button
                key={title}
                type="button"
                className="about-scroll-standard-row"
                data-active={index === activePromiseIndex}
                aria-expanded={index === activePromiseIndex}
                aria-controls="about-standard-detail"
                onClick={() => setActivePromiseIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden className="h-6 w-6" />
                <strong>{title}</strong>
                <ArrowRight aria-hidden className="h-5 w-5" />
              </button>
            ))}
            <div
              key={activePromise.title}
              id="about-standard-detail"
              className="about-scroll-standard-detail"
              aria-live="polite"
            >
              <span>
                <ActivePromiseIcon aria-hidden className="h-6 w-6" />
              </span>
              <div>
                <h3>{activePromise.title}</h3>
                <p>{activePromise.text}</p>
                <strong>{activePromise.detail}</strong>
              </div>
            </div>
          </div>
        </article>

        {activeCollection && (
          <article
            id="about-next"
            data-about-panel
            className="about-scroll-panel about-scroll-panel-next"
          >
            <div className="about-scroll-next-copy">
              <h2>{collectionSection.title}</h2>
              <p>{collectionSection.subtitle}</p>
              <div className="about-scroll-next-actions">
                <Link href={activeCollection.href} className="about-scroll-action about-scroll-action-primary">
                  Explore {activeCollection.title}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </Link>
                <Link href={collectionSection.viewAllHref} className="about-scroll-action about-scroll-action-quiet">
                  {collectionSection.viewAllLabel}
                </Link>
              </div>
              <div className="about-scroll-support-line">
                <Mail aria-hidden className="h-5 w-5" />
                <p>
                  Need a clearer next step? <a href="mailto:support@luckclaws.com">support@luckclaws.com</a>
                </p>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>

            <div className="about-scroll-collection-frame">
              <div
                id="about-collection-detail"
                className="about-scroll-collection-media"
                role="tabpanel"
                aria-labelledby={`about-collection-tab-${normalizeKey(activeCollection.cardKey)}`}
              >
                <Image
                  key={activeCollection.imageUrl}
                  src={activeCollection.imageUrl}
                  alt={activeCollection.imageAlt}
                  fill
                  sizes="(min-width: 861px) 52vw, 100vw"
                  className="object-cover"
                />
                <div className="about-scroll-collection-wash" />
                <strong>{activeCollection.title}</strong>
              </div>
              <div className="about-scroll-collection-selector" role="tablist" aria-label="Choose a collection">
                {availableCollections.map((collection, index) => (
                  <button
                    key={collection.cardKey}
                    type="button"
                    role="tab"
                    aria-selected={collection.cardKey === activeCollection.cardKey}
                    aria-controls="about-collection-detail"
                    id={`about-collection-tab-${normalizeKey(collection.cardKey)}`}
                    data-active={collection.cardKey === activeCollection.cardKey}
                    onClick={() => setActiveCollectionKey(collection.cardKey)}
                    onKeyDown={(event) =>
                      handleTabKey(event, index, availableCollections.length, (nextIndex) =>
                        setActiveCollectionKey(availableCollections[nextIndex].cardKey)
                      )
                    }
                  >
                    <span>{collection.title}</span>
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
