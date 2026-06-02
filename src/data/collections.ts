import { brandName, getProduct, products, type Product } from "@/data/products";

export type CollectionConfig = {
  slug: string;
  href: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  productCountLabel?: string;
  mobileFilters: string[];
  loadMoreLabel: string;
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
    mobileFilters: ["All Products", "Dog Toys", "Cat Toys", "Pet Apparel", "Walking", "Beds"],
    loadMoreLabel: "Load More Products",
    products
  },
  dogToys: {
    slug: "dog-toys",
    href: "/collections/dog-toys",
    title: "Dog Toys",
    description:
      "Keep your furry friend entertained with our curated selection of durable, interactive, and beautifully designed toys. Built to last and styled for your home.",
    seoTitle: `Dog Toys | ${brandName}`,
    seoDescription:
      "Shop durable, interactive, and thoughtfully designed dog toys for play, enrichment, chewing, and everyday fun.",
    productCountLabel: "24 products",
    mobileFilters: ["All Dog Toys", "Interactive", "Chew Toys", "Plush & Squeaky", "Fetch & Toss"],
    loadMoreLabel: "Load More Toys",
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
      "Keep your cat curious, active, and entertained with thoughtfully selected toys for chasing, pouncing, scratching, and everyday enrichment.",
    seoTitle: `Cat Toys | ${brandName}`,
    seoDescription: "Shop cat toys and enrichment favorites designed for curious cats and playful homes.",
    mobileFilters: ["All Cat Toys", "Chase", "Catnip", "Plush", "Enrichment"],
    loadMoreLabel: "Load More Cat Toys",
    products: productList([
      "organic-catnip-mouse",
      "natural-feather-teaser",
      "feather-chase-wand",
      "catnip-toss-set",
      "calming-lick-mat"
    ])
  },
  petApparel: {
    slug: "pet-apparel",
    href: "/collections/pet-apparel",
    title: "Pet Apparel",
    description:
      "Soft, comfortable apparel designed for everyday walks, cozy days, and picture-perfect moments.",
    seoTitle: `Pet Apparel | ${brandName}`,
    seoDescription:
      "Shop soft and comfortable pet apparel for everyday walks, cozy days, and picture-perfect moments.",
    mobileFilters: ["All Apparel", "Sweaters", "Tees", "Cozy Layers", "Everyday"],
    loadMoreLabel: "Load More Apparel",
    products: productList(["chunky-knit-sweater", "cozy-knit-sweater", "soft-ribbed-pet-tee"])
  },
  walkingEssentials: {
    slug: "walking-essentials",
    href: "/collections/walking-essentials",
    title: "Walking Essentials",
    description:
      "Durable, comfortable walking essentials for daily strolls, weekend adventures, and every outing in between.",
    seoTitle: `Walking Essentials | ${brandName}`,
    seoDescription: "Shop leashes, harnesses, collars, and walking essentials for daily pet adventures.",
    mobileFilters: ["All Walking", "Leashes", "Harnesses", "Collars", "Accessories"],
    loadMoreLabel: "Load More Walking Gear",
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
    mobileFilters: ["All Comfort", "Beds", "Blankets", "Rest Mats", "Cozy Favorites"],
    loadMoreLabel: "Load More Comfort",
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
    mobileFilters: ["All Sale", "Dog Toys", "Apparel", "Walking", "Comfort"],
    loadMoreLabel: "Load More Offers",
    products: productList(["interactive-snuffle-mat"])
  }
} satisfies Record<string, CollectionConfig>;
