"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type PreviewSubmitButtonProps = {
  children: React.ReactNode;
  message?: string;
  className?: string;
};

export function PreviewSubmitButton({
  children,
  message = "This form is for preview only and will be connected later.",
  className
}: PreviewSubmitButtonProps) {
  const [status, setStatus] = useState("");

  return (
    <div>
      <button
        type="button"
        className={cn(
          "inline-flex justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]",
          className
        )}
        onClick={() => setStatus(message)}
      >
        {children}
      </button>
      {status && (
        <p className="mt-3 text-sm leading-6 text-on-surface-variant" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
