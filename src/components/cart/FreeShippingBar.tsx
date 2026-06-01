"use client";

import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

export function FreeShippingBar({ compact = false }: { compact?: boolean }) {
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);
  const message =
    totals.remainingForFreeShipping > 0
      ? `Only ${formatPrice(totals.remainingForFreeShipping)} away from free shipping!`
      : "You've unlocked free shipping!";

  return (
    <div
      className={
        compact
          ? "rounded-md bg-surface-container-low p-4"
          : "bg-primary py-3 text-center text-inverse-on-surface"
      }
    >
      <div className={compact ? "" : "section-shell"}>
        <div className="flex items-center justify-center gap-3 text-sm font-semibold md:text-base">
          <span>{message}</span>
          <Truck aria-hidden className="h-5 w-5 text-primary-container" />
        </div>
        <div className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-primary-container transition-all"
            style={{ width: `${totals.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

