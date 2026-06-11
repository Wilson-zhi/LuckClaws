import type { Metadata } from "next";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_RATE } from "@/lib/shipping";

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
    title: "How much is shipping?",
    content:
      `Door-to-door shipping starts at $${DEFAULT_SHIPPING_RATE.toFixed(2)} for orders under $${FREE_SHIPPING_THRESHOLD} and may vary by item size or product type. Orders over $${FREE_SHIPPING_THRESHOLD} qualify for free shipping.`
  },
  {
    title: "How long does shipping take?",
    content:
      "Orders are typically processed within 1-3 business days. Standard delivery usually takes 7-15 business days after processing."
  },
  {
    title: "How do I track my order?",
    content:
      "Use the Track Order page with your email address and order number. If you need help, contact support@luckclaws.com."
  },
  {
    title: "Do you accept returns?",
    content:
      "We only accept return or refund requests for items that arrive damaged, defective, or incorrect. Please contact support@luckclaws.com within 7 days of delivery with your order number and photos of the issue."
  },
  {
    title: "Can I return an item if I changed my mind?",
    content:
      "We do not accept returns for buyer's remorse, preference changes, or wrong size selection. Please review product details carefully before ordering."
  },
  {
    title: "What should I do if my item arrives damaged or incorrect?",
    content:
      "Contact support@luckclaws.com within 7 days of delivery with your order number, photos of the item and packaging, and a short description of the issue. We will review the case and provide next steps."
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
      "Email: support@luckclaws.com or use the Contact Us page. Please include your order number if your question is about an existing order."
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
