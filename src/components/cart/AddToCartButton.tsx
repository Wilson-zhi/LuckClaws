"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { type Product } from "@/data/products";
import { trackAddToCart } from "@/lib/ga4-ecommerce";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "icon" | "outline";
  disabled?: boolean;
};

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  children,
  variant = "primary",
  disabled = false
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const label = children ?? (
    <>
      <ShoppingCart aria-hidden className="h-4 w-4" />
      Add to Cart
    </>
  );

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-none motion-reduce:active:scale-100",
        variant === "primary" &&
          "bg-primary-container px-6 py-3 text-on-primary-container hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft motion-reduce:hover:translate-y-0",
        variant === "outline" &&
          "border border-primary px-6 py-3 text-primary hover:-translate-y-0.5 hover:bg-primary-container/10 hover:shadow-soft motion-reduce:hover:translate-y-0",
        variant === "icon" &&
          "grid h-11 w-11 place-items-center bg-primary-container text-on-primary-container hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft motion-reduce:hover:translate-y-0",
        added && "cart-confirm-pop",
        className
      )}
      disabled={disabled}
      onClick={() => {
        addItem(product, {
          quantity,
          color: product.selectedColor,
          size: product.size
        });
        trackAddToCart(product, quantity);
        window.dispatchEvent(
          new CustomEvent("luck-claws:open-cart", {
            detail: {
              productName: product.name,
              quantity
            }
          })
        );
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      aria-label={disabled ? `${product.name} is currently unavailable` : `Add ${product.name} to cart for ${formatPrice(product.price)}`}
    >
      {added ? (
        <>
          <Check aria-hidden className="h-5 w-5" />
          {variant !== "icon" && <span>Added to cart</span>}
        </>
      ) : variant === "icon" ? (
        <ShoppingCart aria-hidden className="h-5 w-5" />
      ) : (
        label
      )}
      <span className="sr-only" aria-live="polite">{added ? `${product.name} added to cart` : ""}</span>
    </button>
  );
}
