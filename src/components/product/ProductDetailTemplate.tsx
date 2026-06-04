import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Heart,
  ListChecks,
  Mail,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { ViewItemListTracker, ViewItemTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { type Product } from "@/data/products";
import {
  getBestForItems,
  getCareInstructions,
  getProductDetails,
  getProductFaqs,
  getProductHighlights,
  getRelatedProducts,
  getShippingReturnItems
} from "@/lib/product-detail-content";
import { getCollectionPath } from "@/lib/product-links";
import { createProductJsonLd } from "@/lib/product-seo";
import {
  freeShippingLabel,
  freeShippingSentence,
  standardShippingSentence,
  variableShippingSentence
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

const trustItems: CompactTrustItem[] = [
  { key: "shipping", label: freeShippingLabel, Icon: Truck },
  { key: "support-policy", label: "Damaged or incorrect items covered", Icon: ShieldCheck },
  { key: "secure", label: "Secure checkout", Icon: ShieldCheck },
  { key: "materials", label: "Pet-conscious materials", Icon: Heart }
];

const highlightIcons = [Sparkles, Search, ShieldCheck, RotateCcw];

export function ProductDetailTemplate({
  product,
  relatedProducts: providedRelatedProducts
}: {
  product: Product;
  relatedProducts?: Product[];
}) {
  const relatedProducts = providedRelatedProducts ?? getRelatedProducts(product);
  const highlights = getProductHighlights(product);
  const details = getProductDetails(product);
  const bestFor = getBestForItems(product);
  const careInstructions = getCareInstructions(product);
  const shippingReturns = getShippingReturnItems();
  const productFaqs = getProductFaqs(product);
  const collectionHref = getCollectionPath(product);
  const itemListName = `${product.name} Related Products`;
  const accordions = [
    {
      title: "Product Details",
      content: product.shortDescription
    },
    {
      title: "Materials & Care",
      content: product.material ? `${product.material}. ${product.careGuidance}` : product.careGuidance
    },
    {
      title: "Safety Notice",
      content: product.safetyNotice
    },
    {
      title: "Shipping Information",
      content: `${freeShippingSentence} ${standardShippingSentence} ${variableShippingSentence} Orders are typically processed within 1-3 business days. Standard delivery usually takes 7-15 business days after processing.`
    },
    {
      title: "Returns & Exchanges",
      content:
        "General returns for preference changes or buyer's remorse are not accepted. Damaged, defective, or incorrect items must be reported within 7 days of delivery."
    }
  ];

  return (
    <SiteShell>
      <ViewItemTracker product={product} />
      <ViewItemListTracker products={relatedProducts} itemListName={itemListName} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createProductJsonLd(product)) }}
      />

      <section className="section-shell py-8 md:py-14">
        <nav className="mb-6 text-sm text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            &rsaquo;
          </span>
          <Link href={collectionHref} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="mx-2" aria-hidden>
            &rsaquo;
          </span>
          <span className="text-primary">{product.name}</span>
        </nav>
        <Link href="/collections" className="mb-6 inline-flex text-sm font-semibold text-primary transition hover:text-on-surface">
          &larr; Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr]">
          <ProductGallery product={product} />
          <div>
            <ProductPurchasePanel product={product} />

            <CompactTrustBar items={trustItems} className="mt-7" />

            <div className="mt-7">
              <ProductAccordion items={accordions} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient md:p-8">
          <h2 className="font-heading text-2xl font-bold">Product Highlights</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {highlights.map((highlight, index) => {
              const Icon = highlightIcons[index] ?? Sparkles;

              return (
                <div key={highlight.title} className="rounded-md bg-surface-container-low p-5 text-center">
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                    <Icon aria-hidden className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-sm font-bold">{highlight.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-on-surface-variant">{highlight.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="ambient-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                <ListChecks aria-hidden className="h-5 w-5" />
              </span>
              <h2 className="font-heading text-2xl font-bold">Details at a Glance</h2>
            </div>
            <dl className="mt-6 divide-y divide-outline-variant/70">
              {details.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[160px_1fr] sm:gap-5">
                  <dt className="font-semibold text-on-surface">{label}</dt>
                  <dd className="text-on-surface-variant">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-6">
            <div className="ambient-card p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold">Best For</h2>
              <ul className="mt-5 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                {bestFor.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ambient-card p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold">Care Instructions</h2>
              <ul className="mt-5 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                {careInstructions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-14 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="ambient-card p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold">Shipping & Returns</h2>
            <ul className="mt-5 space-y-3 text-sm text-on-surface-variant">
              {shippingReturns.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-2 text-sm leading-6 text-on-surface-variant">
              <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Contact{" "}
                <a href="mailto:support@luckclaws.com" className="font-semibold text-primary underline underline-offset-4">
                  support@luckclaws.com
                </a>{" "}
                for order help.
              </span>
            </p>
          </div>

          <div className="ambient-card p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold">Product Questions</h2>
            <div className="mt-4">
              <ProductAccordion items={productFaqs} />
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-shell pb-28 md:pb-20">
          <h2 className="font-heading text-2xl font-bold">You Might Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} itemListName={itemListName} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant bg-surface-container-lowest p-3 shadow-lift md:hidden">
        <div className="mx-auto flex max-w-screen-sm items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-container">
            <Image src={product.image} alt={product.alt} fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{product.name}</p>
            <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
          </div>
          <AddToCartButton product={product} className="shrink-0 px-5 py-3">
            <Package aria-hidden className="h-4 w-4" />
            Add to Cart
          </AddToCartButton>
        </div>
      </div>
    </SiteShell>
  );
}
