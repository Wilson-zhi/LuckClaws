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
    chips: ["Rubber", "Fabric", "Rope", "Silicone", "Pet-Safe Materials"]
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
                  <label key={option} className="flex items-center gap-3 text-on-surface-variant">
                    <input
                      type="radio"
                      name={group.title}
                      defaultChecked={group.title === "Category" && index === 0}
                      className="h-5 w-5 border-outline-variant text-primary-container focus:ring-primary-container"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            {group.chips && (
              <div className="flex flex-wrap gap-2">
                {group.chips.map((chip) => (
                  <button
                    type="button"
                    key={chip}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface-variant transition hover:border-primary hover:text-primary"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}
