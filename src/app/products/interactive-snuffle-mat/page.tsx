import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Heart,
  Package,
  ShieldCheck,
  Truck
} from "lucide-react";
import { ViewItemListTracker, ViewItemTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductBundleBuilder } from "@/components/product/ProductBundleBuilder";
import { ProductChapterNav } from "@/components/product/ProductChapterNav";
import { ProductDeliveryRoute } from "@/components/product/ProductDeliveryRoute";
import { ProductFieldNotes } from "@/components/product/ProductFieldNotes";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductRecommendationRail } from "@/components/product/ProductRecommendationRail";
import { ProductRoutineGuide } from "@/components/product/ProductRoutineGuide";
import { ProductUseRitual } from "@/components/product/ProductUseRitual";
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
import { createProductJsonLd, createProductMetadata } from "@/lib/product-seo";
import {
  freeShippingLabel,
  freeShippingSentence,
  standardShippingSentence,
  variableShippingSentence
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

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
  return (
    <SiteShell>
      <ViewItemTracker product={product} />
      <ViewItemListTracker products={recommendedCatalogProducts} itemListName="You Might Also Like" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section id="product-overview" className="section-shell scroll-mt-20 py-8 md:scroll-mt-[156px] md:py-14 xl:scroll-mt-[166px]">
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
              <ProductAccordion
                items={accordions}
                defaultOpenIndex={0}
                note="the useful bits, right where you need them"
              />
            </div>
          </div>
        </div>
      </section>

      <ProductChapterNav pairTargetId="product-pairings" />

      <ProductRoutineGuide
        productName={product.name}
        benefits={product.benefits ?? product.productHighlights?.map((highlight) => highlight.text) ?? []}
        bestFor={bestForItems}
        careInstructions={careInstructionItems}
      />

      <ProductBenefits product={product} />

      <ProductUseRitual
        productName={product.name}
        productType={product.productType}
        bestFor={bestForItems}
        careInstructions={careInstructionItems}
        safetyNotice={product.safetyNotice}
      />

      <ProductFieldNotes
        productName={product.name}
        details={productSpecs}
        bestFor={bestForItems}
        careInstructions={careInstructionItems}
        cautionItems={notIdealFor}
      />

      <ProductDeliveryRoute shippingItems={shippingReturns} faqItems={faqItems} />

      <ProductBundleBuilder products={bundleProducts} />

      <ProductRecommendationRail products={recommendedCatalogProducts} itemListName="You Might Also Like" />

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
