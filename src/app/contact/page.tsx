import type { Metadata } from "next";
import { Clock, Mail, PackageCheck } from "lucide-react";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Contact Us | ${brandName}`,
    description: "Contact LUCK CLAWS for product questions, order support, and customer service.",
    path: "/contact"
  })
};

const supportEmailHref =
  "mailto:support@luckclaws.com?subject=LUCK%20CLAWS%20Support%20Request&body=Name:%0AEmail:%0AOrder%20Number:%0AMessage:";

export default function ContactPage() {
  return (
    <SupportPageLayout
      eyebrow="Support"
      title="Contact Us"
      description="Have a question about your order, a product, or your pet's next favorite essential? We're here to help."
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="ambient-card p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold">Support Details</h2>
          <div className="mt-6 space-y-5 text-sm leading-6 text-on-surface-variant">
            <div>
              <p className="font-semibold text-on-surface">Business name</p>
              <p>{brandName}</p>
            </div>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container/20 text-primary">
                <Mail aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-on-surface">Support channel</p>
                <a href="mailto:support@luckclaws.com" className="text-primary hover:underline">
                  support@luckclaws.com
                </a>
                <p className="mt-1">We currently provide customer support by email.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container/20 text-primary">
                <Clock aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-on-surface">Response time</p>
                <p>We typically respond within 1-2 business days.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container/20 text-primary">
                <PackageCheck aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-on-surface">Order support</p>
                <p>Please include your order number when contacting us about an order.</p>
                <p className="mt-2">
                  For damaged, defective, or incorrect items, contact us within 7 days of delivery
                  with your order number and photos of the item and packaging.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="ambient-card p-6 md:p-8" aria-labelledby="email-support-heading">
          <h2 id="email-support-heading" className="font-heading text-2xl font-bold">
            Email Support
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Send us an email and we will respond within 1-2 business days. For order help, include
            your order number and any relevant details.
          </p>
          <div className="mt-6 rounded-md bg-surface-container-low p-5 text-sm leading-7 text-on-surface-variant">
            <p className="font-semibold text-on-surface">Please include:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Your name and email address</li>
              <li>Your order number, if available</li>
              <li>A short description of your question or issue</li>
              <li>Photos of the item and packaging for damaged, defective, or incorrect items</li>
            </ul>
          </div>
          <a
            href={supportEmailHref}
            className="mt-6 inline-flex w-full justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00] md:w-auto"
          >
            Email Support
          </a>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            If the button does not open your email app, email{" "}
            <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
              support@luckclaws.com
            </a>{" "}
            directly.
          </p>
        </section>
      </div>
    </SupportPageLayout>
  );
}
