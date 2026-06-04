"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Lock, Mail, ShieldCheck, Truck } from "lucide-react";
import { PayPalSandboxButtons } from "@/components/checkout/PayPalSandboxButtons";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { readBuyNowCheckoutItem } from "@/lib/buy-now-checkout";
import { type CheckoutInfo, isCheckoutInfoValid, normalizeCheckoutInfo, readCheckoutInfo } from "@/lib/checkout-info";
import { freeShippingLabel, shortStandardShippingSentence, variableShippingSentence } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { getCartTotals, productById, type CartItem, useCartStore } from "@/store/cart-store";

const checkoutTrustItems: CompactTrustItem[] = [
  { key: "shipping", label: freeShippingLabel, Icon: Truck },
  { key: "secure", label: "Secure checkout", Icon: ShieldCheck },
  { key: "paypal", label: "PayPal Sandbox", Icon: Lock },
  {
    key: "support-email",
    label: (
      <a href="mailto:support@luckclaws.com" className="hover:text-primary">
        support@luckclaws.com
      </a>
    ),
    Icon: Mail
  }
];

export function CheckoutPaymentContent() {
  const searchParams = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const isBuyNowMode = searchParams.get("mode") === "buy-now";
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [buyNowLoaded, setBuyNowLoaded] = useState(!isBuyNowMode);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [checkoutInfoLoaded, setCheckoutInfoLoaded] = useState(false);

  useEffect(() => {
    const savedCheckoutInfo = readCheckoutInfo();

    setCheckoutInfo(savedCheckoutInfo ? normalizeCheckoutInfo(savedCheckoutInfo) : null);
    setCheckoutInfoLoaded(true);

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
  const hasValidCheckoutInfo = checkoutInfoLoaded && isCheckoutInfoValid(checkoutInfo);
  const informationHref = `/checkout/information${isBuyNowMode ? "?mode=buy-now" : ""}`;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:items-start">
      <section className="space-y-6">
        <div>
          <Link
            href={informationHref}
            className="mb-4 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface"
          >
            &larr; Back to Information
          </Link>
          <h1 className="font-heading text-4xl font-bold md:text-5xl">Payment</h1>
          <p className="mt-3 text-on-surface-variant">
            Pay securely with PayPal. Sandbox payment mode is active for testing.
          </p>
        </div>

        <CompactTrustBar items={checkoutTrustItems} className="rounded-lg bg-surface-container-low p-4" />

        <section className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">Customer Information</h2>
          {!checkoutInfoLoaded ? (
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              Loading checkout information...
            </p>
          ) : hasValidCheckoutInfo && checkoutInfo ? (
            <div className="mt-5 grid gap-3 text-sm leading-6 text-on-surface-variant md:grid-cols-2">
              <p>
                <span className="font-semibold text-on-surface">Email:</span>{" "}
                {checkoutInfo.email}
              </p>
              <p>
                <span className="font-semibold text-on-surface">Name:</span>{" "}
                {checkoutInfo.fullName}
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
                  .join(", ")}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              Please complete your checkout information before payment.
            </p>
          )}
          <Link
            href={informationHref}
            className="mt-5 inline-flex font-semibold text-primary hover:underline"
          >
            {hasValidCheckoutInfo ? "Edit information" : "Go to Checkout Information"}
          </Link>
        </section>

        <section className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">Pay Securely With PayPal</h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            {shortStandardShippingSentence}. {variableShippingSentence} Taxes are not calculated in
            this sandbox MVP checkout.
          </p>
          {!checkoutInfoLoaded ? (
            <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm text-on-surface-variant">
              Loading checkout information...
            </div>
          ) : !hasValidCheckoutInfo ? (
            <div className="mt-6 rounded-md bg-primary-container/10 p-5 text-sm leading-6 text-on-surface-variant">
              <p className="font-semibold text-on-surface">
                Please complete your checkout information before payment.
              </p>
              <Link
                href={informationHref}
                className="mt-4 inline-flex rounded-full bg-primary-container px-6 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              >
                Go to Checkout Information
              </Link>
            </div>
          ) : showLoadingState ? (
            <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm text-on-surface-variant">
              Loading Buy Now checkout item...
            </div>
          ) : hasItems && checkoutInfo ? (
            <div className="mt-6">
              <PayPalSandboxButtons
                items={checkoutItems}
                total={totals.total}
                shipping={totals.estimatedShipping}
                checkoutMode={isBuyNowMode ? "buy-now" : "cart"}
                checkoutInfo={checkoutInfo}
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
