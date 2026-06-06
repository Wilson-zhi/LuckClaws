export const productHighlightIconKeys = [
  "paw",
  "shield",
  "heart",
  "star",
  "sparkles",
  "leaf",
  "truck",
  "package",
  "check",
  "rotate",
  "lock"
] as const;

export type ProductHighlightIconKey = (typeof productHighlightIconKeys)[number];

const productHighlightIconKeySet = new Set<string>(productHighlightIconKeys);

export function normalizeProductHighlightIconKey(value: unknown): ProductHighlightIconKey | "" {
  if (typeof value !== "string") {
    return "";
  }

  const normalizedIcon = value.trim().toLowerCase();

  return productHighlightIconKeySet.has(normalizedIcon) ? (normalizedIcon as ProductHighlightIconKey) : "";
}
