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
              ".home-editorial-hero-reveal, .home-editorial-motion-reveal, .home-editorial-guide-progress span",
              { clearProps: "all" }
            );
            return;
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

            const guideLayout = root.querySelector<HTMLElement>(".home-editorial-guide-layout");
            const guideProgress = guideLayout?.querySelector<HTMLElement>(
              ".home-editorial-guide-progress span"
            );

            if (guideLayout && guideProgress) {
              const guideCount = Math.max(1, Number(guideLayout.dataset.guideCount ?? 1));
              let activeGuideIndex = -1;

              gsap.set(guideProgress, { scaleX: 0, transformOrigin: "left center" });

              gsap.timeline({
                scrollTrigger: {
                  trigger: guideLayout,
                  start: "top top+=112",
                  end: () => `+=${Math.max(window.innerHeight * 1.55, guideCount * 300)}`,
                  pin: true,
                  pinSpacing: true,
                  scrub: 0.45,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    const nextIndex = Math.min(
                      guideCount - 1,
                      Math.floor(self.progress * guideCount)
                    );

                    if (nextIndex !== activeGuideIndex) {
                      activeGuideIndex = nextIndex;
                      window.dispatchEvent(
                        new CustomEvent("home-guide-motion-step", { detail: nextIndex })
                      );
                    }
                  }
                }
              }).to(guideProgress, { scaleX: 1, ease: "none" });
            }

            const productShelf = root.querySelector<HTMLElement>(".home-editorial-product-shelf");
            if (productShelf) {
              gsap.fromTo(
                productShelf,
                { xPercent: 3 },
                {
                  xPercent: -8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: ".home-editorial-product-window",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                  }
                }
              );
            }

            gsap.utils
              .toArray<HTMLElement>(".home-editorial-collection-media img")
              .forEach((image) => {
                gsap.fromTo(
                  image,
                  { yPercent: -7, scale: 1.12 },
                  {
                    yPercent: 7,
                    scale: 1.04,
                    ease: "none",
                    scrollTrigger: {
                      trigger: image.closest(".home-editorial-collection") ?? image,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.8
                    }
                  }
                );
              });

            const storyPoster = root.querySelector<HTMLElement>(".home-editorial-story-poster");
            const storyImage = storyPoster?.querySelector<HTMLElement>("img");
            const storyCopy = storyPoster?.querySelector<HTMLElement>(".home-editorial-story-copy");

            if (storyPoster && storyImage && storyCopy) {
              gsap.set(storyImage, { scale: 1.12, transformOrigin: "50% 50%" });
              gsap.timeline({
                scrollTrigger: {
                  trigger: storyPoster,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9
                }
              })
                .fromTo(
                  storyPoster,
                  { clipPath: "inset(9% 5% 9% 5% round 0.35rem)" },
                  { clipPath: "inset(0% 0% 0% 0% round 0.35rem)", ease: "none" },
                  0
                )
                .to(storyImage, { scale: 1, yPercent: 3, ease: "none" }, 0)
                .fromTo(
                  storyCopy,
                  { autoAlpha: 0.35, yPercent: 18 },
                  { autoAlpha: 1, yPercent: -6, ease: "none" },
                  0.12
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
