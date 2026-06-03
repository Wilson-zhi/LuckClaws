import { brandName, getProduct, products, type Product } from "@/data/products";

export type CollectionConfig = {
  slug: string;
  href: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  productCountLabel?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  featuredProductId?: string;
  featuredLabel?: string;
  mobileFilters: string[];
  products: Product[];
};

const productList = (ids: string[]) =>
  ids.map((id) => getProduct(id)).filter((product): product is Product => Boolean(product));

export const collectionConfigs = {
  all: {
    slug: "all",
    href: "/collections",
    title: "Shop All",
    description:
      "Explore thoughtfully designed toys, apparel, walking essentials, cozy beds, and everyday pet favorites for dogs and cats.",
    seoTitle: `Shop All Pet Essentials | ${brandName}`,
    seoDescription:
      "Explore thoughtfully designed toys, apparel, walking essentials, cozy beds, and everyday pet favorites for dogs and cats.",
    primaryCtaLabel: "Shop Best Seller",
    primaryCtaHref: "/products/interactive-snuffle-mat",
    mobileFilters: ["All Products", "Dog Toys", "Cat Toys", "Pet Apparel", "Walking", "Beds"],
    products
  },
  dogToys: {
    slug: "dog-toys",
    href: "/collections/dog-toys",
    title: "Dog Toys",
    description:
      "Shop durable, interactive, and enrichment-focused toys designed for everyday play, chewing, fetching, and treat-based routines.",
    seoTitle: `Dog Toys | ${brandName}`,
    seoDescription:
      "Shop durable, interactive, and thoughtfully designed dog toys for play, enrichment, chewing, and everyday fun.",
    productCountLabel: "4 products",
    primaryCtaLabel: "Shop Interactive Snuffle Mat",
    primaryCtaHref: "/products/interactive-snuffle-mat",
    featuredProductId: "interactive-snuffle-mat",
    featuredLabel: "Best Seller",
    mobileFilters: ["All Dog Toys", "Interactive", "Chew Toys", "Plush & Squeaky", "Fetch & Toss"],
    products: productList([
      "interactive-snuffle-mat",
      "durable-rubber-bone",
      "natural-cotton-tug-rope",
      "corduroy-woodland-fox"
    ])
  },
  catToys: {
    slug: "cat-toys",
    href: "/collections/cat-toys",
    title: "Cat Toys",
    description:
      "Keep your cat curious, active, and entertained with toys for chasing, pouncing, catnip play, and everyday enrichment.",
    seoTitle: `Cat Toys | ${brandName}`,
    seoDescription: "Shop cat toys and enrichment favorites designed for curious cats and playful homes.",
    productCountLabel: "4 products",
    mobileFilters: ["All Cat Toys", "Chase", "Catnip", "Plush", "Enrichment"],
    products: productList([
      "organic-catnip-mouse",
      "natural-feather-teaser",
      "feather-chase-wand",
      "catnip-toss-set"
    ])
  },
  petApparel: {
    slug: "pet-apparel",
    href: "/collections/pet-apparel",
    title: "Pet Apparel",
    description:
      "Soft, comfortable apparel for cozy days, everyday walks, and picture-perfect pet moments.",
    seoTitle: `Pet Apparel | ${brandName}`,
    seoDescription:
      "Shop soft and comfortable pet apparel for everyday walks, cozy days, and picture-perfect moments.",
    productCountLabel: "3 products",
    mobileFilters: ["All Apparel", "Sweaters", "Tees", "Cozy Layers", "Everyday"],
    products: productList(["chunky-knit-sweater", "cozy-knit-sweater", "soft-ribbed-pet-tee"])
  },
  walkingEssentials: {
    slug: "walking-essentials",
    href: "/collections/walking-essentials",
    title: "Walking Essentials",
    description:
      "Durable leashes, harnesses, collars, and walking accessories for daily strolls and weekend adventures.",
    seoTitle: `Walking Essentials | ${brandName}`,
    seoDescription: "Shop leashes, harnesses, collars, and walking essentials for daily pet adventures.",
    productCountLabel: "4 products",
    mobileFilters: ["All Walking", "Leashes", "Harnesses", "Collars", "Accessories"],
    products: productList([
      "heritage-leather-leash",
      "comfort-walk-harness",
      "everyday-collar-set",
      "trail-walk-accessory-pouch"
    ])
  },
  bedsBlankets: {
    slug: "beds-blankets",
    href: "/collections/beds-blankets",
    title: "Beds & Blankets",
    description:
      "Cozy beds, soft blankets, and restful essentials made for pets who love comfort as much as play.",
    seoTitle: `Beds & Blankets | ${brandName}`,
    seoDescription: "Shop cozy pet beds, blankets, and restful essentials made for everyday comfort.",
    productCountLabel: "3 products",
    mobileFilters: ["All Comfort", "Beds", "Blankets", "Rest Mats", "Cozy Favorites"],
    products: productList(["boucle-orthopedic-bed", "cozy-nest-blanket", "quilted-rest-mat"])
  },
  sale: {
    slug: "sale",
    href: "/sale",
    title: "Sale",
    description:
      "Limited-time offers on selected LUCK CLAWS favorites for playful pets and modern pet parents.",
    seoTitle: `Sale | ${brandName}`,
    seoDescription: "Shop limited-time offers and discounted pet essentials from LUCK CLAWS.",
    productCountLabel: "1 offer",
    primaryCtaLabel: "Shop Interactive Snuffle Mat",
    primaryCtaHref: "/products/interactive-snuffle-mat",
    featuredProductId: "interactive-snuffle-mat",
    featuredLabel: "Save 25%",
    mobileFilters: ["All Sale", "Dog Toys", "Apparel", "Walking", "Comfort"],
    products: productList(["interactive-snuffle-mat"])
  }
} satisfies Record<string, CollectionConfig>;
