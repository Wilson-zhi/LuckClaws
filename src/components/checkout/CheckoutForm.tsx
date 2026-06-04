"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Mail, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import {
  type CheckoutInfo,
  type CheckoutInfoField,
  normalizeCheckoutInfo,
  readCheckoutInfo,
  saveCheckoutInfo,
  validateCheckoutInfo
} from "@/lib/checkout-info";
import { CompactTrustBar, type CompactTrustItem } from "@/components/sections/CompactTrustBar";
import { freeShippingLabel, standardShippingSentence, variableShippingSentence } from "@/lib/shipping";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type SavedAddress = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_default: boolean | null;
};

const inputClass =
  "min-h-14 w-full rounded-md border-outline bg-surface-container-lowest px-4 text-base focus:border-primary focus:ring-primary";

const defaultCountry = "United States";

const initialCheckoutInfo: CheckoutInfo = {
  email: "",
  fullName: "",
  country: defaultCountry,
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  phone: ""
};

const checkoutTrustItems: CompactTrustItem[] = [
  { key: "shipping", label: freeShippingLabel, Icon: Truck },
  { key: "secure", label: "Secure checkout", Icon: ShieldCheck },
  { key: "support-policy", label: "Damaged or incorrect items covered", Icon: RotateCcw },
  {
    key: "support-email",
    label: (
      <a href="mailto:support@luckclaws.com" className="hover:text-primary">
        support@luckclaws.com
      </a>
    ),
    Icon: Mail
  }
];

function checkoutInfoFromAddress(address: SavedAddress): Partial<CheckoutInfo> {
  const addressLine1 = address.address_line1 ?? "";
  const addressLine2 = address.address_line2 ?? "";
  const postalCode = address.postal_code ?? "";

  return {
    fullName: address.full_name ?? "",
    phone: address.phone ?? "",
    address: addressLine1,
    addressLine1,
    apartment: addressLine2,
    addressLine2,
    city: address.city ?? "",
    state: address.state ?? "",
    zip: postalCode,
    postalCode,
    country: address.country ?? defaultCountry
  };
}

function formatAddress(address: SavedAddress) {
  return [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ]
    .filter(Boolean)
    .join(", ");
}

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();
  const isBuyNowMode = searchParams.get("mode") === "buy-now";
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>(initialCheckoutInfo);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckoutInfoField, string>>>({});
  const [formError, setFormError] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("manual");
  const [manualCountry, setManualCountry] = useState(defaultCountry);
  const emailTouchedRef = useRef(false);

  useEffect(() => {
    const savedInfo = readCheckoutInfo();
    const normalizedSavedInfo = savedInfo ? normalizeCheckoutInfo(savedInfo) : null;

    if (normalizedSavedInfo) {
      setCheckoutInfo({
        ...initialCheckoutInfo,
        ...normalizedSavedInfo
      });
    }

    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active || !data.user) {
        return;
      }

      if (data.user.email) {
        setCheckoutInfo((currentInfo) => ({
          ...currentInfo,
          email: emailTouchedRef.current ? currentInfo.email : data.user.email ?? currentInfo.email
        }));
      }

      const { data: addressData } = await supabase
        .from("addresses")
        .select("id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default")
        .eq("user_id", data.user.id)
        .order("is_default", { ascending: false });

      if (!active || !addressData) {
        return;
      }

      const addresses = addressData as SavedAddress[];
      setSavedAddresses(addresses);

      if (!normalizedSavedInfo) {
        const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setCheckoutInfo((currentInfo) => ({
            ...currentInfo,
            ...checkoutInfoFromAddress(defaultAddress)
          }));
        }
      }
    });

    return () => {
      active = false;
    };
  }, [supabase]);

  const updateField = (field: keyof CheckoutInfo, value: string) => {
    if (field === "email") {
      emailTouchedRef.current = true;
    }

    if (field === "country") {
      setManualCountry(value || defaultCountry);
    }

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

  const clearManualEntry = () => {
    setSelectedAddressId("manual");
    setFormError("");
    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors.fullName;
      delete nextErrors.address;
      delete nextErrors.city;
      delete nextErrors.state;
      delete nextErrors.zip;

      return nextErrors;
    });
    setCheckoutInfo((currentInfo) => ({
      ...currentInfo,
      fullName: "",
      phone: "",
      address: "",
      addressLine1: "",
      apartment: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      postalCode: "",
      country: manualCountry || defaultCountry
    }));
  };

  const applySavedAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setFormError("");
    setFieldErrors({});
    setCheckoutInfo((currentInfo) => ({
      ...currentInfo,
      ...checkoutInfoFromAddress(address)
    }));
  };

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

        <CompactTrustBar items={checkoutTrustItems} className="mt-6 rounded-lg bg-surface-container-low p-4" />
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
        {savedAddresses.length > 0 && (
          <div className="mt-5 rounded-lg bg-surface-container-low p-5">
            <h3 className="font-heading text-xl font-bold">Use a saved address</h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Choose an address from your account, or keep editing the fields below manually.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className={`rounded-md border p-4 text-left text-sm transition ${
                  selectedAddressId === "manual"
                    ? "border-primary bg-primary-container/10 ring-2 ring-primary/20"
                    : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                }`}
                onClick={clearManualEntry}
              >
                <span className="font-heading text-base font-bold text-on-surface">Manual entry</span>
                <span className="mt-1 block text-on-surface-variant">Enter a new address below.</span>
              </button>
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  className={`rounded-md border p-4 text-left text-sm transition ${
                    selectedAddressId === address.id
                      ? "border-primary bg-primary-container/10 ring-2 ring-primary/20"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                  }`}
                  onClick={() => applySavedAddress(address)}
                >
                  <span className="font-heading text-base font-bold text-on-surface">
                    {address.full_name || "Saved address"}
                  </span>
                  {address.is_default && (
                    <span className="ml-2 rounded-full bg-primary-container/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                      DEFAULT
                    </span>
                  )}
                  <span className="mt-2 block leading-6 text-on-surface-variant">
                    {formatAddress(address)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
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
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="mb-2 block font-semibold text-on-surface-variant">
              Name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Name"
              className={inputClass}
              value={checkoutInfo.fullName ?? ""}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(getFieldError("fullName"))}
              aria-describedby={getFieldError("fullName") ? "fullName-error" : undefined}
              required
            />
            {getFieldError("fullName") && (
              <p id="fullName-error" className="mt-2 text-sm text-error">
                {getFieldError("fullName")}
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
