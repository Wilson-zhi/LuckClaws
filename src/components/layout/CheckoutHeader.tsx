import { Lock } from "lucide-react";
import Link from "next/link";
import { brandName } from "@/data/products";

export function CheckoutHeader() {
  return (
    <header className="border-b border-outline-variant/50 bg-surface-container-lowest">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold text-primary">
          {brandName}
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
          <Lock aria-hidden className="h-5 w-5" />
          Secure Checkout
        </div>
      </div>
    </header>
  );
}

export function CheckoutFooter() {
  const links = ["Shipping & Returns", "Privacy Policy", "Terms of Service", "Contact Us", "Refund Policy"];

  return (
    <footer className="bg-surface-container-high py-8">
      <div className="section-shell flex flex-col gap-6 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <p>© 2024 {brandName}</p>
        <nav aria-label="Checkout footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="transition hover:text-primary">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

