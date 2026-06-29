import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { type Product } from "@/data/products";

type HomeProductDiscoveryProps = {
  products: Product[];
};

export function HomeProductDiscovery({ products }: HomeProductDiscoveryProps) {
  const visibleProducts = products.slice(0, 8);

  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <section id="best-sellers" className="bg-[#FFF9EF] py-12 md:py-16">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Customer-ready picks</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight md:text-5xl">Best sellers</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B5540]">
              Customer-ready essentials for play, comfort, walks, and everyday care.
            </p>
          </div>
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-x-0"
          >
            Shop all products
            <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 lg:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} itemListName="Homepage Best Sellers" />
          ))}
        </div>
      </div>
    </section>
  );
}
