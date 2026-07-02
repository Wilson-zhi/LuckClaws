"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, Mail, PackageCheck, Sparkles, type LucideIcon } from "lucide-react";

type SupportTopicKey = "product" | "order" | "item-issue";

type SupportTopic = {
  key: SupportTopicKey;
  title: string;
  text: string;
  helper: string;
  Icon: LucideIcon;
};

const supportTopics: SupportTopic[] = [
  {
    key: "product",
    title: "Product questions",
    text: "Tell us what you are shopping for and what your pet needs next.",
    helper: "Share the routine, pet size or style preference, and the category you are comparing.",
    Icon: Sparkles
  },
  {
    key: "order",
    title: "Order help",
    text: "Include your order number so support can review the right details.",
    helper: "Send the order number, checkout email, and the specific update you need.",
    Icon: PackageCheck
  },
  {
    key: "item-issue",
    title: "Damaged or incorrect item",
    text: "Send your order number and photos of the item and packaging.",
    helper: "Photos help support understand what arrived and identify the right next step.",
    Icon: Heart
  }
];

export function AboutSupportModule() {
  const [activeTopicKey, setActiveTopicKey] = useState<SupportTopicKey>("product");
  const activeTopic = supportTopics.find((topic) => topic.key === activeTopicKey) ?? supportTopics[0];

  return (
    <section className="bg-[#f2dfc5] py-12 md:py-20">
      <div className="section-shell">
        <div className="group/about-contact relative overflow-hidden rounded-[40px] border border-[#e4caa5] bg-[#241407] p-5 text-white shadow-ambient md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-[#ffd98d]/22 transition-transform duration-500 ease-out group-hover/about-contact:-translate-x-4 group-hover/about-contact:translate-y-4 group-hover/about-contact:rotate-[8deg] motion-reduce:group-hover/about-contact:translate-x-0 motion-reduce:group-hover/about-contact:translate-y-0 motion-reduce:group-hover/about-contact:rotate-0" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-[#ffd98d]/12 blur-2xl transition-transform duration-500 ease-out group-hover/about-contact:translate-x-5 group-hover/about-contact:-translate-y-4 group-hover/about-contact:scale-110 motion-reduce:group-hover/about-contact:translate-x-0 motion-reduce:group-hover/about-contact:translate-y-0 motion-reduce:group-hover/about-contact:scale-100" />

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-stretch">
            <div className="flex min-h-[480px] flex-col justify-between rounded-[32px] border border-white/12 bg-white/[0.06] p-6 md:p-8">
              <div>
                <span className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd98d]">
                  Support concierge
                </span>
                <h2 className="mt-6 font-heading text-4xl font-extrabold leading-[1.02] md:text-6xl">
                  Need help choosing?
                </h2>
                <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/72 md:text-base">
                  Tell us what you are shopping for, what your pet needs, or what happened with an order. We will
                  help you find the right next step.
                </p>
                <p className="mt-5 flex flex-wrap items-center gap-2 text-sm leading-7 text-white/72">
                  <Mail aria-hidden className="h-4 w-4 text-[#ffd98d]" />
                  <span className="font-bold text-white">Email:</span>
                  <a
                    href="mailto:support@luckclaws.com"
                    className="font-bold text-[#ffd98d] underline-offset-4 transition hover:text-white hover:underline"
                  >
                    support@luckclaws.com
                  </a>
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#ffd98d] px-8 py-3 font-heading font-bold text-[#241407] transition hover:-translate-y-0.5 hover:bg-[#f7c868] motion-reduce:hover:translate-y-0"
                >
                  Contact Us
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center rounded-full border border-white/22 bg-white/[0.08] px-8 py-3 font-heading font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.14] motion-reduce:hover:translate-y-0"
                >
                  Explore Collections
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-[#fffaf1] p-4 text-[#241407] shadow-soft md:p-5">
              <div className="grid gap-3">
                {supportTopics.map(({ key, title, text, Icon }) => {
                  const selected = key === activeTopicKey;

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      className={`group rounded-[24px] border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        selected
                          ? "border-[#241407] bg-[#241407] text-white shadow-soft"
                          : "border-[#e4caa5] bg-white hover:-translate-y-0.5 hover:border-[#b68742] motion-reduce:hover:translate-y-0"
                      }`}
                      onClick={() => setActiveTopicKey(key)}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                            selected ? "bg-[#ffd98d] text-[#241407]" : "bg-[#ffe4ad] text-[#8a5a00]"
                          }`}
                        >
                          <Icon aria-hidden className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block font-heading text-lg font-extrabold">{title}</span>
                          <span
                            className={`mt-1 block text-sm leading-6 ${
                              selected ? "text-white/72" : "text-[#6f5a43]"
                            }`}
                          >
                            {text}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="homepage-enter mt-4 rounded-[24px] bg-[#f6ead7] p-5" key={activeTopic.key}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a5a00]">Selected path</p>
                <p className="mt-2 font-heading text-2xl font-extrabold">{activeTopic.title}</p>
                <p className="mt-2 text-sm leading-7 text-[#6f5a43]">{activeTopic.helper}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
