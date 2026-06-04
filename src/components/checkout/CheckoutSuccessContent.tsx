"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { readPayPalPaymentResult, type PayPalPaymentResult } from "@/lib/paypal-payment-result";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [result, setResult] = useState<PayPalPaymentResult | null>(null);
  const [ordersHref, setOrdersHref] = useState("/account/login");

  useEffect(() => {
    const storedResult = readPayPalPaymentResult();

    if (storedResult && (!orderId || storedResult.orderId === orderId)) {
      setResult(storedResult);
    }
  }, [orderId]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setOrdersHref(data.session ? "/account/orders" : "/account/login");
    });
  }, []);

  if (!result) {
    return (
      <section className="mx-auto max-w-3xl rounded-lg bg-surface-container-lowest p-8 text-center shadow-ambient md:p-12">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-container-low text-on-surface-variant">
          <ShieldCheck aria-hidden className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-heading text-4xl font-extrabold">Payment Status Not Verified</h1>
        <p className="mt-4 text-sm leading-6 text-on-surface-variant md:text-base">
          This page only shows payment success after a completed PayPal Sandbox capture in this
          browser session. If you completed checkout in another browser, contact support with your
          PayPal order ID.
        </p>
        <Link
          href="/checkout/payment"
          className="mt-7 inline-flex rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
        >
          Return to Payment
        </Link>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/collections"
            className="inline-flex justify-center rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          >
            Continue Shopping
          </Link>
          <Link
            href={ordersHref}
            className="inline-flex justify-center rounded-full border border-outline-variant px-7 py-3 font-heading font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
          >
            View My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-lg bg-surface-container-lowest p-8 text-center shadow-ambient md:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-container/20 text-primary">
        <CheckCircle2 aria-hidden className="h-7 w-7" />
      </div>
      <h1 className="mt-6 font-heading text-4xl font-extrabold">PayPal Sandbox Payment Captured</h1>
      <p className="mt-4 text-sm leading-6 text-on-surface-variant md:text-base">
        Thank you. Your PayPal Sandbox payment was completed for testing. Fulfillment has not been
        started automatically.
      </p>
      <div className="mt-7 rounded-md bg-surface-container-low p-5 text-left text-sm leading-7 text-on-surface-variant">
        {result.internalOrderNumber && (
          <p>
            <span className="font-semibold text-on-surface">LUCK CLAWS order number:</span>{" "}
            {result.internalOrderNumber}
          </p>
        )}
        <p>
          <span className="font-semibold text-on-surface">PayPal order ID:</span> {result.orderId}
        </p>
        {result.captureId && (
          <p>
            <span className="font-semibold text-on-surface">Capture ID:</span> {result.captureId}
          </p>
        )}
        {result.amount && (
          <p>
            <span className="font-semibold text-on-surface">Captured amount:</span>{" "}
            {result.amount.value} {result.amount.currency_code}
          </p>
        )}
        {result.orderSaveError && (
          <p className="mt-3 rounded-md bg-error/10 p-3 text-error">
            Order storage notice: {result.orderSaveError}
          </p>
        )}
      </div>
      <p className="mt-6 flex justify-center gap-2 text-sm leading-6 text-on-surface-variant">
        <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          For help, contact{" "}
          <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
            support@luckclaws.com
          </a>{" "}
          with your {result.internalOrderNumber ? "LUCK CLAWS order number" : "PayPal order ID"}.
        </span>
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/collections"
          className="inline-flex justify-center rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/contact"
          className="inline-flex justify-center rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
        >
          Contact Support
        </Link>
        <Link
          href={ordersHref}
          className="inline-flex justify-center rounded-full border border-outline-variant px-7 py-3 font-heading font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
        >
          View My Orders
        </Link>
      </div>
    </section>
  );
}
