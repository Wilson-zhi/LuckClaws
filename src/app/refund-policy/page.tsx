import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Refund Policy | ${brandName}`,
    description:
      "Read the LUCK CLAWS refund policy for damaged, defective, or incorrect items.",
    path: "/refund-policy"
  })
};

const sections = [
  {
    title: "Policy Summary",
    text:
      "We only accept refund or return requests for items that arrive damaged, defective, or incorrect."
  },
  {
    title: "7-Day Issue Reporting Window",
    text:
      "Damaged, defective, or incorrect items must be reported within 7 days of delivery."
  },
  {
    title: "How to Request Support",
    text: (
      <>
        Contact{" "}
        <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
          support@luckclaws.com
        </a>{" "}
        with your order number, photos of the item and packaging, and a short description of the issue.
      </>
    )
  },
  {
    title: "Non-Returnable Items",
    text:
      "We do not accept returns for buyer's remorse, preference changes, wrong size selection, normal wear and tear, misuse, or items damaged after delivery through pet use."
  },
  {
    title: "Item Condition",
    text:
      "Items must not be used beyond inspection if a return is requested. Do not send items back before contacting support."
  },
  {
    title: "Refund Processing",
    text:
      "If the issue is approved, we may offer a replacement, refund, or return instructions depending on the case. Refund processing time may vary by payment provider."
  },
  {
    title: "Exchanges",
    text:
      "Exchanges are reviewed only for approved damaged, defective, or incorrect item cases and depend on item availability."
  },
  {
    title: "Shipping Fees",
    text:
      "Shipping fees are non-refundable unless the issue is due to a damaged, defective, or incorrect item."
  },
  {
    title: "Contact Us",
    text: (
      <>
        For refund or return questions, contact LUCK CLAWS support at{" "}
        <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
          support@luckclaws.com
        </a>
        .
      </>
    )
  }
];

export default function RefundPolicyPage() {
  return (
    <SupportPageLayout
      eyebrow="Legal"
      title="Refund Policy"
      description="We only accept refund or return requests for items that arrive damaged, defective, or incorrect."
      backLink={{ href: "/", label: "Back Home" }}
    >
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
