"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { topLevelNavigation, type NavigationItem } from "@/data/navigation";
import { brandName } from "@/data/products";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getCartTotals, useCartStore } from "@/store/cart-store";
import { trackViewCart } from "@/lib/ga4-ecommerce";

type PublicCategoryNavRow = {
  name: string | null;
  slug: string | null;
};

export function Header({ initialNavigationItems }: { initialNavigationItems?: NavigationItem[] }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountHref, setAccountHref] = useState("/account/login");
  const fallbackNavigationItems = useMemo(
    () => (initialNavigationItems && initialNavigationItems.length > 0 ? initialNavigationItems : topLevelNavigation),
    [initialNavigationItems]
  );
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(fallbackNavigationItems);
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);

  useEffect(() => {
    const openCartDrawer = () => {
      trackViewCart(useCartStore.getState().items);
      setDrawerOpen(true);
    };

    window.addEventListener("luck-claws:open-cart", openCartDrawer);
    return () => window.removeEventListener("luck-claws:open-cart", openCartDrawer);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAccountHref("/account/login");
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAccountHref(data.session ? "/account" : "/account/login");
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountHref(session ? "/account" : "/account/login");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setNavigationItems(fallbackNavigationItems);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadPublicNavigation() {
      const { data, error } = await browserSupabase
        .from("product_categories")
        .select("name, slug")
        .eq("status", "active")
        .eq("show_in_nav", true)
        .order("sort_order", { ascending: true, nullsFirst: false });

      if (!active) {
        return;
      }

      if (error || !data || data.length === 0) {
        setNavigationItems(fallbackNavigationItems);
        return;
      }

      const categoryItems = (data as PublicCategoryNavRow[])
        .map((category) => {
          const name = category.name?.trim();
          const slug = category.slug?.trim();

          return name && slug ? { label: name, href: `/collections/${slug}` } : null;
        })
        .filter((item): item is NavigationItem => Boolean(item));

      setNavigationItems(
        categoryItems.length > 0
          ? [
              { label: "Shop All", href: "/collections" },
              ...categoryItems,
              { label: "About Us", href: "/about" },
              { label: "Sale", href: "/sale", sale: true }
            ]
          : fallbackNavigationItems
      );
    }

    void loadPublicNavigation();

    return () => {
      active = false;
    };
  }, [fallbackNavigationItems]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E8D6BF] bg-[#FFF9EF]/95 shadow-[0_8px_28px_rgba(68,43,20,0.04)] backdrop-blur">
        <div className="section-shell hidden h-[74px] items-center gap-6 lg:flex">
          <Link
            href="/"
            className="shrink-0 rounded-full border border-[#E5C99F] bg-white/70 px-4 py-2 font-heading text-xl font-extrabold tracking-tight text-[#6F4300] shadow-soft transition hover:-translate-y-0.5 hover:border-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
          >
            {brandName}
          </Link>
          <nav className="min-w-0 flex-1" aria-label="Primary navigation">
            <ul className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#5C4834]">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-2 whitespace-nowrap transition duration-200 hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      pathname === item.href && "bg-[#F4D7A5] text-[#5B3300] shadow-soft",
                      item.sale && "text-error hover:bg-[#FFF1EA]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2 text-primary">
            <Link
              href="/search"
              className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:-translate-y-0.5 hover:border-[#E5C99F] hover:bg-white hover:text-[#3B2512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              aria-label="Search"
            >
              <Search aria-hidden className="h-6 w-6" />
            </Link>
            <span
              className="grid h-10 w-10 place-items-center rounded-full text-primary/45"
              aria-hidden
              title="Wishlist will be connected later"
            >
              <Heart aria-hidden className="h-6 w-6" />
            </span>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:-translate-y-0.5 hover:border-[#E5C99F] hover:bg-white hover:text-[#3B2512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              onClick={() => {
                trackViewCart(items);
                setDrawerOpen(true);
              }}
              aria-label={`Open cart with ${totals.count} items`}
            >
              <ShoppingBag aria-hidden className="h-6 w-6" />
              {totals.count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-xs font-bold text-on-primary-container">
                  {totals.count}
                </span>
              )}
            </button>
            <Link
              href={accountHref}
              className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:-translate-y-0.5 hover:border-[#E5C99F] hover:bg-white hover:text-[#3B2512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
              aria-label="Account"
            >
              <User aria-hidden className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="section-shell flex h-16 items-center justify-between lg:hidden">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#E8D6BF] bg-white/70 text-[#5C4834] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
          <Link href="/" className="font-heading text-sm font-extrabold tracking-wide text-[#6F4300]">
            {brandName}
          </Link>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E8D6BF] bg-white/70 text-primary transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              trackViewCart(items);
              setDrawerOpen(true);
            }}
            aria-label={`Open cart with ${totals.count} items`}
          >
            <ShoppingBag aria-hidden className="h-5 w-5" />
            {totals.count > 0 && (
              <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-[10px] font-bold text-on-primary-container">
                {totals.count}
              </span>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#E8D6BF] bg-[#FFF9EF] px-4 py-4 shadow-soft lg:hidden" aria-label="Mobile navigation">
            <ul className="grid gap-2">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-full px-4 py-3 text-sm font-semibold text-[#5C4834] transition hover:bg-white hover:text-primary",
                      pathname === item.href && "bg-primary-container text-on-primary-container shadow-soft",
                      item.sale && "text-error"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/search"
                  className="block rounded-full px-4 py-3 text-sm font-semibold text-[#5C4834] transition hover:bg-white hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href={accountHref}
                  className="block rounded-full px-4 py-3 text-sm font-semibold text-[#5C4834] transition hover:bg-white hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
