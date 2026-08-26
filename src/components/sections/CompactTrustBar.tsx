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

function trustArtWord(key: string, label: ReactNode) {
  const labelText = typeof label === "string" ? label : "";
  const normalized = `${key} ${labelText}`.toLowerCase();

  if (normalized.includes("ship") || normalized.includes("truck")) return "ship";
  if (normalized.includes("support") || normalized.includes("damage") || normalized.includes("return")) return "care";
  if (normalized.includes("secure") || normalized.includes("lock")) return "safe";
  if (normalized.includes("material") || normalized.includes("heart") || normalized.includes("leaf")) return "kind";
  return "trust";
}

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
          className="compact-trust-item group relative flex min-h-[4.5rem] snap-start items-center gap-3 overflow-hidden rounded-md border border-[#E6CFAF] bg-[#FFFCF6]/95 px-4 py-3 text-sm font-semibold leading-5 text-[#4D351F] shadow-soft transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#C88A25] hover:bg-white hover:shadow-ambient motion-reduce:hover:translate-y-0"
        >
          <span className="compact-trust-icon" aria-hidden>
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 leading-5">{label}</span>
          <span className="lc-hand-note compact-trust-word" aria-hidden>
            {trustArtWord(key, label)}
          </span>
        </div>
      ))}
    </div>
  );
}
