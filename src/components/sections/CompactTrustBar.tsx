import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type CompactTrustItem = {
  key: string;
  label: ReactNode;
  Icon: LucideIcon;
};

type CompactTrustBarProps = {
  items: CompactTrustItem[];
  columns?: "balanced" | "wide";
  className?: string;
};

export function CompactTrustBar({ items, columns = "balanced", className = "" }: CompactTrustBarProps) {
  const columnClass =
    columns === "wide"
      ? "auto-cols-[minmax(220px,1fr)] snap-x snap-proximity grid-flow-col overflow-x-auto pb-2 pr-10 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-4"
      : "sm:grid-cols-2";

  return (
    <div className={`grid gap-3 ${columnClass} ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="flex min-h-16 snap-start items-center gap-3 rounded-md border border-[#E8D6BF] bg-white/80 px-4 py-3 text-sm font-semibold leading-5 text-[#5C4834] shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:shadow-ambient motion-reduce:hover:translate-y-0"
        >
          <Icon aria-hidden className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0 leading-5">{label}</span>
        </div>
      ))}
    </div>
  );
}
