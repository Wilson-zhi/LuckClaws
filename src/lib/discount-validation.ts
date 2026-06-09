import "server-only";

import {
  calculateDiscountAmount,
  isDiscountCodeType,
  normalizeDiscountCode,
  numberFromDiscountValue,
  type AppliedDiscount,
  type DiscountCodeRow
} from "@/lib/discounts";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

function dateFromValue(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function validateDiscountForSubtotal({
  code,
  subtotal
}: {
  code: string;
  subtotal: number;
}): Promise<AppliedDiscount> {
  const normalizedCode = normalizeDiscountCode(code);

  if (!normalizedCode) {
    throw new Error("Enter a discount code.");
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Discount validation is temporarily unavailable.");
  }

  const { data, error } = await supabase
    .from("discount_codes")
    .select(
      "id, code, name, type, value, status, minimum_order_amount, max_uses, used_count, starts_at, expires_at, created_at, updated_at"
    )
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw new Error("Discount validation is temporarily unavailable.");
  }

  if (!data) {
    throw new Error("Invalid code.");
  }

  const discount = data as DiscountCodeRow;
  const type = discount.type?.trim() ?? null;

  if (discount.status !== "active") {
    throw new Error("This discount code is not currently available.");
  }

  if (!isDiscountCodeType(type)) {
    throw new Error("Invalid code.");
  }

  const now = new Date();
  const startsAt = dateFromValue(discount.starts_at);
  const expiresAt = dateFromValue(discount.expires_at);

  if (startsAt && startsAt.getTime() > now.getTime()) {
    throw new Error("This code is not active yet.");
  }

  if (expiresAt && expiresAt.getTime() < now.getTime()) {
    throw new Error("Code expired.");
  }

  const maxUses = discount.max_uses === null ? null : numberFromDiscountValue(discount.max_uses);
  const usedCount = numberFromDiscountValue(discount.used_count);

  if (maxUses !== null && maxUses > 0 && usedCount >= maxUses) {
    throw new Error("Code usage limit reached.");
  }

  const minimumOrderAmount = numberFromDiscountValue(discount.minimum_order_amount);

  if (minimumOrderAmount > 0 && subtotal < minimumOrderAmount) {
    throw new Error("Minimum order not met.");
  }

  const value = numberFromDiscountValue(discount.value);

  if (value <= 0) {
    throw new Error("Invalid code.");
  }

  const amount = calculateDiscountAmount({ subtotal, type, value });

  if (amount <= 0) {
    throw new Error("Invalid code.");
  }

  return {
    code: normalizedCode,
    name: discount.name,
    type,
    value,
    amount
  };
}
