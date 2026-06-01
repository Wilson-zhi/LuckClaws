import { SlidersHorizontal } from "lucide-react";

const chips = ["All Toys", "Interactive", "Chew Toys", "Plush & Squeaky", "Fetch & Toss", "Cat Toys"];

export function SearchFilterChips() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar" aria-label="Search filters">
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-sm font-semibold"
      >
        <SlidersHorizontal aria-hidden className="h-4 w-4" />
        Filters
      </button>
      {chips.map((chip, index) => (
        <button
          key={chip}
          type="button"
          className={
            index === 0
              ? "shrink-0 rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary-container"
              : "shrink-0 rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary"
          }
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

