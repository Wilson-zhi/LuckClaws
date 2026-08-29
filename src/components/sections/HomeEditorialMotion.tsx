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
              ".home-editorial-hero-reveal, .home-editorial-motion-reveal, [data-guide-title-piece], [data-route-title-piece], .home-editorial-guide-intro, .home-editorial-guide-layout, .home-guide-wayfinder, .home-guide-handoff, .home-route-deck-intro, .home-route-deck-stage, .home-route-deck-tab",
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
          const routeStage = routeDeck?.querySelector<HTMLElement>(".home-route-deck-stage");
          const routeTabs = routeDeck
            ? gsap.utils.toArray<HTMLElement>(".home-route-deck-tab", routeDeck)
            : [];

          if (routeDeck && routeDeckHeading) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: routeDeckHeading,
                  start: "top 86%",
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
                { autoAlpha: 0, x: mobile ? 0 : 32, y: mobile ? 18 : 0, duration: 0.55, ease: "power3.out" },
                "-=0.42"
              )
              .from(
                routeStage ? [routeStage] : [],
                {
                  autoAlpha: 0,
                  y: mobile ? 28 : 48,
                  clipPath: "inset(8% 5% 8% 5%)",
                  duration: mobile ? 0.65 : 0.82,
                  ease: "power3.out"
                },
                "-=0.22"
              )
              .from(
                routeTabs,
                { autoAlpha: 0, y: 20, duration: 0.42, stagger: 0.07, ease: "power2.out" },
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

            const storyStage = root.querySelector<HTMLElement>(".home-editorial-story-stage");
            const storyPoster = storyStage?.querySelector<HTMLElement>(".home-editorial-story-poster");
            const storyImage = storyPoster?.querySelector<HTMLElement>("img");
            const storyCopy = storyPoster?.querySelector<HTMLElement>(".home-editorial-story-copy");
            const storyStatus = storyPoster?.querySelector<HTMLElement>(".home-editorial-story-status");

            if (storyStage && storyPoster && storyImage && storyCopy) {
              gsap.set(storyPoster, {
                scale: 0.82,
                y: 72,
                rotationY: -7,
                transformPerspective: 1400,
                transformOrigin: "50% 50%"
              });
              gsap.set(storyImage, { scale: 1.13, transformOrigin: "50% 50%" });
              gsap.set(storyCopy, { autoAlpha: 0, yPercent: 22 });
              if (storyStatus) gsap.set(storyStatus, { autoAlpha: 0, y: 18 });

              const storyTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: storyStage,
                  start: "top top+=112",
                  end: () => `+=${Math.max(window.innerHeight * 1.65, 1200)}`,
                  pin: storyStage,
                  pinSpacing: true,
                  scrub: 0.8,
                  anticipatePin: 1,
                  invalidateOnRefresh: true
                }
              });

              storyTimeline
                .to(
                  storyPoster,
                  {
                    scale: 1,
                    y: 0,
                    rotationY: 0,
                    clipPath: "inset(0% 0% 0% 0% round 0.45rem)",
                    duration: 0.28,
                    ease: "power2.out"
                  },
                  0
                )
                .to(storyImage, { scale: 1, duration: 0.3, ease: "power2.out" }, 0)
                .to(storyCopy, { autoAlpha: 1, yPercent: 0, duration: 0.2, ease: "power2.out" }, 0.12)
                .to(storyStatus ? [storyStatus] : [], { autoAlpha: 1, y: 0, duration: 0.16 }, 0.22)
                .to({}, { duration: 0.3 })
                .to(storyCopy, { autoAlpha: 0, yPercent: -16, duration: 0.18, ease: "power2.in" })
                .to(storyStatus ? [storyStatus] : [], { autoAlpha: 0, y: -16, duration: 0.12 }, "<")
                .to(
                  storyPoster,
                  {
                    autoAlpha: 0.38,
                    xPercent: -18,
                    scale: 0.82,
                    rotationY: 5,
                    duration: 0.22,
                    ease: "power2.in"
                  },
                  "<"
                );
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
