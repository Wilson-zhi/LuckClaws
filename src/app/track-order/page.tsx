import type { Metadata } from "next";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";

export const metadata: Metadata = {
  title: `Track Order | ${brandName}`,
  description:
    "Track your LUCK CLAWS order status with your email address and order number."
};

export default function TrackOrderPage() {
  return (
    <SupportPageLayout
      eyebrow="Order Support"
      title="Track Order"
      description="Enter your order details to check your order status."
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
          <button
            type="submit"
            className="inline-flex justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          >
            Track Order
          </button>
        </form>
        <p className="mt-6 rounded-md bg-primary-container/10 p-4 text-sm leading-6 text-on-surface-variant">
          Order tracking functionality will be connected later. For now, customers can contact{" "}
          <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
            support@luckclaws.com
          </a>{" "}
          for order updates.
        </p>
      </div>
    </SupportPageLayout>
  );
}
