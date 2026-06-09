"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  cartItemsToCheckoutPayload,
  clearStoredDiscountCode,
  readStoredDiscountCode,
  saveStoredDiscountCode,
  type DiscountValidationResponse
} from "@/lib/checkout-discount";
import { normalizeDiscountCode, type AppliedDiscount } from "@/lib/discounts";
import { formatPrice } from "@/lib/utils";
import { type CartItem } from "@/store/cart-store";

type DiscountCodeBoxProps = {
  items: CartItem[];
  onDiscountChange: (discount: AppliedDiscount | null) => void;
};

async function validateCode(code: string, items: CartItem[]) {
  const response = await fetch("/api/discounts/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code,
      items: cartItemsToCheckoutPayload(items)
    })
  });
  const payload = (await response.json()) as DiscountValidationResponse;

  if (!response.ok || !payload.discount) {
    throw new Error(payload.error ?? "Invalid code.");
  }

  return payload.discount;
}

export function DiscountCodeBox({ items, onDiscountChange }: DiscountCodeBoxProps) {
  const [code, setCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const itemSignature = useMemo(
    () => items.map((item) => [item.id, item.quantity, item.color ?? "", item.size ?? ""].join(":")).join("|"),
    [items]
  );

  useEffect(() => {
    const storedCode = readStoredDiscountCode();

    if (!storedCode || items.length === 0) {
      onDiscountChange(null);
      return;
    }

    let active = true;

    setCode(storedCode);
    setLoading(true);
    validateCode(storedCode, items)
      .then((discount) => {
        if (!active) {
          return;
        }

        setAppliedDiscount(discount);
        setError("");
        setMessage(`${discount.code} applied.`);
        onDiscountChange(discount);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearStoredDiscountCode();
        setAppliedDiscount(null);
        setMessage("");
        onDiscountChange(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [itemSignature, items, onDiscountChange]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = normalizeDiscountCode(code);

    if (!normalizedCode) {
      setError("Enter a discount code.");
      setMessage("");
      return;
    }

    if (items.length === 0) {
      setError("Add an item before applying a discount.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const discount = await validateCode(normalizedCode, items);

      setCode(discount.code);
      setAppliedDiscount(discount);
      saveStoredDiscountCode(discount.code);
      onDiscountChange(discount);
      setMessage(`${discount.code} applied.`);
    } catch (applyError) {
      setAppliedDiscount(null);
      clearStoredDiscountCode();
      onDiscountChange(null);
      setError(applyError instanceof Error ? applyError.message : "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setMessage("");
    setError("");
    clearStoredDiscountCode();
    onDiscountChange(null);
  }

  return (
    <section className="rounded-md border border-outline-variant/70 bg-surface-container-lowest p-4">
      <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
        <label className="text-sm font-bold text-on-surface" htmlFor="discount-code">
          Discount code
        </label>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            id="discount-code"
            type="text"
            autoComplete="off"
            placeholder="WELCOME10"
            value={code}
            className="min-h-11 rounded-full border border-outline-variant bg-white px-4 text-sm uppercase text-on-surface outline-none transition placeholder:normal-case placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary-container/30"
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());

              if (error) {
                setError("");
              }

              if (message) {
                setMessage("");
              }
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 justify-center rounded-full bg-primary-container px-5 py-2.5 font-heading text-sm font-bold text-on-primary-container transition hover:bg-[#e08f00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </form>

      {appliedDiscount && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md bg-primary-container/15 px-4 py-3 text-sm">
          <p className="font-semibold text-primary">
            {appliedDiscount.code} saves {formatPrice(appliedDiscount.amount)}
          </p>
          <button
            type="button"
            className="font-semibold text-on-surface-variant hover:text-primary"
            onClick={removeDiscount}
          >
            Remove
          </button>
        </div>
      )}

      {message && !appliedDiscount && (
        <p className="mt-3 text-sm font-semibold text-primary" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm font-semibold text-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
