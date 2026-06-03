const defaultCategoryOptions = [
  "All Dog Toys",
  "Interactive & Puzzles",
  "Chew Toys",
  "Plush & Squeaky",
  "Fetch & Toss"
];

type FilterSidebarProps = {
  categoryOptions?: string[];
};

const getFilterGroups = (categoryOptions: string[]) => [
  {
    title: "Category",
    options: categoryOptions
  },
  {
    title: "Material",
    chips: ["Rubber", "Fabric", "Rope", "Silicone", "Pet-Conscious Materials"]
  },
  {
    title: "Price",
    options: ["Under $15", "$15 - $30", "$30 - $50", "Over $50"]
  }
];

export function FilterSidebar({ categoryOptions = defaultCategoryOptions }: FilterSidebarProps) {
  const filterGroups = getFilterGroups(categoryOptions);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-28 space-y-8">
        {filterGroups.map((group) => (
          <section key={group.title} className="border-b border-outline-variant/60 pb-8 last:border-b-0">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-on-surface">
              {group.title}
            </h2>
            {group.options && (
              <div className="space-y-4">
                {group.options.map((option, index) => (
                  <span
                    key={option}
                    className={
                      index === 0
                        ? "block rounded-full bg-primary-container px-4 py-2 text-sm font-semibold leading-6 text-on-primary-container"
                        : "block rounded-full bg-surface-container-lowest px-4 py-2 text-sm leading-6 text-on-surface-variant shadow-soft"
                    }
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
            {group.chips && (
              <div className="flex flex-wrap gap-2">
                {group.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm leading-5 text-on-surface-variant"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}
