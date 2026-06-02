import Link from "next/link";
import { shopFooterLinks } from "@/data/navigation";
import { brandName } from "@/data/products";

const footerGroups = [
  {
    title: "Shop",
    links: shopFooterLinks
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Track Order", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Sustainability", href: "#" },
      { label: "Community", href: "#" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" }
    ]
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
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-primary-container">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-inverse-on-surface/70">
          &copy; 2024 {brandName}
        </div>
      </div>
    </footer>
  );
}
