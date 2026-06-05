import { Brain, Search, Utensils, WashingMachine } from "lucide-react";
import { mainProduct, type Product } from "@/data/products";

const icons = [Search, Utensils, Brain, WashingMachine];

const benefitCopy = [
  "Hide dry treats or kibble between the fleece folds to invite sniffing and searching.",
  "Use with snacks or a portion of meals to encourage slower, more focused eating.",
  "Adds a simple indoor activity that supports daily enrichment.",
  "Shake out crumbs, machine wash cold, and air dry fully before reuse."
];

export function ProductBenefits({ product = mainProduct }: { product?: Product }) {
  const highlights = product.productHighlights?.length
    ? product.productHighlights
    : product.benefits?.map((benefit, index) => ({
        title: benefit,
        text: benefitCopy[index] ?? "Selected for supervised everyday enrichment."
      })) ?? [];

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="section-shell">
      <div className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-8">
        <h2 className="font-heading text-2xl font-bold">Product Highlights</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {highlights.map((highlight, index) => {
            const Icon = icons[index] ?? Brain;
            return (
              <div key={highlight.title} className="rounded-md bg-surface-container-low p-5 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-bold">{highlight.title}</h3>
                <p className="mt-2 text-xs leading-5 text-on-surface-variant">{highlight.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
