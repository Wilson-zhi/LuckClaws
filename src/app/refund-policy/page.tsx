import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";

export const metadata: Metadata = {
  title: `Refund Policy | ${brandName}`,
  description:
    "Review the LUCK CLAWS refund policy for return windows, eligibility, refunds, exchanges, and damaged or incorrect items."
};

const sections = [
  {
    title: "30-Day Return Window",
    text:
      "Unused items may be eligible for return within 30 days of delivery. Contact support with your order number to begin a return request."
  },
  {
    title: "Return Eligibility",
    text:
      "Returned items should be clean, unused, undamaged, and in their original condition when possible. We may request photos or additional details before approving a return."
  },
  {
    title: "Non-Returnable Items",
    text:
      "Items that have been heavily used, damaged after delivery, altered, or marked as final sale may not be eligible for return unless required by applicable law."
  },
  {
    title: "Refund Processing",
    text:
      "Approved refunds are typically issued to the original payment method after the returned item is received and reviewed. Processing time may vary by payment provider."
  },
  {
    title: "Exchanges",
    text:
      "If you need a different size, color, or item, contact support. Exchanges depend on item availability and return eligibility."
  },
  {
    title: "Damaged or Incorrect Items",
    text:
      "If you receive a damaged or incorrect item, contact us with your order number and clear photos of the item and packaging so we can review the issue."
  },
  {
    title: "Contact Us",
    text:
      "For refund or return questions, contact LUCK CLAWS support at support@luckclaws.com."
  }
];

export default function RefundPolicyPage() {
  return (
    <SupportPageLayout
      eyebrow="Legal"
      title="Refund Policy"
      description="Return, refund, and exchange information for LUCK CLAWS orders."
    >
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
