"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, PawPrint, Sparkles } from "lucide-react";
import type { HomepageNewsletterContent } from "@/lib/homepage-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NewsletterSignup({ content }: { content: HomepageNewsletterContent }) {
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
        setMessage(content.duplicateMessage);
        setSubmittedEmail("");
        return;
      }

      setError("We couldn't save your email right now. Please try again later.");
      setSubmittedEmail("");
      return;
    }

    setSubmittedEmail(normalizedEmail);
  };

  if (!content.enabled) {
    return null;
  }

  const editEmail = () => {
    setSubmittedEmail("");
    setError("");
    setMessage("");
  };

  const describedBy = error ? "newsletter-error newsletter-note" : "newsletter-note";
  const visibleSubmittedEmail = submittedEmail === "__newsletter_honeypot__" ? "" : submittedEmail;

  return (
    <section className="home-editorial-newsletter">
      <div className="section-shell">
        <div className="home-editorial-newsletter-grid home-editorial-motion-reveal">
          <div className="home-editorial-newsletter-copy">
            <span className="home-editorial-kicker inline-flex items-center gap-2">
              <Mail aria-hidden className="h-4 w-4" />
              {content.eyebrow}
            </span>
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
            {content.offerText && <strong>{content.offerText}</strong>}
            <div className="home-editorial-newsletter-doodle" aria-hidden="true">
              <PawPrint />
              <span className="lc-hand-note">good mail for pet people</span>
              <Sparkles />
            </div>
          </div>

          <div
            className="home-editorial-newsletter-postcard"
            data-state={submittedEmail ? "success" : error ? "error" : "ready"}
          >
            <div className="home-editorial-newsletter-stamp" aria-hidden="true">
              <PawPrint />
              <span>LUCK<br />MAIL</span>
            </div>
            <div className="home-editorial-newsletter-flap" aria-hidden="true" />
            <div className="home-editorial-newsletter-form">
              {submittedEmail ? (
                <div className="home-editorial-newsletter-success" role="status" aria-live="polite">
                  <CheckCircle2 aria-hidden className="h-7 w-7" />
                  <h3>{content.successTitle}</h3>
                  <p>{content.successMessage}</p>
                  {visibleSubmittedEmail && <small>{visibleSubmittedEmail}</small>}
                  <button type="button" onClick={editEmail}>
                    {content.editButtonText}
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} aria-label="Newsletter signup">
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
                    {content.placeholder}
                  </label>
                  <div className="home-editorial-newsletter-fields">
                    <input
                      id="newsletter-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder={content.placeholder}
                      value={email}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                      className="newsletter-input"
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
                    <button type="submit" disabled={submitting}>
                      <span>{submitting ? content.submittingText : content.buttonText}</span>
                      <ArrowRight aria-hidden />
                    </button>
                  </div>
                  {error && (
                    <p id="newsletter-error" className="home-editorial-newsletter-error" role="alert">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="home-editorial-newsletter-message" role="status">
                      {message}
                    </p>
                  )}
                  <p id="newsletter-note" className="home-editorial-newsletter-note">
                    {content.noteText}
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
