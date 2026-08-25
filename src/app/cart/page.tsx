import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { SiteShell } from "@/components/layout/SiteShell";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Your Cart | ${brandName}`,
    description: "Review your LUCK CLAWS cart and continue to secure checkout.",
    path: "/cart",
    noIndex: true
  })
};

export default function CartPage() {
  return (
    <SiteShell>
      <FreeShippingBar />
      <section className="section-shell py-12 md:py-20">
        <h1 className="font-heading text-5xl font-extrabold md:text-7xl">Your Cart</h1>
        <Link href="/collections" className="mt-5 inline-block font-semibold text-primary">
          &larr; Continue Shopping
        </Link>
        <div className="mt-10">
          <Suspense
            fallback={(
              <div className="rounded-lg bg-surface-container-lowest p-6 text-sm text-on-surface-variant shadow-soft">
                Loading your cart...
              </div>
            )}
          >
            <CartPageContent />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
