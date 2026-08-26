"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Heart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  WISHLIST_FEEDBACK_EVENT,
  type WishlistFeedbackAction
} from "@/components/wishlist/WishlistButton";
import { cn } from "@/lib/utils";

type Feedback = {
  message: string;
  tone: "success" | "error";
  action: WishlistFeedbackAction;
  id: number;
};

export function WishlistFeedback() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleFeedback = (event: Event) => {
      const detail = (event as CustomEvent<Partial<Feedback>>).detail;

      if (!detail || typeof detail.message !== "string") {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const tone = detail.tone === "error" ? "error" : "success";
      const action = detail.action === "removed" || detail.action === "error" ? detail.action : "saved";
      setFeedback({ message: detail.message, tone, action, id: Date.now() });
      timeoutRef.current = setTimeout(() => setFeedback(null), 5000);
    };

    window.addEventListener(WISHLIST_FEEDBACK_EVENT, handleFeedback);

    return () => {
      window.removeEventListener(WISHLIST_FEEDBACK_EVENT, handleFeedback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!mounted || !feedback) {
    return null;
  }

  const presentation =
    feedback.action === "error"
      ? { word: "PAUSE", eyebrow: "Wishlist sync", Icon: CircleAlert }
      : feedback.action === "removed"
        ? { word: "EDIT", eyebrow: "Wishlist updated", Icon: CheckCircle2 }
        : { word: "SAVED", eyebrow: "Keep for later", Icon: Heart };
  const Icon = presentation.Icon;

  return createPortal(
    <div
      key={feedback.id}
      className={cn(
        "wishlist-feedback fixed left-4 right-4 top-[calc(5rem+env(safe-area-inset-top))] z-[90] isolate overflow-hidden rounded-md border px-4 py-4 text-sm font-semibold shadow-lift sm:left-auto sm:right-5 sm:top-20 sm:w-[430px]",
        feedback.tone === "error"
          ? "border-[#E7B49E] bg-[#FFF1EA] text-[#762D19]"
          : feedback.action === "removed"
            ? "border-[#D9BC8C] bg-[#FFF8EA] text-[#2C1A0D]"
            : "border-[#587060] bg-[#2F493D] text-white"
      )}
      data-action={feedback.action}
      role="status"
      aria-live="polite"
    >
      <span className="wishlist-feedback-word" aria-hidden="true">{presentation.word}</span>
      <div className="relative z-10 flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-soft",
            feedback.action === "saved"
              ? "bg-[#FFD78D] text-[#2C1A0D]"
              : feedback.action === "removed"
                ? "bg-[#F1D6A6] text-[#6F4300]"
                : "bg-[#F2C5B2] text-[#762D19]"
          )}
        >
          <Icon aria-hidden className={cn("h-5 w-5", feedback.action === "saved" && "fill-current")} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-65">
            {presentation.eyebrow}
          </p>
          <p className="mt-1 pr-2 leading-5">{feedback.message}</p>
          {feedback.action === "saved" ? (
            <Link
              href="/wishlist"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#FFD78D] underline decoration-[#FFD78D]/45 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD78D]"
            >
              View wishlist
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-current/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          onClick={() => setFeedback(null)}
          aria-label="Dismiss wishlist message"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
