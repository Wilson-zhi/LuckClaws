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
      className="group relative block aspect-[1.15] overflow-hidden rounded-md bg-surface-container shadow-soft"
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 280px, 44vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-bold text-white">{name}</h3>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/80 text-on-surface transition group-hover:bg-primary-container">
          <ArrowRight aria-hidden className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

