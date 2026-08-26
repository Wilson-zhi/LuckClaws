import Image from "next/image";
import Link from "next/link";
import { Heart, Package, ShieldCheck, Truck } from "lucide-react";
import { ViewItemListTracker, ViewItemTracker } from "@/components/analytics/EcommerceEventTrackers";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductBundleBuilder } from "@/components/product/ProductBundleBuilder";
import { ProductChapterNav } from "@/components/product/ProductChapterNav";
import { ProductDeliveryRoute } from "@/components/product/ProductDeliveryRoute";
import { ProductFieldNotes } from "@/components/product/ProductFieldNotes";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHighlightsBand } from "@/components/product/ProductHighlightsBand";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductRecommendationRail } from "@/components/product/ProductRecommendationRail";
import { ProductRoutineGuide } from "@/components/product/ProductRoutineGuide";
import { ProductUseRitual } from "@/components/product/ProductUseRitual";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { type Product } from "@/data/products";
import { type NavigationItem } from "@/data/navigation";
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

export function ProductDetailTemplate({
  product,
  relatedProducts: providedRelatedProducts,
  navigationItems
}: {
  product: Product;
  relatedProducts?: Product[];
  navigationItems?: NavigationItem[];
}) {
  const relatedProducts = providedRelatedProducts ?? getRelatedProducts(product);
  const bundleProducts = [product, ...relatedProducts.slice(0, 2)];
  const highlights = product.productHighlights?.length ? product.productHighlights : getProductHighlights(product);
  const details = product.detailRows?.length
    ? product.detailRows.map((detailRow) => [detailRow.label, detailRow.value] as const)
    : getProductDetails(product);
  const bestFor = product.bestFor?.length ? product.bestFor : getBestForItems(product);
  const careInstructions = product.careInstructions?.length ? product.careInstructions : getCareInstructions(product);
  const shippingReturns = getShippingReturnItems();
  const productFaqs = product.productFaqs?.length ? product.productFaqs : getProductFaqs(product);
  const collectionHref = getCollectionPath(product);
  const routineBenefits = product.benefits?.length
    ? product.benefits
    : highlights.map((highlight) => highlight.text || highlight.title);
  const itemListName = `${product.name} Related Products`;
  const accordions = product.accordionSections?.length
    ? product.accordionSections
    : [
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
    <SiteShell navigationItems={navigationItems}>
      <ViewItemTracker product={product} />
      <ViewItemListTracker products={relatedProducts} itemListName={itemListName} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createProductJsonLd(product)) }}
      />

      <section id="product-overview" className="section-shell scroll-mt-20 py-8 md:scroll-mt-[156px] md:py-14 xl:scroll-mt-[166px]">
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
        benefits={routineBenefits}
        bestFor={bestFor}
        careInstructions={careInstructions}
      />

      <ProductHighlightsBand highlights={highlights} />

      <ProductUseRitual
        productName={product.name}
        productType={product.productType}
        bestFor={bestFor}
        careInstructions={careInstructions}
        safetyNotice={product.safetyNotice}
      />

      <ProductFieldNotes
        productName={product.name}
        details={details}
        bestFor={bestFor}
        careInstructions={careInstructions}
      />

      <ProductDeliveryRoute shippingItems={shippingReturns} faqItems={productFaqs} />

      {relatedProducts.length > 0 && <ProductBundleBuilder products={bundleProducts} />}

      {relatedProducts.length > 0 && (
        <ProductRecommendationRail products={relatedProducts} itemListName={itemListName} />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant bg-surface-container-lowest p-3 shadow-lift md:hidden">
        <div className="mx-auto flex max-w-screen-sm items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-container">
            <Image src={product.image} alt={product.alt} fill sizes="48px" className="object-cover" priority />
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
