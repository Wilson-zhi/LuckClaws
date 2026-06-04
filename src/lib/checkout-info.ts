export const checkoutInfoKey = "luckclaws:checkoutInfo";

export type CheckoutInfo = {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
};

export type CheckoutInfoField = keyof Pick<
  CheckoutInfo,
  "email" | "firstName" | "lastName" | "country" | "address" | "city" | "state" | "zip"
>;

export type CheckoutInfoValidationError = {
  field: CheckoutInfoField;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredFieldLabels: Record<CheckoutInfoField, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  country: "Country / Region",
  address: "Address",
  city: "City",
  state: "State",
  zip: "ZIP code"
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeCheckoutInfo(info: CheckoutInfo): CheckoutInfo {
  return {
    email: clean(info.email),
    firstName: clean(info.firstName),
    lastName: clean(info.lastName),
    country: clean(info.country),
    address: clean(info.address),
    apartment: clean(info.apartment),
    city: clean(info.city),
    state: clean(info.state),
    zip: clean(info.zip),
    phone: clean(info.phone)
  };
}

export function validateCheckoutInfo(info: CheckoutInfo | null | undefined): CheckoutInfoValidationError[] {
  const normalizedInfo = normalizeCheckoutInfo(info ?? {});
  const errors: CheckoutInfoValidationError[] = [];

  (Object.keys(requiredFieldLabels) as CheckoutInfoField[]).forEach((field) => {
    if (!normalizedInfo[field]) {
      errors.push({
        field,
        message: `${requiredFieldLabels[field]} is required.`
      });
    }
  });

  if (normalizedInfo.email && !emailPattern.test(normalizedInfo.email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address."
    });
  }

  return errors;
}

export function isCheckoutInfoValid(info: CheckoutInfo | null | undefined) {
  return validateCheckoutInfo(info).length === 0;
}

export function saveCheckoutInfo(info: CheckoutInfo) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(checkoutInfoKey, JSON.stringify(normalizeCheckoutInfo(info)));
}

export function readCheckoutInfo(): CheckoutInfo | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(checkoutInfoKey);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as CheckoutInfo;

    return parsedValue && typeof parsedValue === "object" ? parsedValue : null;
  } catch {
    return null;
  }
}
