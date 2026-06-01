import Link from "next/link";
import { brandName } from "@/data/products";

const footerGroups = [
  {
    title: "Shop",
    links: ["Dog Toys", "Cat Toys", "Pet Apparel", "Walking Essentials", "Beds & Blankets"]
  },
  {
    title: "Support",
    links: ["Contact Us", "Shipping & Returns", "FAQ", "Track Order"]
  },
  {
    title: "Company",
    links: ["About Us", "Sustainability", "Community"]
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Refund Policy"]
  }
];

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-lg bg-inverse-surface text-inverse-on-surface">
      <div className="section-shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="font-heading text-xl font-bold text-primary-container">
              {brandName}
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-inverse-on-surface/80">
              Premium supplies for the modern pet parent. Designed with love, crafted with care.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wide">{group.title}</h2>
              <ul className="mt-5 space-y-3 text-sm text-inverse-on-surface/80">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={link === "About Us" ? "/about" : "#"}
                      className="transition hover:text-primary-container"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-inverse-on-surface/70">
          © 2024 {brandName}
        </div>
      </div>
    </footer>
  );
}

