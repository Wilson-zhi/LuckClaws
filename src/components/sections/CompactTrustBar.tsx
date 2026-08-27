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
      ? "auto-cols-[minmax(220px,1fr)] grid-flow-col overflow-x-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
      : "sm:grid-cols-2";

  return (
    <div className={`home-editorial-trust-rail grid ${columnClass} ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="home-editorial-trust-item"
        >
          <span aria-hidden>
            <Icon className="h-5 w-5" />
          </span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
