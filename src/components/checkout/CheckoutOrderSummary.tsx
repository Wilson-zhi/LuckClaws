"use client";

import Image from "next/image";
import { useCartStore, getCartTotals } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CheckoutOrderSummary() {
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);

  return (
    <aside className="rounded-lg border border-outline-variant bg-surface-container-low p-6 shadow-soft md:p-10">
      <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
      <div className="mt-7 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-container">
              <Image src={item.image} alt={item.alt} fill sizes="80px" className="object-cover" />
              <span className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold">{item.name}</h3>
              <p className="text-sm text-on-surface-variant">
                {item.color ?? "Forest Green & Cream"}
                {item.size ? ` / ${item.size}` : ""}
              </p>
            </div>
            <p className="font-heading font-bold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3 border-y border-outline-variant py-6">
        <label className="sr-only" htmlFor="discount">
          Discount code
        </label>
        <input
          id="discount"
          placeholder="Discount code"
          className="min-h-12 flex-1 border-outline bg-white px-4 focus:border-primary focus:ring-primary"
        />
        <button type="button" className="bg-surface-container-high px-6 font-bold">
          Apply
        </button>
      </div>

      <div className="space-y-4 py-6 text-on-surface-variant">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-on-surface">{formatPrice(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-on-surface">Calculated at next step</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span className="text-on-surface">Calculated at next step</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between border-t border-outline-variant pt-6">
        <span className="font-heading text-2xl font-bold">Total</span>
        <span className="font-heading text-4xl font-bold">{formatPrice(totals.total)}</span>
      </div>
    </aside>
  );
}

