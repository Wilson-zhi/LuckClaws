"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { analyticsPreferencesEvent } from "@/lib/analytics-consent";

const consentStorageKey = "luck-claws-analytics-consent";

type AnalyticsConsentValue = "loading" | "pending" | "granted" | "denied";

function readStoredConsent(): AnalyticsConsentValue {
  const storedValue = window.localStorage.getItem(consentStorageKey);

  if (storedValue === "granted" || storedValue === "denied") {
    return storedValue;
  }

  return "pending";
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<AnalyticsConsentValue>("loading");
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());

    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(analyticsPreferencesEvent, openPreferences);

    return () => window.removeEventListener(analyticsPreferencesEvent, openPreferences);
  }, []);

  const updateConsent = (nextConsent: "granted" | "denied") => {
    const analyticsWasLoaded = consent === "granted";

    window.localStorage.setItem(consentStorageKey, nextConsent);
    setConsent(nextConsent);
    setPreferencesOpen(false);

    if (analyticsWasLoaded && nextConsent === "denied") {
      window.location.reload();
    }
  };

  const showPreferences = consent === "pending" || preferencesOpen;

  return (
    <>
      {consent === "granted" ? (
        <>
          <GoogleAnalytics />
          <MicrosoftClarity />
        </>
      ) : null}

      {showPreferences ? (
        <section
          aria-label="Cookie preferences"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-5xl border border-[#F4D7A5]/35 bg-[#2D1B10] px-5 py-5 text-[#FFF8EF] shadow-[0_24px_70px_rgba(45,27,16,0.34)] sm:inset-x-5 sm:px-6 lg:flex lg:items-center lg:gap-8"
        >
          <div className="flex min-w-0 flex-1 gap-4">
            <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F4B13D] text-[#2D1B10]">
              <ShieldCheck aria-hidden="true" size={21} strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold">Your privacy, your choice</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#F7E8D0]/82">
                Essential storage keeps the store working. Optional analytics help us understand
                site performance and are loaded only when you allow them. Read our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-[#FFD58A] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD58A]"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              {preferencesOpen && consent !== "pending" ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#F4D7A5]">
                  Current setting: {consent === "granted" ? "analytics allowed" : "essential only"}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex shrink-0 flex-col gap-2 sm:flex-row lg:mt-0">
            <button
              type="button"
              onClick={() => updateConsent("denied")}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#F4D7A5]/55 px-5 text-sm font-bold text-[#FFF8EF] transition-[background-color,border-color,color] hover:border-[#FFD58A] hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD58A]"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => updateConsent("granted")}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F4B13D] px-5 text-sm font-bold text-[#2D1B10] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#FFD58A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD58A] motion-reduce:hover:translate-y-0"
            >
              Allow analytics
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
