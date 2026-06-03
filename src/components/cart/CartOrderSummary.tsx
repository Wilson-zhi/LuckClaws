"use client";

import Link from "next/link";
import { Lock, Mail, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { trackBeginCheckout } from "@/lib/ga4-ecommerce";
import { freeShippingLabel, shortStandardShippingSentence, standardShippingSentence } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

export function CartOrderSummary() {
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);
  const hasItems = items.length > 0;

  return (
    <aside className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-8">
      <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Review your items before continuing to checkout.
      </p>
      <div className="mt-7 space-y-4 border-b border-outline-variant pb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated shipping</span>
          <span>{totals.hasFreeShipping ? "Free" : formatPrice(totals.estimatedShipping)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>Calculated at checkout</span>
        </div>
        <p className="text-sm text-on-surface-variant">
          {standardShippingSentence} Shipping may vary by item size or product type.
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-heading text-2xl font-bold">Estimated Total</span>
        <span className="font-heading text-3xl font-bold text-primary">{formatPrice(totals.total)}</span>
      </div>
      {hasItems ? (
        <Link
          href="/checkout/information"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-4 font-heading text-lg font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          onClick={() => trackBeginCheckout(items)}
        >
          Proceed to Checkout
          <Lock aria-hidden className="h-5 w-5" />
        </Link>
      ) : (
        <button
          type="button"
          className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-surface-container-high px-6 py-4 font-heading text-lg font-bold text-on-surface-variant"
          disabled
        >
          Proceed to Checkout
          <Lock aria-hidden className="h-5 w-5" />
        </button>
      )}
      <Link
        href="/collections"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-outline-variant px-6 py-3 font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary"
      >
        Continue Shopping
      </Link>

      <div className="mt-8 space-y-5 text-sm">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <ShieldCheck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Secure checkout</p>
            <p className="text-on-surface-variant">Protected checkout flow</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <RotateCcw aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Damaged or incorrect items covered</p>
            <p className="text-on-surface-variant">Contact us within 7 days of delivery</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <Truck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">{freeShippingLabel}</p>
            <p className="text-on-surface-variant">{shortStandardShippingSentence}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container/20 text-primary">
            <Mail aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Support</p>
            <a className="text-on-surface-variant hover:text-primary" href="mailto:support@luckclaws.com">
              support@luckclaws.com
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
