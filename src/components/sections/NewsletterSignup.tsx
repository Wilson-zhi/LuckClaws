"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (honeypot.trim()) {
      setError("");
      setMessage("");
      setSubmittedEmail("__newsletter_honeypot__");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      setMessage("");
      setSubmittedEmail("");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      setMessage("");
      setSubmittedEmail("");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Newsletter signup is temporarily unavailable. Please try again later.");
      setMessage("");
      setSubmittedEmail("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        source: "homepage",
        status: "active"
      });

    setSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setMessage("You're already in the pack.");
        setSubmittedEmail("");
        return;
      }

      setError("We couldn't save your email right now. Please try again later.");
      setSubmittedEmail("");
      return;
    }

    setSubmittedEmail(normalizedEmail);
  };

  const editEmail = () => {
    setSubmittedEmail("");
    setError("");
    setMessage("");
  };

  const describedBy = error ? "newsletter-error newsletter-note" : "newsletter-note";
  const visibleSubmittedEmail = submittedEmail === "__newsletter_honeypot__" ? "" : submittedEmail;

  return (
    <section className="bg-[#FFF9EF] py-14 md:py-20">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] border border-[#EAD4B8] bg-[linear-gradient(135deg,#FFF8EF_0%,#F3DFC4_100%)] shadow-lift">
          <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.78fr)] md:items-center md:p-10 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                <Mail aria-hidden className="h-4 w-4" />
                LUCK CLAWS updates
              </span>
              <h2 className="mt-5 max-w-lg font-heading text-3xl font-extrabold leading-tight md:text-4xl">
                Better routines, fewer random buys.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
                Get new arrivals, routine-first product edits, and occasional offers from LUCK CLAWS.
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">
                Get 10% off your first order with WELCOME10.
              </p>
            </div>

            <div className="rounded-lg border border-outline-variant/70 bg-white/95 p-4 shadow-soft md:p-5">
              {submittedEmail ? (
                <div className="rounded-md bg-surface-container-lowest p-5" role="status" aria-live="polite">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container/20 text-primary">
                    <CheckCircle2 aria-hidden className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold text-on-surface">You&apos;re in the pack!</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    Thanks for joining LUCK CLAWS. Use code WELCOME10 for 10% off your first order.
                  </p>
                  {visibleSubmittedEmail && (
                    <p className="mt-3 break-all text-xs font-semibold text-on-surface-variant">
                      {visibleSubmittedEmail}
                    </p>
                  )}
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
                <label className="sr-only" htmlFor="newsletter-company">
                  Leave this field blank
                </label>
                <input
                  id="newsletter-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  className="hidden"
                  aria-hidden="true"
                  onChange={(event) => setHoneypot(event.target.value)}
                />
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className="newsletter-input min-h-[52px] w-full rounded-full border border-outline-variant bg-white px-5 text-sm text-on-surface shadow-none outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary-container/30"
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError("");
                      }

                      if (message) {
                        setMessage("");
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary-container px-6 py-3 font-heading text-sm font-bold text-on-primary-container transition hover:-translate-y-0.5 hover:bg-[#e08f00] hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0 sm:w-auto"
                  >
                    {submitting ? "Joining..." : "Join the Pack"}
                  </button>
                </div>
                {error && (
                  <p id="newsletter-error" className="text-sm font-semibold text-error" role="alert">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-sm font-semibold text-primary" role="status">
                    {message}
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
      </div>
    </section>
  );
}
