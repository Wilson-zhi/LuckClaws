import Link from "next/link";

const chips = [
  { label: "All", href: "/collections" },
  { label: "Dog Toys", href: "/collections/dog-toys" },
  { label: "Cat Toys", href: "/collections/cat-toys" },
  { label: "Pet Apparel", href: "/collections/pet-apparel" },
  { label: "Walking Essentials", href: "/collections/walking-essentials" },
  { label: "Beds & Blankets", href: "/collections/beds-blankets" },
  { label: "Sale", href: "/sale" }
];

export function SearchFilterChips() {
  return (
    <nav
      className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
      aria-label="Related collection filters"
    >
      {chips.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          className="shrink-0 rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {chip.label}
        </Link>
      ))}
    </nav>
  );
}
