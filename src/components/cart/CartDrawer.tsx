"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, RotateCcw, ShieldCheck, Truck, X } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { frequentlyBoughtTogether } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = getCartTotals(items);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 transition">
      <button
        type="button"
        className="absolute inset-0 bg-on-surface/25 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close cart drawer"
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[520px] translate-x-0 flex-col bg-surface-container-lowest shadow-lift transition-transform duration-300"
        aria-label="Cart drawer"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-5">
          <h2 className="font-heading text-3xl font-bold">Your Cart</h2>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-surface-container"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <X aria-hidden className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FreeShippingBar compact />

          <div className="mt-6 space-y-6">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 border-b border-outline-variant/60 pb-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-container">
                  <Image src={item.image} alt={item.alt} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold">{item.name}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {item.color && <>Color: {item.color}</>}
                        {item.color && item.size && " | "}
                        {item.size && <>Size: {item.size}</>}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-error"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X aria-hidden className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(quantity) => updateQuantity(item.id, quantity)}
                      label={item.name}
                    />
                    <p className="font-heading text-lg font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-7">
            <h3 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">
              Frequently Bought Together
            </h3>
            <div className="mt-4 space-y-3">
              {frequentlyBoughtTogether.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-full bg-surface-container-low px-4 py-3 shadow-soft"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-container">
                    <Image src={product.image} alt={product.alt} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold">{product.name}</p>
                    <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
                  </div>
                  <AddToCartButton product={product} variant="outline" className="px-5 py-2">
                    Add
                  </AddToCartButton>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-outline-variant/60 px-6 py-6">
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between font-heading text-lg font-bold">
              <span>Estimated Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
            <p className="text-center text-sm text-on-surface-variant">
              Shipping & taxes calculated at checkout.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] uppercase text-on-surface-variant">
            <span className="flex items-center justify-center gap-1">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Secure
            </span>
            <span className="flex items-center justify-center gap-1">
              <RotateCcw aria-hidden className="h-4 w-4" /> Returns
            </span>
            <span className="flex items-center justify-center gap-1">
              <Truck aria-hidden className="h-4 w-4" /> Free over $50
            </span>
          </div>

          <Link
            href="/checkout/information"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-4 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            onClick={onClose}
          >
            Proceed to Checkout
            <Lock aria-hidden className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="mt-4 w-full text-center font-semibold text-on-surface-variant hover:text-primary"
            onClick={onClose}
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
