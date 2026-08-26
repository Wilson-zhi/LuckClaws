import { mainProduct, type Product } from "@/data/products";
import { ProductHighlightsBand } from "@/components/product/ProductHighlightsBand";

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

  return <ProductHighlightsBand highlights={highlights} />;
}
