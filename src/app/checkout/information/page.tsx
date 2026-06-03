import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutFooter, CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Checkout Information | ${brandName}`,
    description:
      "Enter your contact and shipping information to continue your LUCK CLAWS checkout.",
    path: "/checkout/information",
    noIndex: true
  })
};

const steps = ["Cart", "Information", "Payment"];

export default function CheckoutInformationPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="section-shell py-10 md:py-16">
        <nav aria-label="Checkout steps" className="mb-10 text-sm font-semibold text-on-surface-variant">
          <ol className="flex flex-wrap gap-3">
            {steps.map((step, index) => (
              <li key={step} className={step === "Information" ? "text-on-surface" : "text-on-surface-variant/50"}>
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

        <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:items-start">
          <Suspense fallback={<CheckoutFormFallback />}>
            <CheckoutForm />
          </Suspense>
          <Suspense fallback={<CheckoutSummaryFallback />}>
            <CheckoutOrderSummary />
          </Suspense>
        </div>
      </main>
      <CheckoutFooter />
    </>
  );
}

function CheckoutFormFallback() {
  return (
    <div className="rounded-lg bg-surface-container-low p-6 text-sm text-on-surface-variant shadow-soft">
      Loading checkout form...
    </div>
  );
}

function CheckoutSummaryFallback() {
  return (
    <aside className="rounded-lg border border-outline-variant bg-surface-container-low p-6 shadow-soft md:p-10">
      <h2 className="font-heading text-3xl font-bold">Order Summary</h2>
      <div className="mt-7 rounded-md bg-surface-container-lowest p-5 text-sm text-on-surface-variant">
        Loading checkout summary...
      </div>
    </aside>
  );
}
