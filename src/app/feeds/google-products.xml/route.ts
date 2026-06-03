import { generateGoogleProductsXml } from "@/lib/merchant-feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateGoogleProductsXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
