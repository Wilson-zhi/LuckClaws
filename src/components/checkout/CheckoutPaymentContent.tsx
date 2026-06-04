"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Lock, Mail, ShieldCheck, Truck } from "lucide-react";
import { PayPalSandboxButtons } from "@/components/checkout/PayPalSandboxButtons";
import { readBuyNowCheckoutItem } from "@/lib/buy-now-checkout";
import { type CheckoutInfo, readCheckoutInfo } from "@/lib/checkout-info";
import { freeShippingLabel, shortStandardShippingSentence, variableShippingSentence } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, productById, type CartItem, useCartStore } from "@/store/cart-store";

export function CheckoutPaymentContent() {
  const searchParams = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const isBuyNowMode = searchParams.get("mode") === "buy-now";
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [buyNowLoaded, setBuyNowLoaded] = useState(!isBuyNowMode);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);

  useEffect(() => {
    setCheckoutInfo(readCheckoutInfo());

    if (!isBuyNowMode) {
      setBuyNowItem(null);
      setBuyNowLoaded(true);
      return;
    }

    setBuyNowItem(readBuyNowCheckoutItem());
    setBuyNowLoaded(true);
  }, [isBuyNowMode]);

  const checkoutItems = useMemo(() => {
    if (isBuyNowMode && buyNowLoaded && buyNowItem) {
      return [buyNowItem];
    }

    return cartItems;
  }, [buyNowItem, buyNowLoaded, cartItems, isBuyNowMode]);

  const totals = getCartTotals(checkoutItems);
  const showLoadingState = isBuyNowMode && !buyNowLoaded;
  const hasItems = checkoutItems.length > 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:items-start">
      <section className="space-y-6">
        <div>
          <Link
            href={`/checkout/information${isBuyNowMode ? "?mode=buy-now" : ""}`}
            className="mb-4 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface"
          >
            &larr; Back to Information
          </Link>
          <h1 className="font-heading text-4xl font-bold md:text-5xl">Payment</h1>
          <p className="mt-3 text-on-surface-variant">
            Pay securely with PayPal. Sandbox payment mode is active for testing.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Truck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>{freeShippingLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <Lock aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>PayPal Sandbox</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <a href="mailto:support@luckclaws.com" className="hover:text-primary">
              support@luckclaws.com
            </a>
          </div>
        </div>

        <section className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">Customer Information</h2>
          {checkoutInfo ? (
            <div className="mt-5 grid gap-3 text-sm leading-6 text-on-surface-variant md:grid-cols-2">
              <p>
                <span className="font-semibold text-on-surface">Email:</span>{" "}
                {checkoutInfo.email || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-on-surface">Name:</span>{" "}
                {[checkoutInfo.firstName, checkoutInfo.lastName].filter(Boolean).join(" ") || "Not provided"}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold text-on-surface">Ship to:</span>{" "}
                {[
                  checkoutInfo.address,
                  checkoutInfo.apartment,
                  checkoutInfo.city,
                  checkoutInfo.state,
                  checkoutInfo.zip,
                  checkoutInfo.country
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              Customer information has not been saved in this browser session. You can return to
              the information step before paying.
            </p>
          )}
          <Link
            href={`/checkout/information${isBuyNowMode ? "?mode=buy-now" : ""}`}
            className="mt-5 inline-flex font-semibold text-primary hover:underline"
          >
            Edit information
          </Link>
        </section>

        <section className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">Pay Securely With PayPal</h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            {shortStandardShippingSentence}. {variableShippingSentence} Taxes are not calculated in
            this sandbox MVP checkout.
          </p>
          {showLoadingState ? (
            <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm text-on-surface-variant">
              Loading Buy Now checkout item...
            </div>
          ) : hasItems ? (
            <div className="mt-6">
              <PayPalSandboxButtons
                items={checkoutItems}
                total={totals.total}
                shipping={totals.estimatedShipping}
                checkoutMode={isBuyNowMode ? "buy-now" : "cart"}
              />
            </div>
          ) : (
            <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm text-on-surface-variant">
              No items are ready for payment.{" "}
              <Link href="/collections" className="font-semibold text-primary">
                Continue shopping
              </Link>
              .
            </div>
          )}
        </section>
      </section>

      <aside className="rounded-lg border border-outline-variant bg-surface-container-low p-6 shadow-soft md:p-10">
        <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
        {isBuyNowMode && buyNowLoaded && buyNowItem && (
          <p className="mt-3 rounded-md bg-primary-container/15 px-4 py-3 text-sm font-semibold text-primary">
            Checking out this item only.
          </p>
        )}
        <div className="mt-7 space-y-5">
          {checkoutItems.map((item) => {
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
          })}
        </div>

        <div className="space-y-4 py-6 text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-on-surface">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated shipping</span>
            <span className="text-on-surface">
              {totals.hasFreeShipping ? "Free" : formatPrice(totals.estimatedShipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="text-on-surface">Not calculated</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-outline-variant pt-6">
          <span className="font-heading text-2xl font-bold">Total</span>
          <span className="font-heading text-4xl font-bold">{formatPrice(totals.total)}</span>
        </div>
      </aside>
    </div>
  );
}
