import Image from "next/image";
import { Star } from "lucide-react";

type ReviewCardProps = {
  quote: string;
  name: string;
  pet: string;
  image: string;
};

export function ReviewCard({ quote, name, pet, image }: ReviewCardProps) {
  return (
    <article className="rounded-md bg-surface-container-lowest p-6 shadow-soft">
      <div className="flex text-primary-container" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} aria-hidden className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-on-surface-variant">&quot;{quote}&quot;</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-container">
          <Image src={image} alt={`${name} and ${pet}, LUCK CLAWS customer`} fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-xs text-on-surface-variant">Verified Buyer</p>
        </div>
      </div>
    </article>
  );
}
