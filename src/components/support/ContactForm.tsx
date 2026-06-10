"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  orderNumber: string;
  website: string;
};

type ContactFormErrors = Partial<Record<keyof Pick<ContactFormValues, "email" | "subject" | "message">, string>>;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  orderNumber: "",
  website: ""
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "min-h-12 rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary-container/30";

const textareaClass =
  "min-h-36 rounded-md border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary-container/30";

function cleanOptionalValue(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function validateContactForm(values: ContactFormValues) {
  const nextErrors: ContactFormErrors = {};
  const email = values.email.trim().toLowerCase();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!email) {
    nextErrors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!subject) {
    nextErrors.subject = "Subject is required.";
  }

  if (!message) {
    nextErrors.message = "Message is required.";
  } else if (message.length < 10) {
    nextErrors.message = "Message must be at least 10 characters.";
  }

  return nextErrors;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));

    if (field === "email" || field === "subject" || field === "message") {
      setErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }

    setSubmitError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setSubmitError("");
    setSuccessMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (values.website.trim()) {
      setSuccessMessage("Thanks for reaching out. We'll get back to you soon.");
      setValues(initialValues);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setSubmitError("Support messages are temporarily unavailable. Please email support@luckclaws.com.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("contact_messages").insert({
      name: cleanOptionalValue(values.name),
      email: values.email.trim().toLowerCase(),
      subject: values.subject.trim(),
      message: values.message.trim(),
      order_number: cleanOptionalValue(values.orderNumber),
      status: "new",
      source: "contact_page"
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Unable to submit contact message:", error.message);
      setSubmitError("Unable to send your message right now. Please email support@luckclaws.com.");
      return;
    }

    setSuccessMessage("Thanks for reaching out. We'll get back to you soon.");
    setValues(initialValues);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-name" className="text-sm font-semibold text-on-surface">
          Name <span className="font-normal text-on-surface-variant">(optional)</span>
        </label>
        <input
          id="contact-name"
          className={fieldClass}
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          autoComplete="name"
          placeholder="Your name"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-email" className="text-sm font-semibold text-on-surface">
          Email
        </label>
        <input
          id="contact-email"
          className={fieldClass}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm font-semibold text-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-order-number" className="text-sm font-semibold text-on-surface">
          Order number <span className="font-normal text-on-surface-variant">(optional)</span>
        </label>
        <input
          id="contact-order-number"
          className={fieldClass}
          value={values.orderNumber}
          onChange={(event) => updateField("orderNumber", event.target.value)}
          autoComplete="off"
          placeholder="Order number if this is about an order"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-subject" className="text-sm font-semibold text-on-surface">
          Subject
        </label>
        <input
          id="contact-subject"
          className={fieldClass}
          value={values.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          placeholder="How can we help?"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="text-sm font-semibold text-error">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-message" className="text-sm font-semibold text-on-surface">
          Message
        </label>
        <textarea
          id="contact-message"
          className={textareaClass}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us what happened or what you need help choosing."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm font-semibold text-error">
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <div className="rounded-md bg-error/10 p-4 text-sm font-semibold text-error" role="alert">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-primary-container/15 p-4 text-sm font-semibold text-primary" role="status">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        aria-disabled={isSubmitting}
      >
        <Send aria-hidden className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Submit"}
      </button>

      {hasErrors && (
        <p className="text-sm leading-6 text-on-surface-variant" aria-live="polite">
          Please fix the highlighted fields before sending your message.
        </p>
      )}
    </form>
  );
}
