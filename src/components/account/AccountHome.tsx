"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  Package,
  Save,
  UserCircle
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useWishlistStore } from "@/store/wishlist-store";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Profile = {
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: string | null;
};

type AccountUser = {
  id: string;
  email?: string;
};

function initialsFromName(name: string, email?: string) {
  const source = name.trim() || email?.split("@")[0] || "LC";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function storagePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length).split("?")[0]);
}

export function AccountHome() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadAccount() {
      const { data, error: userError } = await browserSupabase.auth.getUser();

      if (!active) {
        return;
      }

      if (userError || !data.user) {
        router.replace("/account/login");
        return;
      }

      const nextUser = {
        id: data.user.id,
        email: data.user.email
      };
      const metadataName =
        typeof data.user.user_metadata?.full_name === "string"
          ? data.user.user_metadata.full_name
          : "";
      const metadataAvatar =
        typeof data.user.user_metadata?.avatar_url === "string"
          ? data.user.user_metadata.avatar_url
          : "";
      const initialProfileResult = await browserSupabase
        .from("profiles")
        .select("full_name, phone, avatar_url, role")
        .eq("id", data.user.id)
        .maybeSingle();
      let profileData = initialProfileResult.data as Profile | null;
      let profileError = initialProfileResult.error;

      if (profileError) {
        const fallbackResult = await browserSupabase
          .from("profiles")
          .select("full_name, phone, role")
          .eq("id", data.user.id)
          .maybeSingle();

        profileData = fallbackResult.data as Profile | null;
        profileError = fallbackResult.error;
      }

      if (!active) {
        return;
      }

      if (profileError && process.env.NODE_ENV === "development") {
        console.error("Unable to load account profile:", profileError);
      }

      const nextProfile = (profileData ?? {}) as Profile;
      setUser(nextUser);
      setProfile(nextProfile);
      setFullName(nextProfile.full_name?.trim() || metadataName);
      setPhone(nextProfile.phone?.trim() || "");
      setAvatarUrl(nextProfile.avatar_url?.trim() || metadataAvatar);
      setLoading(false);
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/account/login");
  };

  const handleProfileSave = async () => {
    if (!supabase || !user || saving) {
      return;
    }

    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();

    if (!normalizedName) {
      setError("Please add your name before saving.");
      setMessage("");
      return;
    }

    if (normalizedName.length > 100) {
      setError("Name must be 100 characters or fewer.");
      setMessage("");
      return;
    }

    if (normalizedPhone.length > 30) {
      setError("Phone number must be 30 characters or fewer.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: normalizedName,
      phone: normalizedPhone || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString()
    });
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: normalizedName,
        avatar_url: avatarUrl || null
      }
    });

    setSaving(false);

    if (profileError || authError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to save account profile:", profileError ?? authError);
      }
      setError("Unable to save your profile. Please try again.");
      return;
    }

    setProfile((current) => ({
      ...current,
      full_name: normalizedName,
      phone: normalizedPhone || null,
      avatar_url: avatarUrl || null
    }));
    setFullName(normalizedName);
    setPhone(normalizedPhone);
    setMessage("Profile updated.");
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !supabase || !user || uploading) {
      return;
    }

    setError("");
    setMessage("");

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${user.id}/avatar-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to upload account avatar:", uploadError);
      }
      setUploading(false);
      setError("Unable to upload the avatar. Make sure the avatar storage SQL has been applied, then try again.");
      event.target.value = "";
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);
    const nextAvatarUrl = publicUrlData.publicUrl;
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      avatar_url: nextAvatarUrl,
      updated_at: new Date().toISOString()
    });
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim() || null,
        avatar_url: nextAvatarUrl
      }
    });

    if (profileError || authError) {
      await supabase.storage.from(AVATAR_BUCKET).remove([storagePath]);
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to persist account avatar:", profileError ?? authError);
      }
      setUploading(false);
      setError("The image uploaded, but your profile could not be updated. Please try again.");
      event.target.value = "";
      return;
    }

    const previousStoragePath = avatarUrl ? storagePathFromPublicUrl(avatarUrl) : null;

    if (previousStoragePath && previousStoragePath !== storagePath) {
      const { error: removeError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([previousStoragePath]);

      if (removeError && process.env.NODE_ENV === "development") {
        console.error("Unable to remove previous account avatar:", removeError);
      }
    }

    setAvatarUrl(nextAvatarUrl);
    setProfile((current) => ({ ...current, avatar_url: nextAvatarUrl }));
    setUploading(false);
    setMessage("Avatar updated.");
    event.target.value = "";
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
      <div className="flex min-h-[360px] items-center justify-center gap-3 text-sm font-semibold text-on-surface-variant">
        <LoaderCircle aria-hidden className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        Loading account...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="ambient-card p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[#F7DCA9] text-[#6F4300] shadow-soft">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${fullName || "Account"} profile photo`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center font-heading text-2xl font-extrabold">
                {initialsFromName(fullName, user.email)}
              </span>
            )}
            {uploading && (
              <span className="absolute inset-0 grid place-items-center bg-[#24170E]/65 text-white">
                <LoaderCircle aria-hidden className="h-6 w-6 animate-spin motion-reduce:animate-none" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-2xl font-bold">Your profile</h2>
            <p className="mt-1 break-all text-sm text-on-surface-variant">{user.email}</p>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => void handleAvatarUpload(event)}
              disabled={uploading}
            />
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary-container/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera aria-hidden className="h-4 w-4" />
              {uploading ? "Uploading..." : avatarUrl ? "Replace photo" : "Upload photo"}
            </button>
            <p className="mt-2 text-xs leading-5 text-on-surface-variant">JPEG, PNG, or WebP. Maximum 5MB.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={100}
              autoComplete="name"
              className="min-h-12 rounded-md border border-[#D8C3AD] bg-white px-4 text-base font-normal text-on-surface shadow-none focus:border-primary focus:ring-primary"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Phone <span className="sr-only">optional</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={30}
              autoComplete="tel"
              placeholder="Optional"
              className="min-h-12 rounded-md border border-[#D8C3AD] bg-white px-4 text-base font-normal text-on-surface shadow-none placeholder:text-[#8B7762] focus:border-primary focus:ring-primary"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface sm:col-span-2">
            Email
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              className="min-h-12 rounded-md border border-[#E7D8C7] bg-[#F8F2E9] px-4 text-base font-normal text-[#6B5540] shadow-none"
            />
          </label>
        </div>

        {(message || error) && (
          <p
            className={
              error
                ? "mt-5 rounded-md bg-[#FFF1EA] px-4 py-3 text-sm font-semibold text-[#8A2F16]"
                : "mt-5 rounded-md bg-[#EEF5E9] px-4 py-3 text-sm font-semibold text-[#315B2A]"
            }
            role="status"
            aria-live="polite"
          >
            {error || message}
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:bg-[#5B3300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
            onClick={() => void handleProfileSave()}
            disabled={saving || uploading}
          >
            {saving ? (
              <LoaderCircle aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Save aria-hidden className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save profile"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => void handleLogout()}
          >
            <LogOut aria-hidden className="h-4 w-4" />
            Log out
          </button>
        </div>
      </section>

      <section className="grid content-start gap-4" aria-label="Account shortcuts">
        {profile?.role === "admin" && (
          <AccountLink
            href="/admin"
            Icon={LayoutDashboard}
            title="Admin Dashboard"
            description="Manage store operations."
          />
        )}
        <AccountLink
          href="/wishlist"
          Icon={Heart}
          title="My Wishlist"
          description={`${wishlistCount} saved ${wishlistCount === 1 ? "item" : "items"}.`}
        />
        <AccountLink
          href="/account/orders"
          Icon={Package}
          title="My Orders"
          description="View orders linked to your account."
        />
        <AccountLink
          href="/account/addresses"
          Icon={MapPin}
          title="My Addresses"
          description="Add and manage saved shipping addresses."
        />
      </section>
    </div>
  );
}

function AccountLink({
  href,
  Icon,
  title,
  description
}: {
  href: string;
  Icon: typeof UserCircle;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="ambient-card flex min-h-[112px] items-center gap-4 p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0 md:p-7"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-container/20 text-primary">
        <Icon aria-hidden className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block font-heading text-xl font-bold">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-on-surface-variant">{description}</span>
      </span>
    </Link>
  );
}
