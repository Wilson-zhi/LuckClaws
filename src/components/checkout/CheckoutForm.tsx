"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Mail, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import {
  type CheckoutInfo,
  type CheckoutInfoField,
  normalizeCheckoutInfo,
  readCheckoutInfo,
  saveCheckoutInfo,
  validateCheckoutInfo
} from "@/lib/checkout-info";
import { freeShippingLabel, standardShippingSentence, variableShippingSentence } from "@/lib/shipping";

const inputClass =
  "min-h-14 w-full rounded-md border-outline bg-surface-container-lowest px-4 text-base focus:border-primary focus:ring-primary";

const initialCheckoutInfo: CheckoutInfo = {
  email: "",
  firstName: "",
  lastName: "",
  country: "United States",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  phone: ""
};

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowMode = searchParams.get("mode") === "buy-now";
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>(initialCheckoutInfo);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckoutInfoField, string>>>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const savedInfo = readCheckoutInfo();

    if (savedInfo) {
      setCheckoutInfo({
        ...initialCheckoutInfo,
        ...normalizeCheckoutInfo(savedInfo)
      });
    }
  }, []);

  const updateField = (field: keyof CheckoutInfo, value: string) => {
    setFormError("");
    setCheckoutInfo((currentInfo) => ({
      ...currentInfo,
      [field]: value
    }));
    setFieldErrors((currentErrors) => {
      if (!(field in currentErrors)) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field as CheckoutInfoField];

      return nextErrors;
    });
  };

  const getFieldError = (field: CheckoutInfoField) => fieldErrors[field];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedInfo = normalizeCheckoutInfo(checkoutInfo);
    const validationErrors = validateCheckoutInfo(normalizedInfo);

    if (validationErrors.length > 0) {
      setFieldErrors(
        validationErrors.reduce<Partial<Record<CheckoutInfoField, string>>>((errors, validationError) => {
          errors[validationError.field] = validationError.message;

          return errors;
        }, {})
      );
      setFormError("Please complete the required checkout information before payment.");
      return;
    }

    setFieldErrors({});
    setFormError("");
    saveCheckoutInfo(normalizedInfo);

    router.push(`/checkout/payment${isBuyNowMode ? "?mode=buy-now" : ""}`);
  };

  return (
    <form className="space-y-8" aria-label="Checkout information form" onSubmit={handleSubmit} noValidate>
      <section>
        <h1 className="font-heading text-4xl font-bold md:text-5xl">Checkout Information</h1>
        <p className="mt-3 text-on-surface-variant">
          Enter your contact and shipping details to continue. Payment will be connected in the
          next step.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Truck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>{freeShippingLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>Damaged or incorrect items covered</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <a href="mailto:support@luckclaws.com" className="hover:text-primary">
              support@luckclaws.com
            </a>
          </div>
        </div>
        <p className="mt-3 text-sm text-on-surface-variant">
          {standardShippingSentence} {variableShippingSentence}
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold">Contact information</h2>
        <div className="mt-5">
          <label htmlFor="email" className="mb-2 block font-semibold text-on-surface-variant">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            value={checkoutInfo.email ?? ""}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(getFieldError("email"))}
            aria-describedby={getFieldError("email") ? "email-error" : undefined}
            required
          />
          {getFieldError("email") && (
            <p id="email-error" className="mt-2 text-sm text-error">
              {getFieldError("email")}
            </p>
          )}
        </div>
        <label className="mt-5 flex items-center gap-3 text-on-surface-variant">
          <input
            type="checkbox"
            name="emailOffers"
            className="h-6 w-6 rounded border-outline text-primary-container focus:ring-primary-container"
          />
          Email me with news and exclusive offers
        </label>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold">Shipping address</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="country" className="mb-2 block font-semibold text-on-surface-variant">
              Country / Region
            </label>
            <select
              id="country"
              name="country"
              className={inputClass}
              autoComplete="country-name"
              value={checkoutInfo.country ?? "United States"}
              onChange={(event) => updateField("country", event.target.value)}
              aria-invalid={Boolean(getFieldError("country"))}
              aria-describedby={getFieldError("country") ? "country-error" : undefined}
              required
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            {getFieldError("country") && (
              <p id="country-error" className="mt-2 text-sm text-error">
                {getFieldError("country")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="firstName" className="mb-2 block font-semibold text-on-surface-variant">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              placeholder="First name"
              className={inputClass}
              value={checkoutInfo.firstName ?? ""}
              onChange={(event) => updateField("firstName", event.target.value)}
              aria-invalid={Boolean(getFieldError("firstName"))}
              aria-describedby={getFieldError("firstName") ? "firstName-error" : undefined}
              required
            />
            {getFieldError("firstName") && (
              <p id="firstName-error" className="mt-2 text-sm text-error">
                {getFieldError("firstName")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block font-semibold text-on-surface-variant">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              placeholder="Last name"
              className={inputClass}
              value={checkoutInfo.lastName ?? ""}
              onChange={(event) => updateField("lastName", event.target.value)}
              aria-invalid={Boolean(getFieldError("lastName"))}
              aria-describedby={getFieldError("lastName") ? "lastName-error" : undefined}
              required
            />
            {getFieldError("lastName") && (
              <p id="lastName-error" className="mt-2 text-sm text-error">
                {getFieldError("lastName")}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="mb-2 block font-semibold text-on-surface-variant">
              Address
            </label>
            <input
              id="address"
              name="address"
              autoComplete="address-line1"
              placeholder="Street address"
              className={inputClass}
              value={checkoutInfo.address ?? ""}
              onChange={(event) => updateField("address", event.target.value)}
              aria-invalid={Boolean(getFieldError("address"))}
              aria-describedby={getFieldError("address") ? "address-error" : undefined}
              required
            />
            {getFieldError("address") && (
              <p id="address-error" className="mt-2 text-sm text-error">
                {getFieldError("address")}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="apartment" className="mb-2 block font-semibold text-on-surface-variant">
              Apartment, suite, etc. <span className="font-normal">(optional)</span>
            </label>
            <input
              id="apartment"
              name="apartment"
              autoComplete="address-line2"
              placeholder="Apartment, suite, unit, building, floor"
              className={inputClass}
              value={checkoutInfo.apartment ?? ""}
              onChange={(event) => updateField("apartment", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-2 block font-semibold text-on-surface-variant">
              City
            </label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              placeholder="City"
              className={inputClass}
              value={checkoutInfo.city ?? ""}
              onChange={(event) => updateField("city", event.target.value)}
              aria-invalid={Boolean(getFieldError("city"))}
              aria-describedby={getFieldError("city") ? "city-error" : undefined}
              required
            />
            {getFieldError("city") && (
              <p id="city-error" className="mt-2 text-sm text-error">
                {getFieldError("city")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block font-semibold text-on-surface-variant">
              State
            </label>
            <select
              id="state"
              name="state"
              className={inputClass}
              autoComplete="address-level1"
              value={checkoutInfo.state ?? ""}
              onChange={(event) => updateField("state", event.target.value)}
              aria-invalid={Boolean(getFieldError("state"))}
              aria-describedby={getFieldError("state") ? "state-error" : undefined}
              required
            >
              <option value="">Select state</option>
              <option>California</option>
              <option>New York</option>
              <option>Texas</option>
            </select>
            {getFieldError("state") && (
              <p id="state-error" className="mt-2 text-sm text-error">
                {getFieldError("state")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="zip" className="mb-2 block font-semibold text-on-surface-variant">
              ZIP code
            </label>
            <input
              id="zip"
              name="zip"
              autoComplete="postal-code"
              placeholder="ZIP code"
              className={inputClass}
              value={checkoutInfo.zip ?? ""}
              onChange={(event) => updateField("zip", event.target.value)}
              aria-invalid={Boolean(getFieldError("zip"))}
              aria-describedby={getFieldError("zip") ? "zip-error" : undefined}
              required
            />
            {getFieldError("zip") && (
              <p id="zip-error" className="mt-2 text-sm text-error">
                {getFieldError("zip")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block font-semibold text-on-surface-variant">
              Phone <span className="font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone number"
              className={inputClass}
              value={checkoutInfo.phone ?? ""}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-4 border-t border-outline-variant pt-8 md:flex-row md:items-center md:justify-between">
        <Link href="/cart" className="font-semibold text-primary">
          Return to cart
        </Link>
        {formError && (
          <p className="text-sm font-semibold text-error" role="alert">
            {formError}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-primary-container px-10 py-4 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
