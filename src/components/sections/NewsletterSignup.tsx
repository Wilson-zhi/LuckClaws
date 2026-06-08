"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setSubmittedEmail("");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setSubmittedEmail("");
      return;
    }

    setError("");
    setSubmittedEmail(trimmedEmail);
  };

  const editEmail = () => {
    setSubmittedEmail("");
    setError("");
  };

  const describedBy = error ? "newsletter-error newsletter-note" : "newsletter-note";

  return (
    <section className="section-shell">
      <div className="overflow-hidden rounded-lg bg-[#FFF8EF] shadow-lift">
        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_minmax(340px,0.86fr)] md:items-center md:p-10 lg:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Mail aria-hidden className="h-4 w-4" />
              LUCK CLAWS updates
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Join the Pack</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
              Get 10% off your first order, plus early access to new drops and pet care tips.
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">No spam. Just pet-friendly updates and offers.</p>
          </div>

          <div className="rounded-md border border-outline-variant/70 bg-white/90 p-4 shadow-soft md:p-5">
            {submittedEmail ? (
              <div className="rounded-md bg-surface-container-lowest p-5" role="status" aria-live="polite">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                  <CheckCircle2 aria-hidden className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-heading text-2xl font-bold text-on-surface">You&apos;re in the pack!</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  Thanks for joining LUCK CLAWS. Your 10% offer will be available soon.
                </p>
                <p className="mt-3 break-all text-xs font-semibold text-on-surface-variant">{submittedEmail}</p>
                <button
                  type="button"
                  className="mt-5 inline-flex rounded-full border border-primary px-5 py-2.5 font-heading text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-primary-container/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
                  onClick={editEmail}
                >
                  Use another email
                </button>
              </div>
            ) : (
              <form className="grid gap-3" noValidate onSubmit={handleSubmit} aria-label="Newsletter signup">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className="newsletter-input min-h-[52px] w-full rounded-full border border-outline-variant bg-white px-5 text-sm text-on-surface shadow-none outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary-container/30"
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary-container px-6 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0 sm:w-auto"
                  >
                    Get 10% Off
                  </button>
                </div>
                {error && (
                  <p id="newsletter-error" className="text-sm font-semibold text-error" role="alert">
                    {error}
                  </p>
                )}
                <p id="newsletter-note" className="text-xs leading-5 text-on-surface-variant">
                  No spam. Just pet-friendly updates and offers.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
