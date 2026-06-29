import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type PublicCategoryCard } from "@/lib/public-product-data";

type RoutinePanel = {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  featured?: boolean;
};

function categoryByHref(categories: PublicCategoryCard[], href: string) {
  return categories.find((category) => category.href === href);
}

function categoryData(
  categories: PublicCategoryCard[],
  href: string,
  fallback: Pick<PublicCategoryCard, "name" | "href" | "image" | "alt">
) {
  return categoryByHref(categories, href) ?? fallback;
}

export function HomeRoutineRoute({ categories }: { categories: PublicCategoryCard[] }) {
  const dogToys = categoryData(categories, "/collections/dog-toys", {
    name: "Dog Toys",
    href: "/collections/dog-toys",
    image: "/images/category-dog-toys.jpg",
    alt: "Dog toys selected for play routines."
  });
  const catToys = categoryData(categories, "/collections/cat-toys", {
    name: "Cat Toys",
    href: "/collections/cat-toys",
    image: "/images/organic-catnip-mouse.jpg",
    alt: "Cat toys selected for chase and enrichment routines."
  });
  const walking = categoryData(categories, "/collections/walking-essentials", {
    name: "Walking Essentials",
    href: "/collections/walking-essentials",
    image: "/images/category-walking-essentials.jpg",
    alt: "Walking essentials for daily pet routines."
  });
  const apparel = categoryData(categories, "/collections/pet-apparel", {
    name: "Pet Apparel",
    href: "/collections/pet-apparel",
    image: "/images/category-pet-apparel.jpg",
    alt: "Pet apparel for everyday comfort."
  });
  const beds = categoryData(categories, "/collections/beds-and-blankets", {
    name: "Beds & Blankets",
    href: "/collections/beds-and-blankets",
    image: "/images/category-beds-blankets.jpg",
    alt: "Beds and blankets for pet rest routines."
  });

  const panels: RoutinePanel[] = [
    {
      key: "play",
      title: "Play",
      eyebrow: "Toys, texture, enrichment",
      description: "Start with energy level, then choose toys for chewing, chasing, sniffing, or solo play.",
      image: dogToys.image,
      imageAlt: dogToys.alt,
      links: [
        { label: dogToys.name, href: dogToys.href },
        { label: catToys.name, href: catToys.href }
      ],
      featured: true
    },
    {
      key: "walk",
      title: "Walk",
      eyebrow: "Leashes, harnesses, layers",
      description: "For quick errands, daily walks, and practical out-the-door routines.",
      image: walking.image,
      imageAlt: walking.alt,
      links: [
        { label: walking.name, href: walking.href },
        { label: apparel.name, href: apparel.href }
      ]
    },
    {
      key: "rest",
      title: "Rest",
      eyebrow: "Soft landing spots",
      description: "Build calmer corners with bedding, blankets, and cozy recovery pieces.",
      image: beds.image,
      imageAlt: beds.alt,
      links: [{ label: beds.name, href: beds.href }]
    },
    {
      key: "comfort",
      title: "Comfort",
      eyebrow: "Fit, feel, daily ease",
      description: "Compare practical apparel and everyday products without over-browsing.",
      image: apparel.image,
      imageAlt: apparel.alt,
      links: [
        { label: apparel.name, href: apparel.href },
        { label: "Explore Collections", href: "/collections" }
      ]
    }
  ];
  const featuredPanel = panels.find((panel) => panel.featured) ?? panels[0];
  const supportingPanels = panels.filter((panel) => panel.key !== featuredPanel.key);

  return (
    <section id="shop-by-routine" className="bg-[#FFF9EF] py-12 md:py-16">
      <div className="section-shell">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Routine-first shopping</p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            Shop by routine
          </h2>
          <p className="mt-3 text-base leading-7 text-[#6B5540]">
            Start with what your pet needs next.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.18fr_1fr] lg:gap-5">
          <RoutineCard panel={featuredPanel} featured />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {supportingPanels.map((panel) => (
              <RoutineCard key={panel.key} panel={panel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoutineCard({ panel, featured = false }: { panel: RoutinePanel; featured?: boolean }) {
  return (
    <article
      className={
        featured
          ? "group relative min-h-[430px] overflow-hidden rounded-[2rem] bg-[#3A2514] shadow-lift"
          : "group relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-[#3A2514] shadow-ambient"
      }
    >
      <Image
        src={panel.image}
        alt={panel.imageAlt}
        fill
        sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 420px, 100vw"}
        className="object-cover opacity-82 transition duration-500 group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#26170C]/88 via-[#26170C]/38 to-transparent" />
      <div className={featured ? "absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8" : "absolute inset-x-5 bottom-5"}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD894]">{panel.eyebrow}</p>
        <h3 className={featured ? "mt-2 font-heading text-4xl font-extrabold text-white" : "mt-2 font-heading text-2xl font-bold text-white"}>
          {panel.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/82">{panel.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {panel.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group/link inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-bold text-[#3A2514] transition hover:bg-primary-container hover:text-on-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {link.label}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition group-hover/link:translate-x-0.5 motion-reduce:group-hover/link:translate-x-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
