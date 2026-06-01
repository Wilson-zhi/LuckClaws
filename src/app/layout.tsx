import type { Metadata } from "next";
import "./globals.css";
import { brandName } from "@/data/products";

export const metadata: Metadata = {
  metadataBase: new URL("https://luckclaws.example"),
  title: `${brandName} | Premium Pet Essentials for Dogs and Cats`,
  description:
    "Premium pet toys, apparel, walking essentials, beds, and everyday supplies for modern pet parents.",
  applicationName: brandName,
  openGraph: {
    title: `${brandName} | Premium Pet Essentials for Dogs and Cats`,
    description:
      "Warm, premium, playful pet essentials designed for daily comfort and enrichment.",
    siteName: brandName,
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
