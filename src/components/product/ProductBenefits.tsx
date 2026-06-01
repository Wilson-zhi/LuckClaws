import { Brain, Flower2, Sparkles, WashingMachine } from "lucide-react";
import { mainProduct } from "@/data/products";

const icons = [Brain, Flower2, Sparkles, WashingMachine];

const benefitCopy = [
  "10 mins of sniffing burns as many calories as an hour's walk.",
  "Turns mealtime into a fun puzzle, preventing gulping and digestive issues.",
  "Foraging releases dopamine, helping to calm stressed or hyperactive pups.",
  "Machine washable for easy cleaning after messy foraging sessions."
];

export function ProductBenefits() {
  return (
    <section className="section-shell">
      <div className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-8">
        <h2 className="font-heading text-2xl font-bold">Why Dogs Love It</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {mainProduct.benefits?.map((benefit, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <div key={benefit} className="rounded-md bg-surface-container-low p-5 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-bold">{benefit}</h3>
                <p className="mt-2 text-xs leading-5 text-on-surface-variant">{benefitCopy[index]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

