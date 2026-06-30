import { Heart, Lock, SearchCheck, ShieldCheck, Truck } from "lucide-react";
import { freeShippingLabel } from "@/lib/shipping";

const badges = [
  {
    icon: Lock,
    title: "Secure checkout",
    text: "Checkout flows stay simple, protected, and easy to review before payment."
  },
  {
    icon: SearchCheck,
    title: "Clear product details",
    text: "Product pages focus on price, use case, category, and practical buying details."
  },
  {
    icon: ShieldCheck,
    title: "Damaged item support",
    text: "Support is available for damaged, defective, or incorrect items after delivery."
  },
  {
    icon: Heart,
    title: "Pet-conscious picks",
    text: "The storefront is organized around daily routines, not overwhelming choice."
  },
  {
    icon: Truck,
    title: freeShippingLabel,
    text: "Shipping messaging stays consistent from homepage through checkout."
  }
];

export function TrustBadges() {
  return (
    <section className="bg-[linear-gradient(180deg,#2C1A0D_0%,#2C1A0D_78%,#FFF9EF_100%)] pb-24 pt-14 text-white md:pb-28 md:pt-20">
      <div className="section-shell">
        <div className="grid gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD894]">Shop with clarity</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                Practical promises, clearly stated.
              </h2>
            </div>
            <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/72 md:mt-0 md:text-base">
              LUCK CLAWS should feel calm to shop: clear product paths, consistent service copy, and no vague claims.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {badges.map((badge) => (
              <article
                key={badge.title}
                className="rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-5 shadow-soft transition hover:-translate-y-1 hover:bg-white/[0.10] motion-reduce:hover:translate-y-0"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFD894]/12 text-[#FFD894]">
                  <badge.icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-white">{badge.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/68">{badge.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
