"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, PackageCheck, Sparkles, type LucideIcon } from "lucide-react";

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
    <section className="section-shell py-12 md:py-20">
      <div className="relative overflow-hidden rounded-[32px] bg-primary-container p-6 text-on-primary-container shadow-ambient md:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/35" />
        <div className="pointer-events-none absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-white/20" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/45 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              Support
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Need help choosing?
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 md:text-base">
              Tell us what you are shopping for, what your pet needs, or what happened with an
              order. We will help you find the right next step.
            </p>
            <p className="mt-4 text-sm leading-7">
              <span className="font-bold">Email:</span>{" "}
              <a href="mailto:support@luckclaws.com" className="font-bold underline underline-offset-4">
                support@luckclaws.com
              </a>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-heading font-bold text-white transition hover:bg-primary/90"
              >
                Contact Us
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center rounded-full border border-primary/35 bg-white/75 px-8 py-3 font-heading font-bold text-on-surface transition hover:bg-white"
              >
                Explore Collections
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] bg-white/60 p-4 text-on-surface shadow-soft backdrop-blur md:p-5">
            <div className="grid gap-3">
              {supportTopics.map(({ key, title, text, Icon }) => {
                const selected = key === activeTopicKey;

                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    className={`group rounded-[18px] border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      selected
                        ? "border-primary bg-white shadow-soft"
                        : "border-white/70 bg-white/55 hover:border-primary/40 hover:bg-white"
                    }`}
                    onClick={() => setActiveTopicKey(key)}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                          selected ? "bg-primary text-white" : "bg-primary-container/25 text-primary"
                        }`}
                      >
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-heading font-bold">{title}</span>
                        <span className="mt-1 block text-sm leading-6 text-on-surface-variant">{text}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="homepage-enter mt-4 rounded-[18px] bg-surface-container-low p-5" key={activeTopic.key}>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Selected path</p>
              <p className="mt-2 font-heading text-lg font-bold">{activeTopic.title}</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{activeTopic.helper}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
