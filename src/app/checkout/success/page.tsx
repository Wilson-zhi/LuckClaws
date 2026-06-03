import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";
import { CheckoutFooter, CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Payment Status | ${brandName}`,
    description: "View PayPal Sandbox payment status for LUCK CLAWS checkout.",
    path: "/checkout/success",
    noIndex: true
  })
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="section-shell py-10 md:py-16">
        <Suspense fallback={<SuccessFallback />}>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <CheckoutFooter />
    </>
  );
}

function SuccessFallback() {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-surface-container-low p-6 text-sm text-on-surface-variant shadow-soft">
      Loading payment status...
    </div>
  );
}
