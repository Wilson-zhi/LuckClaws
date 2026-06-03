import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";
import { freeShippingSentence, standardShippingSentence, variableShippingSentence } from "@/lib/shipping";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Shipping & Returns | ${brandName}`,
    description:
      "Learn about LUCK CLAWS shipping costs, processing times, delivery estimates, and damaged item support.",
    path: "/shipping-returns"
  })
};

const sections = [
  {
    title: "Shipping Times",
    text:
      "Standard delivery usually takes 7-15 business days after processing. Shipping timelines are estimates and may vary due to carrier delays, customs processing, weather, holidays, or address issues."
  },
  {
    title: "Shipping Costs",
    text: `${freeShippingSentence} ${standardShippingSentence} ${variableShippingSentence}`
  },
  {
    title: "Order Processing",
    text:
      "Orders are typically processed within 1-3 business days. If you need help with an order, contact support with your order number."
  },
  {
    title: "Damaged, Defective, or Incorrect Items",
    text: (
      <>
        If your order arrives damaged, defective, or incorrect, contact{" "}
        <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
          support@luckclaws.com
        </a>{" "}
        within 7 days of delivery with your order number and photos of the item and packaging.
      </>
    )
  },
  {
    title: "Returns Not Accepted for Preference Changes",
    text:
      "We do not accept returns for buyer's remorse, preference changes, wrong size selection, normal wear and tear, or items damaged through misuse."
  }
];

export default function ShippingReturnsPage() {
  return (
    <SupportPageLayout
      eyebrow="Support"
      title="Shipping & Returns"
      description="Clear information about order processing, delivery, shipping costs, and support for damaged, defective, or incorrect items."
    >
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
