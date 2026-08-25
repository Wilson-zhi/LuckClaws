import Link from "next/link";
import {
  companyFooterLinks,
  legalFooterLinks,
  shopFooterLinks,
  supportFooterLinks
} from "@/data/navigation";
import { brandName } from "@/data/products";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { CookiePreferencesButton } from "@/components/layout/CookiePreferencesButton";

const footerGroups = [
  {
    title: "Shop",
    links: shopFooterLinks
  },
  {
    title: "Support",
    links: supportFooterLinks
  },
  {
    title: "Company",
    links: companyFooterLinks
  },
  {
    title: "Legal",
    links: legalFooterLinks
  }
];

export function Footer() {
  return (
    <footer className="bg-[linear-gradient(180deg,#F3E5D2_0%,#2D1B10_88px,#2D1B10_100%)] pt-16 text-[#FFF8EF]">
      <div className="section-shell pb-12 pt-8 md:pb-16 md:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1.75fr] lg:gap-14">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex rounded-full border border-[#F4D7A5]/30 px-4 py-2 font-heading text-xl font-extrabold text-[#F4B13D] transition hover:border-[#F4B13D] hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B13D]"
            >
              {brandName}
            </Link>
            <p className="mt-5 text-sm leading-6 text-[#F7E8D0]/82">
              Practical pet essentials for everyday routines.
            </p>
            <p className="mt-5 text-sm leading-6 text-[#F7E8D0]/82">
              Support email:{" "}
              <a
                href="mailto:support@luckclaws.com"
                className="font-semibold text-[#F4B13D] underline-offset-4 transition hover:text-[#FFD58A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B13D]"
              >
                support@luckclaws.com
              </a>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[#F4D7A5]">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3 text-sm text-[#F7E8D0]/78">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex transition hover:translate-x-0.5 hover:text-[#F4B13D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B13D] motion-reduce:hover:translate-x-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-[#F7E8D0]/65 md:flex-row md:items-center md:justify-between">
          <span>
            &copy; <CurrentYear /> {brandName}
          </span>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
            <CookiePreferencesButton />
            <span>Warm routine-first shopping for dogs, cats, and daily pet life.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
