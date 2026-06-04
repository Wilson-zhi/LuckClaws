"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

function SupabaseConfigNotice() {
  return (
    <div className="rounded-md border border-error/30 bg-error/10 p-4 text-sm leading-6 text-on-surface-variant">
      Supabase public environment variables are not configured for this build.
    </div>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
};

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required = true
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const visibilityLabel = visible ? "Hide password" : "Show password";

  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      <span className="relative block">
        <input
          className={`${inputClass} pr-12`}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
          onClick={() => setVisible((current) => !current)}
          aria-label={visibilityLabel}
          aria-pressed={visible}
        >
          {visible ? <EyeOff aria-hidden className="h-5 w-5" /> : <Eye aria-hidden className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/account");
      }
    });
  }, [router, supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setLoading(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/account");
  };

  if (!supabase) {
    return <SupabaseConfigNotice />;
  }

  return (
    <form className="ambient-card p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Email
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        {error && (
          <p className="rounded-md bg-error/10 p-3 text-sm leading-6 text-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
      <p className="mt-5 text-sm text-on-surface-variant">
        New to LUCK CLAWS?{" "}
        <Link href="/account/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const normalizedEmail = email.trim();
    const normalizedFullName = fullName.trim();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Confirm password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: normalizedFullName
        }
      }
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user && normalizedFullName) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: normalizedFullName
      });
    }

    setLoading(false);

    if (data.session) {
      router.replace("/account");
      return;
    }

    setConfirmationEmail(normalizedEmail);
  };

  if (!supabase) {
    return <SupabaseConfigNotice />;
  }

  if (confirmationEmail) {
    return (
      <section className="ambient-card p-6 md:p-8" aria-live="polite">
        <h2 className="font-heading text-3xl font-bold">Check your email to finish registration</h2>
        <p className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">
          We&apos;ve sent a confirmation link to your email address. Please open your inbox and click
          the link to activate your LUCK CLAWS account.
        </p>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">
          If you do not see the email, check your spam or promotions folder.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account/login"
            className="inline-flex justify-center rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form className="ambient-card p-6 md:p-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Name <span className="font-normal text-on-surface-variant">(optional)</span>
          <input
            className={inputClass}
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Email
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <PasswordField
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {error && (
          <p className="rounded-md bg-error/10 p-3 text-sm leading-6 text-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
      <p className="mt-5 text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
