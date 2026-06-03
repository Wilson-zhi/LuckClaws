import { brandName, products, type Product } from "@/data/products";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";

const schemaAvailabilityByProductAvailability: Record<Product["availability"], string> = {
  in_stock: "https://schema.org/InStock"
};

const schemaConditionByProductCondition: Record<Product["condition"], string> = {
  new: "https://schema.org/NewCondition"
};

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
      itemCondition: schemaConditionByProductCondition[product.condition]
    },
    ...(typeof product.rating === "number" && typeof product.reviewCount === "number"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount
          }
        }
      : {})
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
