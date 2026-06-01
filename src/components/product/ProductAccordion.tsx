import { ChevronDown } from "lucide-react";

type AccordionItem = {
  title: string;
  content: string;
};

export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-outline-variant/70 border-y border-outline-variant/70">
      {items.map((item) => (
        <details key={item.title} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
            {item.title}
            <ChevronDown aria-hidden className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.content}</p>
        </details>
      ))}
    </div>
  );
}

