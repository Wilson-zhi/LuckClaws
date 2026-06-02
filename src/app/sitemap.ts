import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.9 },
  { path: "/collections/dog-toys", changeFrequency: "weekly", priority: 0.9 },
  { path: "/collections/cat-toys", changeFrequency: "weekly", priority: 0.85 },
  { path: "/collections/pet-apparel", changeFrequency: "weekly", priority: 0.85 },
  { path: "/collections/walking-essentials", changeFrequency: "weekly", priority: 0.85 },
  { path: "/collections/beds-blankets", changeFrequency: "weekly", priority: 0.85 },
  { path: "/sale", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/interactive-snuffle-mat", changeFrequency: "weekly", priority: 0.9 },
  { path: "/search", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shipping-returns", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/track-order", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.5 }
] satisfies Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
