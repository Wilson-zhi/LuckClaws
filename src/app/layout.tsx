import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { brandName } from "@/data/products";
import { defaultOgImage, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${brandName} | Premium Pet Toys, Apparel & Everyday Essentials`,
  description:
    "Shop thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
  applicationName: brandName,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    siteName: brandName,
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${brandName} | Premium Pet Essentials`,
    description:
      "Thoughtfully designed pet toys, apparel, walking essentials, beds, blankets, and enrichment products for dogs and cats.",
    images: [
      {
        url: defaultOgImage,
        alt: `${brandName} premium pet essentials for dogs and cats`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | Premium Pet Essentials`,
    description: "Thoughtfully designed pet essentials for playful pets and modern pet parents.",
    images: [defaultOgImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
