import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAuthenticatedClientFromRequest } from "@/lib/supabase/server";

type DashboardSection<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

type ProductMetrics = {
  total: number;
  active: number;
  draft: number;
  archived: number;
};

type CategoryMetrics = {
  total: number;
  active: number;
};

type NewsletterMetrics = {
  total: number;
  active: number;
  unsubscribed: number;
};

type MessageMetrics = {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
};

type DiscountMetrics = {
  total: number;
  active: number;
  draft: number;
  archived: number;
};

type OrderMetrics = {
  total: number;
};

type RecentSubscriber = {
  id: string;
  email: string | null;
  status: string | null;
  created_at: string | null;
};

type RecentMessage = {
  id: string;
  email: string | null;
  subject: string | null;
  status: string | null;
  created_at: string | null;
};

type RecentDiscount = {
  id: string;
  code: string | null;
  type: string | null;
  value: number | string | null;
  status: string | null;
  created_at: string | null;
};

type RecentOrder = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  created_at: string | null;
};

export type AdminDashboardPayload = {
  products: DashboardSection<ProductMetrics>;
  categories: DashboardSection<CategoryMetrics>;
  newsletter: DashboardSection<{
    metrics: NewsletterMetrics;
    recent: RecentSubscriber[];
  }>;
  messages: DashboardSection<{
    metrics: MessageMetrics;
    recent: RecentMessage[];
  }>;
  discounts: DashboardSection<{
    metrics: DiscountMetrics;
    recent: RecentDiscount[];
  }>;
  orders: DashboardSection<{
    metrics: OrderMetrics;
    recent: RecentOrder[];
  }>;
};

function countByStatus(rows: Array<{ status: string | null }>, status: string) {
  return rows.filter((row) => row.status === status).length;
}

async function safeSection<T>(name: string, loader: () => Promise<T>): Promise<DashboardSection<T>> {
  try {
    return {
      ok: true,
      data: await loader()
    };
  } catch (error) {
    console.error(`Unable to load admin dashboard ${name}:`, error instanceof Error ? error.message : error);

    return {
      ok: false,
      error: "Unable to load this section right now."
    };
  }
}

export async function GET(request: Request) {
  const auth = await requireAdminFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = getSupabaseAuthenticatedClientFromRequest(request);

  if (!supabase) {
    return NextResponse.json(
      { error: "Authenticated Supabase session is not available." },
      { status: 500 }
    );
  }

  const [products, categories, newsletter, messages, discounts, orders] = await Promise.all([
    safeSection("products", async () => {
      const { data, error } = await supabase.from("products").select("id, status");

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as Array<{ id: string; status: string | null }>;

      return {
        total: rows.length,
        active: countByStatus(rows, "active"),
        draft: countByStatus(rows, "draft"),
        archived: countByStatus(rows, "archived")
      };
    }),
    safeSection("categories", async () => {
      const { data, error } = await supabase.from("product_categories").select("id, status");

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as Array<{ id: string; status: string | null }>;

      return {
        total: rows.length,
        active: countByStatus(rows, "active")
      };
    }),
    safeSection("newsletter", async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as RecentSubscriber[];

      return {
        metrics: {
          total: rows.length,
          active: countByStatus(rows, "active"),
          unsubscribed: countByStatus(rows, "unsubscribed")
        },
        recent: rows.slice(0, 5)
      };
    }),
    safeSection("messages", async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, email, subject, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as RecentMessage[];

      return {
        metrics: {
          total: rows.length,
          new: countByStatus(rows, "new"),
          in_progress: countByStatus(rows, "in_progress"),
          resolved: countByStatus(rows, "resolved")
        },
        recent: rows.slice(0, 5)
      };
    }),
    safeSection("discounts", async () => {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("id, code, type, value, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as RecentDiscount[];

      return {
        metrics: {
          total: rows.length,
          active: countByStatus(rows, "active"),
          draft: countByStatus(rows, "draft"),
          archived: countByStatus(rows, "archived")
        },
        recent: rows.slice(0, 5)
      };
    }),
    safeSection("orders", async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, customer_email, total_amount, currency, payment_status, fulfillment_status, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as RecentOrder[];

      return {
        metrics: {
          total: rows.length
        },
        recent: rows.slice(0, 5)
      };
    })
  ]);

  const payload: AdminDashboardPayload = {
    products,
    categories,
    newsletter,
    messages,
    discounts,
    orders
  };

  return NextResponse.json(payload);
}
