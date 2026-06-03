"use client";

import { useRouter } from "next/navigation";
import { type Product } from "@/data/products";
import { trackAddToCart } from "@/lib/ga4-ecommerce";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type BuyNowButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
};

export function BuyNowButton({ product, quantity = 1, className }: BuyNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary-container/10",
        className
      )}
      onClick={() => {
        addItem(product, {
          quantity,
          color: product.selectedColor,
          size: product.size
        });
        trackAddToCart(product, quantity);
        router.push("/checkout/information");
      }}
      aria-label={`Buy ${product.name} now for ${formatPrice(product.price)}`}
    >
      Buy Now
    </button>
  );
}
