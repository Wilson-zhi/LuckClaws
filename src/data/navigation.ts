export type NavigationItem = {
  label: string;
  href: string;
  sale?: boolean;
};

export const topLevelNavigation = [
  { label: "Shop All", href: "/collections" },
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" },
  { label: "Pet Apparel", href: "/collections/pet-apparel" },
  { label: "Walking Essentials", href: "/collections/walking-essentials" },
  { label: "Beds & Blankets", href: "/collections/beds-blankets" },
  { label: "About Us", href: "/about" },
  { label: "Sale", href: "/sale", sale: true }
] satisfies NavigationItem[];

export const shopFooterLinks = [
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" },
  { label: "Pet Apparel", href: "/collections/pet-apparel" },
  { label: "Walking Essentials", href: "/collections/walking-essentials" },
  { label: "Beds & Blankets", href: "/collections/beds-blankets" }
];

export const supportFooterLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track-order" }
];

export const companyFooterLinks = [
  { label: "About Us", href: "/about" }
];

export const legalFooterLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" }
];
