import { Heart, Lock, ShieldCheck, Truck } from "lucide-react";
import { freeShippingLabel } from "@/lib/shipping";

const badges = [
  {
    icon: Heart,
    title: "Pet-conscious materials",
    text: "Everyday essentials selected with comfort, play, and practical use in mind."
  },
  {
    icon: Truck,
    title: freeShippingLabel,
    text: "A clear shipping threshold for larger routine restocks and multi-item orders."
  },
  {
    icon: ShieldCheck,
    title: "Damaged item support",
    text: "Contact us within 7 days for damaged, defective, or incorrect items."
  },
  {
    icon: Lock,
    title: "Secure checkout",
    text: "Checkout is designed around clear totals, protected payment, and simple confirmation."
  }
];

export function TrustBadges() {
  return (
    <section className="section-shell py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Store standards</p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold">Practical trust signals, stated clearly.</h2>
        </div>
        <div className="hidden rounded-full bg-primary-container/20 px-4 py-2 text-sm font-bold text-primary md:inline-flex">
          Routine-friendly shopping
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-ambient motion-reduce:hover:translate-y-0"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
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
