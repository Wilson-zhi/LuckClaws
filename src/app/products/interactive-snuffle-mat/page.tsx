import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Package, RotateCcw, Truck } from "lucide-react";
import { AddBundleButton } from "@/components/cart/AddBundleButton";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  brandName,
  frequentlyBoughtTogether,
  mainProduct,
  recommendedProducts
} from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { absoluteUrl, createSeoMetadata, productOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `Interactive Snuffle Mat | ${brandName}`,
    description:
      "Shop the LUCK CLAWS Interactive Snuffle Mat, designed for dog enrichment, slower eating, mental stimulation, and everyday play.",
    path: "/products/interactive-snuffle-mat",
    image: productOgImage
  })
};

const accordions = [
  {
    title: "Product Details",
    content:
      "Designed to turn mealtime into an enriching scent game, with layered fleece petals that invite sniffing and foraging."
  },
  {
    title: "Materials & Care",
    content:
      `${mainProduct.material}. Machine wash cold on a gentle cycle and air dry fully before the next play session.`
  },
  {
    title: "Safety Notice",
    content: mainProduct.safetyNotice ?? ""
  },
  {
    title: "Shipping Information",
    content:
      "Orders ship from our studio within 1-2 business days. Free shipping applies to qualifying orders over $50."
  },
  {
    title: "Returns & Exchanges",
    content:
      "Unused items can be returned within 30 days. If something arrives damaged, contact us and we will make it right."
  }
];

export default function ProductPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: mainProduct.name,
    image: absoluteUrl(mainProduct.image),
    description: "Dog enrichment snuffle mat for mental stimulation and slower eating.",
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      price: mainProduct.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/products/interactive-snuffle-mat")
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: mainProduct.rating,
      reviewCount: mainProduct.reviewCount
    }
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="section-shell py-8 md:py-14">
        <nav className="mb-6 text-sm text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/collections/dog-toys" className="hover:text-primary">
            Dog Toys
          </Link>
          <span className="mx-2">›</span>
          <span className="text-primary">{mainProduct.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr]">
          <ProductGallery product={mainProduct} />
          <div>
            <ProductPurchasePanel product={mainProduct} />

            <div className="mt-7 grid gap-3 text-sm text-on-surface-variant">
              <p className="flex items-center gap-2">
                <Truck aria-hidden className="h-5 w-5 text-primary" /> Free shipping on orders over $50
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw aria-hidden className="h-5 w-5 text-primary" /> 30-day easy returns
              </p>
            </div>

            <div className="mt-7">
              <ProductAccordion items={accordions} />
            </div>
          </div>
        </div>
      </section>

      <ProductBenefits />

      <section className="section-shell py-14 md:py-20">
        <h2 className="font-heading text-2xl font-bold">Frequently Bought Together</h2>
        <div className="mt-6 rounded-lg bg-surface-container-lowest p-6 shadow-ambient">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr_1.4fr] md:items-center">
            {[mainProduct, ...frequentlyBoughtTogether].map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 md:block md:text-center">
                {index > 0 && <span className="hidden text-2xl text-on-surface-variant md:block">+</span>}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container md:mx-auto md:h-28 md:w-28">
                  <Image src={product.image} alt={product.alt} fill sizes="112px" className="object-cover" />
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold">{index === 0 ? "This item" : product.name}</p>
                  <p className="text-sm text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
            <div className="md:col-start-6">
              <p className="text-sm font-semibold">Total Price:</p>
              <p className="font-heading text-xl font-bold">
                {formatPrice(mainProduct.price + frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0))}
              </p>
              <AddBundleButton
                products={[mainProduct, ...frequentlyBoughtTogether]}
                className="mt-4 w-full"
              >
                Add All 3 to Cart
              </AddBundleButton>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="section-shell pb-14 md:pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">Real Dogs, Real Joy</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Photos from our happy customers.</p>
          </div>
          <a href="#" className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex">
            View All Reviews <ArrowRight aria-hidden className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mainProduct.gallery?.map((image, index) => (
            <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-surface-container shadow-soft">
              <Image
                src={image}
                alt={`Customer photo ${index + 1} of the LUCK CLAWS Interactive Snuffle Mat`}
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-2 py-1 text-xs font-bold text-primary">
                ★ {index === 2 ? "4.8" : "5.0"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16 md:pb-20">
        <h2 className="font-heading text-2xl font-bold">You Might Also Like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant bg-surface-container-lowest p-3 shadow-lift md:hidden">
        <AddToCartButton product={mainProduct} className="w-full">
          <Package aria-hidden className="h-4 w-4" />
          Add to Cart - {formatPrice(mainProduct.price)}
        </AddToCartButton>
      </div>

      <div className="fixed bottom-24 right-4 hidden rounded-full bg-surface-container-lowest p-3 text-primary shadow-soft md:block">
        <CheckCircle2 aria-hidden className="h-6 w-6" />
        <span className="sr-only">In stock</span>
      </div>
    </SiteShell>
  );
}
