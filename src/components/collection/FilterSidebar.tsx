export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type FilterControlsProps = {
  categoryOptions: FilterOption[];
  materialOptions: FilterOption[];
  priceOptions: FilterOption[];
  selectedCategory: string;
  selectedMaterials: string[];
  selectedPrice: string;
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onSelectCategory: (value: string) => void;
  onToggleMaterial: (value: string) => void;
  onSelectPrice: (value: string) => void;
  onClearFilters: () => void;
};

type FilterSidebarProps = FilterControlsProps;

function filterButtonClass(active: boolean) {
  return active
    ? "w-full rounded-full bg-primary-container px-4 py-2 text-left text-sm font-semibold leading-6 text-on-primary-container"
    : "w-full rounded-full bg-surface-container-lowest px-4 py-2 text-left text-sm leading-6 text-on-surface-variant shadow-soft transition hover:text-primary";
}

function FilterButton({
  active,
  label,
  count,
  onClick
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={filterButtonClass(active)}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {count !== undefined && <span className="text-xs opacity-75">{count}</span>}
      </span>
    </button>
  );
}

export function FilterControls({
  categoryOptions,
  materialOptions,
  priceOptions,
  selectedCategory,
  selectedMaterials,
  selectedPrice,
  resultCount,
  totalCount,
  hasActiveFilters,
  onSelectCategory,
  onToggleMaterial,
  onSelectPrice,
  onClearFilters
}: FilterControlsProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-md bg-surface-container-lowest p-4 shadow-soft">
        <p className="text-sm font-bold text-on-surface">Filters</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          Showing {resultCount} of {totalCount}
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:text-on-surface-variant disabled:no-underline"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear filters
        </button>
      </div>

      <section className="border-b border-outline-variant/60 pb-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-on-surface">Category</h2>
        <div className="space-y-3">
          {categoryOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={selectedCategory === option.value}
              label={option.label}
              count={option.count}
              onClick={() => onSelectCategory(option.value)}
            />
          ))}
        </div>
      </section>

      <section className="border-b border-outline-variant/60 pb-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-on-surface">Material</h2>
        {materialOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {materialOptions.map((option) => {
              const active = selectedMaterials.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  className={
                    active
                      ? "rounded-full bg-primary-container px-4 py-2 text-sm font-semibold leading-5 text-on-primary-container"
                      : "rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm leading-5 text-on-surface-variant transition hover:border-primary hover:text-primary"
                  }
                  onClick={() => onToggleMaterial(option.value)}
                  aria-pressed={active}
                >
                  {option.label}
                  {option.count !== undefined && <span className="ml-2 text-xs opacity-75">{option.count}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">No material filters available.</p>
        )}
      </section>

      <section className="pb-2">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-on-surface">Price</h2>
        <div className="space-y-3">
          {priceOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={selectedPrice === option.value}
              label={option.label}
              count={option.count}
              onClick={() => onSelectPrice(option.value)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block" aria-label="Product filters">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <FilterControls {...props} />
      </div>
    </aside>
  );
}
