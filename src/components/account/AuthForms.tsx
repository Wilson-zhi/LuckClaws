"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
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
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Password
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user && fullName.trim()) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName.trim()
      });
    }

    setLoading(false);

    if (data.session) {
      router.replace("/account");
      return;
    }

    setMessage("Account created. Check your email if confirmation is required before signing in.");
  };

  if (!supabase) {
    return <SupabaseConfigNotice />;
  }

  return (
    <form className="ambient-card p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Full name <span className="font-normal text-on-surface-variant">(optional)</span>
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
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Password
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            value={password}
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {message && (
          <p className="rounded-md bg-primary-container/15 p-3 text-sm leading-6 text-on-surface-variant" role="status">
            {message}
          </p>
        )}
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
