import { brandName, products, type Product } from "@/data/products";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import {
  DEFAULT_SHIPPING_RATE,
  freeShippingSentence,
  standardShippingSentence,
  variableShippingSentence
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

const schemaAvailabilityByProductAvailability: Record<Product["availability"], string> = {
  in_stock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder"
};

const schemaConditionByProductCondition: Record<Product["condition"], string> = {
  new: "https://schema.org/NewCondition"
};

function createOfferShippingDetails(product: Product) {
  const shippingRate = product.shippingRate ?? DEFAULT_SHIPPING_RATE;

  return {
    "@type": "OfferShippingDetails",
    "@id": absoluteUrl("/shipping-returns#standard-door-to-door-shipping"),
    name: "Standard door-to-door shipping",
    description: `${standardShippingSentence} ${freeShippingSentence} ${variableShippingSentence}`,
    url: absoluteUrl("/shipping-returns"),
    shippingRate: {
      "@type": "MonetaryAmount",
      value: Number(shippingRate.toFixed(2)),
      currency: product.currency
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US"
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY"
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 7,
        maxValue: 15,
        unitCode: "DAY"
      }
    }
  };
}

function createMerchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    "@id": absoluteUrl("/refund-policy#merchant-return-policy"),
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    description:
      "General returns for preference changes or buyer's remorse are not accepted. Damaged, defective, or incorrect items must be reported within 7 days of delivery.",
    url: absoluteUrl("/refund-policy"),
    merchantReturnLink: absoluteUrl("/refund-policy")
  };
}

function productImageUrls(product: Product) {
  return Array.from(new Set([product.image, ...(product.gallery ?? [])].filter(Boolean))).map((image) =>
    absoluteUrl(image)
  );
}

export function createProductSeoDescription(product: Product) {
  return `${product.shortDescription} ${product.category} from ${brandName}, priced at ${formatPrice(product.price)}.`;
}

export function createProductMetadata(product: Product) {
  const title = product.seoTitle ?? `${product.name} | ${brandName}`;
  const description = product.seoDescription ?? createProductSeoDescription(product);

  return createSeoMetadata({
    title,
    description,
    path: product.productUrl,
    image: product.image,
    imageAlt: product.imageAlt,
    openGraphTitle: title,
    openGraphDescription: description,
    twitterTitle: title,
    twitterDescription: description
  });
}

export function createProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.slug,
    url: absoluteUrl(product.productUrl),
    image: productImageUrls(product),
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(product.productUrl),
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: schemaAvailabilityByProductAvailability[product.availability],
      itemCondition: schemaConditionByProductCondition[product.condition],
      seller: {
        "@type": "Organization",
        name: brandName,
        url: absoluteUrl("/")
      },
      shippingDetails: createOfferShippingDetails(product),
      hasMerchantReturnPolicy: createMerchantReturnPolicy()
    }
  };
}

export function getMerchantProductType(product: Product) {
  return product.productType === product.category
    ? product.category
    : `${product.category} > ${product.productType}`;
}

export function getGoogleProductCategory(product?: Product) {
  return product?.googleProductCategory ?? "Animals & Pet Supplies > Pet Supplies";
}

export function getSeoReadyProducts() {
  return products;
}
