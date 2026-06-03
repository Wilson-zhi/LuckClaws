import type { Metadata } from "next";
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

const steps = ["Cart", "Information", "Shipping", "Payment"];

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
          <CheckoutForm />
          <CheckoutOrderSummary />
        </div>
      </main>
      <CheckoutFooter />
    </>
  );
}
