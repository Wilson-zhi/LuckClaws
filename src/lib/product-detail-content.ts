import { products, type Product } from "@/data/products";

export type ProductFaqItem = {
  title: string;
  content: string;
};

type Highlight = {
  title: string;
  text: string;
};

function productUse(product: Product) {
  switch (product.category) {
    case "Cat Toys":
      return "Chasing, pouncing, catnip play, and supervised enrichment.";
    case "Dog Toys":
      return "Everyday play, fetch, tug, chewing, or supervised enrichment.";
    case "Dog Treats":
      return "Reward-based training moments and daily routines.";
    case "Dining":
      return "Everyday feeding and treat-time routines.";
    case "Pet Apparel":
      return "Everyday comfort, cozy walks, or seasonal layering.";
    case "Walking Essentials":
      return "Daily walks, outdoor routines, and prepared outings.";
    case "Beds & Blankets":
      return "Rest, comfort, crate, couch, or travel support.";
    case "Storage":
      return "Treat storage and countertop organization.";
    default:
      return "Everyday pet care routines.";
  }
}

export function getProductHighlights(product: Product): Highlight[] {
  if (product.benefits?.length) {
    return product.benefits.map((benefit) => ({
      title: benefit,
      text: "Selected for everyday use as part of a supervised pet care routine."
    }));
  }

  switch (product.category) {
    case "Cat Toys":
      return [
        { title: "Built for curious cats", text: "Designed for chasing, pouncing, and daily enrichment." },
        { title: "Easy routine add-on", text: "Simple to bring out for short supervised play sessions." },
        { title: "Lightweight play format", text: "Selected for active indoor play and quick engagement." },
        { title: "Inspect before use", text: "Check regularly and remove if damaged or loose parts appear." }
      ];
    case "Dog Toys":
      return [
        { title: "Everyday play ready", text: "Selected for supervised play, enrichment, fetch, tug, or chewing routines." },
        { title: "Supports daily variety", text: "Helps add a focused activity to your pet's normal day." },
        { title: "Simple care guidance", text: "Wipe clean or spot clean as needed, then dry fully before reuse." },
        { title: "Use with supervision", text: "Inspect regularly and remove the toy if damaged." }
      ];
    case "Pet Apparel":
      return [
        { title: "Comfort-focused layer", text: "Designed for everyday comfort, cozy walks, or seasonal layering." },
        { title: "Easy outfit rotation", text: "A practical apparel option for relaxed routines." },
        { title: "Fit-first approach", text: "Check sizing before ordering and remove if your pet shows discomfort." },
        { title: "Gentle care", text: "Follow the care label where available; use cold or gentle care when appropriate." }
      ];
    case "Walking Essentials":
      return [
        { title: "Daily walk support", text: "Selected for everyday walks and outdoor routines." },
        { title: "Routine-ready design", text: "Made for repeated use during normal pet-parent errands and strolls." },
        { title: "Check before each walk", text: "Inspect fit and hardware before heading outside." },
        { title: "Easy upkeep", text: "Wipe clean after outdoor use and let dry fully." }
      ];
    case "Beds & Blankets":
      return [
        { title: "Comfort for rest", text: "Selected for naps, quiet corners, crates, couches, or travel routines." },
        { title: "Soft everyday setup", text: "A practical comfort piece for daily home use." },
        { title: "Simple care", text: "Follow wash instructions where available and dry fully before reuse." },
        { title: "Routine friendly", text: "Easy to place where your pet already likes to settle." }
      ];
    default:
      return [
        { title: "Everyday useful", text: "Selected for practical pet care routines." },
        { title: "Simple to use", text: "Designed to fit naturally into daily care, play, or storage habits." },
        { title: "Easy upkeep", text: product.careGuidance },
        { title: "Inspect regularly", text: product.safetyNotice }
      ];
  }
}

export function getProductDetails(product: Product) {
  const details = [
    ["Product type", product.productType],
    ["Category", product.category],
    ["Use", productUse(product)],
    ["Care", product.careGuidance],
    ["Safety", product.safetyNotice]
  ];

  if (product.selectedColor) {
    details.splice(2, 0, ["Color", product.selectedColor]);
  }

  if (product.size) {
    details.splice(product.selectedColor ? 3 : 2, 0, ["Size", product.size]);
  }

  if (product.material) {
    details.splice(product.selectedColor || product.size ? 4 : 2, 0, ["Material", product.material]);
  } else if (product.materialTags?.length) {
    details.splice(product.selectedColor || product.size ? 4 : 2, 0, ["Material focus", product.materialTags.join(", ")]);
  }

  return details;
}

export function getBestForItems(product: Product) {
  switch (product.category) {
    case "Cat Toys":
      return ["Chasing and pouncing", "Short supervised play sessions", "Indoor enrichment", "Cats who enjoy interactive toys"];
    case "Dog Toys":
      return ["Supervised play sessions", "Fetch, tug, chewing, or enrichment routines", "Adding variety to daily activity", "Dogs who enjoy interactive toys"];
    case "Dog Treats":
      return ["Reward-based training", "Daily reinforcement moments", "Treat-based routines", "Pet parents managing portions thoughtfully"];
    case "Pet Apparel":
      return ["Cozy walks", "Seasonal layering", "Relaxed everyday comfort", "Pets measured before ordering"];
    case "Walking Essentials":
      return ["Daily walks", "Outdoor routines", "Errands with your pet", "Pet parents who check fit before use"];
    case "Beds & Blankets":
      return ["Naps and quiet time", "Crates, couches, or travel", "Everyday comfort", "Pets who like a soft resting spot"];
    default:
      return ["Daily pet care routines", "Organized homes", "Simple everyday use", "Pet parents who inspect products regularly"];
  }
}

export function getCareInstructions(product: Product) {
  switch (product.category) {
    case "Cat Toys":
    case "Dog Toys":
      return ["Use during supervised play", "Wipe clean or spot clean as needed", "Let dry fully before reuse", "Inspect regularly and remove if damaged"];
    case "Dog Treats":
      return ["Keep sealed between uses", "Use as a reward in appropriate portions", "Store according to package guidance where available", "Supervise while feeding"];
    case "Dining":
      return ["Wash regularly with mild soap", "Dry fully before reuse", "Inspect for chips or damage", "Use for normal feeding routines"];
    case "Pet Apparel":
      return ["Check fit before use", "Follow the product care label where available", "Use cold or gentle care when appropriate", "Remove if your pet shows discomfort"];
    case "Walking Essentials":
      return ["Check fit before each walk", "Inspect hardware regularly", "Wipe clean after outdoor use", "Store dry between outings"];
    case "Beds & Blankets":
      return ["Follow wash instructions where available", "Dry fully before reuse", "Shake out loose hair or debris as needed", "Inspect regularly for damage"];
    default:
      return ["Use as intended", "Clean regularly", "Dry fully before reuse", "Inspect regularly and remove if damaged"];
  }
}

export function getShippingReturnItems() {
  return [
    "Free shipping on orders over $50",
    "Standard shipping is $9.99 under $50",
    "Report damaged, defective, or incorrect items within 7 days of delivery"
  ];
}

export function getProductFaqs(product: Product): ProductFaqItem[] {
  const categoryQuestion =
    product.category === "Pet Apparel"
      ? {
          title: "How do I choose the right size?",
          content: "Check sizing before ordering and choose the option that gives your pet comfortable movement."
        }
      : product.category === "Walking Essentials"
        ? {
            title: "What should I check before walks?",
            content: "Check fit and hardware before each walk, and remove the item from use if anything looks worn or damaged."
          }
        : product.category === "Cat Toys" || product.category === "Dog Toys"
          ? {
              title: "Should pets use this unsupervised?",
              content: product.safetyNotice
            }
          : {
              title: "How should this fit into my routine?",
              content: productUse(product)
            };

  return [
    {
      title: `What is ${product.name} best for?`,
      content: productUse(product)
    },
    categoryQuestion,
    {
      title: "How should I care for it?",
      content: product.careGuidance
    },
    {
      title: "What safety guidance should I follow?",
      content: product.safetyNotice
    },
    {
      title: "How do shipping and returns work?",
      content:
        "Free shipping applies over $50, and standard shipping is $9.99 under $50. General returns are not accepted; damaged, defective, or incorrect items must be reported within 7 days of delivery."
    }
  ];
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (relatedProduct) => relatedProduct.id !== product.id && relatedProduct.category === product.category
  );
  const fallback = products.filter(
    (relatedProduct) =>
      relatedProduct.id !== product.id &&
      !sameCategory.some((sameCategoryProduct) => sameCategoryProduct.id === relatedProduct.id)
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
