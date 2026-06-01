"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { type Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "icon" | "outline";
};

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  children,
  variant = "primary"
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition",
        variant === "primary" &&
          "bg-primary-container px-6 py-3 text-on-primary-container hover:bg-[#e08f00]",
        variant === "outline" &&
          "border border-primary px-6 py-3 text-primary hover:bg-primary-container/10",
        variant === "icon" &&
          "grid h-11 w-11 place-items-center bg-primary-container text-on-primary-container hover:bg-[#e08f00]",
        className
      )}
      onClick={() => {
        addItem(product, {
          quantity,
          color: product.selectedColor,
          size: product.size
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      aria-label={`Add ${product.name} to cart for ${formatPrice(product.price)}`}
    >
      {variant === "icon" ? <ShoppingCart aria-hidden className="h-5 w-5" /> : label}
      {added && <span className="sr-only">Added</span>}
    </button>
  );
}

