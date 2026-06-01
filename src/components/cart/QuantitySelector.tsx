"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  label?: string;
};

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  label = "Quantity"
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-lowest">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-on-surface-variant transition hover:bg-surface-container"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        aria-label={`Decrease ${label}`}
      >
        <Minus aria-hidden className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-on-surface-variant transition hover:bg-surface-container"
        onClick={() => onChange(quantity + 1)}
        aria-label={`Increase ${label}`}
      >
        <Plus aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}

