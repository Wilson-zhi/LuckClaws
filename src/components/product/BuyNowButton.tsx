"use client";

import { useRouter } from "next/navigation";
import { type Product } from "@/data/products";
import { saveBuyNowCheckoutItem } from "@/lib/buy-now-checkout";
import { cn, formatPrice } from "@/lib/utils";

type BuyNowButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
  disabled?: boolean;
};

export function BuyNowButton({ product, quantity = 1, className, disabled = false }: BuyNowButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
        className
      )}
      disabled={disabled}
      onClick={() => {
        saveBuyNowCheckoutItem(product, quantity);
        router.push("/checkout/information?mode=buy-now");
      }}
      aria-label={disabled ? `${product.name} is currently unavailable` : `Buy ${product.name} now for ${formatPrice(product.price)}`}
    >
      Buy Now
    </button>
  );
}
