"use client";

import Image from "next/image";
import Link from "next/link";
import { BeginCheckoutTracker } from "@/components/analytics/EcommerceEventTrackers";
import { useCartStore, getCartTotals, productById } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CheckoutOrderSummary() {
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);

  return (
    <aside className="rounded-lg border border-outline-variant bg-surface-container-low p-6 shadow-soft md:p-10">
      <BeginCheckoutTracker items={items} />
      <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
      <div className="mt-7 space-y-5">
        {items.length === 0 ? (
          <div className="rounded-md bg-surface-container-lowest p-5 text-sm text-on-surface-variant">
            No items are in checkout yet.{" "}
            <Link href="/collections" className="font-semibold text-primary">
              Continue shopping
            </Link>
            .
          </div>
        ) : (
          items.map((item) => {
            const product = productById(item.id);
            const image = product?.image ?? item.image;
            const alt = product?.alt ?? item.alt;

            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container">
                  <Image src={image} alt={alt} fill sizes="80px" className="object-cover" />
                  <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold">{item.name}</h3>
                  {(item.color || item.size) && (
                    <p className="text-sm text-on-surface-variant">
                      {item.color && <>Color: {item.color}</>}
                      {item.color && item.size && " / "}
                      {item.size && <>Size: {item.size}</>}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-on-surface-variant">Qty {item.quantity}</p>
                </div>
                <p className="font-heading font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            );
          })
        )}
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
      <p className="mt-4 text-sm text-on-surface-variant">
        Payment and shipping rates will be connected in the next step.
      </p>
    </aside>
  );
}
