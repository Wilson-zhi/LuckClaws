"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Check,
  HelpCircle,
  Pause,
  PawPrint,
  Play,
  Route,
  SearchCheck
} from "lucide-react";
import type {
  HomepageDecisionGuideContent,
  HomepageDecisionGuideIconKey
} from "@/lib/homepage-content";

const decisionGuideIconMap = {
  paw: PawPrint,
  route: Route,
  bed: Bed,
  help: HelpCircle,
  search: SearchCheck,
  heart: PawPrint
} as const satisfies Record<
  HomepageDecisionGuideIconKey,
  ComponentType<{ className?: string; "aria-hidden"?: boolean }>
>;

function guideIcon(icon: HomepageDecisionGuideIconKey) {
  return decisionGuideIconMap[icon] ?? PawPrint;
}

const guideAutoAdvanceMs = 5200;

export function HomeDecisionGuide({ guide }: { guide: HomepageDecisionGuideContent }) {
  const guideOptions = guide.options;
  const guideRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeKey, setActiveKey] = useState(guideOptions[0]?.key ?? "");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeOption = useMemo(
    () => guideOptions.find((option) => option.key === activeKey) ?? guideOptions[0],
    [activeKey, guideOptions]
  );
  const activeIndex = Math.max(
    0,
    guideOptions.findIndex((option) => option.key === activeOption?.key)
  );
  const isAutoAdvancing = isPlaying && isInView && !isInteracting;

  const selectIndex = useCallback(
    (index: number, pauseAutoplay = false) => {
      if (guideOptions.length === 0) return;

      const normalizedIndex = (index + guideOptions.length) % guideOptions.length;
      setActiveKey(guideOptions[normalizedIndex].key);
      if (pauseAutoplay) setIsPlaying(false);
    },
    [guideOptions]
  );

  useEffect(() => {
    const element = guideRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (reducedMotion.matches) setIsPlaying(false);
    };

    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);
    return () => reducedMotion.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!isAutoAdvancing || guideOptions.length < 2) return;

    const timeout = window.setTimeout(() => {
      selectIndex(activeIndex + 1);
    }, guideAutoAdvanceMs);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, guideOptions.length, isAutoAdvancing, selectIndex]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = guideOptions.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    const normalizedIndex = (nextIndex + guideOptions.length) % guideOptions.length;
    selectIndex(normalizedIndex, true);
    tabRefs.current[normalizedIndex]?.focus();
  };

  if (!guide.enabled || !activeOption) {
    return null;
  }

  const ActiveIcon = guideIcon(activeOption.icon);
  const normalizedTitle = guide.title.trim();
  const titleCommaIndex = normalizedTitle.indexOf(",");
  const titleLead = titleCommaIndex >= 0
    ? normalizedTitle.slice(0, titleCommaIndex).trim()
    : normalizedTitle;
  const titleAccent = titleCommaIndex >= 0
    ? normalizedTitle.slice(titleCommaIndex + 1).trim()
    : "";
  const titleLeadWords = titleLead.split(/\s+/).filter(Boolean);
  const titlePrimary = titleLeadWords[0] ?? normalizedTitle;
  const titleMiddle = titleLeadWords.slice(1).join(" ");
  const activeStep = guide.steps[activeStepIndex] ?? guide.steps[0];

  return (
    <section id="shop-by-routine" className="home-editorial-guide scroll-mt-24">
      <div className="section-shell">
        <header className="home-editorial-guide-heading">
          <div className="home-editorial-guide-title-block">
            <p className="home-editorial-kicker">{guide.eyebrow}</p>
            <div className="home-editorial-guide-title-art">
              <h2 aria-label={normalizedTitle}>
                <span data-guide-title-piece="primary" aria-hidden="true">
                  {titlePrimary}
                </span>
                {titleMiddle ? (
                  <span data-guide-title-piece="middle" aria-hidden="true">
                    {titleMiddle}{titleCommaIndex >= 0 ? "," : ""}
                  </span>
                ) : null}
                {titleAccent ? (
                  <em data-guide-title-piece="accent" aria-hidden="true">
                    {titleAccent}
                  </em>
                ) : null}
              </h2>
              <span
                className="home-editorial-guide-title-stamp"
                data-guide-title-piece="stamp"
                aria-hidden="true"
              >
                <PawPrint />
                <span>
                  <strong>{guideOptions.length}</strong>
                  <small>routes</small>
                </span>
              </span>
            </div>
          </div>
          <div className="home-editorial-guide-intro">
            <div className="home-editorial-guide-intro-note">
              <span aria-hidden="true">
                <Route />
              </span>
              <div>
                <small>Start here</small>
                <strong>What does today feel like?</strong>
                <p>{guide.subtitle}</p>
              </div>
            </div>
            <div className="home-editorial-guide-routine-tags" aria-label="Available routines">
              {guide.routineTags.slice(0, 4).map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  type="button"
                  data-tone={index}
                  data-active={index === activeIndex}
                  aria-pressed={index === activeIndex}
                  onClick={() => selectIndex(index, true)}
                  onFocus={() => selectIndex(index)}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{tag}</strong>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          ref={guideRef}
          className="home-editorial-guide-layout"
          data-autoplay={isAutoAdvancing}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setIsInteracting(true);
          }}
          onPointerLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false);
          }}
        >
          <div className="home-editorial-guide-media" aria-live={isPlaying ? "off" : "polite"}>
            <div key={activeOption.key} className="home-editorial-guide-media-swap">
              <Image
                src={activeOption.image}
                alt={activeOption.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="home-editorial-guide-media-shade" aria-hidden="true" />
            <p key={`ticket-${activeOption.key}`} className="home-editorial-guide-media-label">
              <span className="home-editorial-guide-ticket-index">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="home-editorial-guide-ticket-copy">
                <small>Routine ticket</small>
                <strong>{activeOption.eyebrow}</strong>
              </span>
              <PawPrint aria-hidden />
            </p>
            <p className="home-editorial-guide-media-note lc-hand-note">
              A shorter route to shop.
            </p>
          </div>

          <div className="home-editorial-guide-panel">
            <div className="home-editorial-guide-panel-heading">
              <div>
                <span>Choose their moment</span>
                <strong>{activeOption.eyebrow}</strong>
              </div>
              <div className="home-editorial-guide-controls">
                <button
                  type="button"
                  aria-label="Previous routine"
                  title="Previous routine"
                  onClick={() => selectIndex(activeIndex - 1, true)}
                >
                  <ArrowLeft aria-hidden />
                </button>
                <span aria-hidden="true">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(guideOptions.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Next routine"
                  title="Next routine"
                  onClick={() => selectIndex(activeIndex + 1, true)}
                >
                  <ArrowRight aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause routine preview" : "Play routine preview"}
                  title={isPlaying ? "Pause routine preview" : "Play routine preview"}
                  data-playback="true"
                  onClick={() => setIsPlaying((current) => !current)}
                >
                  {isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}
                </button>
              </div>
            </div>

            <div className="home-editorial-guide-tabs" role="tablist" aria-label="Shopping routine advisor">
              {guideOptions.map(({ key, label, icon }, index) => {
                const isActive = key === activeOption.key;
                const Icon = guideIcon(icon);
                const shortLabel = guide.routineTags[index] ?? label;

                return (
                  <button
                    key={key}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    id={`routine-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-label={label}
                    aria-selected={isActive}
                    aria-controls="routine-guide-panel"
                    tabIndex={isActive ? 0 : -1}
                    className="group"
                    data-active={isActive}
                    onClick={() => selectIndex(index, true)}
                    onFocus={() => selectIndex(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setActiveKey(key);
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden className="h-5 w-5" />
                    <strong>{shortLabel}</strong>
                  </button>
                );
              })}
            </div>

            <article
              key={activeOption.key}
              id="routine-guide-panel"
              role="tabpanel"
              aria-labelledby={`routine-tab-${activeOption.key}`}
              aria-live={isPlaying ? "off" : "polite"}
              className="home-editorial-guide-result"
            >
              <div className="home-editorial-guide-result-copy">
                <p className="home-editorial-guide-result-kicker">
                  <ActiveIcon aria-hidden />
                  <span>{activeOption.eyebrow}</span>
                </p>
                <h3>{activeOption.title}</h3>
                <p>{activeOption.description}</p>
              </div>
              <div className="home-editorial-guide-result-actions">
                <span>Best for</span>
                <ul>
                  {activeOption.details.slice(0, 2).map((detail) => (
                    <li key={detail}>
                      <Check aria-hidden />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="home-editorial-guide-result-links">
                  {activeOption.links.slice(0, 2).map((link, index) => (
                    <Link key={link.href} href={link.href} data-primary={index === 0} className="group">
                      <span>{link.label}</span>
                      <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <div className="home-editorial-guide-timeline" aria-hidden="true">
              <span>
                <i key={activeOption.key} data-running={isAutoAdvancing} />
              </span>
              <small>{isPlaying ? "AUTO" : "PAUSED"}</small>
            </div>
          </div>
        </div>

        {activeStep ? (
          <div className="home-editorial-guide-steps" aria-label={guide.stepsTitle}>
            <header>
              <span className="home-editorial-guide-steps-count" aria-hidden="true">
                <strong>{guide.steps.length}</strong>
                <small>moves</small>
              </span>
              <div>
                <span>{guide.stepsBadge}</span>
                <strong>{guide.stepsTitle}</strong>
                <em className="lc-hand-note">Pick. Match. Go.</em>
              </div>
            </header>
            <div className="home-editorial-guide-step-journey">
              <ol>
                {guide.steps.map((step, index) => {
                  const isActive = index === activeStepIndex;

                  return (
                    <li key={step.number} data-active={isActive} data-step={step.number}>
                      <button
                        type="button"
                        aria-current={isActive ? "step" : undefined}
                        aria-controls="routine-step-detail"
                        onClick={() => setActiveStepIndex(index)}
                        onFocus={() => setActiveStepIndex(index)}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setActiveStepIndex(index);
                        }}
                      >
                        <span className="home-editorial-guide-step-marker" aria-hidden="true">
                          <PawPrint />
                        </span>
                        <small>Step {step.number}</small>
                        <strong>{step.title}</strong>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <article key={activeStep.number} id="routine-step-detail">
                <span className="home-editorial-guide-step-position">
                  <small>Now following</small>
                  <strong>
                    {activeStep.number} / {String(guide.steps.length).padStart(2, "0")}
                  </strong>
                </span>
                <strong>{activeStep.title}</strong>
                <p>{activeStep.text}</p>
              </article>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
