"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, MapPin, Package, UserCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  full_name?: string | null;
  role?: string | null;
};

type AccountUser = {
  id: string;
  email?: string;
};

export function AccountHome() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/account/login");
        return;
      }

      setUser({
        id: data.user.id,
        email: data.user.email
      });

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", data.user.id)
        .maybeSingle();

      setProfile(profileData);
      setLoading(false);
    });
  }, [router, supabase]);

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/account/login");
  };

  if (!supabase) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Supabase public environment variables are not configured for this build.
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading account...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="ambient-card p-6 md:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
            <UserCircle aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold">Account Details</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Signed in as {user.email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm leading-6 text-on-surface-variant">
          <p>
            <span className="font-semibold text-on-surface">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold text-on-surface">Name:</span>{" "}
            {profile?.full_name || "Not added yet"}
          </p>
        </div>
        <button
          type="button"
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          onClick={handleLogout}
        >
          <LogOut aria-hidden className="h-4 w-4" />
          Log Out
        </button>
      </section>

      <section className="grid gap-4">
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="ambient-card flex items-center gap-4 p-6 transition hover:border-primary md:p-8"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
              <LayoutDashboard aria-hidden className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-bold">Admin Dashboard</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Manage store operations.</p>
            </div>
          </Link>
        )}
        <Link
          href="/account/orders"
          className="ambient-card flex items-center gap-4 p-6 transition hover:border-primary md:p-8"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
            <Package aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold">My Orders</h2>
            <p className="mt-1 text-sm text-on-surface-variant">View orders linked to your account.</p>
          </div>
        </Link>
        <Link
          href="/account/addresses"
          className="ambient-card flex items-center gap-4 p-6 transition hover:border-primary md:p-8"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
            <MapPin aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold">My Addresses</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Add and manage saved shipping addresses.</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
