"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ViewCartTracker } from "@/components/analytics/EcommerceEventTrackers";
import { CartAddOnCard } from "@/components/cart/CartAddOnCard";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { cartAddOns } from "@/data/products";
import { useCartStore } from "@/store/cart-store";

export function CartPageContent() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <ViewCartTracker items={items} />
      <div>
        <div className="rounded-lg bg-surface-container-lowest p-5 shadow-ambient md:p-8">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-container/20 text-primary">
                <ShoppingBag aria-hidden className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-heading text-3xl font-bold">Your cart is empty</h2>
              <p className="mt-3 text-on-surface-variant">Find something your pet will love.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/collections"
                  className="rounded-full bg-primary-container px-6 py-3 font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                >
                  Shop All
                </Link>
                <Link
                  href="/collections/dog-toys"
                  className="rounded-full border border-primary px-6 py-3 font-bold text-primary transition hover:bg-primary-container/10"
                >
                  Dog Toys
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <section className="mt-10 border-t border-outline-variant pt-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Complete the routine</h2>
          <p className="mt-2 text-on-surface-variant">
            Add small essentials that pair well with enrichment, training, and everyday play.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cartAddOns.map((product) => (
              <CartAddOnCard
                key={product.id}
                product={product}
                itemListName="Cart Page Add-ons"
              />
            ))}
          </div>
        </section>
      </div>

      <CartOrderSummary />
    </div>
  );
}
