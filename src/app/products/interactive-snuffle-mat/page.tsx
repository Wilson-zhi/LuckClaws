import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Heart,
  ListChecks,
  Mail,
  Package,
  ShieldCheck,
  Truck
} from "lucide-react";
import { AddBundleButton } from "@/components/cart/AddBundleButton";
import { ViewItemListTracker, ViewItemTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  frequentlyBoughtTogether,
  mainProduct,
  recommendedProducts,
  type Product
} from "@/data/products";
import {
  getPublicProductBySlug,
  getPublicProducts,
  pickPublicProductsByStaticProducts
} from "@/lib/public-product-data";
import { getProductPath } from "@/lib/product-links";
import { createProductJsonLd, createProductMetadata } from "@/lib/product-seo";
import {
  freeShippingLabel,
  freeShippingSentence,
  standardShippingSentence,
  variableShippingSentence
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getPublicProductBySlug(mainProduct.slug);

  return createProductMetadata(product ?? mainProduct);
}

function createAccordions(product: Product) {
  if (product.accordionSections?.length) {
    return product.accordionSections;
  }

  return [
    {
      title: "Product Details",
      content:
        product.shortDescription ||
        "Designed to turn treats or a portion of meals into an enriching scent game, with layered folds that invite sniffing and foraging."
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
}

const trustItems: CompactTrustItem[] = [
  { key: "shipping", label: freeShippingLabel, Icon: Truck },
  { key: "support-policy", label: "Damaged or incorrect items covered", Icon: ShieldCheck },
  { key: "secure", label: "Secure checkout", Icon: ShieldCheck },
  { key: "materials", label: "Pet-conscious materials", Icon: Heart }
];

function createProductSpecs(product: Product) {
  return [
    ["Product type", product.productType],
    ["Color", product.selectedColor ?? "See product options"],
    ["Size", product.size ?? "See product details"],
    ["Material", product.material ?? "Pet-conscious materials"],
    ["Care", product.careGuidance],
    ["Use", "Supervised enrichment and slower feeding"],
    ["Safety", product.safetyNotice]
  ];
}

const bestFor = [
  "Dogs who eat too quickly",
  "Bored or high-energy dogs",
  "Indoor enrichment",
  "Treat-based training routines"
];

const notIdealFor = [
  "Aggressive chewers",
  "Unsupervised play",
  "Pets who destroy fabric toys"
];

const careInstructions = [
  "Shake out crumbs after use",
  "Machine wash cold on gentle cycle",
  "Air dry fully before reuse",
  "Inspect regularly and remove if damaged"
];

const shippingReturns = [
  freeShippingSentence,
  standardShippingSentence,
  variableShippingSentence,
  "Orders are typically processed within 1-3 business days",
  "Standard delivery usually takes 7-15 business days after processing",
  "Report damaged, defective, or incorrect items within 7 days of delivery",
  "General returns for preference changes or buyer's remorse are not accepted"
];

const productFaqs = [
  {
    title: "How do I use a snuffle mat?",
    content:
      "Sprinkle dry treats or kibble between the fleece folds, place the mat on a flat surface, and let your dog sniff and search under supervision."
  },
  {
    title: "Can this help slow down eating?",
    content:
      "Yes. Using a portion of dry food in the folds can encourage slower, more focused eating compared with an open bowl."
  },
  {
    title: "Is it machine washable?",
    content:
      "Yes. Shake out crumbs first, machine wash cold on a gentle cycle, and air dry fully before reuse."
  },
  {
    title: "Is this suitable for puppies?",
    content:
      "It can be suitable for puppies who are supervised and gentle with fabric toys. Remove the mat if chewing or damage starts."
  },
  {
    title: "Should my dog use it unsupervised?",
    content:
      "No. This mat is intended for supervised enrichment only and should be removed if it becomes damaged."
  },
  {
    title: "What size is this mat?",
    content:
      "This product is the Large size in Forest Green & Cream, designed for everyday enrichment and treat-based routines."
  },
  {
    title: "What if my dog chews fabric toys?",
    content:
      "Choose a tougher chew-focused toy instead. This snuffle mat is not intended for aggressive chewers or pets who destroy fabric toys."
  }
];

export default async function ProductPage() {
  const product = await getPublicProductBySlug(mainProduct.slug);

  if (!product) {
    notFound();
  }

  const catalogProducts = await getPublicProducts();
  const recommendedCatalogProducts = pickPublicProductsByStaticProducts(
    recommendedProducts,
    catalogProducts,
    recommendedProducts.length
  );
  const bundleProducts = [
    product,
    ...pickPublicProductsByStaticProducts(
      frequentlyBoughtTogether,
      catalogProducts,
      frequentlyBoughtTogether.length
    )
  ];
  const structuredData = createProductJsonLd(product);
  const accordions = createAccordions(product);
  const productSpecs = product.detailRows?.length
    ? product.detailRows.map((detailRow) => [detailRow.label, detailRow.value] as const)
    : createProductSpecs(product);
  const bestForItems = product.bestFor?.length ? product.bestFor : bestFor;
  const careInstructionItems = product.careInstructions?.length ? product.careInstructions : careInstructions;
  const faqItems = product.productFaqs?.length ? product.productFaqs : productFaqs;
  const galleryImages = product.gallery?.length ? product.gallery : [product.image];

  return (
    <SiteShell>
      <ViewItemTracker product={product} />
      <ViewItemListTracker products={recommendedCatalogProducts} itemListName="You Might Also Like" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="section-shell py-8 md:py-14">
        <nav className="mb-6 text-sm text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            &rsaquo;
          </span>
          <Link href="/collections/dog-toys" className="hover:text-primary">
            Dog Toys
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

      <ProductBenefits product={product} />

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
              {productSpecs.map(([label, value]) => (
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
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-primary">Best for</p>
                  <ul className="mt-3 space-y-3 text-sm text-on-surface-variant">
                    {bestForItems.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">
                    Not ideal for
                  </p>
                  <ul className="mt-3 space-y-3 text-sm text-on-surface-variant">
                    {notIdealFor.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="ambient-card p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold">Care Instructions</h2>
              <ul className="mt-5 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
                {careInstructionItems.map((item) => (
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
              <ProductAccordion items={faqItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <h2 className="font-heading text-2xl font-bold">Frequently Bought Together</h2>
        <div className="mt-6 rounded-lg bg-surface-container-lowest p-6 shadow-ambient">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr_1.4fr] md:items-center">
            {bundleProducts.map((bundleProduct, index) => (
              <div key={bundleProduct.id} className="flex items-center gap-4 md:block md:text-center">
                {index > 0 && <span className="hidden text-2xl text-on-surface-variant md:block">+</span>}
                <Link
                  href={getProductPath(bundleProduct)}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container md:mx-auto md:block md:h-28 md:w-28"
                  aria-label={`View ${bundleProduct.name}`}
                >
                  <Image src={bundleProduct.image} alt={bundleProduct.alt} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="mt-2">
                  <Link href={getProductPath(bundleProduct)} className="text-sm font-semibold hover:text-primary">
                    {index === 0 ? "This item" : bundleProduct.name}
                  </Link>
                  <p className="text-sm text-primary">{formatPrice(bundleProduct.price)}</p>
                </div>
              </div>
            ))}
            <div className="md:col-start-6">
              <p className="text-sm font-semibold">Total Price:</p>
              <p className="font-heading text-xl font-bold">
                {formatPrice(bundleProducts.reduce((sum, item) => sum + item.price, 0))}
              </p>
              <AddBundleButton
                products={bundleProducts}
                className="mt-4 w-full"
              >
                Add All {bundleProducts.length} to Cart
              </AddBundleButton>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section-shell pb-14 md:pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">Product Gallery</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Additional views of the Interactive Snuffle Mat.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-surface-container shadow-soft">
              <Image
                src={image}
                alt={`LUCK CLAWS ${product.name} gallery image ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-2 py-1 text-xs font-bold text-primary">
                &#9733; {index === 2 ? "4.8" : "5.0"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-28 md:pb-20">
        <h2 className="font-heading text-2xl font-bold">You Might Also Like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {recommendedCatalogProducts.map((recommendedProduct) => (
            <ProductCard key={recommendedProduct.id} product={recommendedProduct} />
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant bg-surface-container-lowest p-3 shadow-lift md:hidden">
        <div className="mx-auto flex max-w-screen-sm items-center gap-3">
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

      <div className="fixed bottom-24 right-4 hidden rounded-full bg-surface-container-lowest p-3 text-primary shadow-soft md:block">
        <CheckCircle2 aria-hidden className="h-6 w-6" />
        <span className="sr-only">In stock</span>
      </div>
    </SiteShell>
  );
}
