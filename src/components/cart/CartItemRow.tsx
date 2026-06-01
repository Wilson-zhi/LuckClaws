"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { formatPrice } from "@/lib/utils";
import { type CartItem, useCartStore } from "@/store/cart-store";

type CartItemRowProps = {
  item: CartItem;
  compact?: boolean;
};

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <article className="flex gap-4">
      <div
        className={
          compact
            ? "relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container"
            : "relative h-32 w-32 shrink-0 overflow-hidden rounded-md bg-surface-container"
        }
      >
        <Image src={item.image} alt={item.alt} fill sizes="160px" className="object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-bold text-on-surface">{item.name}</h3>
          {(item.color || item.size) && (
            <p className="mt-1 text-sm text-on-surface-variant">
              {item.color && <>Color: {item.color}</>}
              {item.color && item.size && " | "}
              {item.size && <>Size: {item.size}</>}
            </p>
          )}
          <p className="mt-2 font-semibold text-primary">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            label={item.name}
          />
          {!compact && (
            <button
              type="button"
              className="text-sm font-semibold text-on-surface-variant underline underline-offset-4 hover:text-primary"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          )}
          <p className="w-20 text-right font-heading text-lg font-bold">
            {formatPrice(item.price * item.quantity)}
          </p>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-error"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

