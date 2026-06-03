import Link from "next/link";
import { Mail, RotateCcw, ShieldCheck } from "lucide-react";
import { PreviewSubmitButton } from "@/components/forms/PreviewSubmitButton";

const inputClass =
  "min-h-14 w-full rounded-md border-outline bg-surface-container-lowest px-4 text-base focus:border-primary focus:ring-primary";

export function CheckoutForm() {
  return (
    <form className="space-y-8" aria-label="Checkout information form">
      <section>
        <h1 className="font-heading text-4xl font-bold md:text-5xl">Checkout Information</h1>
        <p className="mt-3 text-on-surface-variant">
          Enter your contact and shipping details to continue. Payment and shipping rates will be
          connected in the next step.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant md:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <span>30-day easy returns on eligible items</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail aria-hidden className="h-5 w-5 shrink-0 text-primary" />
            <a href="mailto:support@luckclaws.com" className="hover:text-primary">
              support@luckclaws.com
            </a>
          </div>
        </div>
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
          />
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
              defaultValue="United States"
              autoComplete="country-name"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
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
            />
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
            />
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
            />
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
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block font-semibold text-on-surface-variant">
              State
            </label>
            <select
              id="state"
              name="state"
              className={inputClass}
              defaultValue=""
              autoComplete="address-level1"
            >
              <option value="">Select state</option>
              <option>California</option>
              <option>New York</option>
              <option>Texas</option>
            </select>
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
            />
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
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-4 border-t border-outline-variant pt-8 md:flex-row md:items-center md:justify-between">
        <Link href="/cart" className="font-semibold text-primary">
          Return to cart
        </Link>
        <PreviewSubmitButton
          className="px-10 py-4"
          message="Shipping and payment steps are for preview only and will be connected later."
        >
          Continue to Shipping
        </PreviewSubmitButton>
      </div>
    </form>
  );
}
