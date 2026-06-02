import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";

export const metadata: Metadata = {
  title: `Privacy Policy | ${brandName}`,
  description:
    "Read the LUCK CLAWS privacy policy placeholder for ecommerce information collection, cookies, third-party services, and choices."
};

const sections = [
  {
    title: "Information We Collect",
    text:
      "We may collect information you provide when placing an order, contacting support, creating an account, or signing up for updates, such as your name, email, shipping address, billing details, and order information."
  },
  {
    title: "How We Use Information",
    text:
      "We use information to process orders, provide customer support, improve the shopping experience, communicate order updates, and share marketing messages when permitted."
  },
  {
    title: "Cookies and Analytics",
    text:
      "We may use cookies and similar technologies to keep the website working, remember preferences, understand site performance, and improve product discovery."
  },
  {
    title: "Third-Party Services",
    text:
      "We may work with service providers for payment processing, shipping, analytics, marketing, and website operations. These providers process information as needed to support our store."
  },
  {
    title: "Your Choices",
    text:
      "You may unsubscribe from marketing emails when available and may contact us to request help with privacy-related questions about your account or order information."
  },
  {
    title: "Contact Us",
    text:
      "For privacy questions, contact LUCK CLAWS support at support@luckclaws.com."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <SupportPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="A simple privacy policy placeholder for the LUCK CLAWS ecommerce MVP."
    >
      <div className="mb-6 rounded-lg border border-primary-container/50 bg-primary-container/10 p-5 text-sm leading-6 text-on-surface-variant">
        This is placeholder content and should be reviewed before final launch.
      </div>
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
