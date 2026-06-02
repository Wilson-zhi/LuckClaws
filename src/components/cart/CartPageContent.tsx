"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { ViewCartTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { frequentlyBoughtTogether } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartPageContent() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <ViewCartTracker items={items} />
      <div>
        <div className="rounded-lg bg-surface-container-lowest p-5 shadow-ambient md:p-8">
          {items.length === 0 ? (
            <p className="py-10 text-center text-on-surface-variant">Your cart is empty.</p>
          ) : (
            <div className="space-y-7">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <section className="mt-10 border-t border-outline-variant pt-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Frequently Bought Together
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {frequentlyBoughtTogether.map((product) => (
              <article
                key={product.id}
                className="flex items-center gap-5 rounded-md bg-surface-container-lowest p-5 shadow-soft"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-container">
                  <Image src={product.image} alt={product.alt} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold">{product.name}</h3>
                  <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                </div>
                <AddToCartButton product={product} variant="icon">
                  <Plus aria-hidden className="h-5 w-5" />
                </AddToCartButton>
              </article>
            ))}
          </div>
        </section>
      </div>

      <CartOrderSummary />
    </div>
  );
}

