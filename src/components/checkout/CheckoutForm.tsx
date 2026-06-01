import Link from "next/link";

const inputClass =
  "min-h-14 w-full rounded-none border-outline bg-surface-container-lowest px-4 text-base focus:border-primary focus:ring-primary";

export function CheckoutForm() {
  return (
    <form className="space-y-8">
      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">Contact Information</h1>
          <p className="text-on-surface-variant">
            Already have an account?{" "}
            <a href="#" className="font-bold text-primary">
              Log in
            </a>
          </p>
        </div>
        <div className="mt-6">
          <label htmlFor="email" className="mb-2 block font-semibold text-on-surface-variant">
            Email Address
          </label>
          <input id="email" type="email" placeholder="hello@example.com" className={inputClass} />
        </div>
        <label className="mt-5 flex items-center gap-3 text-on-surface-variant">
          <input
            type="checkbox"
            className="h-6 w-6 rounded border-outline text-primary-container focus:ring-primary-container"
          />
          Email me with news and exclusive offers
        </label>
      </section>

      <section>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">Shipping Address</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="country" className="mb-2 block font-semibold text-on-surface-variant">
              Country / Region
            </label>
            <select id="country" className={inputClass} defaultValue="United States">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div>
            <label htmlFor="firstName" className="mb-2 block font-semibold text-on-surface-variant">
              First Name
            </label>
            <input id="firstName" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block font-semibold text-on-surface-variant">
              Last Name
            </label>
            <input id="lastName" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="mb-2 block font-semibold text-on-surface-variant">
              Address
            </label>
            <input id="address" placeholder="Street address or P.O. Box" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="apartment" className="mb-2 block font-semibold text-on-surface-variant">
              Apartment, suite, etc. <span className="font-normal">(optional)</span>
            </label>
            <input id="apartment" className={inputClass} />
          </div>
          <div>
            <label htmlFor="city" className="mb-2 block font-semibold text-on-surface-variant">
              City
            </label>
            <input id="city" className={inputClass} />
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block font-semibold text-on-surface-variant">
              State
            </label>
            <select id="state" className={inputClass} defaultValue="">
              <option value="">Select</option>
              <option>California</option>
              <option>New York</option>
              <option>Texas</option>
            </select>
          </div>
          <div>
            <label htmlFor="zip" className="mb-2 block font-semibold text-on-surface-variant">
              ZIP Code
            </label>
            <input id="zip" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block font-semibold text-on-surface-variant">
              Phone Number
            </label>
            <input id="phone" type="tel" className={inputClass} />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-4 border-t border-outline-variant pt-8 md:flex-row md:items-center md:justify-between">
        <Link href="/cart" className="font-semibold text-primary">
          ← Return to cart
        </Link>
        <button
          type="submit"
          className="rounded-full bg-primary-container px-10 py-4 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
        >
          Continue to Shipping
        </button>
      </div>
    </form>
  );
}

