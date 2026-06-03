import type { Metadata } from "next";
import { Clock, Mail, PackageCheck } from "lucide-react";
import { PreviewSubmitButton } from "@/components/forms/PreviewSubmitButton";
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

const fields = [
  { label: "Name", id: "name", type: "text", required: true },
  { label: "Email", id: "email", type: "email", required: true },
  { label: "Order Number (optional)", id: "order-number", type: "text", required: false }
];

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

        <form className="ambient-card p-6 md:p-8" aria-label="Contact support form">
          <h2 className="font-heading text-2xl font-bold">Send a Message</h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            This contact form is for preview only and is not connected to a backend yet. For urgent
            order help, email{" "}
            <a href="mailto:support@luckclaws.com" className="font-semibold text-primary hover:underline">
              support@luckclaws.com
            </a>
            .
          </p>
          <div className="mt-6 grid gap-5">
            {fields.map((field) => (
              <label key={field.id} className="grid gap-2 text-sm font-semibold text-on-surface">
                {field.label}
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  className="rounded-md border border-outline-variant bg-white px-4 py-3 font-normal text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Message
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="resize-y rounded-md border border-outline-variant bg-white px-4 py-3 font-normal text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30"
              />
            </label>
            <PreviewSubmitButton
              className="mt-2 w-full md:w-auto"
              message="This is a preview contact form and is not connected to a backend yet. For order help, email support@luckclaws.com."
            >
              Submit
            </PreviewSubmitButton>
          </div>
        </form>
      </div>
    </SupportPageLayout>
  );
}
