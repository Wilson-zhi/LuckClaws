import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, PawPrint } from "lucide-react";
import { type Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

type HomePosterHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  featuredLabel: string;
  featuredText: string;
  hasVideo: boolean;
  products: Product[];
  trustLabels: string[];
};

function fallbackProductImage(product: Product) {
  const normalized = `${product.name} ${product.slug} ${product.category}`.toLowerCase();

  if (normalized.includes("snuffle")) return "/images/interactive-snuffle-mat-lifestyle.jpg";
  if (normalized.includes("puzzle")) return "/images/premium-puzzle-feeder.jpg";
  if (normalized.includes("cat")) return "/images/organic-catnip-mouse.jpg";
  if (normalized.includes("walk") || normalized.includes("leash") || normalized.includes("harness")) {
    return "/images/category-walking-essentials.jpg";
  }
  if (normalized.includes("apparel") || normalized.includes("sweater") || normalized.includes("tee")) {
    return "/images/category-pet-apparel.jpg";
  }
  if (normalized.includes("bed") || normalized.includes("blanket")) {
    return "/images/category-beds-blankets.jpg";
  }

  return "/images/category-dog-toys.jpg";
}

export function HomePosterHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  videoUrl,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  featuredLabel,
  featuredText,
  hasVideo,
  products,
  trustLabels
}: HomePosterHeroProps) {
  return (
    <section className="home-editorial-hero" aria-labelledby="home-hero-title">
      <div className="home-editorial-hero-stage">
        <div className="home-editorial-hero-media">
          {hasVideo ? (
            <video autoPlay muted loop playsInline poster={imageUrl} aria-label={imageAlt}>
              <source src={videoUrl} type={videoUrl.toLowerCase().includes(".webm") ? "video/webm" : "video/mp4"} />
            </video>
          ) : (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover object-center"
            />
          )}
          <div className="home-editorial-hero-media-shade" aria-hidden="true" />
        </div>

        <div className="home-editorial-hero-top">
          <p className="home-editorial-hero-eyebrow">
            <PawPrint aria-hidden className="h-4 w-4" />
            <span>{eyebrow}</span>
          </p>
          <div className="home-editorial-hero-trust" aria-label="Store promises">
            {trustLabels.slice(0, 3).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="home-editorial-hero-copy">
          <p className="home-editorial-hero-feature">
            <span>{featuredLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="lc-hand-note">{featuredText}</span>
          </p>
          <h1 id="home-hero-title">{title}</h1>
          <p className="home-editorial-hero-subtitle">{subtitle}</p>
          <div className="home-editorial-hero-actions">
            <Link href={primaryButtonLink} className="home-editorial-hero-primary group">
              <span>{primaryButtonText}</span>
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <Link href={secondaryButtonLink} className="home-editorial-hero-secondary group">
              <span>{secondaryButtonText}</span>
              <span className="home-editorial-hero-secondary-line" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {products.length > 0 && (
          <aside className="home-editorial-hero-picks" aria-label="Quick product picks">
            <div className="home-editorial-hero-picks-heading">
              <span>Everyday picks</span>
              <span>{String(products.length).padStart(2, "0")}</span>
            </div>
            <div>
              {products.map((product) => (
                <Link key={product.id} href={product.productUrl} className="group">
                  <span className="home-editorial-hero-pick-image">
                    <Image
                      src={fallbackProductImage(product)}
                      alt={product.alt}
                      fill
                      sizes="52px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </span>
                  <span className="home-editorial-hero-pick-copy">
                    <small>{product.category}</small>
                    <strong>{product.name}</strong>
                  </span>
                  <span className="home-editorial-hero-pick-price">{formatPrice(product.price)}</span>
                  <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
              ))}
            </div>
          </aside>
        )}

        <div className="home-editorial-hero-reveal" aria-hidden="true">
          <span>{featuredText}</span>
          <strong>Useful things for the days you share.</strong>
        </div>

        <a href="#shop-by-routine" className="home-editorial-hero-scroll">
          <span>Scroll to explore</span>
          <ArrowDown aria-hidden className="h-4 w-4" />
        </a>

        <div className="home-editorial-hero-wash" aria-hidden="true" />
      </div>
    </section>
  );
}
