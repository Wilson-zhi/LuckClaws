"use client";

import { analyticsPreferencesEvent } from "@/lib/analytics-consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(analyticsPreferencesEvent))}
      className="min-h-11 text-left font-semibold text-[#F7E8D0]/78 underline-offset-4 transition hover:text-[#F4B13D] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B13D] md:min-h-0"
    >
      Cookie preferences
    </button>
  );
}
