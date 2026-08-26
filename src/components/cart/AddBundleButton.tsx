"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
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
  const [added, setAdded] = useState(false);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 font-semibold text-on-primary-container transition duration-200 hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        added && "cart-confirm-pop",
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
        window.dispatchEvent(
          new CustomEvent("luck-claws:open-cart", {
            detail: {
              productName: "Routine bundle",
              quantity: products.length
            }
          })
        );
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      aria-label={`Add bundle to cart for ${formatPrice(total)}`}
    >
      {added ? <Check aria-hidden className="h-5 w-5" /> : <ShoppingCart aria-hidden className="h-4 w-4" />}
      {added ? "Bundle added" : children ?? "Add Bundle to Cart"}
      <span className="sr-only" aria-live="polite">
        {added ? `${products.length} products added to cart` : ""}
      </span>
    </button>
  );
}
