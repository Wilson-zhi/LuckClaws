import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { CheckoutFooter, CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Payment Canceled | ${brandName}`,
    description: "Return to your LUCK CLAWS cart or payment step after canceling checkout.",
    path: "/checkout/cancel",
    noIndex: true
  })
};

export default function CheckoutCancelPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="section-shell py-10 md:py-16">
        <section className="mx-auto max-w-3xl rounded-lg bg-surface-container-lowest p-8 text-center shadow-ambient md:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-container-low text-on-surface-variant">
            <XCircle aria-hidden className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-extrabold">Payment Was Canceled</h1>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant md:text-base">
            Your cart was not charged. You can return to payment, review your cart, or contact
            support if you need help.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout/payment"
              className="inline-flex justify-center rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              Return to Payment
            </Link>
            <Link
              href="/cart"
              className="inline-flex justify-center rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
            >
              Back to Cart
            </Link>
            <Link
              href="/collections"
              className="inline-flex justify-center rounded-full border border-outline-variant px-7 py-3 font-heading font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
            >
              Continue Shopping
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-on-surface-variant">
            Support:{" "}
            <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
              support@luckclaws.com
            </a>
          </p>
        </section>
      </main>
      <CheckoutFooter />
    </>
  );
}
