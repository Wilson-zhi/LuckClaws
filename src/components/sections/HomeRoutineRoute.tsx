import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint } from "lucide-react";
import { type PublicCategoryCard } from "@/lib/public-product-data";

function categoryPathLabel(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "Play together";
  if (normalized.includes("cat")) return "Keep curiosity moving";
  if (normalized.includes("walking")) return "Step outside";
  if (normalized.includes("apparel")) return "Dress for the day";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "Make room for rest";
  return "Find the right routine";
}

function categoryBenefit(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "Chew, chase, sniff, repeat.";
  if (normalized.includes("cat")) return "Pounce, bat, and follow their curiosity.";
  if (normalized.includes("walking")) return "The useful things that get you out the door.";
  if (normalized.includes("apparel")) return "Soft layers made for movement and comfort.";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "Warmer corners for slower parts of the day.";
  return "A clearer path through everyday pet essentials.";
}

function fallbackImageForCategory(category: PublicCategoryCard) {
  const normalized = `${category.name} ${category.href}`.toLowerCase();

  if (normalized.includes("dog")) return "/images/category-dog-toys.jpg";
  if (normalized.includes("cat")) return "/images/organic-catnip-mouse.jpg";
  if (normalized.includes("walking")) return "/images/category-walking-essentials.jpg";
  if (normalized.includes("apparel")) return "/images/category-pet-apparel.jpg";
  if (normalized.includes("bed") || normalized.includes("blanket")) return "/images/category-beds-blankets.jpg";
  return "/images/hero-dog-running.jpg";
}

function categoryImage(category: PublicCategoryCard) {
  const image = category.image.trim();
  const normalized = image.toLowerCase();
  const categoryScope = `${category.name} ${category.href}`.toLowerCase();

  if (
    !image ||
    normalized.includes("icon") ||
    normalized.includes("logo") ||
    (categoryScope.includes("cat") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("apparel") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("walking") && normalized.includes("dog-toys")) ||
    (categoryScope.includes("bed") && normalized.includes("dog-toys"))
  ) {
    return fallbackImageForCategory(category);
  }

  return image;
}

export function HomeRoutineRoute({ categories }: { categories: PublicCategoryCard[] }) {
  if (categories.length === 0) return null;

  const visibleCategories = categories.slice(0, 4);

  return (
    <section id="routine-lookbook" className="home-editorial-collections scroll-mt-24">
      <div className="section-shell">
        <header className="home-editorial-collections-heading">
          <div>
            <p className="home-editorial-kicker">Routine lookbook</p>
            <h2>Four ways into a better pet day.</h2>
          </div>
          <div>
            <p>Start with the moment, then move into a smaller and more useful product edit.</p>
            <Link href="/collections" className="group">
              <span>Explore every collection</span>
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>
        </header>

        <div className="home-editorial-collection-grid">
          {visibleCategories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className="home-editorial-collection group"
              data-layout={index}
              aria-label={`Shop ${category.name}`}
            >
              <span className="home-editorial-collection-media">
                <Image
                  src={categoryImage(category)}
                  alt={category.alt}
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes="(min-width: 1280px) 50vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
                />
                <span className="home-editorial-collection-index">
                  <PawPrint aria-hidden className="h-4 w-4" />
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="home-editorial-collection-copy">
                <small>{categoryPathLabel(category)}</small>
                <strong>{category.name}</strong>
                <span>{categoryBenefit(category)}</span>
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
