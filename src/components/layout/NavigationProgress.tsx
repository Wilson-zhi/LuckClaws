"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ProgressPhase = "idle" | "loading" | "complete";

export function NavigationProgress() {
  const pathname = usePathname();
  const initialRender = useRef(true);
  const [phase, setPhase] = useState<ProgressPhase>("idle");

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setPhase("complete");
    const hideTimer = window.setTimeout(() => setPhase("idle"), 240);
    return () => window.clearTimeout(hideTimer);
  }, [pathname]);

  useEffect(() => {
    const handleNavigationStart = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;

      if (!target || target.target === "_blank" || target.hasAttribute("download")) {
        return;
      }

      const href = target.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const destination = new URL(target.href, window.location.href);
      const current = new URL(window.location.href);

      if (
        destination.origin !== current.origin ||
        `${destination.pathname}${destination.search}` === `${current.pathname}${current.search}`
      ) {
        return;
      }

      setPhase("loading");
    };

    const handleHistoryNavigation = () => setPhase("loading");
    document.addEventListener("click", handleNavigationStart, true);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      document.removeEventListener("click", handleNavigationStart, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      setPhase("complete");
      window.setTimeout(() => setPhase("idle"), 240);
    }, 8000);

    return () => window.clearTimeout(fallbackTimer);
  }, [phase]);

  return (
    <div className="route-progress" data-phase={phase} aria-hidden>
      <span className="route-progress__bar" />
    </div>
  );
}
