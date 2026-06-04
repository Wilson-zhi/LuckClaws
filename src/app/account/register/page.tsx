import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/AuthForms";
import { SupportPageLayout } from "@/components/support/SupportPageLayout";
import { brandName } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Create Account | ${brandName}`,
    description: "Create a LUCK CLAWS customer account.",
    path: "/account/register",
    noIndex: true
  })
};

export default function RegisterPage() {
  return (
    <SupportPageLayout
      eyebrow="Account"
      title="Create Account"
      description="Create an account to manage saved addresses and view orders linked to your email."
    >
      <div className="max-w-xl">
        <RegisterForm />
      </div>
    </SupportPageLayout>
  );
}
