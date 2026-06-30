"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { ArrowRight, Bed, HelpCircle, PawPrint, Route, SearchCheck } from "lucide-react";

type GuideLink = {
  label: string;
  href: string;
};

type GuideOption = {
  key: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  details: string[];
  links: GuideLink[];
};

const guideOptions: GuideOption[] = [
  {
    key: "play",
    label: "Energy to spend",
    eyebrow: "Play path",
    title: "Start with toys that make daily energy easier to direct.",
    description:
      "For chewing, chasing, sniffing, pouncing, and curious pets who need a better outlet before the day gets noisy.",
    image: "/images/category-dog-toys.jpg",
    imageAlt: "Dog toys styled on a warm neutral background.",
    Icon: PawPrint,
    details: ["Good for enrichment", "Dog and cat paths", "Simple product comparison"],
    links: [
      { label: "Dog Toys", href: "/collections/dog-toys" },
      { label: "Cat Toys", href: "/collections/cat-toys" }
    ]
  },
  {
    key: "walk",
    label: "Heading outside",
    eyebrow: "Walk path",
    title: "Choose out-the-door essentials before adding extras.",
    description:
      "For daily walks, quick errands, and weather shifts where comfort, movement, and practical gear matter first.",
    image: "/images/category-walking-essentials.jpg",
    imageAlt: "Walking essentials arranged as a warm lifestyle product scene.",
    Icon: Route,
    details: ["Walking gear first", "Apparel when useful", "Clear route to checkout"],
    links: [
      { label: "Walking Essentials", href: "/collections/walking-essentials" },
      { label: "Pet Apparel", href: "/collections/pet-apparel" }
    ]
  },
  {
    key: "rest",
    label: "A calmer home",
    eyebrow: "Rest path",
    title: "Build a softer corner for rest, recovery, and slower routines.",
    description:
      "For pets who need a better place to settle, warmer textures, or a more comfortable home routine.",
    image: "/images/category-beds-blankets.jpg",
    imageAlt: "Soft pet bedding and blanket texture in a calm home setting.",
    Icon: Bed,
    details: ["Rest-focused products", "Soft everyday textures", "Less visual noise"],
    links: [
      { label: "Beds & Blankets", href: "/collections/beds-and-blankets" },
      { label: "Explore Collections", href: "/collections" }
    ]
  },
  {
    key: "support",
    label: "Need help choosing",
    eyebrow: "Support path",
    title: "Use support as part of the shopping path, not an afterthought.",
    description:
      "For product questions, order questions, or moments where you want a clearer next step before buying.",
    image: "/images/about-partners.jpg",
    imageAlt: "A warm pet lifestyle moment representing customer support and practical guidance.",
    Icon: HelpCircle,
    details: ["Product questions", "Order support", "Straightforward next steps"],
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" }
    ]
  }
];

export function HomeDecisionGuide() {
  const [activeKey, setActiveKey] = useState(guideOptions[0].key);
  const activeOption = useMemo(
    () => guideOptions.find((option) => option.key === activeKey) ?? guideOptions[0],
    [activeKey]
  );

  return (
    <section
      id="shop-by-routine"
      className="bg-[linear-gradient(180deg,#F3E5D2_0%,#FFF9EF_18%,#FFF9EF_82%,#F7EAD8_100%)] py-16 md:py-24"
    >
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Routine advisor</p>
            <h2 className="mt-3 max-w-xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight md:text-6xl">
              Choose by moment, not by aisle.
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#6B5540]">
              Start with what your pet needs today, then follow a shorter path to the products that make sense.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Shopping routine advisor">
              {guideOptions.map(({ key, label, Icon }) => {
                const isActive = key === activeOption.key;

                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`group flex min-h-[76px] items-center justify-between gap-4 rounded-[1.25rem] border px-4 text-left shadow-soft transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                      isActive
                        ? "border-primary bg-[#2C1A0D] text-white"
                        : "border-[#E5C9A4] bg-white/82 text-[#4E3928] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:shadow-lift motion-reduce:hover:translate-y-0"
                    }`}
                    onClick={() => setActiveKey(key)}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-full transition ${
                          isActive
                            ? "bg-[#FFD894] text-[#2C1A0D]"
                            : "bg-primary-container/20 text-primary group-hover:bg-primary-container"
                        }`}
                      >
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="font-heading text-base font-extrabold">{label}</span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={`h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 ${
                        isActive ? "text-[#FFD894]" : "text-primary"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <article
              className="grid overflow-hidden rounded-[2rem] border border-[#E4C8A3] bg-[#2C1A0D] text-white shadow-lift md:grid-cols-[0.86fr_1.14fr]"
              aria-live="polite"
            >
              <div className="relative min-h-[280px] overflow-hidden md:min-h-[430px]">
                <Image
                  key={activeOption.image}
                  src={activeOption.image}
                  alt={activeOption.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-cover transition duration-500 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(36,23,14,0.62)_0%,rgba(36,23,14,0.12)_58%,rgba(36,23,14,0.05)_100%)]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.1rem] border border-white/16 bg-[#2C1A0D]/58 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894]">
                    {activeOption.eyebrow}
                  </p>
                  <p className="mt-1 font-heading text-xl font-extrabold">A shorter route to shop.</p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#FFD894]/28 bg-[#FFD894]/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894]">
                    <SearchCheck aria-hidden className="h-4 w-4" />
                    Guided choice
                  </p>
                  <h3 className="mt-5 max-w-xl font-heading text-3xl font-extrabold leading-tight md:text-5xl">
                    {activeOption.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/76">
                    {activeOption.description}
                  </p>
                </div>

                <div className="grid gap-5">
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {activeOption.details.map((detail) => (
                      <li
                        key={detail}
                        className="rounded-[1rem] border border-white/12 bg-white/[0.07] px-4 py-3 text-sm font-bold leading-5 text-white/82"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    {activeOption.links.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD894] ${
                          index === 0
                            ? "bg-[#FFD894] text-[#2C1A0D] hover:bg-primary-container hover:shadow-soft"
                            : "border border-white/24 bg-white/10 text-white hover:bg-white hover:text-[#2C1A0D]"
                        }`}
                      >
                        {link.label}
                        <ArrowRight
                          aria-hidden
                          className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
