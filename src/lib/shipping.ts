export const FREE_SHIPPING_THRESHOLD = 300;
export const DEFAULT_SHIPPING_RATE = 39.99;

export const freeShippingLabel = `Free shipping over $${FREE_SHIPPING_THRESHOLD}`;
export const freeShippingSentence = `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}.`;
export const standardShippingSentence = `Door-to-door shipping starts at $${DEFAULT_SHIPPING_RATE.toFixed(2)} for orders under $${FREE_SHIPPING_THRESHOLD}.`;
export const shortStandardShippingSentence = `Door-to-door shipping starts at $${DEFAULT_SHIPPING_RATE.toFixed(2)} under $${FREE_SHIPPING_THRESHOLD}`;
export const variableShippingSentence = "Shipping may vary by item size or product type.";
