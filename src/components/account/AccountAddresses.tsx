"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Edit3, MapPin, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AddressRecord = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_default: boolean | null;
};

type AddressFormState = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const emptyForm: AddressFormState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  isDefault: false
};

const inputClass =
  "min-h-14 w-full rounded-md border border-outline-variant bg-white px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/30";

function toNullable(value: string) {
  const trimmed = value.trim();

  return trimmed || null;
}

function formFromAddress(address: AddressRecord): AddressFormState {
  return {
    fullName: address.full_name ?? "",
    phone: address.phone ?? "",
    addressLine1: address.address_line1 ?? "",
    addressLine2: address.address_line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postalCode: address.postal_code ?? "",
    country: address.country ?? "United States",
    isDefault: Boolean(address.is_default)
  };
}

export function AccountAddresses() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [userId, setUserId] = useState("");
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAddresses = useCallback(async (currentUserId: string) => {
    if (!supabase) {
      return;
    }

    const { data, error: addressError } = await supabase
      .from("addresses")
      .select(
        "id, user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default"
      )
      .eq("user_id", currentUserId)
      .order("is_default", { ascending: false });

    if (addressError) {
      setError(addressError.message);
      return;
    }

    setAddresses((data ?? []) as AddressRecord[]);
  }, [supabase]);

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

      setUserId(data.user.id);
      await loadAddresses(data.user.id);
      setLoading(false);
    });
  }, [loadAddresses, router, supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || !userId) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const addressPayload = {
      user_id: userId,
      full_name: toNullable(form.fullName),
      phone: toNullable(form.phone),
      address_line1: toNullable(form.addressLine1),
      address_line2: toNullable(form.addressLine2),
      city: toNullable(form.city),
      state: toNullable(form.state),
      postal_code: toNullable(form.postalCode),
      country: toNullable(form.country),
      is_default: form.isDefault
    };

    if (form.isDefault) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    }

    const result = editingId
      ? await supabase.from("addresses").update(addressPayload).eq("id", editingId).eq("user_id", userId)
      : await supabase.from("addresses").insert(addressPayload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    await loadAddresses(userId);
    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Address updated." : "Address saved.");
    setSaving(false);
  };

  const handleEdit = (address: AddressRecord) => {
    setEditingId(address.id);
    setForm(formFromAddress(address));
    setMessage("");
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !userId) {
      return;
    }

    setError("");
    setMessage("");
    const { error: deleteError } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", userId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadAddresses(userId);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    setMessage("Address removed.");
  };

  if (!supabase) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Supabase public environment variables are not configured for this build.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <form className="ambient-card p-6 md:p-8" onSubmit={handleSubmit}>
        <h2 className="font-heading text-2xl font-bold">
          {editingId ? "Edit Address" : "Add Address"}
        </h2>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Name
            <input
              className={inputClass}
              autoComplete="name"
              value={form.fullName}
              onChange={(event) => setForm((value) => ({ ...value, fullName: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Phone <span className="font-normal text-on-surface-variant">(optional)</span>
            <input
              className={inputClass}
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Address line 1
            <input
              className={inputClass}
              autoComplete="address-line1"
              value={form.addressLine1}
              onChange={(event) => setForm((value) => ({ ...value, addressLine1: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-on-surface">
            Address line 2 <span className="font-normal text-on-surface-variant">(optional)</span>
            <input
              className={inputClass}
              autoComplete="address-line2"
              value={form.addressLine2}
              onChange={(event) => setForm((value) => ({ ...value, addressLine2: event.target.value }))}
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              City
              <input
                className={inputClass}
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => setForm((value) => ({ ...value, city: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              State
              <input
                className={inputClass}
                autoComplete="address-level1"
                value={form.state}
                onChange={(event) => setForm((value) => ({ ...value, state: event.target.value }))}
                required
              />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Postal code
              <input
                className={inputClass}
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(event) => setForm((value) => ({ ...value, postalCode: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Country
              <input
                className={inputClass}
                autoComplete="country-name"
                value={form.country}
                onChange={(event) => setForm((value) => ({ ...value, country: event.target.value }))}
                required
              />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
              checked={form.isDefault}
              onChange={(event) => setForm((value) => ({ ...value, isDefault: event.target.checked }))}
            />
            Use as default shipping address
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex justify-center rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
              disabled={saving}
            >
              {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
            </button>
            {editingId && (
              <button
                type="button"
                className="inline-flex justify-center rounded-full border border-primary px-8 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <section className="space-y-4">
        {addresses.length === 0 ? (
          <div className="ambient-card p-6 text-center md:p-8">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
              <MapPin aria-hidden className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold">No Saved Addresses</h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              Add a shipping address to make future checkout details easier to manage.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className="ambient-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">{address.full_name}</h2>
                  {address.is_default && (
                    <p className="mt-2 inline-flex rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      Default
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full text-primary transition hover:bg-primary-container/10"
                    onClick={() => handleEdit(address)}
                    aria-label="Edit address"
                  >
                    <Edit3 aria-hidden className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full text-error transition hover:bg-error/10"
                    onClick={() => handleDelete(address.id)}
                    aria-label="Remove address"
                  >
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm leading-7 text-on-surface-variant">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
