"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WISHLIST_FEEDBACK_EVENT } from "@/components/wishlist/WishlistButton";
import { cn } from "@/lib/utils";

type Feedback = {
  message: string;
  tone: "success" | "error";
};

export function WishlistFeedback() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<Feedback>;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setFeedback(customEvent.detail);
      timeoutRef.current = setTimeout(() => setFeedback(null), 3200);
    };

    window.addEventListener(WISHLIST_FEEDBACK_EVENT, handleFeedback);

    return () => {
      window.removeEventListener(WISHLIST_FEEDBACK_EVENT, handleFeedback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!feedback) {
    return null;
  }

  const Icon = feedback.tone === "error" ? CircleAlert : CheckCircle2;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-[90] flex w-[min(92vw,430px)] -translate-x-1/2 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold shadow-lift",
        feedback.tone === "error"
          ? "bg-[#FFF1EA] text-[#8A2F16]"
          : "bg-[#24170E] text-white"
      )}
      role="status"
      aria-live="polite"
    >
      <Icon aria-hidden className="h-5 w-5 shrink-0" />
      <span className="min-w-0 flex-1 leading-5">{feedback.message}</span>
      <button
        type="button"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        onClick={() => setFeedback(null)}
        aria-label="Dismiss wishlist message"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
