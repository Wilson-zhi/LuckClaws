"use client";

import { ShoppingCart } from "lucide-react";
import { type Product } from "@/data/products";
import { trackAddBundleToCart } from "@/lib/ga4-ecommerce";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type AddBundleButtonProps = {
  products: Product[];
  className?: string;
  children?: React.ReactNode;
};

export function AddBundleButton({ products, className, children }: AddBundleButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 font-semibold text-on-primary-container transition hover:bg-[#e08f00]",
        className
      )}
      onClick={() => {
        products.forEach((product) => {
          addItem(product, {
            color: product.selectedColor,
            size: product.size
          });
        });
        trackAddBundleToCart(products);
        window.dispatchEvent(new Event("luck-claws:open-cart"));
      }}
      aria-label={`Add bundle to cart for ${formatPrice(total)}`}
    >
      <ShoppingCart aria-hidden className="h-4 w-4" />
      {children ?? "Add Bundle to Cart"}
    </button>
  );
}
