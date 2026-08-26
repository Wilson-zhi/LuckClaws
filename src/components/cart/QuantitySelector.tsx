"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
};

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max,
  disabled = false,
  label = "Quantity"
}: QuantitySelectorProps) {
  const decreaseDisabled = disabled || quantity <= min;
  const increaseDisabled = disabled || (max !== undefined && quantity >= max);

  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-lowest">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={decreaseDisabled}
        aria-label={`Decrease ${label}`}
      >
        <Minus aria-hidden className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold text-on-surface" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        onClick={() => onChange(max === undefined ? quantity + 1 : Math.min(max, quantity + 1))}
        disabled={increaseDisabled}
        aria-label={`Increase ${label}`}
      >
        <Plus aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
