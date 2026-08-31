"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type HomeEditorialMotionProps = {
  children: ReactNode;
};

export function HomeEditorialMotion({ children }: HomeEditorialMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const motion = gsap.matchMedia();

      motion.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduceMotion: "(prefers-reduced-motion: reduce)"
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set(
              ".home-editorial-hero-reveal, .home-editorial-motion-reveal, [data-guide-title-piece], [data-route-title-piece], [data-promise-title-piece], .home-editorial-guide-intro, .home-editorial-guide-layout, .home-guide-wayfinder, .home-guide-handoff, .home-route-deck-intro, .home-route-deck-stage, .home-route-deck-tab, .home-route-story-bridge, .home-editorial-story-poster, .home-editorial-story-principles, .home-story-promise-handoff, .home-editorial-promises header, .home-promise-board",
              { clearProps: "all" }
            );
            return;
          }

          const guide = root.querySelector<HTMLElement>(".home-editorial-guide");
          const guideHeading = guide?.querySelector<HTMLElement>(".home-editorial-guide-heading");
          const guideTitlePieces = guide
            ? gsap.utils.toArray<HTMLElement>("[data-guide-title-piece]", guide)
            : [];
          const guideKicker = guide?.querySelector<HTMLElement>(".home-editorial-guide-title-block > p");
          const guideIntro = guide?.querySelector<HTMLElement>(".home-editorial-guide-intro-note");
          const guideTags = guide
            ? gsap.utils.toArray<HTMLElement>(".home-editorial-guide-routine-tags button", guide)
            : [];
          const guideLayout = guide?.querySelector<HTMLElement>(".home-editorial-guide-layout");

          if (guideHeading && guideTitlePieces.length > 0) {
            const guideIntroTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: guideHeading,
                start: "top 84%",
                once: true
              }
            });

            guideIntroTimeline
              .from(guideKicker ? [guideKicker] : [], {
                y: 16,
                duration: 0.42,
                ease: "power2.out"
              })
              .from(
                guideTitlePieces,
                {
                  y: (index) => (index === guideTitlePieces.length - 1 ? 10 : 30),
                  rotation: (index) => [-7, 5, -4, 12][index] ?? 0,
                  scale: (index) => (index === guideTitlePieces.length - 1 ? 0.72 : 0.94),
                  duration: mobile ? 0.55 : 0.72,
                  stagger: 0.1,
                  ease: "back.out(1.5)"
                },
                "-=0.18"
              )
              .from(
                guideIntro ? [guideIntro] : [],
                { y: 22, duration: 0.55, ease: "power3.out" },
                "-=0.5"
              )
              .from(
                guideTags,
                {
                  y: 12,
                  rotation: (index) => (index % 2 === 0 ? -5 : 5),
                  duration: 0.38,
                  stagger: 0.07,
                  ease: "back.out(1.7)"
                },
                "-=0.32"
              )
              .from(
                guideLayout ? [guideLayout] : [],
                {
                  y: mobile ? 28 : 52,
                  scale: desktop ? 0.985 : 1,
                  duration: mobile ? 0.68 : 0.9,
                  ease: "power3.out"
                },
                "-=0.18"
              );
          }

          const guideSteps = guide?.querySelector<HTMLElement>(".home-guide-wayfinder");
          const guideStepHeader = guideSteps?.querySelector<HTMLElement>("header");
          const guideStepButtons = guideSteps
            ? gsap.utils.toArray<HTMLElement>(".home-guide-wayfinder-track li", guideSteps)
            : [];
          const guideStepDetail = guideSteps?.querySelector<HTMLElement>(
            ".home-guide-wayfinder-track > article"
          );

          if (guideSteps) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: guideSteps,
                  start: "top 88%",
                  once: true
                }
              })
              .from(guideStepHeader ? [guideStepHeader] : [], {
                x: -22,
                duration: 0.5,
                ease: "power3.out"
              })
              .from(
                guideStepButtons,
                {
                  y: 24,
                  duration: 0.48,
                  stagger: 0.1,
                  ease: "back.out(1.35)"
                },
                "-=0.28"
              )
              .from(
                guideStepDetail ? [guideStepDetail] : [],
                {
                  x: mobile ? 0 : 28,
                  y: mobile ? 18 : 0,
                  duration: 0.52,
                  ease: "power3.out"
                },
                "-=0.28"
              );
          }

          const handoff = guide?.querySelector<HTMLElement>(".home-guide-handoff");
          const handoffCopy = handoff?.querySelector<HTMLElement>(".home-guide-handoff-copy");
          const handoffTrack = handoff?.querySelector<HTMLElement>(".home-guide-handoff-track");
          const handoffRail = handoff?.querySelector<HTMLElement>(".home-guide-handoff-rail i");
          const handoffTicket = handoff?.querySelector<HTMLElement>(".home-guide-handoff-ticket");
          const handoffPaws = handoff
            ? gsap.utils.toArray<SVGElement>(".home-guide-handoff-paws svg", handoff)
            : [];
          const handoffDestination = handoff?.querySelector<HTMLElement>(
            ".home-guide-handoff-destination"
          );

          if (handoff && handoffTrack && handoffRail && handoffTicket && handoffDestination) {
            gsap.from(handoffCopy ? [handoffCopy] : [], {
              autoAlpha: 0,
              x: -20,
              duration: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: handoff,
                start: "top 90%",
                once: true
              }
            });

            const travelDistance = () =>
              Math.max(
                0,
                handoffTrack.clientWidth -
                  handoffTicket.offsetWidth -
                  handoffDestination.offsetWidth -
                  (mobile ? 12 : 28)
              );

            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: handoff,
                  start: "top 92%",
                  end: "bottom 52%",
                  scrub: 0.65,
                  invalidateOnRefresh: true
                }
              })
              .fromTo(handoffRail, { scaleX: 0 }, { scaleX: 1 }, 0)
              .fromTo(
                handoffTicket,
                { x: 0, rotation: -4 },
                { x: travelDistance, rotation: 3 },
                0
              )
              .fromTo(
                handoffPaws,
                { autoAlpha: 0.16, scale: 0.72 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: "power2.out"
                },
                0.08
              )
              .fromTo(
                handoffDestination,
                { scale: 0.94, rotation: 0 },
                { scale: 1.03, rotation: -1, duration: 0.24, ease: "back.out(1.5)" },
                0.68
              );
          }

          const routeDeck = root.querySelector<HTMLElement>(".home-route-deck");
          const routeDeckHeading = routeDeck?.querySelector<HTMLElement>(".home-route-deck-heading");
          const routeTitlePieces = routeDeck
            ? gsap.utils.toArray<HTMLElement>("[data-route-title-piece]", routeDeck)
            : [];
          const routeIntro = routeDeck?.querySelector<HTMLElement>(".home-route-deck-intro");
          const routeIntroStops = routeDeck
            ? gsap.utils.toArray<HTMLElement>(".home-route-deck-intro-track > span", routeDeck)
            : [];
          const routeStage = routeDeck?.querySelector<HTMLElement>(".home-route-deck-stage");
          const routeTabs = routeDeck
            ? gsap.utils.toArray<HTMLElement>(".home-route-deck-tab", routeDeck)
            : [];

          if (routeDeck && routeDeckHeading) {
            gsap
              .timeline({
                  scrollTrigger: {
                    trigger: routeDeckHeading,
                    start: "top bottom+=16%",
                    once: true
                  }
              })
              .from(routeTitlePieces, {
                y: 26,
                rotation: (index) => [-4, 3, 8][index] ?? 0,
                scale: 0.94,
                duration: 0.68,
                stagger: 0.1,
                ease: "back.out(1.45)"
              })
              .from(
                routeIntro ? [routeIntro] : [],
                { x: mobile ? 0 : 28, y: mobile ? 16 : 0, rotation: desktop ? 1.2 : 0, duration: 0.55, ease: "power3.out" },
                "-=0.42"
              )
              .from(
                routeIntroStops,
                { y: 10, stagger: 0.07, duration: 0.34, ease: "back.out(1.35)" },
                "-=0.28"
              )
              .from(
                routeStage ? [routeStage] : [],
                {
                  y: mobile ? 28 : 48,
                  clipPath: "inset(6% 3% 7% 3% round 0.5rem)",
                  duration: mobile ? 0.65 : 0.82,
                  ease: "power3.out"
                },
                "-=0.2"
              )
              .from(
                routeTabs,
                { y: 18, duration: 0.4, stagger: 0.065, ease: "power2.out" },
                "-=0.34"
              );
          }

          const revealTargets = gsap.utils.toArray<HTMLElement>(
            ".home-editorial-motion-reveal"
          );

          revealTargets.forEach((element) => {
            gsap.from(element, {
              autoAlpha: 0,
              y: mobile ? 26 : 48,
              duration: mobile ? 0.72 : 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true
              }
            });
          });

          const routeStoryBridge = root.querySelector<HTMLElement>(".home-route-story-bridge");
          const routeStoryLine = routeStoryBridge?.querySelector<HTMLElement>(".home-route-story-line i");
          const routeStoryTicket = routeStoryBridge?.querySelector<HTMLElement>(".home-route-story-ticket");
          const routeStoryPaws = routeStoryBridge
            ? gsap.utils.toArray<SVGElement>(".home-route-story-paws svg", routeStoryBridge)
            : [];
          const routeStoryDestination = routeStoryBridge?.querySelector<HTMLElement>(
            ".home-route-story-destination"
          );
          const story = root.querySelector<HTMLElement>(".home-editorial-story");
          const storyStage = story?.querySelector<HTMLElement>(".home-editorial-story-stage");
          const storyPoster = storyStage?.querySelector<HTMLElement>(".home-editorial-story-poster");
          const storyMedia = storyPoster?.querySelector<HTMLElement>(".home-editorial-story-media");
          const storyImage = storyMedia?.querySelector<HTMLElement>("img");
          const storyCopy = storyPoster?.querySelector<HTMLElement>(".home-editorial-story-copy");
          const storySeal = storyCopy?.querySelector<HTMLElement>(".home-editorial-story-seal");
          const storyStatus = storyMedia?.querySelector<HTMLElement>(".home-editorial-story-status");

          if (desktop && storyPoster && storyImage && storyCopy) {
            gsap.set(storyPoster, {
              scale: 0.9,
              y: 96,
              rotationY: -5,
              clipPath: "inset(2% 1% 2% 1% round 1.1rem)",
              transformPerspective: 1400,
              transformOrigin: "50% 50%"
            });
            gsap.set(storyImage, { scale: 1.11, transformOrigin: "50% 50%" });
            gsap.set(storyCopy, { autoAlpha: 0, yPercent: 14 });
            gsap.set(storySeal ? [storySeal] : [], { rotation: 18, scale: 0.72 });
            if (storyStatus) gsap.set(storyStatus, { autoAlpha: 0, y: 18 });
          }

          if (routeStoryBridge && routeStoryLine && routeStoryTicket && routeStoryDestination) {
            const routeStoryTimeline = gsap
              .timeline({
                scrollTrigger: {
                  trigger: routeStoryBridge,
                  start: desktop ? "top 96%" : "top 92%",
                  endTrigger: desktop && storyStage ? storyStage : routeStoryBridge,
                  end: desktop && storyStage ? "top 80%" : "bottom 58%",
                  scrub: mobile ? 0.35 : 0.55,
                  invalidateOnRefresh: true
                }
              })
              .fromTo(
                routeStoryLine,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.52, ease: "none" },
                0
              )
              .fromTo(
                routeStoryTicket,
                { x: mobile ? -4 : -18, y: 16, rotation: -7 },
                { x: 0, y: 0, rotation: -2, duration: 0.42, ease: "power2.out" },
                0
              )
              .fromTo(
                routeStoryPaws,
                { autoAlpha: 0, y: 14, scale: 0.55, rotation: -24 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  rotation: (index) => [-14, 12, -8][index] ?? 0,
                  duration: 0.32,
                  stagger: 0.08,
                  ease: "back.out(1.6)"
                },
                0.06
              )
              .fromTo(
                routeStoryDestination,
                { x: mobile ? 4 : 18, y: 12, scale: 0.88, rotation: 7 },
                { x: 0, y: 0, scale: 1, rotation: 2, duration: 0.38, ease: "back.out(1.45)" },
                0.28
              );

            if (desktop && storyPoster && storyImage && storyCopy) {
              routeStoryTimeline
                .to(
                  storyPoster,
                  {
                    scale: 1,
                    y: 0,
                    rotationY: 0,
                    clipPath: "inset(0% 0% 0% 0% round 0.5rem)",
                    duration: 0.72,
                    ease: "power2.out"
                  },
                  0.18
                )
                .to(storyImage, { scale: 1, duration: 0.75, ease: "power2.out" }, 0.2)
                .to(
                  storyCopy,
                  { autoAlpha: 1, yPercent: 0, duration: 0.42, ease: "power2.out" },
                  0.24
                )
                .to(
                  storySeal ? [storySeal] : [],
                  { rotation: -6, scale: 1, duration: 0.3, ease: "back.out(1.4)" },
                  0.36
                )
                .to(
                  storyStatus ? [storyStatus] : [],
                  { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" },
                  0.4
                );
            }
          }

          if (storyStage && storyPoster && storyMedia && storyImage && storyCopy) {
            if (desktop) {
              const storyTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: storyStage,
                  start: "top top+=112",
                  end: () => `+=${Math.max(window.innerHeight * 1.05, 860)}`,
                  pin: storyStage,
                  pinSpacing: true,
                  scrub: 0.75,
                  anticipatePin: 1,
                  invalidateOnRefresh: true
                }
              });

              storyTimeline
                .to(
                  storyImage,
                  { scale: 1.035, duration: 0.22, ease: "none" },
                  0
                )
                .to(
                  storySeal ? [storySeal] : [],
                  { rotation: -3, scale: 1.03, duration: 0.2, ease: "sine.inOut" },
                  0
                )
                .to(storyCopy, { yPercent: -1.5, duration: 0.22, ease: "none" }, 0)
                .to({}, { duration: 0.38 })
                .to(storyCopy, { autoAlpha: 0.18, yPercent: -12, duration: 0.18, ease: "power2.in" })
                .to(storyStatus ? [storyStatus] : [], { autoAlpha: 0, y: -12, duration: 0.12 }, "<")
                .to(
                  storyPoster,
                  {
                    autoAlpha: 0.52,
                    xPercent: -6,
                    scale: 0.9,
                    rotationY: 3,
                    duration: 0.22,
                    ease: "power2.in"
                  },
                  "<"
                );
            } else {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: storyStage,
                    start: "top bottom+=18%",
                    once: true
                  }
                })
                .from(storyPoster, {
                  clipPath: "inset(3% 2% 3% 2% round 1rem)",
                  y: 30,
                  duration: 0.62,
                  ease: "power3.out"
                })
                .from(storyImage, { scale: 1.08, duration: 1.05, ease: "power2.out" }, 0.05)
                .from(
                  storyCopy,
                  { autoAlpha: 0, y: 24, duration: 0.66, ease: "power3.out" },
                  0.18
                )
                .from(
                  storySeal ? [storySeal] : [],
                  { rotation: 18, scale: 0.72, duration: 0.5, ease: "back.out(1.45)" },
                  0.42
                )
                .from(
                  storyStatus ? [storyStatus] : [],
                  { autoAlpha: 0, y: -16, duration: 0.42, ease: "power2.out" },
                  0.48
                );
            }
          }

          const storyPrinciples = story?.querySelector<HTMLElement>(".home-editorial-story-principles");
          const storyPrinciplesHeading = storyPrinciples?.querySelector<HTMLElement>(
            ".home-story-principles-heading"
          );
          const storyPrincipleButtons = storyPrinciples
            ? gsap.utils.toArray<HTMLElement>(".home-story-principle-tabs button", storyPrinciples)
            : [];
          const storyPrinciplePanel = storyPrinciples?.querySelector<HTMLElement>(
            ".home-story-principle-panel"
          );

          if (storyPrinciples) {
            gsap
              .timeline({
                  scrollTrigger: {
                    trigger: storyPrinciples,
                    start: "top bottom+=18%",
                    once: true
                  }
                })
              .from(storyPrinciplesHeading ? [storyPrinciplesHeading] : [], {
                y: 24,
                duration: 0.5,
                ease: "power3.out"
              })
              .from(
                storyPrincipleButtons,
                { x: mobile ? 0 : -18, y: mobile ? 14 : 0, stagger: 0.08, duration: 0.44, ease: "power3.out" },
                "-=0.2"
              )
              .from(
                storyPrinciplePanel ? [storyPrinciplePanel] : [],
                { clipPath: "inset(0 0 10% 0 round 0.45rem)", x: desktop ? 26 : 0, y: mobile ? 16 : 0, duration: 0.56, ease: "power3.out" },
                "-=0.28"
              );
          }

          const storyPromiseHandoff = story?.querySelector<HTMLElement>(".home-story-promise-handoff");
          const storyPromiseLine = storyPromiseHandoff?.querySelector<HTMLElement>("i");
          const storyPromiseArrow = storyPromiseHandoff?.querySelector<HTMLElement>(
            ".home-story-promise-arrow"
          );

          if (storyPromiseHandoff && storyPromiseLine) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: storyPromiseHandoff,
                  start: "top 90%",
                  end: "bottom 64%",
                  scrub: mobile ? 0.3 : 0.55
                }
              })
              .from(storyPromiseHandoff, { autoAlpha: 0, y: 24, ease: "power2.out" }, 0)
              .fromTo(storyPromiseLine, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0.08)
              .from(
                storyPromiseArrow ? [storyPromiseArrow] : [],
                { y: -18, rotation: -16, scale: 0.82, ease: "back.out(1.4)" },
                0.55
              );
          }

          const promises = root.querySelector<HTMLElement>(".home-editorial-promises");
          const promiseHeader = promises?.querySelector<HTMLElement>("header");
          const promiseTitlePieces = promises
            ? gsap.utils.toArray<HTMLElement>("[data-promise-title-piece]", promises)
            : [];
          const promiseHeaderNote = promises?.querySelector<HTMLElement>(".home-promise-header-note");
          const promiseBoard = promises?.querySelector<HTMLElement>(".home-promise-board");
          const promiseButtons = promiseBoard
            ? gsap.utils.toArray<HTMLElement>(".home-editorial-promise-list button", promiseBoard)
            : [];
          const promiseShowcase = promiseBoard?.querySelector<HTMLElement>(
            ".home-editorial-promise-showcase"
          );

          if (promises && promiseHeader && promiseBoard) {
            gsap
              .timeline({
                  scrollTrigger: {
                    trigger: promises,
                    start: "top bottom+=18%",
                    once: true
                  }
              })
              .from(promiseTitlePieces, {
                y: 30,
                rotation: (index) => (index === 0 ? -3 : 2),
                duration: 0.68,
                stagger: 0.1,
                ease: "back.out(1.35)"
              })
              .from(
                promiseHeaderNote ? [promiseHeaderNote] : [],
                { x: desktop ? 24 : 0, y: mobile ? 16 : 0, duration: 0.48, ease: "power3.out" },
                "-=0.36"
              )
              .from(
                promiseBoard,
                { y: 32, clipPath: "inset(4% 2% 5% 2% round 0.7rem)", duration: 0.68, ease: "power3.out" },
                "-=0.15"
              )
              .from(
                promiseButtons,
                { y: 14, duration: 0.36, stagger: 0.055, ease: "power2.out" },
                "-=0.4"
              )
              .from(
                promiseShowcase ? [promiseShowcase] : [],
                { clipPath: "inset(0 0 10% 0)", x: desktop ? 22 : 0, duration: 0.48, ease: "power3.out" },
                "-=0.34"
              );
          }

          const newsletter = root.querySelector<HTMLElement>(".home-editorial-newsletter");
          const newsletterCopy = newsletter?.querySelector<HTMLElement>(".home-editorial-newsletter-copy");
          const newsletterPostcard = newsletter?.querySelector<HTMLElement>(
            ".home-editorial-newsletter-postcard"
          );
          const newsletterRouteStops = newsletter
            ? gsap.utils.toArray<HTMLElement>(".home-editorial-newsletter-route > span", newsletter)
            : [];
          const newsletterStamp = newsletter?.querySelector<HTMLElement>(".home-editorial-newsletter-stamp");

          if (newsletter && newsletterCopy && newsletterPostcard) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: newsletter,
                  start: "top bottom+=16%",
                  once: true
                }
              })
              .from(newsletterCopy, {
                x: desktop ? -28 : 0,
                y: mobile ? 18 : 0,
                duration: 0.62,
                ease: "power3.out"
              })
              .from(
                newsletterPostcard,
                {
                  clipPath: "inset(5% 3% 5% 3% round 0.75rem)",
                  x: desktop ? 32 : 0,
                  y: mobile ? 22 : 0,
                  rotation: desktop ? 1.6 : 0.5,
                  duration: 0.72,
                  ease: "power3.out"
                },
                "-=0.44"
              )
              .from(
                newsletterRouteStops,
                { y: 10, stagger: 0.08, duration: 0.36, ease: "back.out(1.35)" },
                "-=0.28"
              )
              .from(
                newsletterStamp ? [newsletterStamp] : [],
                { scale: 0.76, rotation: 14, duration: 0.42, ease: "back.out(1.5)" },
                "-=0.24"
              );
          }

          if (desktop) {
            const hero = root.querySelector<HTMLElement>(".home-editorial-hero");
            const heroStage = hero?.querySelector<HTMLElement>(".home-editorial-hero-stage");
            const heroMedia = hero?.querySelector<HTMLElement>(".home-editorial-hero-media");
            const heroVisual = heroMedia?.querySelector<HTMLElement>("img, video");
            const heroCopy = hero?.querySelector<HTMLElement>(".home-editorial-hero-copy");
            const heroPicks = hero?.querySelector<HTMLElement>(".home-editorial-hero-picks");
            const heroTrust = hero?.querySelector<HTMLElement>(".home-editorial-hero-trust");
            const heroReveal = hero?.querySelector<HTMLElement>(".home-editorial-hero-reveal");
            const heroScroll = hero?.querySelector<HTMLElement>(".home-editorial-hero-scroll");
            const heroWash = hero?.querySelector<HTMLElement>(".home-editorial-hero-wash");

            if (hero && heroStage && heroMedia && heroCopy && heroReveal && heroWash) {
              const heroVisualTargets = heroVisual ? [heroVisual] : [];
              const heroPickTargets = heroPicks ? [heroPicks] : [];
              const heroTrustTargets = heroTrust ? [heroTrust] : [];
              const heroScrollTargets = heroScroll ? [heroScroll] : [];

              gsap.set(heroVisualTargets, { scale: 1.08, transformOrigin: "50% 50%" });
              gsap.set(heroReveal, { autoAlpha: 0, y: 48 });
              gsap.set(heroWash, { autoAlpha: 1, yPercent: 102 });

              const heroTimeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: hero,
                  start: "top top+=86",
                  end: () => `+=${Math.max(1, hero.offsetHeight - heroStage.offsetHeight)}`,
                  scrub: 0.8,
                  invalidateOnRefresh: true
                }
              });

              heroTimeline
                .to(
                  heroMedia,
                  {
                    clipPath: "inset(0% 0% 0% 0% round 0rem)"
                  },
                  0
                )
                .to(heroVisualTargets, { scale: 1 }, 0)
                .to(heroCopy, { autoAlpha: 0, yPercent: -18 }, 0.08)
                .to(heroPickTargets, { autoAlpha: 0, y: 54 }, 0.1)
                .to(heroTrustTargets, { autoAlpha: 0, y: -18 }, 0.14)
                .to(heroScrollTargets, { autoAlpha: 0 }, 0.12)
                .to(heroReveal, { autoAlpha: 1, y: 0, duration: 0.24 }, 0.5)
                .to(heroReveal, { y: -18, duration: 0.26 }, 0.72)
                .to(heroWash, { yPercent: 0, duration: 0.16 }, 0.84);
            }

          }
        }
      );

      return () => motion.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="home-editorial-motion-root">
      {children}
    </div>
  );
}
