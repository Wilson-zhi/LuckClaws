import type { Metadata } from "next";
import { LoginForm } from "@/components/account/AuthForms";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Sign In | ${brandName}`,
    description: "Sign in to your LUCK CLAWS customer account.",
    path: "/account/login",
    noIndex: true
  })
};

export default function LoginPage() {
  return (
    <SupportPageLayout
      eyebrow="Account"
      title="Sign In"
      description="Access your LUCK CLAWS account, saved addresses, and order history."
    >
      <div className="max-w-xl">
        <LoginForm />
      </div>
    </SupportPageLayout>
  );
}
