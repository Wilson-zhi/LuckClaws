"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/utils";

type AccountOrderRow = {
  id: string;
  order_number: string | null;
  created_at: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  total_amount: number | string | null;
  currency: string | null;
  paypal_order_id: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function displayStatus(value: string | null) {
  return value ? value.replaceAll("_", " ") : "pending";
}

function totalFromRow(order: AccountOrderRow) {
  const value = typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount ?? 0);

  return Number.isFinite(value) ? value : 0;
}

export function AccountOrders() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<AccountOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, order_number, created_at, payment_status, fulfillment_status, total_amount, currency, paypal_order_id")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      if (orderError) {
        setError(orderError.message);
      } else {
        setOrders((orderData ?? []) as AccountOrderRow[]);
      }

      setLoading(false);
    });
  }, [router, supabase]);

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
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="ambient-card p-6 text-sm leading-6 text-error" role="alert">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="ambient-card p-6 text-center md:p-8">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-container/20 text-primary">
          <Package aria-hidden className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold">No Orders Yet</h2>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          You do not have any orders yet. Orders placed while signed in will appear here after payment is captured.
        </p>
        <Link
          href="/collections"
          className="mt-6 inline-flex rounded-full bg-primary-container px-7 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
        >
          Shop LUCK CLAWS
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article key={order.id} className="ambient-card p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                {formatDate(order.created_at)}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold">
                {order.order_number ?? "Order number unavailable"}
              </h2>
              {order.paypal_order_id && (
                <p className="mt-2 text-sm text-on-surface-variant">
                  PayPal order ID: {order.paypal_order_id}
                </p>
              )}
            </div>
            <div className="text-left md:text-right">
              <p className="font-heading text-2xl font-bold">{formatPrice(totalFromRow(order))}</p>
              <p className="mt-1 text-sm uppercase tracking-wide text-on-surface-variant">
                {order.currency ?? "USD"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-on-surface-variant md:grid-cols-2">
            <p className="rounded-md bg-surface-container-low p-3">
              <span className="font-semibold text-on-surface">Payment:</span>{" "}
              {displayStatus(order.payment_status)}
            </p>
            <p className="rounded-md bg-surface-container-low p-3">
              <span className="font-semibold text-on-surface">Status:</span>{" "}
              {displayStatus(order.fulfillment_status)}
            </p>
          </div>
          <Link
            href={`/account/orders/${order.id}`}
            className="mt-6 inline-flex rounded-full border border-primary px-5 py-2 font-heading text-sm font-bold text-primary transition hover:bg-primary-container/10"
          >
            View details
          </Link>
        </article>
      ))}
    </div>
  );
}
