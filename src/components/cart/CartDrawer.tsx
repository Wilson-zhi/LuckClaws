"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckCircle2, Lock, Mail, RotateCcw, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
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
  recentlyAdded?: {
    productName: string;
    quantity: number;
    token: number;
  } | null;
};

export function CartDrawer({ open, onClose, recentlyAdded = null }: CartDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
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

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        drawerRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;

      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 transition">
      <button
        type="button"
        className="cart-drawer-backdrop absolute inset-0 bg-on-surface/25 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close cart drawer"
        tabIndex={-1}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className="cart-drawer-panel absolute right-0 top-0 flex h-full w-full max-w-[520px] translate-x-0 flex-col bg-surface-container-lowest shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-5">
          <div>
            <h2 id="cart-drawer-title" className="font-heading text-3xl font-bold">Your Cart</h2>
            <p className="mt-1 text-sm font-semibold text-on-surface-variant">{itemCountLabel}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-surface-container"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <X aria-hidden className="h-6 w-6" />
          </button>
        </div>

        {recentlyAdded && hasItems ? (
          <div
            key={recentlyAdded.token}
            className="cart-added-ticket relative isolate overflow-hidden border-b border-[#587060] bg-[#2F493D] px-6 py-4 text-white"
            role="status"
            aria-live="polite"
          >
            <span className="cart-added-word" aria-hidden="true">ADDED</span>
            <div className="relative z-10 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFD78D] text-[#2C1A0D] shadow-soft">
                <CheckCircle2 aria-hidden className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFD78D]">
                  Added to your routine
                </p>
                <p className="mt-1 truncate font-heading text-base font-extrabold text-white">
                  {recentlyAdded.productName}
                </p>
              </div>
              <p className="shrink-0 text-xs font-bold tabular-nums text-[#FFD78D]">
                {recentlyAdded.quantity} {recentlyAdded.quantity === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {hasItems ? (
            <>
              <FreeShippingBar compact />

              <div className="mt-6 space-y-6">
                {items.map((item) => {
                  const product = productById(item.id);
                  const image = item.image || product?.image || "/images/hero-dog-running.jpg";
                  const alt = item.alt || product?.alt || item.name;

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
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-on-surface-variant transition hover:bg-error/10 hover:text-error"
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

          <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] uppercase text-on-surface-variant sm:grid-cols-4">
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
