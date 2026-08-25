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
    <div className="relative">
      <nav
        className="flex snap-x snap-proximity gap-3 overflow-x-auto pb-2 pr-12 hide-scrollbar"
        aria-label="Related collection filters"
      >
        {chips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="min-h-11 shrink-0 snap-start rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {chip.label}
          </Link>
        ))}
      </nav>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-0 top-0 w-12 bg-gradient-to-l from-[#FFF9EF] to-transparent sm:hidden"
      />
    </div>
  );
}
