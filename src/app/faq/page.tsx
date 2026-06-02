import type { Metadata } from "next";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `FAQ | ${brandName}`,
    description:
      "Find answers to common questions about LUCK CLAWS products, shipping, returns, sizing, and order support.",
    path: "/faq"
  })
};

const questions = [
  {
    title: "How long does shipping take?",
    content:
      "Shipping time depends on your destination and the shipping method available at checkout. Order updates will be sent by email when available."
  },
  {
    title: "How do I track my order?",
    content:
      "Use the Track Order page with your email address and order number. If you need help, contact support@luckclaws.com."
  },
  {
    title: "Can I return an item?",
    content:
      "Unused items may be eligible for return within 30 days of delivery. Please review the Refund Policy for return eligibility details."
  },
  {
    title: "Are your products safe for pets?",
    content:
      "LUCK CLAWS selects products with pet comfort and everyday safety in mind. Always supervise play and remove damaged toys or accessories."
  },
  {
    title: "How do I choose the right size?",
    content:
      "Measure your pet carefully and compare those measurements to the product details when available. If you are unsure, contact support before ordering."
  },
  {
    title: "Do you ship internationally?",
    content:
      "Available shipping regions may vary. Enter your shipping address at checkout to see the current options for your location."
  },
  {
    title: "How can I contact support?",
    content:
      "Email support@luckclaws.com or use the Contact Us page. Please include your order number if your question is about an existing order."
  }
];

export default function FaqPage() {
  return (
    <SupportPageLayout
      eyebrow="Help Center"
      title="FAQ"
      description="Quick answers to common questions about shopping with LUCK CLAWS."
    >
      <div className="ambient-card p-6 md:p-8">
        <ProductAccordion items={questions} />
      </div>
    </SupportPageLayout>
  );
}
