import { brandName, type Product } from "@/data/products";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { getGoogleProductCategory, getMerchantProductType, getSeoReadyProducts } from "@/lib/product-seo";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlElement(name: string, value: string | number) {
  return `<${name}>${xmlEscape(String(value))}</${name}>`;
}

function availabilityForFeed(product: Product) {
  switch (product.availability) {
    case "out_of_stock":
      return "out of stock";
    case "preorder":
      return "preorder";
    default:
      return "in stock";
  }
}

function conditionForFeed(product: Product) {
  return product.condition;
}

function priceForFeed(product: Product) {
  return `${product.price.toFixed(2)} ${product.currency}`;
}

function productFeedItem(product: Product) {
  const fields = [
    xmlElement("g:id", product.id),
    xmlElement("g:title", product.name),
    xmlElement("g:description", product.shortDescription),
    xmlElement("g:link", absoluteUrl(product.productUrl)),
    xmlElement("g:image_link", absoluteUrl(product.image)),
    xmlElement("g:availability", availabilityForFeed(product)),
    xmlElement("g:price", priceForFeed(product)),
    xmlElement("g:brand", product.brand),
    xmlElement("g:condition", conditionForFeed(product)),
    xmlElement("g:product_type", getMerchantProductType(product)),
    xmlElement("g:google_product_category", getGoogleProductCategory(product))
  ];

  return `<item>${fields.join("")}</item>`;
}

export function generateGoogleProductsXml(products: Product[] = getSeoReadyProducts()) {
  const items = products.map(productFeedItem).join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>${xmlElement("title", `${brandName} Products`)}${xmlElement("link", siteUrl)}${xmlElement("description", `Product feed for ${brandName}`)}${items}</channel></rss>`;
}
