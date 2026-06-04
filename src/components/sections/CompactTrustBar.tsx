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
  const columnClass = columns === "wide" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2";

  return (
    <div className={`grid gap-3 ${columnClass} ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="flex min-h-16 items-center gap-3 rounded-md bg-surface-container-lowest px-4 py-3 text-sm font-semibold leading-5 text-on-surface-variant shadow-soft"
        >
          <Icon aria-hidden className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0 leading-5">{label}</span>
        </div>
      ))}
    </div>
  );
}
