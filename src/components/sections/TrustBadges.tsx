import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Pet-Conscious Materials",
    text: "Carefully selected materials designed for everyday comfort and play."
  },
  {
    icon: Truck,
    title: "Free Shipping Over $50",
    text: "Enjoy free shipping on qualifying orders."
  },
  {
    icon: RotateCcw,
    title: "30-Day Easy Returns",
    text: "Hassle-free returns within 30 days."
  }
];

export function TrustBadges() {
  return (
    <section className="section-shell">
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        {badges.map((badge) => (
          <div key={badge.title} className="rounded-lg bg-surface-container-lowest p-6 text-center shadow-soft">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
              <badge.icon aria-hidden className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-heading font-bold">{badge.title}</h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{badge.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
