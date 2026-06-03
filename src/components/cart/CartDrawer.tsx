"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Lock, Mail, RotateCcw, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import { CartAddOnCard } from "@/components/cart/CartAddOnCard";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { cartAddOns } from "@/data/products";
import { trackBeginCheckout, trackRemoveFromCart } from "@/lib/ga4-ecommerce";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, productById, useCartStore } from "@/store/cart-store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = getCartTotals(items);
  const hasItems = items.length > 0;
  const itemCountLabel = `${totals.count} ${totals.count === 1 ? "item" : "items"}`;

  const handleRemoveItem = (itemId: string) => {
    const item = items.find((cartItem) => cartItem.id === itemId);

    if (item) {
      trackRemoveFromCart(item);
    }

    removeItem(itemId);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

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
          <div>
            <h2 className="font-heading text-3xl font-bold">Your Cart</h2>
            <p className="mt-1 text-sm font-semibold text-on-surface-variant">{itemCountLabel}</p>
          </div>
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
          {hasItems ? (
            <>
              <FreeShippingBar compact />

              <div className="mt-6 space-y-6">
                {items.map((item) => {
                  const product = productById(item.id);
                  const image = product?.image ?? item.image;
                  const alt = product?.alt ?? item.alt;

                  return (
                    <article
                      key={item.id}
                      className="flex gap-4 border-b border-outline-variant/60 pb-6"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-container">
                        <Image src={image} alt={alt} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-lg font-bold">{item.name}</h3>
                            {(item.color || item.size) && (
                              <p className="mt-1 text-sm text-on-surface-variant">
                                {item.color && <>Color: {item.color}</>}
                                {item.color && item.size && " | "}
                                {item.size && <>Size: {item.size}</>}
                              </p>
                            )}
                            <p className="mt-2 text-sm font-semibold text-primary">
                              Unit price {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-on-surface-variant hover:text-error"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <X aria-hidden className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(quantity) => updateQuantity(item.id, quantity)}
                            label={item.name}
                          />
                          <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                              Line total
                            </p>
                            <p className="font-heading text-lg font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <section className="mt-7">
                <h3 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">
                  Complete the routine
                </h3>
                <div className="mt-4 space-y-3">
                  {cartAddOns.map((product) => (
                    <CartAddOnCard
                      key={product.id}
                      product={product}
                      itemListName="Cart Drawer Add-ons"
                      compact
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-lg bg-surface-container-low p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-container/20 text-primary">
                <ShoppingBag aria-hidden className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">Your cart is empty</h3>
              <p className="mt-2 text-on-surface-variant">Find something your pet will love.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/collections"
                  className="rounded-full bg-primary-container px-5 py-3 font-bold text-on-primary-container transition hover:bg-[#e08f00]"
                  onClick={onClose}
                >
                  Shop All
                </Link>
                <Link
                  href="/collections/dog-toys"
                  className="rounded-full border border-primary px-5 py-3 font-bold text-primary transition hover:bg-primary-container/10"
                  onClick={onClose}
                >
                  Dog Toys
                </Link>
              </div>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="border-t border-outline-variant/60 px-6 py-6">
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated shipping</span>
              <span>{totals.hasFreeShipping ? "Free" : formatPrice(totals.estimatedShipping)}</span>
            </div>
            <div className="flex justify-between font-heading text-lg font-bold">
              <span>Estimated Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
            <p className="text-center text-sm text-on-surface-variant">
              Taxes calculated at checkout.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2 text-[11px] uppercase text-on-surface-variant">
            <span className="flex items-center justify-center gap-1">
              <Truck aria-hidden className="h-4 w-4" /> {`Free over $${FREE_SHIPPING_THRESHOLD}`}
            </span>
            <span className="flex items-center justify-center gap-1">
              <RotateCcw aria-hidden className="h-4 w-4" /> Damaged or incorrect
            </span>
            <span className="flex items-center justify-center gap-1">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Secure checkout
            </span>
            <span className="flex items-center justify-center gap-1">
              <Mail aria-hidden className="h-4 w-4" /> Support
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-on-surface-variant">
            Support:{" "}
            <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
              support@luckclaws.com
            </a>
          </p>

          <Link
            href="/checkout/information"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-4 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            onClick={() => {
              trackBeginCheckout(items);
              onClose();
            }}
          >
            Proceed to Checkout
            <Lock aria-hidden className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-outline-variant px-6 py-3 font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary"
            onClick={onClose}
          >
            View Cart
          </Link>
          <button
            type="button"
            className="mt-4 w-full text-center font-semibold text-on-surface-variant hover:text-primary"
            onClick={onClose}
          >
            Continue Shopping
          </button>
          </div>
        )}
      </aside>
    </div>
  );
}
