import type { Metadata } from "next";
import { PolicySections, SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Privacy Policy | ${brandName}`,
    description:
      "Read the LUCK CLAWS privacy policy for information about data collection, cookies, analytics, and customer choices.",
    path: "/privacy-policy"
  })
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
      "Essential browser storage keeps core store features working. Optional Google Analytics and Microsoft Clarity tools are loaded only after you allow analytics through the cookie preference control."
  },
  {
    title: "Third-Party Services",
    text:
      "We may work with service providers for payment processing, shipping, analytics, marketing, and website operations. These providers process information as needed to support our store."
  },
  {
    title: "Your Choices",
    text:
      "You can review or change your analytics preference at any time through Cookie preferences in the site footer. You may also unsubscribe from marketing emails when available and contact us with privacy-related questions."
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
      backLink={{ href: "/", label: "Back Home" }}
    >
      <div className="mb-6 rounded-lg border border-primary-container/50 bg-primary-container/10 p-5 text-sm leading-6 text-on-surface-variant">
        This is placeholder content and should be reviewed before final launch.
      </div>
      <PolicySections sections={sections} />
    </SupportPageLayout>
  );
}
