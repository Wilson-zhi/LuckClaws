import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Shipping & Returns | ${brandName}`,
    description:
      "Learn about LUCK CLAWS shipping times, processing, costs, returns, and damaged item support.",
    path: "/shipping-returns"
  })
};

const sections = [
  {
    title: "Shipping Times",
    text:
      "Delivery timing can vary based on destination, carrier volume, and the shipping method selected at checkout. You will receive order updates by email when available."
  },
  {
    title: "Shipping Costs",
    text:
      "Shipping costs are shown during checkout before payment. Free shipping may be available when your order meets the current threshold shown on the site."
  },
  {
    title: "Order Processing",
    text:
      "Orders are prepared as quickly as possible during business days. If you need help with an order, contact support with your order number."
  },
  {
    title: "30-Day Returns",
    text:
      "Unused items may be eligible for return within 30 days of delivery. Returned items should be clean, undamaged, and in their original condition when possible."
  },
  {
    title: "Damaged or Incorrect Items",
    text:
      "If your order arrives damaged or incorrect, contact us with your order number and photos of the item and packaging so our team can review the issue."
  }
];

export default function ShippingReturnsPage() {
  return (
    <SupportPageLayout
      eyebrow="Support"
      title="Shipping & Returns"
      description="Clear, simple information about order processing, delivery, and returns for LUCK CLAWS purchases."
    >
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
