import { brandName, products, type Product } from "@/data/products";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import { DEFAULT_SHIPPING_RATE } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

const schemaAvailabilityByProductAvailability: Record<Product["availability"], string> = {
  in_stock: "https://schema.org/InStock"
};

const schemaConditionByProductCondition: Record<Product["condition"], string> = {
  new: "https://schema.org/NewCondition"
};

function createOfferShippingDetails(product: Product) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: (product.shippingRate ?? DEFAULT_SHIPPING_RATE).toFixed(2),
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
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnLink: absoluteUrl("/refund-policy")
  };
}

export function createProductSeoDescription(product: Product) {
  return `${product.shortDescription} ${product.category} from ${brandName}, priced at ${formatPrice(product.price)}.`;
}

export function createProductMetadata(product: Product) {
  const title = `${product.name} | ${brandName}`;
  const description = createProductSeoDescription(product);

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
    sku: product.id,
    url: absoluteUrl(product.productUrl),
    image: absoluteUrl(product.image),
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

export function getGoogleProductCategory() {
  return "Animals & Pet Supplies > Pet Supplies";
}

export function getSeoReadyProducts() {
  return products;
}
