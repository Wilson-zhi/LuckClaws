import { Heart, Lock, SearchCheck, ShieldCheck, Truck } from "lucide-react";
import { freeShippingLabel } from "@/lib/shipping";

const badges = [
  {
    icon: Lock,
    title: "Secure checkout"
  },
  {
    icon: SearchCheck,
    title: "Clear product details"
  },
  {
    icon: ShieldCheck,
    title: "Damaged or incorrect item support"
  },
  {
    icon: Heart,
    title: "Support when needed"
  },
  {
    icon: Truck,
    title: freeShippingLabel
  }
];

export function TrustBadges() {
  return (
    <section className="bg-[#2C1A0D] py-5 text-white">
      <div className="section-shell">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex min-w-max items-center gap-3">
            {badges.map((badge, index) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-3 text-sm font-bold text-white/88">
                  <badge.icon aria-hidden className="h-4 w-4 text-[#FFD894]" />
                  {badge.title}
                </div>
                {index < badges.length - 1 && <span className="text-[#FFD894]/70" aria-hidden>•</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
