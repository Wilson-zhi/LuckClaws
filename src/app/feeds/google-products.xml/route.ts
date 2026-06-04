import { generateGoogleProductsXml } from "@/lib/merchant-feed";
import { getPublicProducts } from "@/lib/public-product-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(generateGoogleProductsXml(await getPublicProducts()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
