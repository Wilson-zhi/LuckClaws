import { DEFAULT_SHIPPING_RATE, standardShippingSentence } from "@/lib/shipping";

type ProductBase = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  regularPrice?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  selectedColor?: string;
  colors?: string[];
  size?: string;
  material?: string;
  benefits?: string[];
  safetyNotice?: string;
  description: string;
  image: string;
  gallery?: string[];
  alt: string;
  materialTags?: string[];
  shippingRate?: number;
  shippingClass?: string;
  shippingDescription?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  sortOrder?: number | null;
  homepageSection?: "featured" | "best_seller" | "new_arrivals" | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const brandName = "LUCK CLAWS";

export type Product = ProductBase & {
  title: string;
  brand: typeof brandName;
  currency: "USD";
  availability: "in_stock" | "out_of_stock" | "preorder";
  condition: "new";
  imageAlt: string;
  productUrl: string;
  compareAtPrice?: number;
  shippingRate: number;
  shippingClass: string;
  shippingDescription: string;
  collectionSlug: string;
  shortDescription: string;
  productType: string;
  careGuidance: string;
  safetyNotice: string;
  seoTitle?: string;
  seoDescription?: string;
  googleProductCategory?: string;
  stockQuantity?: number | null;
};

type ProductInput = ProductBase &
  Partial<Pick<Product, "collectionSlug" | "shortDescription" | "productType" | "careGuidance" | "safetyNotice">>;

const collectionSlugByCategory: Record<string, string> = {
  "Beds & Blankets": "beds-blankets",
  "Cat Toys": "cat-toys",
  "Dog Toys": "dog-toys",
  "Dog Treats": "all",
  Dining: "all",
  "Pet Apparel": "pet-apparel",
  Storage: "all",
  "Walking Essentials": "walking-essentials"
};

function defaultProductType(product: ProductInput) {
  if (product.subcategory) {
    return product.subcategory;
  }

  switch (product.category) {
    case "Cat Toys":
      return "Cat enrichment toy";
    case "Dog Toys":
      return "Dog play and enrichment toy";
    case "Dog Treats":
      return "Training reward";
    case "Dining":
      return "Dining essential";
    case "Pet Apparel":
      return "Pet apparel";
    case "Walking Essentials":
      return "Walking essential";
    case "Beds & Blankets":
      return "Rest and comfort essential";
    case "Storage":
      return "Treat storage";
    default:
      return "Pet essential";
  }
}

function defaultCareGuidance(category: string) {
  switch (category) {
    case "Beds & Blankets":
    case "Pet Apparel":
      return "Follow the product care label where available; machine wash cold or use gentle care when appropriate.";
    case "Cat Toys":
    case "Dog Toys":
      return "Wipe clean or spot clean as needed, and let the item dry fully before reuse.";
    case "Dog Treats":
      return "Keep sealed between training sessions and follow package guidance where available.";
    case "Dining":
      return "Wash regularly with mild soap and dry fully before reuse.";
    case "Storage":
      return "Wipe clean as needed and keep the lid closed between uses.";
    case "Walking Essentials":
      return "Wipe clean after outdoor use and check hardware before each walk.";
    default:
      return "Clean regularly and inspect before use.";
  }
}

function defaultSafetyNotice(category: string) {
  switch (category) {
    case "Cat Toys":
      return "Supervise pets during play and remove the item if loose parts or damage appear.";
    case "Dog Toys":
      return "Supervise pets during play and remove the toy if damaged.";
    case "Dog Treats":
      return "Use as a reward, choose appropriate portions, and supervise while feeding.";
    case "Pet Apparel":
      return "Check fit before use and remove if your pet shows discomfort.";
    case "Walking Essentials":
      return "Check fit and hardware before each walk.";
    default:
      return "Inspect regularly and remove from use if damaged.";
  }
}

function createProduct(product: ProductInput): Product {
  return {
    ...product,
    title: product.name,
    brand: brandName,
    currency: "USD",
    availability: "in_stock",
    condition: "new",
    imageAlt: product.alt,
    productUrl: `/products/${product.slug}`,
    ...(product.regularPrice ? { compareAtPrice: product.regularPrice } : {}),
    shippingRate: product.shippingRate ?? DEFAULT_SHIPPING_RATE,
    shippingClass: product.shippingClass ?? "standard",
    shippingDescription: product.shippingDescription ?? standardShippingSentence,
    isSale: product.isSale ?? Boolean(product.regularPrice && product.regularPrice > product.price),
    collectionSlug: product.collectionSlug ?? collectionSlugByCategory[product.category] ?? "all",
    shortDescription: product.shortDescription ?? product.description,
    productType: product.productType ?? defaultProductType(product),
    careGuidance: product.careGuidance ?? defaultCareGuidance(product.category),
    safetyNotice: product.safetyNotice ?? defaultSafetyNotice(product.category)
  };
}

export const mainProduct: Product = createProduct({
  id: "interactive-snuffle-mat",
  slug: "interactive-snuffle-mat",
  name: "Interactive Snuffle Mat",
  category: "Dog Toys",
  subcategory: "Enrichment Toys",
  price: 29.99,
  regularPrice: 39.99,
  badge: "Best Seller",
  rating: 4.8,
  reviewCount: 124,
  selectedColor: "Forest Green & Cream",
  colors: ["Forest Green & Cream", "Natural Beige", "Sunset Amber"],
  size: "Large",
  material: "Soft fleece surface with anti-slip backing",
  benefits: [
    "Encourages natural foraging",
    "Helps slow down mealtime",
    "Supports mental stimulation",
    "Machine-washable design"
  ],
  safetyNotice:
    "For supervised play only. Remove if damaged. Not intended for aggressive chewers.",
  description:
    "Engage your dog's natural foraging instincts with a premium snuffle mat designed for mental stimulation and slower eating.",
  image: "/images/interactive-snuffle-mat-forest-green-cream.jpg",
  gallery: [
    "/images/interactive-snuffle-mat-forest-green-cream.jpg",
    "/images/interactive-snuffle-mat-top.jpg",
    "/images/interactive-snuffle-mat-lifestyle.jpg",
    "/images/interactive-snuffle-mat-washable.jpg"
  ],
  alt: "Golden retriever using the LUCK CLAWS Interactive Snuffle Mat in Forest Green and Cream.",
  materialTags: ["Fabric", "Pet-Conscious Materials"]
});

const productInputs: ProductInput[] = [
  mainProduct,
  {
    id: "organic-training-treats",
    slug: "organic-training-treats",
    name: "Organic Training Treats",
    category: "Dog Treats",
    price: 9.99,
    description: "Small-batch reward treats for daily training moments.",
    image: "/images/organic-training-treats.jpg",
    alt: "LUCK CLAWS Organic Training Treats bag.",
    materialTags: ["Pet-Conscious Materials"]
  },
  {
    id: "calming-lick-mat",
    slug: "calming-lick-mat",
    name: "Calming Lick Mat",
    category: "Dog Toys",
    subcategory: "Enrichment Toys",
    price: 14.99,
    rating: 4.9,
    reviewCount: 58,
    description: "A soothing enrichment mat for slow licking and calmer routines.",
    image: "/images/calming-lick-mat.jpg",
    alt: "Green LUCK CLAWS Calming Lick Mat.",
    materialTags: ["Silicone", "Pet-Conscious Materials"]
  },
  {
    id: "chunky-knit-sweater",
    slug: "chunky-knit-sweater",
    name: "Chunky Knit Sweater",
    category: "Pet Apparel",
    price: 45,
    description: "A cozy knit layer made for cool walks and couch naps.",
    image: "/images/chunky-knit-sweater.jpg",
    alt: "Chunky yellow LUCK CLAWS pet sweater.",
    badge: "Pet Apparel",
    materialTags: ["Fabric"]
  },
  {
    id: "cozy-knit-sweater",
    slug: "cozy-knit-sweater",
    name: "Cozy Knit Sweater",
    category: "Pet Apparel",
    price: 45,
    description: "A soft everyday sweater for cozy mornings, cool evenings, and easy layering.",
    image: "/images/category-pet-apparel.jpg",
    alt: "Small dog wearing cozy LUCK CLAWS pet apparel.",
    badge: "Pet Apparel",
    materialTags: ["Fabric"]
  },
  {
    id: "soft-ribbed-pet-tee",
    slug: "soft-ribbed-pet-tee",
    name: "Soft Ribbed Pet Tee",
    category: "Pet Apparel",
    price: 28,
    description: "A lightweight ribbed tee designed for relaxed days and simple comfort.",
    image: "/images/category-pet-apparel.jpg",
    alt: "Small dog modeling soft LUCK CLAWS everyday apparel.",
    badge: "Pet Apparel",
    materialTags: ["Fabric"]
  },
  {
    id: "heritage-leather-leash",
    slug: "heritage-leather-leash",
    name: "Heritage Leather Leash",
    category: "Walking Essentials",
    price: 68,
    description: "A refined everyday leash with polished hardware.",
    image: "/images/heritage-leather-leash.jpg",
    alt: "Brown LUCK CLAWS Heritage Leather Leash.",
    badge: "Walking Essentials",
    materialTags: ["Leather"]
  },
  {
    id: "everyday-collar-set",
    slug: "everyday-collar-set",
    name: "Everyday Collar Set",
    category: "Walking Essentials",
    price: 36,
    description: "A polished collar set made for secure, comfortable daily outings.",
    image: "/images/heritage-leather-leash.jpg",
    alt: "Brown LUCK CLAWS walking accessory set.",
    badge: "Walking Essentials",
    materialTags: ["Leather"]
  },
  {
    id: "trail-walk-accessory-pouch",
    slug: "trail-walk-accessory-pouch",
    name: "Trail Walk Accessory Pouch",
    category: "Walking Essentials",
    price: 32,
    description: "A compact walking pouch for treats, bags, and small outing essentials.",
    image: "/images/comfort-walk-harness.jpg",
    alt: "Tan LUCK CLAWS walking essentials setup.",
    badge: "Walking Essentials",
    materialTags: ["Fabric"]
  },
  {
    id: "boucle-orthopedic-bed",
    slug: "boucle-orthopedic-bed",
    name: "Boucle Orthopedic Bed",
    category: "Beds & Blankets",
    price: 120,
    description: "A structured, cloud-soft bed for deeper rest.",
    image: "/images/boucle-orthopedic-bed.jpg",
    alt: "Cream LUCK CLAWS Boucle Orthopedic Bed.",
    badge: "Beds & Blankets",
    materialTags: ["Fabric"]
  },
  {
    id: "cozy-nest-blanket",
    slug: "cozy-nest-blanket",
    name: "Cozy Nest Blanket",
    category: "Beds & Blankets",
    price: 58,
    description: "A soft, nestable blanket for crate naps, sofa cuddles, and quiet corners.",
    image: "/images/category-beds-blankets.jpg",
    alt: "Cozy LUCK CLAWS pet bed and blanket setup.",
    badge: "Beds & Blankets",
    materialTags: ["Fabric"]
  },
  {
    id: "quilted-rest-mat",
    slug: "quilted-rest-mat",
    name: "Quilted Rest Mat",
    category: "Beds & Blankets",
    price: 72,
    description: "A low-profile rest mat for pets who like a soft place near the family.",
    image: "/images/boucle-orthopedic-bed.jpg",
    alt: "Cream LUCK CLAWS rest mat and bed essential.",
    badge: "Beds & Blankets",
    materialTags: ["Fabric"]
  },
  {
    id: "matte-ceramic-bowl",
    slug: "matte-ceramic-bowl",
    name: "Matte Ceramic Bowl",
    category: "Dining",
    price: 32,
    description: "A low-profile ceramic bowl with an easy-clean matte finish.",
    image: "/images/matte-ceramic-bowl.jpg",
    alt: "Matte green ceramic pet bowl by LUCK CLAWS.",
    isNew: true,
    materialTags: ["Ceramic"]
  },
  {
    id: "comfort-walk-harness",
    slug: "comfort-walk-harness",
    name: "Comfort Walk Harness",
    category: "Walking Essentials",
    price: 54,
    description: "A soft, balanced harness for calm everyday walks.",
    image: "/images/comfort-walk-harness.jpg",
    alt: "Tan LUCK CLAWS Comfort Walk Harness.",
    isNew: true,
    materialTags: ["Fabric"]
  },
  {
    id: "natural-feather-teaser",
    slug: "natural-feather-teaser",
    name: "Natural Feather Teaser",
    category: "Cat Toys",
    price: 24,
    description: "A playful wand toy with natural motion and tactile feathers.",
    image: "/images/natural-feather-teaser.jpg",
    alt: "LUCK CLAWS Natural Feather Teaser for cats.",
    isNew: true,
    materialTags: ["Fabric"]
  },
  {
    id: "airtight-treat-jar",
    slug: "airtight-treat-jar",
    name: "Airtight Treat Jar",
    category: "Storage",
    price: 38,
    description: "A countertop jar that keeps treats fresh and close at hand.",
    image: "/images/airtight-treat-jar.jpg",
    alt: "Glass LUCK CLAWS Airtight Treat Jar.",
    isNew: true,
    materialTags: ["Glass"]
  },
  {
    id: "durable-rubber-bone",
    slug: "durable-rubber-bone",
    name: "Durable Rubber Bone",
    category: "Dog Toys",
    subcategory: "Chew Toys",
    price: 18,
    rating: 4.9,
    reviewCount: 82,
    description: "A resilient chew toy with a satisfying textured surface.",
    image: "/images/durable-rubber-bone.jpg",
    alt: "Gray LUCK CLAWS Durable Rubber Bone.",
    materialTags: ["Rubber"]
  },
  {
    id: "natural-cotton-tug-rope",
    slug: "natural-cotton-tug-rope",
    name: "Natural Cotton Tug Rope",
    category: "Dog Toys",
    subcategory: "Fetch & Toss",
    price: 22,
    rating: 4.6,
    reviewCount: 89,
    description: "A woven cotton rope designed for tug games and light fetch.",
    image: "/images/natural-cotton-tug-rope.jpg",
    alt: "Natural cotton tug rope by LUCK CLAWS.",
    materialTags: ["Rope", "Fabric"]
  },
  {
    id: "natural-cotton-rope-tug",
    slug: "natural-cotton-rope-tug",
    name: "Natural Cotton Rope Tug",
    category: "Dog Toys",
    subcategory: "Fetch & Toss",
    price: 16,
    rating: 4.6,
    reviewCount: 89,
    description: "A compact rope tug for smaller dogs and everyday fetch.",
    image: "/images/natural-cotton-tug-rope.jpg",
    alt: "Compact natural cotton rope tug by LUCK CLAWS.",
    materialTags: ["Rope", "Fabric"]
  },
  {
    id: "corduroy-woodland-fox",
    slug: "corduroy-woodland-fox",
    name: "Corduroy Woodland Fox",
    category: "Dog Toys",
    subcategory: "Plush & Squeaky",
    price: 24.5,
    rating: 5,
    reviewCount: 41,
    description: "A soft corduroy companion with a gentle squeaker.",
    image: "/images/corduroy-woodland-fox.jpg",
    alt: "Corduroy woodland fox dog toy by LUCK CLAWS.",
    materialTags: ["Fabric"]
  },
  {
    id: "eco-plush-squeaker",
    slug: "eco-plush-squeaker",
    name: "Eco Plush Squeaker",
    category: "Dog Toys",
    subcategory: "Plush & Squeaky",
    price: 22,
    rating: 4.7,
    reviewCount: 56,
    description: "A soft squeaker toy with a minimalist cloud shape.",
    image: "/images/eco-plush-squeaker.jpg",
    alt: "Eco Plush Squeaker toy by LUCK CLAWS.",
    materialTags: ["Fabric"]
  },
  {
    id: "organic-catnip-mouse",
    slug: "organic-catnip-mouse",
    name: "Organic Catnip Mouse",
    category: "Cat Toys",
    price: 12,
    rating: 4.8,
    reviewCount: 10,
    description: "A compact mouse toy filled for lively cat play sessions.",
    image: "/images/organic-catnip-mouse.jpg",
    alt: "Gray organic catnip mouse toy by LUCK CLAWS.",
    materialTags: ["Fabric"]
  },
  {
    id: "feather-chase-wand",
    slug: "feather-chase-wand",
    name: "Feather Chase Wand",
    category: "Cat Toys",
    price: 18,
    rating: 4.7,
    reviewCount: 34,
    description: "A lively feather wand for chasing, pouncing, and daily enrichment.",
    image: "/images/natural-feather-teaser.jpg",
    alt: "LUCK CLAWS feather chase cat toy.",
    materialTags: ["Fabric"]
  },
  {
    id: "catnip-toss-set",
    slug: "catnip-toss-set",
    name: "Catnip Toss Set",
    category: "Cat Toys",
    price: 16,
    rating: 4.8,
    reviewCount: 27,
    description: "A small set of tossable catnip toys for curious cats and playful homes.",
    image: "/images/organic-catnip-mouse.jpg",
    alt: "LUCK CLAWS catnip toss toy set.",
    materialTags: ["Fabric"]
  },
  {
    id: "beginner-snuffle-mat",
    slug: "beginner-snuffle-mat",
    name: "Beginner Snuffle Mat",
    category: "Dog Toys",
    subcategory: "Enrichment Toys",
    price: 24.99,
    description: "A smaller starter mat for first-time foragers.",
    image: "/images/beginner-snuffle-mat.jpg",
    alt: "Beginner Snuffle Mat by LUCK CLAWS.",
    materialTags: ["Fabric"]
  },
  {
    id: "plush-foraging-toy",
    slug: "plush-foraging-toy",
    name: "Plush Foraging Toy",
    category: "Dog Toys",
    price: 19.99,
    description: "A cheerful plush toy that hides small rewards.",
    image: "/images/plush-foraging-toy.jpg",
    alt: "Carrot-shaped plush foraging toy by LUCK CLAWS.",
    materialTags: ["Fabric"]
  },
  {
    id: "premium-puzzle-feeder",
    slug: "premium-puzzle-feeder",
    name: "Premium Puzzle Feeder",
    category: "Dog Toys",
    price: 34.99,
    description: "A polished puzzle feeder for focused enrichment.",
    image: "/images/premium-puzzle-feeder.jpg",
    alt: "Round wooden puzzle feeder by LUCK CLAWS.",
    materialTags: ["Wood"]
  }
];

export const products: Product[] = productInputs.map((product) =>
  product.id === mainProduct.id ? mainProduct : createProduct(product)
);

export const getProduct = (id: string) => products.find((product) => product.id === id);

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const frequentlyBoughtTogether = [
  getProduct("organic-training-treats")!,
  getProduct("calming-lick-mat")!
];

export const cartAddOns = [
  getProduct("organic-training-treats")!,
  getProduct("calming-lick-mat")!,
  getProduct("natural-cotton-rope-tug")!
];

export const bestSellers = [
  mainProduct,
  getProduct("chunky-knit-sweater")!,
  getProduct("heritage-leather-leash")!,
  getProduct("boucle-orthopedic-bed")!
];

export const newArrivals = [
  getProduct("matte-ceramic-bowl")!,
  getProduct("comfort-walk-harness")!,
  getProduct("natural-feather-teaser")!,
  getProduct("airtight-treat-jar")!
];

export const collectionProducts = [
  mainProduct,
  getProduct("durable-rubber-bone")!,
  getProduct("natural-cotton-tug-rope")!,
  getProduct("corduroy-woodland-fox")!
];

export const searchProducts = [
  mainProduct,
  getProduct("durable-rubber-bone")!,
  getProduct("eco-plush-squeaker")!,
  getProduct("natural-cotton-rope-tug")!,
  getProduct("organic-catnip-mouse")!
];

export const recommendedProducts = [
  getProduct("beginner-snuffle-mat")!,
  getProduct("calming-lick-mat")!,
  getProduct("plush-foraging-toy")!,
  getProduct("premium-puzzle-feeder")!
];

export const categories = [
  {
    name: "Dog Toys",
    href: "/collections/dog-toys",
    image: "/images/category-dog-toys.jpg",
    alt: "Dog toy category curated by LUCK CLAWS."
  },
  {
    name: "Pet Apparel",
    href: "/collections/pet-apparel",
    image: "/images/category-pet-apparel.jpg",
    alt: "Pet apparel category curated by LUCK CLAWS."
  },
  {
    name: "Walking Essentials",
    href: "/collections/walking-essentials",
    image: "/images/category-walking-essentials.jpg",
    alt: "Walking essentials category curated by LUCK CLAWS."
  },
  {
    name: "Beds & Blankets",
    href: "/collections/beds-blankets",
    image: "/images/category-beds-blankets.jpg",
    alt: "Beds and blankets category curated by LUCK CLAWS."
  }
];
