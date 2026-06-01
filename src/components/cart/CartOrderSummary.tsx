"use client";

import Link from "next/link";
import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

export function CartOrderSummary() {
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);

  return (
    <aside className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-8">
      <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
      <div className="mt-7 flex gap-3">
        <label htmlFor="cart-discount" className="sr-only">
          Discount code
        </label>
        <input
          id="cart-discount"
          placeholder="Discount code"
          className="min-h-12 flex-1 rounded-full border-outline-variant bg-surface-container-low px-5 focus:border-primary focus:ring-primary"
        />
        <button type="button" className="rounded-full bg-surface-container-high px-6 font-semibold">
          Apply
        </button>
      </div>
      <div className="mt-7 space-y-4 border-b border-outline-variant pb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-heading text-2xl font-bold">Estimated Total</span>
        <span className="font-heading text-3xl font-bold text-primary">{formatPrice(totals.total)}</span>
      </div>
      <Link
        href="/checkout/information"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-4 font-heading text-lg font-bold text-on-primary-container transition hover:bg-[#e08f00]"
      >
        Proceed to Checkout
        <Lock aria-hidden className="h-5 w-5" />
      </Link>

      <div className="mt-8 space-y-5 text-sm">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <ShieldCheck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Secure Checkout</p>
            <p className="text-on-surface-variant">256-bit encryption</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <RotateCcw aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">30-Day Easy Returns</p>
            <p className="text-on-surface-variant">Hassle-free guarantee</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <Truck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Free Shipping</p>
            <p className="text-on-surface-variant">On orders over $50</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

