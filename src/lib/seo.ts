import type { Metadata } from "next";
import { brandName } from "@/data/products";

export const siteUrl = "https://luckclaws.com";
export const defaultOgImage = "/images/hero-dog-running.jpg";
export const productOgImage = "/images/interactive-snuffle-mat-lifestyle.jpg";
export const iconPath = "/icon.svg";

type SeoMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function createSeoMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  imageAlt = `${brandName} premium pet essentials`,
  openGraphTitle,
  openGraphDescription,
  twitterTitle,
  twitterDescription,
  noIndex = false
}: SeoMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      siteName: brandName,
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle ?? title,
      description: twitterDescription ?? description,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : undefined
  };
}
