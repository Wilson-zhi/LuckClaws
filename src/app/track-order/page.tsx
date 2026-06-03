import type { Metadata } from "next";
import { PreviewSubmitButton } from "@/components/forms/PreviewSubmitButton";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Track Order | ${brandName}`,
    description: "Track your LUCK CLAWS order or contact support for order updates.",
    path: "/track-order"
  })
};

export default function TrackOrderPage() {
  return (
    <SupportPageLayout
      eyebrow="Order Support"
      title="Track Order"
      description="Enter your order details when live order processing is enabled."
    >
      <div className="ambient-card max-w-2xl p-6 md:p-8">
        <form className="grid gap-5" aria-label="Track order form">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Email Address
            <input
              id="tracking-email"
              name="tracking-email"
              type="email"
              required
              className="rounded-md border border-outline-variant bg-white px-4 py-3 font-normal text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Order Number
            <input
              id="tracking-order-number"
              name="tracking-order-number"
              type="text"
              required
              className="rounded-md border border-outline-variant bg-white px-4 py-3 font-normal text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30"
            />
          </label>
          <PreviewSubmitButton
            message="Track order functionality will be connected when live order processing is enabled. For order help, contact support@luckclaws.com with your order number."
          >
            Track Order
          </PreviewSubmitButton>
        </form>
        <p className="mt-6 rounded-md bg-primary-container/10 p-4 text-sm leading-6 text-on-surface-variant">
          Track order functionality will be connected when live order processing is enabled. For
          order help, contact{" "}
          <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
            support@luckclaws.com
          </a>{" "}
          with your order number.
        </p>
      </div>
    </SupportPageLayout>
  );
}
