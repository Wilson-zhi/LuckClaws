import { roundMoney } from "@/lib/utils";

export type DiscountCodeType = "percentage" | "fixed_amount";

export type DiscountCodeStatus = "active" | "draft" | "archived";

export type DiscountCodeRow = {
  id: string;
  code: string | null;
  name: string | null;
  type: string | null;
  value: number | string | null;
  status: string | null;
  minimum_order_amount: number | string | null;
  max_uses: number | string | null;
  used_count: number | string | null;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AppliedDiscount = {
  code: string;
  name: string | null;
  type: DiscountCodeType;
  value: number;
  amount: number;
};

export function normalizeDiscountCode(value: string) {
  return value.trim().toUpperCase();
}

export function numberFromDiscountValue(value: number | string | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateDiscountAmount({
  subtotal,
  type,
  value
}: {
  subtotal: number;
  type: DiscountCodeType;
  value: number;
}) {
  if (subtotal <= 0 || value <= 0) {
    return 0;
  }

  if (type === "percentage") {
    return roundMoney(subtotal * (Math.min(value, 100) / 100));
  }

  return roundMoney(Math.min(value, subtotal));
}

export function isDiscountCodeType(value: string | null): value is DiscountCodeType {
  return value === "percentage" || value === "fixed_amount";
}

export function isDiscountCodeStatus(value: string | null): value is DiscountCodeStatus {
  return value === "active" || value === "draft" || value === "archived";
}
