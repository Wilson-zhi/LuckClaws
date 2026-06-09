import {
  isDiscountCodeStatus,
  isDiscountCodeType,
  normalizeDiscountCode,
  numberFromDiscountValue,
  type DiscountCodeStatus,
  type DiscountCodeType
} from "@/lib/discounts";

export type AdminDiscountPayload = {
  code: string;
  name: string | null;
  type: DiscountCodeType;
  value: number;
  status: DiscountCodeStatus;
  minimum_order_amount: number | null;
  max_uses: number | null;
  starts_at: string | null;
  expires_at: string | null;
};

export type AdminDiscountValidationResult =
  | { ok: true; payload: AdminDiscountPayload }
  | { ok: false; errors: Record<string, string> };

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function optionalDate(value: unknown) {
  const text = cleanString(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);

  return Number.isNaN(date.getTime()) ? "invalid" : date.toISOString();
}

export function validateAdminDiscountPayload(value: unknown): AdminDiscountValidationResult {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
  const code = normalizeDiscountCode(cleanString(record.code));
  const name = cleanString(record.name) || null;
  const type = cleanString(record.type);
  const status = cleanString(record.status);
  const discountValue = numberFromDiscountValue(record.value as number | string | null);
  const minimumOrderAmount = optionalNumber(record.minimum_order_amount);
  const maxUses = optionalNumber(record.max_uses);
  const startsAt = optionalDate(record.starts_at);
  const expiresAt = optionalDate(record.expires_at);
  const errors: Record<string, string> = {};

  if (!code) {
    errors.code = "Code is required.";
  }

  if (!isDiscountCodeType(type)) {
    errors.type = "Type must be percentage or fixed amount.";
  }

  if (!isDiscountCodeStatus(status)) {
    errors.status = "Status must be active, draft, or archived.";
  }

  if (discountValue <= 0) {
    errors.value = "Value must be greater than 0.";
  }

  if (type === "percentage" && discountValue > 100) {
    errors.value = "Percentage discount cannot exceed 100.";
  }

  if (minimumOrderAmount !== null && (!Number.isFinite(minimumOrderAmount) || minimumOrderAmount < 0)) {
    errors.minimum_order_amount = "Minimum order amount must be 0 or greater.";
  }

  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
    errors.max_uses = "Max uses must be a positive whole number.";
  }

  if (startsAt === "invalid") {
    errors.starts_at = "Start date must be valid.";
  }

  if (expiresAt === "invalid") {
    errors.expires_at = "Expiry date must be valid.";
  }

  if (
    startsAt &&
    startsAt !== "invalid" &&
    expiresAt &&
    expiresAt !== "invalid" &&
    new Date(startsAt).getTime() > new Date(expiresAt).getTime()
  ) {
    errors.expires_at = "Expiry date must be after the start date.";
  }

  if (Object.keys(errors).length > 0 || !isDiscountCodeType(type) || !isDiscountCodeStatus(status)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      code,
      name,
      type,
      value: discountValue,
      status,
      minimum_order_amount: minimumOrderAmount,
      max_uses: maxUses,
      starts_at: startsAt,
      expires_at: expiresAt
    }
  };
}
