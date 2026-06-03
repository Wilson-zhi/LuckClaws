import { PreviewSubmitButton } from "@/components/forms/PreviewSubmitButton";

export function NewsletterSignup() {
  return (
    <section className="section-shell">
      <div className="rounded-lg bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-[#FBE8D0] p-8 shadow-soft md:p-16">
        <div className="max-w-lg">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Join the Pack.</h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant md:text-base">
            Get 10% off your first order, plus early access to new drops and pet care tips.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="min-h-12 flex-1 rounded-full border border-outline-variant bg-white px-5 text-sm focus:border-primary focus:ring-primary"
            />
            <PreviewSubmitButton
              className="px-7 text-sm"
              message="Newsletter signup is for preview only and will be connected later."
            >
              Get 10% Off
            </PreviewSubmitButton>
          </form>
        </div>
      </div>
    </section>
  );
}
