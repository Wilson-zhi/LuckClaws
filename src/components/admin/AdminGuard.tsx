"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminContextValue = {
  accessToken: string;
  userEmail: string | null;
};

type AdminStatus = "checking" | "authorized" | "denied" | "config";

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdminAuth() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminGuard.");
  }

  return context;
}

function AdminStatusShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="section-shell py-12 md:py-16">
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

type AdminGuardProps = {
  children: React.ReactNode | (() => React.ReactNode);
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [message, setMessage] = useState("");
  const [adminContext, setAdminContext] = useState<AdminContextValue | null>(null);

  useEffect(() => {
    if (!supabase) {
      setStatus("config");
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      if (!active) {
        return;
      }

      if (!session) {
        router.replace("/account/login");
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (!active) {
        return;
      }

      if (response.status === 401) {
        router.replace("/account/login");
        return;
      }

      if (!response.ok) {
        setMessage(response.status === 403 ? "此账号没有后台权限 / This account does not have admin access." : "无法验证后台权限 / Admin access could not be verified.");
        setStatus("denied");
        return;
      }

      const payload = (await response.json()) as { user?: { email?: string | null } };

      setAdminContext({
        accessToken: session.access_token,
        userEmail: payload.user?.email ?? session.user.email ?? null
      });
      setStatus("authorized");
    });

    return () => {
      active = false;
    };
  }, [router, supabase]);

  if (status === "config") {
    return (
      <AdminStatusShell>
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          当前构建未配置 Supabase 公开环境变量 / Supabase public environment variables are not configured for this build.
        </div>
      </AdminStatusShell>
    );
  }

  if (status === "checking") {
    return (
      <AdminStatusShell>
        <div className="ambient-card p-6 text-sm leading-6 text-on-surface-variant">
          正在验证后台权限 / Checking admin access...
        </div>
      </AdminStatusShell>
    );
  }

  if (status === "denied" || !adminContext) {
    return (
      <AdminStatusShell>
        <section className="ambient-card p-6 text-center md:p-8">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-error/10 text-error">
            <ShieldAlert aria-hidden className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold">拒绝访问 / Access Denied</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
            {message || "此账号没有后台权限 / This account does not have admin access."}
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex rounded-full border border-primary px-7 py-3 font-heading font-bold text-primary transition hover:bg-primary-container/10"
          >
            返回我的账户 / Back to My Account
          </Link>
        </section>
      </AdminStatusShell>
    );
  }

  const content = typeof children === "function" ? children() : children;

  return <AdminContext.Provider value={adminContext}>{content}</AdminContext.Provider>;
}
