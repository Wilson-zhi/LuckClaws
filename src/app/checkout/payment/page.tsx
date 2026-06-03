import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPaymentContent } from "@/components/checkout/CheckoutPaymentContent";
import { CheckoutFooter, CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Payment | ${brandName}`,
    description: "Pay securely with PayPal Sandbox for your LUCK CLAWS checkout.",
    path: "/checkout/payment",
    noIndex: true
  })
};

const steps = ["Cart", "Information", "Payment"];

export default function CheckoutPaymentPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="section-shell py-10 md:py-16">
        <nav aria-label="Checkout steps" className="mb-10 text-sm font-semibold text-on-surface-variant">
          <ol className="flex flex-wrap gap-3">
            {steps.map((step, index) => (
              <li key={step} className={step === "Payment" ? "text-on-surface" : "text-on-surface-variant/50"}>
                {step}
                {index < steps.length - 1 && (
                  <span className="ml-3" aria-hidden>
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Suspense fallback={<PaymentFallback />}>
          <CheckoutPaymentContent />
        </Suspense>
      </main>
      <CheckoutFooter />
    </>
  );
}

function PaymentFallback() {
  return (
    <div className="rounded-lg bg-surface-container-low p-6 text-sm text-on-surface-variant shadow-soft">
      Loading payment step...
    </div>
  );
}
