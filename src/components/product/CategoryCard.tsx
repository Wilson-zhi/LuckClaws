import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CategoryCardProps = {
  name: string;
  href: string;
  image: string;
  alt: string;
};

export function CategoryCard({ name, href, image, alt }: CategoryCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Shop ${name}`}
      className="group relative block aspect-[1.08] overflow-hidden rounded-lg bg-surface-container shadow-soft ring-1 ring-outline-variant/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:ring-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 280px, 44vw"
        className="object-cover transition duration-500 group-hover:scale-[1.055]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-white/8 transition duration-300 group-hover:from-black/72" />
      <div className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary shadow-soft">
        Shop routine
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Shop collection</p>
            <h3 className="mt-1 font-heading text-xl font-bold text-white">{name}</h3>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-on-surface shadow-soft transition duration-200 group-hover:translate-x-0.5 group-hover:bg-primary-container group-hover:text-on-primary-container motion-reduce:group-hover:translate-x-0">
          <ArrowRight aria-hidden className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
