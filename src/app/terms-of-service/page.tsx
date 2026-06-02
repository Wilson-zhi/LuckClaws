import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Terms of Service | ${brandName}`,
    description:
      "Read the LUCK CLAWS terms of service for website use, product information, orders, payments, shipping, and returns.",
    path: "/terms-of-service"
  })
};

const sections = [
  {
    title: "Use of the Website",
    text:
      "By using this website, you agree to use it for lawful purposes and to avoid actions that could interfere with site security, availability, or customer experience."
  },
  {
    title: "Product Information",
    text:
      "We aim to present product details, images, descriptions, and care information clearly. Actual product color, texture, or packaging may vary slightly based on display settings and production updates."
  },
  {
    title: "Pricing and Availability",
    text:
      "Prices and availability may change without notice. We may correct errors, update product information, or limit quantities when needed."
  },
  {
    title: "Orders and Payments",
    text:
      "Submitting an order does not guarantee acceptance. Orders are subject to payment authorization, availability, and standard review for accuracy or fraud prevention."
  },
  {
    title: "Shipping and Returns",
    text:
      "Shipping and return details are described in our Shipping & Returns and Refund Policy pages. Please review those pages before placing an order."
  },
  {
    title: "Limitation of Liability",
    text:
      "To the fullest extent allowed by applicable law, LUCK CLAWS is not responsible for indirect, incidental, or consequential damages related to website use or product purchase."
  },
  {
    title: "Contact Us",
    text:
      "For questions about these terms, contact LUCK CLAWS support at support@luckclaws.com."
  }
];

export default function TermsOfServicePage() {
  return (
    <SupportPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      description="Simple terms placeholder for the LUCK CLAWS ecommerce MVP."
    >
      <div className="mb-6 rounded-lg border border-primary-container/50 bg-primary-container/10 p-5 text-sm leading-6 text-on-surface-variant">
        This is placeholder content and should be reviewed before final launch.
      </div>
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
